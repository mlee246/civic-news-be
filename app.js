const express = require("express");''
const cors = require('cors')
const app = express();
const {
  findTopics,
  findEndPoints,
} = require("./controllers/topics.controller");
const {
  findArticleById,
  findArticles,
  updateVotes,
} = require("./controllers/articles.controller");
const {
  findCommentsById,
  sendComment,
  deleteCommentById,
} = require("./controllers/comments.controller");

const { findUsers } = require("./controllers/users.controller");

const {
  handlePsqlErrors,
  handleCustomErrors,
  handleNotFoundErrors,
} = require("./error-handlers");

app.use(cors())

app.use(express.json());

app.get("/api/topics", findTopics);

app.get("/api", findEndPoints);

app.get("/api/articles/:article_id", findArticleById);

app.get("/api/articles", findArticles);

app.get("/api/articles/:article_id/comments", findCommentsById);

app.post("/api/articles/:article_id/comments", sendComment);

app.patch("/api/articles/:article_id", updateVotes);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", findUsers);

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleNotFoundErrors);

module.exports = app;
