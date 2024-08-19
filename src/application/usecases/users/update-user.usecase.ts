import { UpdateUserRepositoryInputDTO, UpdateUserUseCaseInputDTO, UserOutputDTO } from '@/adapters/dtos/user.dto'
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user-repository.interface'
import { CryptographyServiceInterface } from '@/domain/interfaces/services/cryptography-service.interface'
import { UpdateUserUseCaseInterface } from '@/domain/interfaces/usecases/users/update-user-usecase.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { isValidEmail, isValidString } from '@/shared/helpers/string.helper'

export class UpdateUserUseCase implements UpdateUserUseCaseInterface {
  constructor (
    private readonly repository: UserRepositoryInterface,
    private readonly cryptographyService: CryptographyServiceInterface
  ) {}

  async execute (input: UpdateUserUseCaseInputDTO): Promise<UserOutputDTO> {
    this.ensureInputIsNotEmpty(input)

    await this.ensureIdIsValid(input)

    const updateInput: UpdateUserRepositoryInputDTO = {
      id: input.id,
      updatedAt: new Date()
    }

    if (input.name) {
      this.ensureNameIsValid(input.name)
      updateInput.name = input.name
    }

    if (input.email) {
      await this.ensureEmailIsValid(input.email, input.id)
      updateInput.email = input.email
    }

    if (input.document) {
      await this.ensureDocumentIsValid(input.document, input.id)
      updateInput.document = input.document
    }

    if (input.password) {
      updateInput.password = this.cryptographyService.encrypt(input.password)
    }

    return await this.repository.update(updateInput)
  }

  ensureInputIsNotEmpty (input: UpdateUserUseCaseInputDTO): void {
    const { name, document, email, password } = input
    if (!name && !document && !email && !password) {
      throw new MissingParamError('One or more fields must be provided for update')
    }
  }

  async ensureIdIsValid (input: UpdateUserUseCaseInputDTO): Promise<void> {
    if (!input?.id) {
      throw new MissingParamError('id')
    }

    const existingUser = await this.repository.getById(input.id)
    if (!existingUser) {
      throw new InvalidParamError('id')
    }
  }

  ensureNameIsValid (name: string): void {
    if (!isValidString(name)) {
      throw new InvalidParamError('name')
    }
  }

  async ensureEmailIsValid (email: string, userId: string): Promise<void> {
    const existingUserEmail = await this.repository.getByEmail(email)

    if (existingUserEmail && existingUserEmail.id !== userId) {
      throw new InvalidParamError('This e-mail already exists.')
    }

    if (!isValidEmail(email)) {
      throw new InvalidParamError('email')
    }
  }

  async ensureDocumentIsValid (document: string, userId: string): Promise<void> {
    const existingUserDocument = await this.repository.getByDocument(document)

    if (existingUserDocument && existingUserDocument.id !== userId) {
      throw new InvalidParamError('This document already exists.')
    }

    if (!isValidString(document)) {
      throw new InvalidParamError('document')
    }
  }
}
