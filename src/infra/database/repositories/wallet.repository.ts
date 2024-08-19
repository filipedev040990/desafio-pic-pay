import { CreateWalletInputRepositoryDTO, WalletOutputDTO } from '@/adapters/dtos/wallet.dto'
import { WalletRepositoryInterface } from '@/domain/interfaces/repositories/wallet-repository.interface'
import { prismaClient } from './prisma-client'

export class WalletRepository implements WalletRepositoryInterface {
  async save (data: CreateWalletInputRepositoryDTO): Promise<WalletOutputDTO> {
    return await prismaClient.wallet.create({ data })
  }

  async getByUserId (userId: string): Promise<WalletOutputDTO | null> {
    const wallet = await prismaClient.wallet.findFirst({ where: { userId } })
    return wallet ?? null
  }

  async updateBalance (id: string, balance: number): Promise<void> {
    await prismaClient.wallet.update({
      where: {
        id
      },
      data: {
        balance
      }
    })
  }
}
