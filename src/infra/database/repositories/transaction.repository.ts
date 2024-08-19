import { CreateTransactionHistoryInputDTO } from '@/adapters/dtos/transaction.dto'
import { TransactionRepositoryInterface } from '@/domain/interfaces/repositories/transaction-repository.interface'
import { prismaClient } from './prisma-client'

export class TransactionRepository implements TransactionRepositoryInterface {
  async save (data: CreateTransactionHistoryInputDTO): Promise<void> {
    await prismaClient.transaction.create({ data })
  }
}
