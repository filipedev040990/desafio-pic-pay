type AuthorizeData = {
  authorization: boolean
}

export type AuthorizeResponse = {
  status: string
  data: AuthorizeData
}

export interface AuthorizeServiceInterface {
  execute: () => Promise<AuthorizeResponse>
}
