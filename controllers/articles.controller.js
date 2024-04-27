const {
  getArticleById,
  getArticles,
  patchVote,
} = require("../models/articles.models");
const { getTopics } = require("../models/topics.models");

exports.findArticleById = (req, res, next) => {
  const { article_id } = req.params;
  getArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.findArticles = (req, res, next) => {
  const topic = req.query.topic;
  getTopics()
    .then((topics) => {
      const validTopics = topics.map((topic) => {
        return topic.slug;
      });
      if (topic != undefined && validTopics.indexOf(topic) === -1) {
        res.status(404).send({ msg: `${topic}: is not yet a valid topic` });
      } else {
        getArticles(topic).then((articles) => {
          res.status(200).send({ articles: articles });
        });
      }
    })
    .catch(next);
};

exports.updateVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (typeof inc_votes != "number") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    patchVote(article_id, inc_votes)
      .then((article) => {
        res.status(200).send({ article: article });
      })
      .catch(next);
  }
};
