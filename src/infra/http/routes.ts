import { Router } from 'express'
import { expressRouteAdapter } from '../tools/express'
import { createUserFactory, updateUserFactory } from '../factories'

const router = Router()

router.post('/user', expressRouteAdapter(createUserFactory()))
router.put('/user/:id', expressRouteAdapter(updateUserFactory()))

export { router }
