import { UpdateUserUseCaseInputDTO, UserRepositoryOutputDTO } from '@/adapters/dtos/user.dto'
import { UpdateUserUseCase } from './update-user.usecase'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user-repository.interface'
import { CryptographyServiceInterface } from '@/domain/interfaces/services/cryptography-service.interface'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

const repository = mock<UserRepositoryInterface>()
const cryptographyService = mock<CryptographyServiceInterface>()
describe('UpdateUserUseCase', () => {
  let sut: UpdateUserUseCase
  let input: UpdateUserUseCaseInputDTO
  let fakeUser: UserRepositoryOutputDTO

  beforeEach(() => {
    sut = new UpdateUserUseCase(repository, cryptographyService)
    input = {
      id: 'anyId',
      name: 'João da Silva',
      document: '78965441236',
      email: 'joao@gmail.com',
      password: 'anyPassword'
    }

    fakeUser = {
      id: 'anyId',
      name: 'João da Silva',
      type: 'consumer',
      document: '78965441236',
      email: 'joao@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    repository.getById.mockResolvedValue(fakeUser)
    repository.getByEmail.mockResolvedValue(null)
    repository.getByDocument.mockResolvedValue(null)
    repository.update.mockResolvedValue(fakeUser)
    cryptographyService.encrypt.mockReturnValue('hashedValue')
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
    jest.clearAllMocks()
  })

  test('should throws if id is not provided', async () => {
    input.id = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new MissingParamError('id'))
  })

  test('should throws if a invalid id is provided', async () => {
    repository.getById.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('id'))
  })

  test('should call repository.getByEmail once and with correct email', async () => {
    await sut.execute(input)
    expect(repository.getByEmail).toHaveBeenCalledTimes(1)
    expect(repository.getByEmail).toHaveBeenCalledWith('joao@gmail.com')
  })

  test('should throws if email is provided and already in use', async () => {
    repository.getByEmail.mockResolvedValue(fakeUser)
    fakeUser.id = 'anotherId'
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('This e-mail already exists.'))
  })

  test('should call repository.getByDocument once and with correct document', async () => {
    await sut.execute(input)
    expect(repository.getByDocument).toHaveBeenCalledTimes(1)
    expect(repository.getByDocument).toHaveBeenCalledWith('78965441236')
  })

  test('should throws if document is provided and already in use', async () => {
    repository.getByDocument.mockResolvedValue(fakeUser)
    fakeUser.id = 'anotherId'
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('This document already exists.'))
  })

  test('should call cryptographyService.encrypt once and with correct value when password is provided', async () => {
    await sut.execute(input)
    expect(cryptographyService.encrypt).toHaveBeenCalledTimes(1)
    expect(cryptographyService.encrypt).toHaveBeenCalledWith('anyPassword')
  })

  test('should not call cryptographyService.encrypt if password is provided', async () => {
    input.password = undefined
    await sut.execute(input)
    expect(cryptographyService.encrypt).not.toHaveBeenCalled()
  })

  test('should throw if no field is provided for update', async () => {
    input = {
      id: 'anyId'
    }
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new MissingParamError('One or more fields must be provided for update'))
  })

  test('should throw if a invalid name is provided', async () => {
    input.name = 123 as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('name'))
  })

  test('should call repository.update once and with correct values', async () => {
    await sut.execute(input)
    expect(repository.update).toHaveBeenCalledTimes(1)
    expect(repository.update).toHaveBeenCalledWith({
      id: 'anyId',
      name: 'João da Silva',
      document: '78965441236',
      email: 'joao@gmail.com',
      password: 'hashedValue',
      updatedAt: new Date()
    })
  })

  test('should return a correct output on success', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({
      id: 'anyId',
      name: 'João da Silva',
      type: 'consumer',
      document: '78965441236',
      email: 'joao@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  })
})
