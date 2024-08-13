export interface CryptographyServiceInterface {
  encrypt: (value: string) => string
  compare: (value: string, valueToCompare: string) => Promise<boolean>
}
