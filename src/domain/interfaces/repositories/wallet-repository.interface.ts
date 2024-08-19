import { CreateTransactionHistoryInputDTO } from '@/adapters/dtos/transaction.dto'
import { CreateWalletInputRepositoryDTO, WalletOutputDTO } from '@/adapters/dtos/wallet.dto'

export type UpdateWalletBalanceInput = {
  payer: {
    walletId: string
    balance: number
    history: CreateTransactionHistoryInputDTO
  }
  payee: {
    walletId: string
    balance: number
    history: CreateTransactionHistoryInputDTO
  }
}
export interface WalletRepositoryInterface {
  save: (input: CreateWalletInputRepositoryDTO) => Promise<WalletOutputDTO>
  getByUserId: (userId: string) => Promise<WalletOutputDTO | null>
  updateBalanceAndRegisterHistory: (input: UpdateWalletBalanceInput) => Promise<void>
}
