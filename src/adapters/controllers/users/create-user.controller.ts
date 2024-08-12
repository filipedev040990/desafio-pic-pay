import { HttpRequest, HttpResponse } from '@/adapters/dtos/controller.dto'
import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { CreateUserUseCaseInterface } from '@/domain/interfaces/usecases/users/create-user-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class CreateUserController implements ControllerInterface {
  constructor (private readonly usecase: CreateUserUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.usecase.execute(input?.body)
      return success(201, output)
    } catch (error) {
      return handleError(error)
    }
  }
}
