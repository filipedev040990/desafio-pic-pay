import { CreateTransactionHistoryInputDTO, CreateTransactionInputDTO } from '@/adapters/dtos/transaction.dto'
import { WalletOutputDTO } from '@/adapters/dtos/wallet.dto'
import { TransactionRepositoryInterface } from '@/domain/interfaces/repositories/transaction-repository.interface'
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user-repository.interface'
import { WalletRepositoryInterface } from '@/domain/interfaces/repositories/wallet-repository.interface'
import { AuthorizeResponse, AuthorizeServiceInterface } from '@/domain/interfaces/services/authorize-service.interface'
import { UUIDServiceInterface } from '@/domain/interfaces/services/uuid-service.interface'
import { CreateTransactionUseCaseInterface } from '@/domain/interfaces/usecases/transactions/create-transaction-usecase.interface'
import { AuthorizationError, InvalidParamError, MissingParamError } from '@/shared/errors'

export class CreateTransactionUseCase implements CreateTransactionUseCaseInterface {
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly walletRepository: WalletRepositoryInterface,
    private readonly authorizeService: AuthorizeServiceInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly uuidService: UUIDServiceInterface
  ) {}

  async execute (input: CreateTransactionInputDTO): Promise<void> {
    this.validateRequiredFields(input)
    this.validateValue(input.value)

    await this.validatePayer(input)
    await this.validatePayee(input)
    await this.validateBalance(input)

    const authResponse = await this.authorizeService.execute()
    const isAuthorized = this.isAuthorized(authResponse)

    if (!isAuthorized) {
      throw new AuthorizationError()
    }

    await this.handleAuthorizedTransaction(input)
  }

  validateRequiredFields (input: CreateTransactionInputDTO): void {
    const requiredFields: Array<keyof CreateTransactionInputDTO> = ['value', 'payee', 'payer']
    for (const field of requiredFields) {
      if (!input[field]) {
        throw new MissingParamError(field)
      }
    }
  }

  validateValue (value: number): void {
    if (value < 0) {
      throw new InvalidParamError('value')
    }
  }

  async validatePayer (input: CreateTransactionInputDTO): Promise<void> {
    const { payer, payee } = input
    if (payer === payee) {
      throw new InvalidParamError('Payer and Payee cannot be the same.')
    }

    const existingPayer = await this.userRepository.getById(payer)
    if (!existingPayer) {
      throw new InvalidParamError('payer')
    }

    if (existingPayer.type === 'merchant') {
      throw new InvalidParamError('Only consumer users can make transfers.')
    }
  }

  async validatePayee (input: CreateTransactionInputDTO): Promise<void> {
    const existingPayee = await this.userRepository.getById(input.payee)
    if (!existingPayee) {
      throw new InvalidParamError('payer')
    }
  }

  async validateBalance (input: CreateTransactionInputDTO): Promise<void> {
    const userWallet = await this.walletRepository.getByUserId(input.payer)
    if (!userWallet) {
      throw new InvalidParamError('wallet not found')
    }

    if (userWallet.balance < input.value) {
      throw new InvalidParamError('insufficient balance')
    }
  }

  isAuthorized (input: AuthorizeResponse): boolean {
    return input?.status === 'success' && input?.data?.authorization
  }

  async handleAuthorizedTransaction (input: CreateTransactionInputDTO): Promise<void> {
    const { payer, payee, value } = input

    const [payerWallet, payeeWallet] = await Promise.all([
      this.walletRepository.getByUserId(payer),
      this.walletRepository.getByUserId(payee)
    ])

    if (!payerWallet) {
      throw new InvalidParamError('Payer wallet not found')
    }

    if (!payeeWallet) {
      throw new InvalidParamError('Payee wallet not found')
    }

    await Promise.all([
      this.walletRepository.updateBalance(payerWallet.id, (payerWallet.balance - value)),
      this.walletRepository.updateBalance(payeeWallet.id, (payeeWallet.balance + value)),
      this.transactionRepository.save(this.makeTransactionHistoryInput(payerWallet, 'debit', value)),
      this.transactionRepository.save(this.makeTransactionHistoryInput(payeeWallet, 'credit', value))
    ])
  }

  makeTransactionHistoryInput (wallet: WalletOutputDTO, type: 'debit' | 'credit', value: number): CreateTransactionHistoryInputDTO {
    return {
      id: this.uuidService.generate(),
      walletId: wallet.id,
      currency: wallet.currency,
      transactionType: type,
      value,
      createdAt: new Date()
    }
  }
}
