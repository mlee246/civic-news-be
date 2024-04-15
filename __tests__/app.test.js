const testData = require('../db/data/test-data/index')
const testDb = require('../db/connection')
const seed = require('../db/seeds/seed')
const app = require('../app')
const request = require('supertest')

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

/* 
1. require anything needed
2. GET/api/topics; should get all topics, responding with an array of topic objects (containing properties; slug, description)
3. GET/api/topics; tests: 
- HP: returns an array
- HP: returns two properties of slug & description
4. Set-up general error tests, keep at top of file
5. do the pull request, delete branch, send to nchelp pr
*/