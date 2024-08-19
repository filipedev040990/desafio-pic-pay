import { CreateTransactionController } from '@/adapters/controllers/transactions/create-transaction.controller'
import { CreateTransactionUseCase } from '@/application/usecases/transactions/create-transaction.usecase'
import { UserRepository } from '../database/repositories/user.repository'
import { WalletRepository } from '../database/repositories/wallet.repository'
import { AuthorizeService } from '../services/authorize.service'
import { TransactionRepository } from '../database/repositories/transaction.repository'
import { UUIDService } from '../services/uuid.service'

export const createTransactionFactory = (): CreateTransactionController => {
  const userRepository = new UserRepository()
  const walletRepository = new WalletRepository()
  const authorizeService = new AuthorizeService()
  const transactionRepository = new TransactionRepository()
  const uuidService = new UUIDService()
  const usecase = new CreateTransactionUseCase(userRepository, walletRepository, authorizeService, transactionRepository, uuidService)
  return new CreateTransactionController(usecase)
}
