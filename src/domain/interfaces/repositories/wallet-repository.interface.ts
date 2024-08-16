import { CreateWalletInputRepositoryDTO, WalletOutputDTO } from '@/adapters/dtos/wallet.dto'

export interface WalletRepositoryInterface {
  save: (input: CreateWalletInputRepositoryDTO) => Promise<WalletOutputDTO>
}
