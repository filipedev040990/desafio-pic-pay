import { HttpRequest } from '@/adapters/dtos/controller.dto'
import { UserOutputDTO } from '@/adapters/dtos/user.dto'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { mock } from 'jest-mock-extended'
import { UpdateUserUseCaseInterface } from '@/domain/interfaces/usecases/users/update-user-usecase.interface'
import { UpdateUserController } from './update-user.controller'

const usecase = mock<UpdateUserUseCaseInterface>()

describe('UpdateUserController', () => {
  let sut: UpdateUserController
  let input: HttpRequest
  let usecaseResponse: UserOutputDTO
  beforeEach(() => {
    sut = new UpdateUserController(usecase)
    input = {
      params: {
        id: 'anyId'
      },
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
      createdAt: new Date(),
      updatedAt: new Date()
    }
    usecase.execute.mockResolvedValue(usecaseResponse)
  })

  test('should call UseCase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith({ id: input.params.id, ...input.body })
  })

  test('should return a correct output on success', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 200, body: usecaseResponse })
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
