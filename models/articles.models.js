const db = require("../db/connection");

exports.getArticleById = (article_id) => {
  return db.query(`
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body, 
    COUNT(comments.article_id)::INT 
    AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ;`, [article_id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return article;
    });
};

exports.getArticles = (topic) => {
  let queryStart = `  
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id)::INT 
  AS comment_count
  FROM articles
  LEFT JOIN comments 
  ON comments.article_id = articles.article_id`;
  const queryEnd = `
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;
  let queryTopic = [];

  if (topic) {
    queryStart += ` WHERE articles.topic = $1`;
    queryTopic.push(topic);
  }
  return db.query(`${queryStart} ${queryEnd}`, queryTopic).then(({ rows }) => {
    return rows;
  });
};

exports.patchVote = (article_id, inc_votes) => {
  return db
    .query(`
UPDATE articles
SET votes = votes + $1
WHERE articles.article_id = $2
RETURNING *
`, [inc_votes, article_id])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      }
      return Promise.reject({
        status: 404,
        msg: `No article found for article_id: ${article_id}`,
      });
    });
};
