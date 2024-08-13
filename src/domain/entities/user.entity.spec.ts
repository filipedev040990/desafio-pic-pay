import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { UserEntity } from './user.entity'
import MockDate from 'mockdate'

describe('UserEntity', () => {
  let sut: any
  let input: any

  beforeEach(() => {
    sut = UserEntity
    input = {
      id: 'AnyId',
      type: 'consumer',
      name: 'Any Name',
      document: 'anyDocument',
      email: 'anyEmail@email.com',
      password: 'hashedPassword'
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

  test('should throws if name is not provided', () => {
    input.name = undefined
    expect(() => sut.build(input)).toThrowError(new MissingParamError('name'))
  })

  test('should throws if type is not provided', () => {
    input.type = undefined
    expect(() => sut.build(input)).toThrowError(new MissingParamError('type'))
  })

  test('should throws if a invalid type is provided', () => {
    input.type = 'invalid_type'
    expect(() => sut.build(input)).toThrowError(new InvalidParamError('type'))
  })

  test('should throws if document is not provided', () => {
    input.document = undefined
    expect(() => sut.build(input)).toThrowError(new MissingParamError('document'))
  })

  test('should throws if email is not provided', () => {
    input.email = undefined
    expect(() => sut.build(input)).toThrowError(new MissingParamError('email'))
  })

  test('should throws if password is not provided', () => {
    input.password = undefined
    expect(() => sut.build(input)).toThrowError(new MissingParamError('password'))
  })

  test('should throws if a invalid email is provided', () => {
    input.email = 'invalid_email'
    expect(() => sut.build(input)).toThrowError(new InvalidParamError('email'))
  })

  test('should return a correct Entity', () => {
    const entity = sut.build(input)
    expect(entity).toEqual({
      id: 'AnyId',
      name: 'Any Name',
      type: 'consumer',
      document: 'anyDocument',
      email: 'anyEmail@email.com',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  })
})
