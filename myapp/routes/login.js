var express = require('express')
var router = express.Router()

const resEnd = require('../modules/end')
const OptPool = require('../modules/optPool')

const optPool = new OptPool()
const pool = optPool.getPool()

/* GET users listing.*/
router.post('/', function(req, res, next) {
  let post = ''
    req.on('data', chunk => { // Get the data received by post
      post += chunk
    })
    req.on('end', () => {
      if(post){
        post = JSON.parse(post)
      }
      /* Use promise start*/
      // promise link database
      const getConnectionPro = (resolve, reject) => {
        pool.getConnection((err, conn) => {
          resolve(conn)
        })
      }
      // promise query database
      const queryPro = (conn) => (resolve, reject) => {
        const sql = 'SELECT * from user where uname=? and pwd=?'
        const param = [post.username, post.password]
        conn.query(sql, param, (err, rs) => {
          resolve({ conn: conn, rs: rs })
        })
      }
      // Execute promise queue
      new Promise(getConnectionPro)
        .then(conn => new Promise(queryPro(conn)))
        .then(arg => {
          const rs = arg.rs, conn = arg.conn
          if(rs.length){ // Match results
            req.token.user = post.username // Save username settings in session
            resEnd(res, { token: post.username }, { status: 1, msg: 'Username and password match, login successful' })
          } else {
            resEnd(res, {}, { status: 0, msg: 'Incorrect username or password' })
          }
          conn.release(); //put back into connection pool
        })
        .catch(e => {
          console.log(e)
        })
      /* Use promise end*/
    })
});

module.exports = router;
