import { CreateWalletInputRepositoryDTO, WalletOutputDTO } from '@/adapters/dtos/wallet.dto'

export interface WalletRepositoryInterface {
  save: (input: CreateWalletInputRepositoryDTO) => Promise<WalletOutputDTO>
  getByUserId: (userId: string) => Promise<WalletOutputDTO | null>
  updateBalance: (id: string, balance: number) => Promise<void>
}
