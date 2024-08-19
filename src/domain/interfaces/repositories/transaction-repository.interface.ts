import { CreateTransactionHistoryInputDTO } from '@/adapters/dtos/transaction.dto'

export interface TransactionRepositoryInterface {
  save: (input: CreateTransactionHistoryInputDTO) => Promise<void>
}
