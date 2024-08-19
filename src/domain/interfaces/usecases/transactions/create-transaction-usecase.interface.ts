import { CreateTransactionInputDTO } from '@/adapters/dtos/transaction.dto'

export interface CreateTransactionUseCaseInterface {
  execute: (input: CreateTransactionInputDTO) => Promise<void>
}
