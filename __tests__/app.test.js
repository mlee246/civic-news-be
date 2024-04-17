const testData = require('../db/data/test-data/index')
const testDb = require('../db/connection')
const seed = require('../db/seeds/seed')
const app = require('../app')
const request = require('supertest')
const endpoints = require('../endpoints.json')

beforeEach(() => seed(testData))
afterAll(() => testDb.end)

describe('GET/api/topics/invalidinput', () => {
    test('404: responds with a message when an invalid endpoint has been requested', () => {
        return request(app)
        .get('/api/topics/invalidinput')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('not found')
        })
    })
})

describe('GET/api/topics', () => {
    test('200: should return with an array of topic objects, with the correct properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const topics = body.topics
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug')
                expect(topic).toHaveProperty('description')
            })
        })
    })
})
describe('GET/api', () => {
    test('200: should respond with an object describing all available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const resEndpoints = body
            expect(resEndpoints).toEqual(endpoints)
        })
    })
    test('200: should respond with a nested object, with each inner object given an appropriate name', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const endpointNames = Object.keys(body)
            const regex = /(^GET |^POST |^PATCH |^DELETE )(\/api)/
            endpointNames.forEach((endpointName) => {
                expect(regex.test(endpointName)).toBe(true)
            })
        })
    })
    test('200: should respond with objects containing the correct properties', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const endpointsDetails = Object.values(body)
            endpointsDetails.forEach((endpointDetails) => {
                expect(typeof endpointDetails.description).toEqual('string')
                expect(typeof endpointDetails.queries).toEqual('object')
                expect(typeof endpointDetails.exampleResponse).toEqual('object')
            })
        })
    })
})

describe('GET/api/articles/:article_id', () => {
    test('200: should respond with an article object, containing the specified properties', () => {
        return request(app)
        .get('/api/articles/10')
        .expect(200)
        .then(({body}) => {
            const article = body
            expect(typeof article.author).toEqual('string')
            expect(typeof article.title).toEqual('string')
            expect(typeof article.article_id).toEqual('number')
            expect(typeof article.body).toEqual('string')
            expect(typeof article.topic).toEqual('string')
            expect(typeof article.created_at).toEqual('string')
            expect(typeof article.votes).toEqual('number')
            expect(typeof article.article_img_url).toEqual('string')
        })
    })
    test('400: should respond with an error message when article_id is invalid', () => {
        return request(app)
        .get('/api/articles/invalid_id')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('article_id is invalid')
        })
    })
    test('404: should respond with an error message when article_id is of valid type, but not found', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body}) => {
         expect(body.msg).toEqual('No article found for article_id: 999')
        })
    })
})
describe('GET/api/articles', () => {
    test('200: responds with an array containing the correct number of articles', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles.length).toBe(13)
        })
    })
    test('200: responds with an array containing article objects with the specified properties', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            articles.forEach((article) => {
                expect(typeof article.author).toEqual('string')
                expect(typeof article.title).toEqual('string')
                expect(typeof article.article_id).toEqual('number')
                expect(typeof article.topic).toEqual('string')
                expect(typeof article.created_at).toEqual('string')
                expect(typeof article.votes).toEqual('number')
                expect(typeof article.article_img_url).toEqual('string')
                expect(typeof article.comment_count).toEqual('number')
            })
        })
    })
    test('200: response should be sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toBeSortedBy('created_at', {descending:true,})
        })
    })
})



/* 
NEXT JOBS; 
**
NOTES:
**Manually add any new endpoints to endpoints.JSON 
**Update GET/api/topics testing (refer to T2 feedback) 
**Update GET/api testing (refer to T3 feedback) 
**Update GET/api/articles/:article_id testing (refer to T4 feedback) 
*/