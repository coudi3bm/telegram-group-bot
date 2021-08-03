import { Router } from 'express'
import { Group } from "../db"

const router = Router()
router.get('/', async function (req, res) {
    const groups = await Group.findAll({
        order: [
            ['id', 'ASC']]
    })
    res.json(groups)
})

router.get('/:id', async function (req, res) {
    const group = await Group.findOne({ where: { id: req.params.id } })
    if (group) {
        res.json(group)
    } else {
        res.status(404).json({ status: 404, message: 'not found' })
    }
})

router.post('/', async function (req, res) {
    const group = await Group.findOne({ where: { id: req.body.id } })
    if (group) {
        res.status(409).json({ status: 409, message: 'group with this id already exsist' })
    } else {
        const group = await Group.create({
            id: req.body.id,
            name: req.body.name,
            note: req.body.note,
        })
        res.status(200).json({ status: 200, message: 'group created' })
    }
})

router.put('/:id', async function (req, res) {
    const group = Group.update({ id: req.body.id, name: req.body.name, note: req.body.note, }, {
        where: { id: req.params.id }
    })
    res.json(group)
})

router.delete('/:id', async function (req, res) {
    const group = await Group.destroy({
        where: {
            id: req.params.id,
        }
    });
    if (group) {
        res.status(200).json({ status: 200, message: 'group removed' })
    } else {
        res.status(500).json({ status: 500, message: 'delete error' })
    }
})


export default router