var express = require('express');
var router = express.Router();

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
    post = JSON.parse(post)
    //Execute sql statement
    pool.getConnection((err, conn) => {
      //Query database
      const sql = 'SELECT * from user where uname=?'
      conn.query(sql, [post.username], (err, rs) => { 
        if (err) { 
          console.log('[query] - :' + err)
          return
        }
        if(rs.length){ // Match results
          resEnd(res, {}, {status: 0, msg: 'Username already exists'})
        } else {
          const insert = 'insert into user (uname, pwd) values(?, ?)'
          const param = [post.username, post.password];
          conn.query(insert, param, (err, rs) => {
            if (err) {
              console.log('[insert] - :' + err)
              return
            }
            resEnd(res, {}, {status: 1, msg: '注册成功'})
          })
        }
        conn.release(); //put back into connection pool
      })
    })
  })
});

module.exports = router;
