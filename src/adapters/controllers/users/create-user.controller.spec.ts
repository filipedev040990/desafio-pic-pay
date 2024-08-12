import { HttpRequest } from '@/adapters/dtos/controller.dto'
import { CreateUserController } from './create-user.controller'
import { CreateUserUseCaseInterface } from '@/domain/interfaces/usecases/users/create-user-usecase.interface'
import { CreateUserUseCaseOutputDTO } from '@/adapters/dtos/user.dto'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { mock } from 'jest-mock-extended'

const usecase = mock<CreateUserUseCaseInterface>()

describe('CreateUserController', () => {
  let sut: CreateUserController
  let input: HttpRequest
  let usecaseResponse: CreateUserUseCaseOutputDTO
  beforeEach(() => {
    sut = new CreateUserController(usecase)
    input = {
      body: {
        name: 'João da Silva',
        type: 'consumer',
        document: '78965441236',
        email: 'joao@gmail.com',
        password: 'anyPassword'
      }
    }
    usecaseResponse = {
      id: '123456',
      name: 'João da Silva',
      type: 'consumer',
      document: '78965441236',
      email: 'joao@gmail.com',
      createdAt: new Date()
    }
    usecase.execute.mockResolvedValue(usecaseResponse)
  })

  test('should call UseCase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return a correct output on success', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 201, body: usecaseResponse })
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
