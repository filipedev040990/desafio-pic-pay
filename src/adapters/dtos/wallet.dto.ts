export type WalletBaseDTO = {
  userId: string
  balance: number
  currency: string
  status: string
}

export type BuildEntityDTO = WalletBaseDTO & {
  id: string
}
