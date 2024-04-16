const express = require('express')
const app = express()
const {findTopics, findEndPoints} = require('./controllers/topics.controller')

app.get('/api/topics', findTopics)

app.get('/api', findEndPoints)

app.use((request, response, next) => {
    response.status(404).send({msg:'not found'})
})


module.exports = app