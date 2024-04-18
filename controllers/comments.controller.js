const {getCommentsById, postComment} = require('../models/comments.models')
const {getArticleById} = require('../models/articles.models')

exports.findCommentsById = (req, res, next) => {
const {article_id} = req.params
getCommentsById(article_id)
.then((comments) => {
    res.status(200).send({comments:comments})
})
.catch(next)
}

exports.sendComment = (req, res, next) => {
const {article_id} = req.params
getArticleById(article_id)
.then(({article_id}) => {
        const newComment = req.body
        postComment(newComment, article_id)
.then(({body}) => {
        res.status(201).send({comment:body})  
 })
})
.catch(next)
}