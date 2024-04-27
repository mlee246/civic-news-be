const db = require("../db/connection");

exports.getCommentsById = (article_id) => {
  return db.query(`
SELECT * 
FROM comments
WHERE comments.article_id = $1
ORDER BY comments.created_at ASC
;`, [article_id])
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.postComment = (newComment, article_id) => {
  const username = newComment.username;
  const comment = newComment.body;
  return db.query(`
INSERT INTO comments(author, body, article_id) 
VALUES ($1, $2, $3) 
RETURNING * 
;`, [username, comment, article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db.query(`
    DELETE FROM comments
    WHERE comments.comment_id = $1
    RETURNING *
    `, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${comment_id}`,
        });
      }
      return rows[0];
    });
};
