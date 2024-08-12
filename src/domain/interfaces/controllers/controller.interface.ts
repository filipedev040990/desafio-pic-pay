import { HttpRequest, HttpResponse } from '@/adapters/dtos/controller.dto'

export interface ControllerInterface {
  execute: (input: HttpRequest) => Promise<HttpResponse>
}
