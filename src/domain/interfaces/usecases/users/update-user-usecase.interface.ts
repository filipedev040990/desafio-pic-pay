import { UpdateUserUseCaseInputDTO, UserOutputDTO } from '@/adapters/dtos/user.dto'

export interface UpdateUserUseCaseInterface {
  execute: (input: UpdateUserUseCaseInputDTO) => Promise<UserOutputDTO>
}
