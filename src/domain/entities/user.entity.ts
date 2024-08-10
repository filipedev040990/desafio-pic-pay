import constants from '@/shared/constants'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { isValidEmail, isValidString } from '@/shared/helpers/string.helper'
import { randomUUID } from 'crypto'

export type UserInput = {
  name: string
  type: string
  document: string
  email: string
  password: string
}

export class UserEntity {
  constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly type: string,
    public readonly document: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static build (input: UserInput): UserEntity {
    this.validate(input)
    return this.create(input)
  }

  private static validate (input: UserInput): void {
    const requiredFields: Array<keyof UserInput> = ['name', 'type', 'document', 'email', 'password']
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

  private static create (input: UserInput): UserEntity {
    const { name, type, document, email, password } = input
    const id = randomUUID()
    const now = new Date()
    return new UserEntity(id, name, type, document, email, password, now, now)
  }
}
