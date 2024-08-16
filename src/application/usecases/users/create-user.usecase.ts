import { CreateUserUseCaseInputDTO, UserOutputDTO } from '@/adapters/dtos/user.dto'
import { UserEntity } from '@/domain/entities/user/user.entity'
import { WalletEntity } from '@/domain/entities/wallet/wallet.entity'
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user-repository.interface'
import { WalletRepositoryInterface } from '@/domain/interfaces/repositories/wallet-repository.interface'
import { CryptographyServiceInterface } from '@/domain/interfaces/services/cryptography-service.interface'
import { UUIDServiceInterface } from '@/domain/interfaces/services/uuid-service.interface'
import { CreateUserUseCaseInterface } from '@/domain/interfaces/usecases/users/create-user-usecase.interface'
import { InvalidParamError } from '@/shared/errors'

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor (
    private readonly cryptographyService: CryptographyServiceInterface,
    private readonly repository: UserRepositoryInterface,
    private readonly uuidService: UUIDServiceInterface,
    private readonly walletRepository: WalletRepositoryInterface
  ) {}

  async execute (input: CreateUserUseCaseInputDTO): Promise<UserOutputDTO> {
    const user = UserEntity.build({
      id: this.uuidService.generate(),
      name: input.name,
      document: input.document,
      type: input.type,
      email: input.email,
      password: input.password
    })

    user.password = this.cryptographyService.encrypt(input.password)

    await this.ensureEmailIsUnique(user.email)
    await this.ensureDocumentIsUnique(user.document)

    const userWallet = WalletEntity.build({
      id: this.uuidService.generate(),
      userId: user.id,
      balance: 0,
      currency: 'BRL',
      status: 'active'
    })
    const output = await this.repository.save(user)
    await this.walletRepository.save(userWallet)

    return output
  }

  async ensureEmailIsUnique (email: string): Promise<void> {
    const existingUserEmail = await this.repository.getByEmail(email)
    if (existingUserEmail) {
      throw new InvalidParamError('This e-mail already exists.')
    }
  }

  async ensureDocumentIsUnique (document: string): Promise<void> {
    const existingUserDocument = await this.repository.getByDocument(document)
    if (existingUserDocument) {
      throw new InvalidParamError('This document already exists.')
    }
  }
}
