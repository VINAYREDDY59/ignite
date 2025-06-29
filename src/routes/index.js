import express from 'express'
import igniteRoute from './igniteRoutes.js'
const router = express.Router();


router.use('/ignite', igniteRoute)

export default router;