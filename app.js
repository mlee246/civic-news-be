const express = require('express')
const app = express()
const {findTopics, findEndPoints} = require('./controllers/topics.controller')
const {findArticleById} = require('./controllers/articles.controller')

app.get('/api/topics', findTopics)

app.get('/api', findEndPoints)

app.get('/api/articles/:article_id', findArticleById)

app.use((error, request, response, next) => {
    if(error.code === '22P02'){
        response.status(400).send({msg: 'article_id is invalid'})
    } else next (error)
})

app.use((error, request, response, next) => {
    if (error.status) {
        response.status(error.status).send({msg: error.msg})
    } else next(error)
})

app.use((request, response, next) => {
    response.status(404).send({msg:'not found'})
})


module.exports = app