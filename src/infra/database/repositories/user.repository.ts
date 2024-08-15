import { CreateUserRepositoryInputDTO, UpdateUserRepositoryInputDTO, UserRepositoryOutputDTO } from '@/adapters/dtos/user.dto'
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/users/create-user-repository.interface'
import { prismaClient } from './prisma-client'
import { UserEntity } from '@/domain/entities/user.entity'

export class UserRepository implements UserRepositoryInterface {
  async save (data: CreateUserRepositoryInputDTO): Promise<UserRepositoryOutputDTO> {
    const user = await prismaClient.user.create({ data })
    return this.mapModelToEntity(user)!
  }

  async getByEmail (email: string): Promise<UserRepositoryOutputDTO | null> {
    const user = await prismaClient.user.findFirst({ where: { email } })
    return this.mapModelToEntity(user)
  }

  async getByDocument (document: string): Promise<UserRepositoryOutputDTO | null> {
    const user = await prismaClient.user.findFirst({ where: { document } })
    return this.mapModelToEntity(user)
  }

  async getById (id: string): Promise<UserRepositoryOutputDTO | null> {
    const user = await prismaClient.user.findFirst({ where: { id } })
    return this.mapModelToEntity(user)
  }

  async update (input: UpdateUserRepositoryInputDTO): Promise<UserRepositoryOutputDTO> {
    const { id, ...data } = input
    const user = await prismaClient.user.update({
      where: {
        id
      },
      data
    })

    return this.mapModelToEntity(user)!
  }

  mapModelToEntity (user: UserEntity | null): UserRepositoryOutputDTO | null {
    if (!user) {
      return null
    }

    const output: UserRepositoryOutputDTO = {
      id: user.id,
      type: user.type,
      name: user.name,
      document: user.document,
      email: user.email,
      createdAt: user.createdAt
    }

    if (user.updatedAt) {
      output.updatedAt = user.updatedAt
    }

    return output
  }
}
