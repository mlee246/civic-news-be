const testData = require("../db/data/test-data/index");
const testDb = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const request = require("supertest");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => testDb.end());

describe("GET/api/topics/invalidinput", () => {
  test("404: responds with a message when an invalid endpoint has been requested", () => {
    return request(app)
      .get("/api/topics/invalidinput")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");
      });
  });
});

describe("GET/api/topics", () => {
  test("200: should return with an array of topic objects, of the correct length and with the correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        const topics = body.topics;
        expect(topics.length).toBe(3)
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET/api", () => {
  test("200: should respond with an object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({body}) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET/api/articles/:article_id", () => {
  test("200: should respond with an article object, containing the specified properties", () => {
    return request(app)
      .get("/api/articles/10")
      .expect(200)
      .then(({ body }) => {
        const article = body;
        expect(typeof article.author).toEqual("string");
        expect(typeof article.title).toEqual("string");
        expect(typeof article.article_id).toEqual("number");
        expect(typeof article.body).toEqual("string");
        expect(typeof article.topic).toEqual("string");
        expect(typeof article.created_at).toEqual("string");
        expect(typeof article.votes).toEqual("number");
        expect(typeof article.article_img_url).toEqual("string")
        expect(typeof article.comment_count).toEqual("number");
      });
  }); test("200: should respond with an article object, containing the correct comment count", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const article = body;
        expect(article.comment_count).toBe(2)
      });
  });
  test("400: should respond with an error message when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  test("404: should respond with an error message when article_id is of valid type, but not found", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No article found for article_id: 999");
      });
  });
});

describe("GET/api/articles", () => {
  test("200: responds with an array containing the correct number of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
      });
  });
  test("200: responds with an array containing article objects with the specified properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(typeof article.author).toEqual("string");
          expect(typeof article.title).toEqual("string");
          expect(typeof article.article_id).toEqual("number");
          expect(typeof article.topic).toEqual("string");
          expect(typeof article.created_at).toEqual("string");
          expect(typeof article.votes).toEqual("number");
          expect(typeof article.article_img_url).toEqual("string");
          expect(typeof article.comment_count).toEqual("number");
        });
      });
  });
  test("200: response should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: responds with the correct number of article objects, when requested with a topic query", () => {
    return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles.length).toBe(12);
    });
  })
  test("404: should respond with an error message when the query is of valid type, but not found", () => {
    return request(app)
      .get("/api/articles/?topic=notatopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("notatopic: is not yet a valid topic");
      });
    })
});

describe("GET/api/articles/:article_id/comments", () => {
  test("200: should respond with correct number of comments for the article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(11);
      })
      .then(() => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments.length).toBe(2);
          });
      });
  });
  test("200: should respond with an array of comment objects, containing the specified properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toEqual("number");
          expect(typeof comment.votes).toEqual("number");
          expect(typeof comment.created_at).toEqual("string");
          expect(typeof comment.author).toEqual("string");
          expect(typeof comment.body).toEqual("string");
          expect(typeof comment.article_id).toEqual("number");
        });
      });
  });
  test("200: should respond with an array of comment objects, in order of most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at");
      });
  });
  test("400: should respond with an error message when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  test("404: should respond with an error message when article_id is of valid type, but not found", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No article found for article_id: 9999");
      });
  });
  test("404: should respond with an error message when article_id is valid, but there are no comments associated with it", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("This article has no comments.");
      });
  });
});

describe("POST/api/articles/:article_id/comments", () => {
  test("200: should add a comment to an article (specified by article_id) and respond with the posted comment", () => {
    const testComment = {
      username: "butter_bridge",
      body: "test comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(testComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toBe("test comment");
      });
  });
  test("400: should respond with an error message when article_id is invalid", () => {
    const testComment = {
      username: "butter_bridge",
      body: "test comment",
    };
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  test("404: should respond with an error message when article_id is of valid type, but not found", () => {
    const testComment = {
      username: "butter_bridge",
      body: "test comment",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No article found for article_id: 999");
      });
  });
});

describe("PATCH/api/articles/:article_id", () => {
  test("200: should return the updated article with votes increased when given a positive value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: should return the updated article with votes decreased when given a negative value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -1 })
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 99,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: should respond with an error message when article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/invalid_id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  test("404: should respond with an error message when article_id is of valid type, but not found", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No article found for article_id: 999");
      });
  });
});

describe("DELETE/api/comments/:comment_id", () => {
  test("204: should respond with a 204 status code when comment is succesfully deleted", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("400: should respond with an error message when comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  test("404: should respond with an error message when comment_id is of valid type, but not found", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("No comment found for comment_id: 999");
      });
  });
});

describe('GET/api/users', () => {
  test('200: should respond with an array of the correct number of user objects', () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({ body }) => {
      const { users } = body;
      expect(users.length).toBe(4);
    });
  })
  test("200: responds with an array containing user objects with the specified properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(typeof user.username).toEqual("string");
          expect(typeof user.name).toEqual("string");
          expect(typeof user.avatar_url).toEqual("string");
        });
      });
  });
})

/* 
NEXT JOBS; 
**
NOTES:
**Manually add any new endpoints to endpoints.JSON 
**Update GET/api/topics testing (refer to T2 feedback) 
**Update GET/api testing (refer to T3 feedback) 
**Update GET/api/articles/:article_id testing (refer to T4 feedback) 
**Update GET/api/articles testing (refer to T5 feedback) 
*/
