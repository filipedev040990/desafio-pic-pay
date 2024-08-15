import { CreateUserRepositoryInputDTO, UserRepositoryOutputDTO } from '@/adapters/dtos/user.dto'

export interface UserRepositoryInterface {
  save: (input: CreateUserRepositoryInputDTO) => Promise<UserRepositoryOutputDTO>
  getByEmail: (email: string) => Promise<UserRepositoryOutputDTO | null>
  getByDocument: (document: string) => Promise<UserRepositoryOutputDTO | null>
}
