import { Router } from 'express'
import { expressRouteAdapter } from '../tools/express'
import { createUserFactory } from '../factories/create-user.factory'

const router = Router()

router.post('/user', expressRouteAdapter(createUserFactory()))

export { router }
