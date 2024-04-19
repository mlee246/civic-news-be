const {getTopics} = require('../models/topics.models')
const endpoints = require('../endpoints.json')


exports.findTopics = (req, res, next) => {
getTopics()
.then((topics) => {
    res.status(200).send({topics:topics})
})
}
exports.findEndPoints = (req, res, next) => {
res.status(200).send({endpoints:endpoints})
}