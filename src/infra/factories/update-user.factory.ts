import { CryptographyService } from '../services/cryptography.service'
import { UserRepository } from '../database/repositories/user.repository'
import { UpdateUserController } from '@/adapters/controllers/users/update-user.controller'
import { UpdateUserUseCase } from '@/application/usecases/users/update-user.usecase'

export const updateUserFactory = (): UpdateUserController => {
  const cryptographyService = new CryptographyService()
  const repository = new UserRepository()
  const useCase = new UpdateUserUseCase(repository, cryptographyService)
  return new UpdateUserController(useCase)
}
