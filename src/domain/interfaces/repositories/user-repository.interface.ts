import { CreateUserRepositoryInputDTO, UpdateUserRepositoryInputDTO, UserRepositoryOutputDTO } from '@/adapters/dtos/user.dto'

export interface UserRepositoryInterface {
  save: (input: CreateUserRepositoryInputDTO) => Promise<UserRepositoryOutputDTO>
  getById: (id: string) => Promise<UserRepositoryOutputDTO | null>
  getByEmail: (email: string) => Promise<UserRepositoryOutputDTO | null>
  getByDocument: (document: string) => Promise<UserRepositoryOutputDTO | null>
  update: (input: UpdateUserRepositoryInputDTO) => Promise<UserRepositoryOutputDTO>
}
