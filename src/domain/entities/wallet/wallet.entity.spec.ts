import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { WalletEntity } from './wallet.entity'
import MockDate from 'mockdate'

describe('WalletEntity', () => {
  let sut: any
  let input: any

  beforeEach(() => {
    sut = WalletEntity
    input = {
      id: 'AnyId',
      userId: 'anyUserId',
      balance: 0,
      currency: 'BRL',
      status: 'active'
    }
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throws if id is not provided', () => {
    input.id = undefined
    expect(() => sut.build(input)).toThrowError(new MissingParamError('id'))
  })

  test('should throws if userId is not provided', () => {
    input.userId = undefined
    expect(() => sut.build(input)).toThrowError(new MissingParamError('userId'))
  })

  test('should throws if currency is not provided', () => {
    input.currency = undefined
    expect(() => sut.build(input)).toThrowError(new MissingParamError('currency'))
  })

  test('should throws if a invalid currency is provided', () => {
    input.currency = 'invalid'
    expect(() => sut.build(input)).toThrowError(new InvalidParamError('currency'))
  })

  test('should throws if status is not provided', () => {
    input.status = undefined
    expect(() => sut.build(input)).toThrowError(new MissingParamError('status'))
  })

  test('should return a correct Entity', () => {
    const entity = sut.build(input)
    expect(entity).toEqual({
      id: 'AnyId',
      userId: 'anyUserId',
      balance: 0,
      currency: 'BRL',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  })
})
