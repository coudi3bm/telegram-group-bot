import { Router } from 'express'
import { Trigger } from "../db"

const router = Router()

router.get('/', async function (req, res) {
    const triggers = await Trigger.findAll({
        order: [
            ['id', 'ASC']
        ],
        where: { groupId: req.query.groupId }
    })
    res.json(triggers)
})

router.get('/:id', async function (req, res) {
    const trigger = await Trigger.findOne({ where: { id: req.params.id, groupId: req.query.groupId } })
    if (trigger) {
        res.json(trigger)
    } else {
        res.status(404).json({ status: 404, message: 'not found' })
    }
})

router.post('/', async function (req, res) {
    const trigger = await Trigger.create({
        name: req.body.name,
        actions: [],
        condition: {
            data: [],
            type: '',
            whoAffected: []
        },
        groupId: req.query.groupId
    })
    res.status(200).json(trigger)
})

router.put('/:id', async function (req, res) {
    const trigger = Trigger.update({ name: req.body.name, actions: req.body.actions, condition: req.body.condition }, {
        where: {
            id: req.params.id,
            groupId: req.query.groupId
        }
    })
    res.json(trigger)
})

router.delete('/:id', async function (req, res) {
    const trigger = await Trigger.destroy({
        where: {
            id: req.params.id,
            groupId: req.query.groupId
        }
    });
    if (trigger) {
        res.status(200).json({ status: 200, message: 'trigger removed' })
    } else {
        res.status(500).json({ status: 500, message: 'delete error' })
    }
})

export default router