import { HttpRequest } from '@/adapters/dtos/controller.dto'
import { CreateTransactionController } from './create-transaction.controller'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { CreateTransactionUseCaseInterface } from '@/domain/interfaces/usecases/transactions/create-transaction-usecase.interface'
import { mock } from 'jest-mock-extended'

const usecase = mock<CreateTransactionUseCaseInterface>()

describe('CreateTransactionController', () => {
  let sut: CreateTransactionController
  let input: HttpRequest
  beforeEach(() => {
    sut = new CreateTransactionController(usecase)
    input = {
      body: {
        value: 100.0,
        payer: 'payerId',
        payee: 'payeeId'
      }
    }
  })

  test('should call UseCase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return a correct output on success', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 204, body: null })
  })

  test('should return a correct error if UseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    usecase.execute.mockImplementationOnce(() => {
      throw error
    })
    const output = await sut.execute(input)
    expect(output).toEqual(badRequest(error))
  })
})
