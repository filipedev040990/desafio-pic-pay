import { CreateUserController } from '@/adapters/controllers/users/create-user.controller'
import { CreateUserUseCase } from '@/application/usecases/users/create-user.usecase'
import { CryptographyService } from '../services/cryptography.service'
import { UserRepository } from '../database/repositories/user.repository'
import { UUIDService } from '../services/uuid.service'
import { WalletRepository } from '../database/repositories/wallet.repository'

export const createUserFactory = (): CreateUserController => {
  const cryptographyService = new CryptographyService()
  const repository = new UserRepository()
  const uuidService = new UUIDService()
  const walletRepository = new WalletRepository()
  const useCase = new CreateUserUseCase(cryptographyService, repository, uuidService, walletRepository)
  return new CreateUserController(useCase)
}
