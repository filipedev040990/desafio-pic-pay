export type CreateTransactionInputDTO = {
  value: number
  payer: string
  payee: string
}

export type CreateTransactionHistoryInputDTO = {
  id: string
  walletId: string
  value: number
  transactionType: string
  currency: string
  createdAt: Date
}
