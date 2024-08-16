import { BuildEntityDTO } from '@/adapters/dtos/wallet.dto'
import { MissingParamError, InvalidParamError } from '@/shared/errors'
import { isValidString } from '@/shared/helpers/string.helper'
import constants from '@/shared/constants'

export class WalletEntity {
  constructor (
    public id: string,
    public userId: string,
    public balance: number,
    public currency: string,
    public status: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  public static build (input: BuildEntityDTO): WalletEntity {
    this.validate(input)
    return this.create(input)
  }

  private static validate (input: BuildEntityDTO): void {
    const requiredFields: Array<keyof Omit<BuildEntityDTO, 'balance'>> = ['id', 'userId', 'currency', 'status']
    for (const field of requiredFields) {
      if (!isValidString(input[field])) {
        throw new MissingParamError(field)
      }
    }

    if (input.balance === null || input.balance === undefined) {
      throw new MissingParamError('balance')
    }

    if (input.balance < 0) {
      throw new InvalidParamError('balance')
    }

    if (!constants.CURRENCY_TYPES.includes(input.currency)) {
      throw new InvalidParamError('currency')
    }
  }

  private static create (input: BuildEntityDTO): WalletEntity {
    const { id, userId, currency, balance, status } = input
    const now = new Date()
    return new WalletEntity(id, userId, balance, currency, status, now, now)
  }
}
