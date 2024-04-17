const db = require('../db/connection')

exports.getCommentsById = (article_id) => {
return db.query(`
SELECT * 
FROM articles
WHERE article_id = $1
;`, [article_id])
.then(({rows}) => {
    const article = rows[0]
    if(!article){
        return Promise.reject({
            status:404, msg:`No article found for article_id: ${article_id}`
        })}
})
.then(() => {
return db.query(`
SELECT * 
FROM comments
WHERE comments.article_id = $1
ORDER BY comments.created_at ASC
;`, [article_id])
.then(({rows:comments}) => {
    if(comments.length < 1){
        return Promise.reject({ status:404, msg:'This article has no comments.'})
        }
        return comments
 })
})
}
