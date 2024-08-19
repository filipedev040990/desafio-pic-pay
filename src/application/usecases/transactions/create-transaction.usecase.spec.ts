/**
 * valida se todos os campos foram enviados - ok
 * valida se o valor é válido - ok
 * valida se o pagador existe e é do tipo consumer - ok
 * valida se pagador e recebedor não são a mesma pessoa - ok
 * valida se beneficiario existe - ok
 * valida se o pagador tem saldo suficiente pra transação - ok
 * consulta serviço autorizador: Use este mock https://util.devi.tools/api/v2/authorize - ok
 * interpreta resposta do serviço autorizador - ok
 * debita valor do wallet do pagador - ok
 * credita valor no wallet do recebedor - ok
 * lança historico da transação - ok
 * o usuario recebedor deve receber uma notificação: Use este mock https://util.devi.tools/api/v1/notify
 */

import { CreateTransactionInputDTO } from '@/adapters/dtos/transaction.dto'
import { CreateTransactionUseCase } from './create-transaction.usecase'
import { AuthorizationError, InvalidParamError, MissingParamError } from '@/shared/errors'
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user-repository.interface'
import { UserRepositoryOutputDTO } from '@/adapters/dtos/user.dto'
import { WalletRepositoryInterface } from '@/domain/interfaces/repositories/wallet-repository.interface'
import { WalletOutputDTO } from '@/adapters/dtos/wallet.dto'
import { AuthorizeResponse, AuthorizeServiceInterface } from '@/domain/interfaces/services/authorize-service.interface'
import { UUIDServiceInterface } from '@/domain/interfaces/services/uuid-service.interface'
import { mock } from 'jest-mock-extended'

const userRepository = mock<UserRepositoryInterface>()
const walletRepository = mock<WalletRepositoryInterface>()
const authorizeService = mock<AuthorizeServiceInterface>()
const uuidService = mock<UUIDServiceInterface>()

describe('CreateTransactionUseCase', () => {
  let sut: CreateTransactionUseCase
  let input: any
  let fakePayerUser: UserRepositoryOutputDTO
  let fakePayeeUser: UserRepositoryOutputDTO
  let fakeWallet: WalletOutputDTO
  let fakeAuthorizeResponse: AuthorizeResponse

  beforeEach(() => {
    sut = new CreateTransactionUseCase(userRepository, walletRepository, authorizeService, uuidService)
    input = {
      value: 45000,
      payer: 'anyPayerId',
      payee: 'anyPayeeId'
    }
    fakePayerUser = {
      id: 'anyPayerId',
      name: 'João da Silva',
      type: 'consumer',
      document: '78965441236',
      email: 'joao@gmail.com',
      createdAt: new Date()
    }
    fakePayeeUser = {
      id: 'anyPayeeId',
      name: 'João da Silva',
      type: 'consumer',
      document: '78965441236',
      email: 'joao@gmail.com',
      createdAt: new Date()
    }
    fakeWallet = {
      id: 'AnyId',
      userId: 'anyUserId',
      balance: 50000,
      currency: 'BRL',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    fakeAuthorizeResponse = {
      status: 'success',
      data: {
        authorization: true
      }
    }

    jest.spyOn(userRepository, 'getById').mockImplementation((id: string): any => {
      if (id === 'anyPayerId') {
        return fakePayerUser
      }
      return fakePayeeUser
    })

    walletRepository.getByUserId.mockResolvedValue(fakeWallet)
    authorizeService.execute.mockResolvedValue(fakeAuthorizeResponse)
  })

  test('should throw if any required field is empty', async () => {
    const requiredFields: Array<keyof CreateTransactionInputDTO> = ['value', 'payee', 'payer']
    for (const field of requiredFields) {
      input[field] = undefined
      const promise = sut.execute(input)
      await expect(promise).rejects.toThrowError(new MissingParamError(field))
      input[field] = field
    }
  })

  test('should throws if a invalid value is provided', async () => {
    input.value = -1
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('value'))
  })

  test('should throws if payer not found', async () => {
    userRepository.getById.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('payer'))
  })

  test('should throws if payee and payer and are the same', async () => {
    input.payee = 'anyPayeeId'
    input.payer = 'anyPayeeId'
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('Payer and Payee cannot be the same.'))
  })

  test('should throws if payer is a merchant', async () => {
    userRepository.getById.mockResolvedValueOnce({
      id: 'anyPayerId',
      name: 'João da Silva',
      type: 'merchant',
      document: '78965441236',
      email: 'joao@gmail.com',
      createdAt: new Date()
    })
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('Only consumer users can make transfers.'))
  })

  test('should call WalletRepository.getByUserId correct payerId', async () => {
    await sut.execute(input)
    expect(walletRepository.getByUserId).toHaveBeenCalledWith('anyPayerId')
  })

  test('should throws if WalletRepository.getByUserId returns null', async () => {
    walletRepository.getByUserId.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('wallet not found'))
  })

  test('should throws if payer has no balance', async () => {
    walletRepository.getByUserId.mockResolvedValueOnce({
      id: 'AnyId',
      userId: 'anyUserId',
      balance: 44900,
      currency: 'BRL',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('insufficient balance'))
  })

  test('should call AuthorizeServive.execute once', async () => {
    await sut.execute(input)
    expect(authorizeService.execute).toHaveBeenCalledTimes(1)
  })

  test('should return a correct authorization response when authorized', () => {
    const response = sut.isAuthorized(fakeAuthorizeResponse)
    expect(response).toBe(true)
  })

  test('should return a correct authorization response when not authorized', () => {
    const response = sut.isAuthorized({
      status: 'fail',
      data: {
        authorization: false
      }
    })
    expect(response).toBe(false)
  })

  test('should throw when not authorized', async () => {
    authorizeService.execute.mockResolvedValueOnce({
      status: 'fail',
      data: {
        authorization: false
      }
    })
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new AuthorizationError())
  })
})
