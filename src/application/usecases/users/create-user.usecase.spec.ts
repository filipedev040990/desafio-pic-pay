import { UserRepositoryOutputDTO, CreateUserUseCaseInputDTO } from '@/adapters/dtos/user.dto'
import { CreateUserUseCase } from './create-user.usecase'
import { UserEntity } from '@/domain/entities/user/user.entity'
import { CryptographyServiceInterface } from '@/domain/interfaces/services/cryptography-service.interface'
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/users/create-user-repository.interface'
import { InvalidParamError } from '@/shared/errors'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { UUIDServiceInterface } from '@/domain/interfaces/services/uuid-service.interface'

const cryptographyService = mock<CryptographyServiceInterface>()
const repository = mock<UserRepositoryInterface>()
const uuidService = mock<UUIDServiceInterface>()

describe('CreateUserUseCase', () => {
  let sut: CreateUserUseCase
  let input: CreateUserUseCaseInputDTO
  let newUser: UserEntity
  let fakeUser: UserRepositoryOutputDTO

  beforeEach(() => {
    sut = new CreateUserUseCase(cryptographyService, repository, uuidService)
    input = {
      name: 'João da Silva',
      type: 'consumer',
      document: '78965441236',
      email: 'joao@gmail.com',
      password: 'anyPassword'
    }
    newUser = {
      id: 'anyId',
      name: 'João da Silva',
      type: 'consumer',
      document: '78965441236',
      email: 'joao@gmail.com',
      password: 'hashedValue',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    fakeUser = {
      id: 'anyId',
      name: 'João da Silva',
      type: 'consumer',
      document: '78965441236',
      email: 'joao@gmail.com',
      createdAt: new Date()
    }

    cryptographyService.encrypt.mockReturnValue('hashedValue')
    uuidService.generate.mockReturnValue('anyId')
    repository.getByEmail.mockResolvedValue(null)
    repository.getByDocument.mockResolvedValue(null)
    repository.save.mockResolvedValue(fakeUser)
    jest.spyOn(UserEntity, 'build').mockReturnValue(newUser)
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
    jest.clearAllMocks()
  })

  test('should call UserEntity.build once and with correct values', async () => {
    const spy = jest.spyOn(UserEntity, 'build')
    await sut.execute(input)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      id: 'anyId',
      name: 'João da Silva',
      type: 'consumer',
      document: '78965441236',
      email: 'joao@gmail.com',
      password: 'anyPassword'
    })
  })

  test('should call cryptographyService.encrypt once and with correct value', async () => {
    await sut.execute(input)
    expect(cryptographyService.encrypt).toHaveBeenCalledTimes(1)
    expect(cryptographyService.encrypt).toHaveBeenCalledWith('anyPassword')
  })

  test('should call repository.getByEmail once and with correct email', async () => {
    await sut.execute(input)
    expect(repository.getByEmail).toHaveBeenCalledTimes(1)
    expect(repository.getByEmail).toHaveBeenCalledWith('joao@gmail.com')
  })

  test('should throws if email already exists', async () => {
    repository.getByEmail.mockResolvedValueOnce(fakeUser)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('This e-mail already exists.'))
  })

  test('should call repository.getByDocument once and with correct email', async () => {
    await sut.execute(input)
    expect(repository.getByDocument).toHaveBeenCalledTimes(1)
    expect(repository.getByDocument).toHaveBeenCalledWith('78965441236')
  })

  test('should throws if document already exists', async () => {
    repository.getByDocument.mockResolvedValueOnce(fakeUser)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('This document already exists.'))
  })

  test('should call repository.save once and with correct values', async () => {
    await sut.execute(input)
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledWith({
      id: 'anyId',
      name: 'João da Silva',
      type: 'consumer',
      document: '78965441236',
      email: 'joao@gmail.com',
      password: 'hashedValue',
      createdAt: new Date(),
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
      createdAt: new Date()
    })
  })
})
