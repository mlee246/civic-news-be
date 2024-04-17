const {getCommentsById} = require('../models/comments.models')

exports.findCommentsById = (req, res, next) => {
const {article_id} = req.params
getCommentsById(article_id)
.then((comments) => {
    res.status(200).send({comments:comments})
})
.catch(next)
}