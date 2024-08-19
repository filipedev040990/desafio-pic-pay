import { Router } from 'express'
import { expressRouteAdapter } from '../tools/express'
import { createUserFactory, updateUserFactory } from '../factories'
import { createTransactionFactory } from '../factories/create-transaction.factory'

const router = Router()

router.post('/user', expressRouteAdapter(createUserFactory()))
router.put('/user/:id', expressRouteAdapter(updateUserFactory()))

router.post('/transfer', expressRouteAdapter(createTransactionFactory()))

export { router }
