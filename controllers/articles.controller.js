const {
  getArticleById,
  getArticles,
  patchVote,
} = require("../models/articles.models");

exports.findArticleById = (req, res, next) => {
  const { article_id } = req.params;
  getArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.findArticles = (req, res, next) => {
  getArticles().then((articles) => {
    res.status(200).send({ articles: articles });
  });
};

exports.updateVotes = (req, res, next) => {
  const { article_id } = req.params;
  getArticleById(article_id)
    .then(({ article_id }) => {
      const { inc_votes } = req.body;
      patchVote(article_id, inc_votes)
      .then((article) => {
        res.status(200).send({article: article})
    })
})
    .catch(next);
};
