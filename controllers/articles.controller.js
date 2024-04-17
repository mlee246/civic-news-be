const {getArticleById, getArticles} = require('../models/articles.models')

exports.findArticleById = (req, res, next) => {
    const {article_id} = req.params
    getArticleById(article_id)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch(next)
}

exports.findArticles = (req, res, next) => {
    getArticles()
    .then((articles) => {
        res.status(200).send({articles: articles})
    })
}