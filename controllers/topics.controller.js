const {getTopics} = require('../models/topics.models')


exports.findTopics = (request, response, next) => {
getTopics().then((topics) => {
    response.status(200).send({topics})
})
}