import { Router } from 'express'
import { config } from "../utils"

const router = Router()

router.post('/login', async function (req, res) {
    if (config.api_token) {
        if (config.api_token === req.body.password) {
            res.status(200).json({ status: 200, message: 'success' })
        } else {
            res.status(403).json({ status: 403, message: 'bad password' })
        }
    } else {
        res.json({ status: 500, message: 'internal error' })
    }
})

export default router