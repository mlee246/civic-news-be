const express = require('express')
const app = express()
const {findTopics} = require('./controllers/topics.controller')

app.get('/api/topics', findTopics)

app.use((request, response, next) => {
    response.status(404).send({msg:'not found'})
})


module.exports = app