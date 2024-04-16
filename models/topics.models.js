const db = require('../db/connection')
const endpoints = require('../endpoints.json')

exports.getTopics = () => {
return db.query('SELECT * FROM topics;')
.then((result) => {
    return result.rows;
})
}

exports.getEndpoints = () => {
    return endpoints
}