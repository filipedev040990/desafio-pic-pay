import { CreateUserRepositoryInputDTO, CreateUserRepositoryOutputDTO } from '@/adapters/dtos/user.dto'
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/users/create-user-repository.interface'
import { prismaClient } from './prisma-client'

export class UserRepository implements UserRepositoryInterface {
  async save (data: CreateUserRepositoryInputDTO): Promise<CreateUserRepositoryOutputDTO> {
    return await prismaClient.user.create({ data })
  }

  async getByEmail (email: string): Promise<CreateUserRepositoryOutputDTO | null> {
    const user = await prismaClient.user.findFirst({ where: { email } })
    return user ?? null
  }

  async getByDocument (document: string): Promise<CreateUserRepositoryOutputDTO | null> {
    const user = await prismaClient.user.findFirst({ where: { document } })
    return user ?? null
  }
}
