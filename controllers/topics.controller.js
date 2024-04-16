const {getTopics, getEndpoints} = require('../models/topics.models')


exports.findTopics = (request, response, next) => {
getTopics()
.then((topics) => {
    response.status(200).send({topics})
})
}
exports.findEndPoints = (request, response, next) => {
const endpoints = getEndpoints()
response.status(200).send(endpoints)
}