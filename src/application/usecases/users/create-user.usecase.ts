import { CreateUserUseCaseInputDTO, CreateUserUseCaseOutputDTO } from '@/adapters/dtos/user.dto'
import { UserEntity } from '@/domain/entities/user.entity'
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/users/create-user-repository.interface'
import { CryptographyServiceInterface } from '@/domain/interfaces/services/cryptography-service.interface'
import { UUIDServiceInterface } from '@/domain/interfaces/services/uuid-service.interface'
import { CreateUserUseCaseInterface } from '@/domain/interfaces/usecases/users/create-user-usecase.interface'
import { InvalidParamError } from '@/shared/errors'

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor (
    private readonly cryptographyService: CryptographyServiceInterface,
    private readonly repository: UserRepositoryInterface,
    private readonly uuidService: UUIDServiceInterface
  ) {}

  async execute (input: CreateUserUseCaseInputDTO): Promise<CreateUserUseCaseOutputDTO> {
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
