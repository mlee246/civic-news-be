const express = require('express')
const app = express()
const {findTopics, findEndPoints} = require('./controllers/topics.controller')
const {findArticleById, findArticles} = require('./controllers/articles.controller')
const {findCommentsById, sendComment} = require('./controllers/comments.controller')

app.use(express.json());

app.get('/api/topics', findTopics)

app.get('/api', findEndPoints)

app.get('/api/articles/:article_id', findArticleById)

app.get('/api/articles', findArticles)

app.get('/api/articles/:article_id/comments', findCommentsById)

app.post('/api/articles/:article_id/comments', sendComment)

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: 'article_id is invalid'})
    } else next (err)
})

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({msg: err.msg})
    } else next(err)
})

app.use((req, res, next) => {
    res.status(404).send({msg:'not found'})
})


module.exports = app