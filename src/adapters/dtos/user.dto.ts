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

export type UserOutputDTO = UserBaseDTO & {
  id: string
  createdAt: Date
  updatedAt?: Date
}

export type CreateUserRepositoryInputDTO = UserOutputDTO & {
  password: string
  updatedAt: Date
}

export type UserRepositoryOutputDTO = UserOutputDTO

export type UpdateUserUseCaseInputDTO = {
  id: string
  name?: string
  document?: string
  email?: string
  password?: string
}

export type UpdateUserRepositoryInputDTO = UpdateUserUseCaseInputDTO & {
  updatedAt: Date
}
