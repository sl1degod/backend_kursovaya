const db = require('../db/database')
const database = require("../db/database");
const stream = require('../Stream')

class ObjectsController {

    async getAllObjects(req, res) {
        const objects = await database.query('select objects.id, objects.name, objects.latitude, objects.longitude, objects.uuid_image, count(report.object_id) as count from objects join report on objects.id = report.object_id group by objects.id')
        res.json(objects.rows)
    }

    async getObjects(req, res) {
        const id = req.params.id
        const objects = await database.query('select * from objects where id = $1', [id])
        res.json(objects.rows[0])
    }

    async getImage(req, res) {
        const id = req.params.id
        const user = await database.query('select users.firstname, users.secondname, users.lastname, users.uuid_image, posts.name as post, users.login, users.password from users, posts where users.post_id = posts.id and users.id = $1', [id])
        stream.objectsReadStream(req, res, id)
    }

    async createObject(req, res) {
        let {name, latitude, longitude} = req.body;
        try {
            const newUser = await database.query(`insert into objects (name, latitude, longitude) values($1, $2, $3) RETURNING *`, [name, latitude, longitude])
            res.json(newUser.rows[0])

        } catch (error) {
            res.json({
                message: "Во время создания объекта произошла ошибка"
            })
        }
    }

    async updateObjects(req, res) {
        const id = req.params.id
        let {name, latitude, longitude} = req.body;
        const user = await database.query('update users set name = $1, latitude = $2, longitude = $3 where id = $4 RETURNING *', [name, latitude, longitude, id])
        res.json(user.rows[0])
    }

}

module.exports = new ObjectsController()