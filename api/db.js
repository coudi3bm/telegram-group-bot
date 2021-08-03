import { Sequelize } from 'sequelize'

export const db = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
})

export const Group = db.define('Groups', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING
    },
    note: {
        type: Sequelize.TEXT
    }
}, {
    timestamps: false
})

export const Trigger = db.define('Triggers', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    groupId: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    actions: {
        type: Sequelize.TEXT,
        get() {
            return JSON.parse(this.getDataValue("actions"))
        },
        set(value) {
            this.setDataValue("actions", JSON.stringify(value))
        }
    },
    condition: {
        type: Sequelize.TEXT,
        get() {
            return JSON.parse(this.getDataValue("condition"))
        },
        set(value) {
            this.setDataValue("condition", JSON.stringify(value))
        }
    }
}, {
    timestamps: false
})

export const Stats = db.define('Stats', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    groupId: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    key: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.DATE
    },
    count: {
        type: Sequelize.INTEGER,
    },
}, {
    timestamps: false
})

db.sync()