import { CreateUserUseCaseInputDTO, CreateUserUseCaseOutputDTO } from '@/adapters/dtos/user.dto'

export interface CreateUserUseCaseInterface {
  execute: (input: CreateUserUseCaseInputDTO) => Promise<CreateUserUseCaseOutputDTO>
}
