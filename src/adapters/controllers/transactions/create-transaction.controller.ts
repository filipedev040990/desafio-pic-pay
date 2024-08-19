import { HttpRequest, HttpResponse } from '@/adapters/dtos/controller.dto'
import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { CreateTransactionUseCaseInterface } from '@/domain/interfaces/usecases/transactions/create-transaction-usecase.interface'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'

export class CreateTransactionController implements ControllerInterface {
  constructor (private readonly usecase: CreateTransactionUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      await this.usecase.execute(input?.body)
      return success(204, null)
    } catch (error) {
      return handleError(error)
    }
  }
}
