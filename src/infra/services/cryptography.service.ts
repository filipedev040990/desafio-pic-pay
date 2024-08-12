import { CryptographyInterface } from '@/domain/interfaces/services/cryptography.interface'
import bcrypt from 'bcrypt'

export class CryptographyService implements CryptographyInterface {
  encrypt (value: string): string {
    return bcrypt.hashSync(value, 12)
  }

  async compare (value: string, valueToCompare: string): Promise<boolean> {
    return await bcrypt.compare(value, valueToCompare)
  }
}
