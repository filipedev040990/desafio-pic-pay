import { CreateUserRepositoryInputDTO, CreateUserRepositoryOutputDTO } from '@/adapters/dtos/user.dto'

export interface UserRepositoryInterface {
  save: (input: CreateUserRepositoryInputDTO) => Promise<CreateUserRepositoryOutputDTO>
  getByEmail: (email: string) => Promise<CreateUserRepositoryOutputDTO | null>
  getByDocument: (document: string) => Promise<CreateUserRepositoryOutputDTO | null>
}
