type UserBaseDTO = {
  name: string
  type: string
  document: string
  email: string
}

export type CreateUserUseCaseInputDTO = UserBaseDTO & {
  password: string
}

export type BuildEntityDTO = CreateUserUseCaseInputDTO & {
  id: string
}

export type CreateUserUseCaseOutputDTO = UserBaseDTO & {
  id: string
  createdAt: Date
}

export type CreateUserRepositoryInputDTO = CreateUserUseCaseOutputDTO & {
  password: string
  updatedAt: Date
}

export type UserRepositoryOutputDTO = CreateUserUseCaseOutputDTO
