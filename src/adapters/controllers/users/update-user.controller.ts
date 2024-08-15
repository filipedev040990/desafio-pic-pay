import { HttpRequest, HttpResponse } from '@/adapters/dtos/controller.dto'
import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { UpdateUserUseCaseInterface } from '@/domain/interfaces/usecases/users/update-user-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class UpdateUserController implements ControllerInterface {
  constructor (private readonly usecase: UpdateUserUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.usecase.execute({ id: input?.params?.id, ...input?.body })
      return success(200, output)
    } catch (error) {
      return handleError(error)
    }
  }
}
