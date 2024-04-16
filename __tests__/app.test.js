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

/* 
NOTES:
**Manually add any new endpoints to endpoints.JSON 
**Update GET/api/topics testing (refer to T2 feedback)
*/