import { CryptographyServiceInterface } from '@/domain/interfaces/services/cryptography-service.interface'
import bcrypt from 'bcrypt'

export class CryptographyService implements CryptographyServiceInterface {
  encrypt (value: string): string {
    return bcrypt.hashSync(value, 12)
  }

  async compare (value: string, valueToCompare: string): Promise<boolean> {
    return await bcrypt.compare(value, valueToCompare)
  }
}
