import { Router } from 'express'
import { Stats } from "../db"

const router = Router()

router.get('/', async function (req, res) {
    const stats = await Stats.findAll({
        order: [
            ['id', 'ASC']
        ],
        where: {
            groupId: req.query.groupId,
        }
    })
    res.json(stats)
})

export default router