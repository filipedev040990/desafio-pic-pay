import { CreateUserUseCaseInputDTO, UserOutputDTO } from '@/adapters/dtos/user.dto'

export interface CreateUserUseCaseInterface {
  execute: (input: CreateUserUseCaseInputDTO) => Promise<UserOutputDTO>
}
