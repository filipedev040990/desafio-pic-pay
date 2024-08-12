import { CreateUserUseCaseInputDTO, CreateUserUseCaseOutputDTO } from '@/adapters/dtos/user.dto'
import { UserEntity } from '@/domain/entities/user.entity'
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/users/create-user-repository.interface'
import { CryptographyInterface } from '@/domain/interfaces/tools/cryptography.interface'
import { CreateUserUseCaseInterface } from '@/domain/interfaces/usecases/users/create-user-usecase.interface'
import { InvalidParamError } from '@/shared/errors'

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor (
    private readonly cryptographyService: CryptographyInterface,
    private readonly repository: UserRepositoryInterface
  ) {}

  async execute (input: CreateUserUseCaseInputDTO): Promise<CreateUserUseCaseOutputDTO> {
    const user = UserEntity.build({ ...input, password: this.cryptographyService.encrypt(input.password) })

    await this.ensureEmailIsUnique(user.email)
    await this.ensureDocumentIsUnique(user.document)

    return await this.repository.save(user)
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
