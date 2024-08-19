import { AuthorizeResponse, AuthorizeServiceInterface } from '@/domain/interfaces/services/authorize-service.interface'
import { AuthorizationError } from '@/shared/errors'
import { logger } from '@/shared/helpers/logger.helper'
import axios from 'axios'

export class AuthorizeService implements AuthorizeServiceInterface {
  async execute (): Promise<AuthorizeResponse> {
    const url = 'https://util.devi.tools/api/v2/authorize'
    try {
      const request: any = await axios.get(url)

      return {
        status: request.data.status,
        data: request.data.data
      }
    } catch (error: any) {
      logger.error(error)
      throw new AuthorizationError()
    }
  }
}
