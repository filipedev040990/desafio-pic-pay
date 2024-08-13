import { HttpRequest } from '@/adapters/dtos/controller.dto'
import { ControllerInterface } from '@/domain/interfaces/controllers/controller.interface'
import { Request, Response } from 'express'
import { prismaClient } from '../database/repositories/prisma-client'
import { randomUUID } from 'crypto'
import { obfuscateValue } from '@/shared/helpers/string.helper'

export const expressRouteAdapter = (controller: ControllerInterface) => {
  return async (req: Request, res: Response) => {
    const input: HttpRequest = {
      body: req?.body,
      params: req?.params,
      query: req?.query
    }

    const { statusCode, body } = await controller.execute(input)
    const output = (statusCode >= 200 && statusCode <= 499) ? body : { error: body.message }

    await logRequest(req, input, statusCode, output)

    res.status(statusCode).json(output)
  }
}

const logRequest = async (req: Request, input: any, statusCode: number, output: any): Promise<void> => {
  await prismaClient.request.create({
    data: {
      id: randomUUID(),
      userId: req?.body?.userId ?? null,
      method: req.method,
      input: JSON.stringify(obfuscateValue({ ...input.body })),
      route: req.url,
      createdAt: new Date(),
      status: statusCode,
      output: JSON.stringify(output),
      updatedAt: new Date()
    }
  })
}
