export type WalletBaseDTO = {
  userId: string
  balance: number
  currency: string
  status: string
}

export type BuildEntityDTO = WalletBaseDTO & {
  id: string
}

export type WalletOutputDTO = WalletBaseDTO & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type CreateWalletInputRepositoryDTO = WalletOutputDTO
