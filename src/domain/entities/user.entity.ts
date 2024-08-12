import { CreateUserUseCaseInputDTO } from '@/adapters/dtos/user.dto'
import constants from '@/shared/constants'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { isValidEmail, isValidString } from '@/shared/helpers/string.helper'
import { randomUUID } from 'crypto'

export class UserEntity {
  constructor (
    public id: string,
    public name: string,
    public type: string,
    public document: string,
    public email: string,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  public static build (input: CreateUserUseCaseInputDTO): UserEntity {
    this.validate(input)
    return this.create(input)
  }

  private static validate (input: CreateUserUseCaseInputDTO): void {
    const requiredFields: Array<keyof CreateUserUseCaseInputDTO> = ['name', 'type', 'document', 'email', 'password']
    for (const field of requiredFields) {
      if (!isValidString(input[field])) {
        throw new MissingParamError(field)
      }
    }

    if (!isValidEmail(input.email)) {
      throw new InvalidParamError('email')
    }

    if (!constants.CUSTOMER_TYPES.includes(input.type)) {
      throw new InvalidParamError('type')
    }
  }

  private static create (input: CreateUserUseCaseInputDTO): UserEntity {
    const { name, type, document, email, password } = input
    const id = randomUUID()
    const now = new Date()
    return new UserEntity(id, name, type, document, email, password, now, now)
  }
}
