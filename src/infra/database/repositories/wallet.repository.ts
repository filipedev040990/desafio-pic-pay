import { CreateWalletInputRepositoryDTO, WalletOutputDTO } from '@/adapters/dtos/wallet.dto'
import { UpdateWalletBalanceInput, WalletRepositoryInterface } from '@/domain/interfaces/repositories/wallet-repository.interface'
import { prismaClient } from './prisma-client'

export class WalletRepository implements WalletRepositoryInterface {
  async save (data: CreateWalletInputRepositoryDTO): Promise<WalletOutputDTO> {
    return await prismaClient.wallet.create({ data })
  }

  async getByUserId (userId: string): Promise<WalletOutputDTO | null> {
    const wallet = await prismaClient.wallet.findFirst({ where: { userId } })
    return wallet ?? null
  }

  async updateBalanceAndRegisterHistory (input: UpdateWalletBalanceInput): Promise<void> {
    await prismaClient.$transaction(async (tx) => {
      await tx.wallet.update({
        where: {
          id: input.payer.walletId
        },
        data: {
          balance: input.payer.balance
        }
      })

      await tx.wallet.update({
        where: {
          id: input.payee.walletId
        },
        data: {
          balance: input.payee.balance
        }
      })

      await tx.transaction.create({
        data: {
          id: input.payer.history.id,
          transactionType: input.payer.history.transactionType,
          currency: input.payer.history.currency,
          value: input.payer.history.value,
          walletId: input.payer.history.walletId,
          createdAt: input.payer.history.createdAt
        }
      })

      await tx.transaction.create({
        data: {
          id: input.payee.history.id,
          transactionType: input.payee.history.transactionType,
          currency: input.payee.history.currency,
          value: input.payee.history.value,
          walletId: input.payee.history.walletId,
          createdAt: input.payee.history.createdAt
        }
      })
    })
  }
}
