var express = require('express');
var router = express.Router();

const resEnd = require('../modules/end')
const OptPool = require('../modules/optPool')

const optPool = new OptPool()
const pool = optPool.getPool()

const checkToken = require('../modules/checkToken')

/* GET users listing.*/
router.post('/', function(req, res, next) {
  let post = ''
  req.on('data', chunk => { // Get the data received by post
    post += chunk
  })
  req.on('end', () => {
    post = JSON.parse(post)
    console.log(req.token)
    new Promise(checkToken(req, res))
      .then(
        //Execute sql statement
        () => pool.getConnection((err, conn) => {
          //Query database
          const sql = 'SELECT * from user where uname=?'
          console.log(req.token.user)
          conn.query(sql, [req.token.user], (err, rs) => { 
            if (err) { 
              console.log('[query] - :' + err)
              return
            }
            // if(rs && rs[0]){
              let data = Object.assign(rs[0], {token: req.cookies.token})
              resEnd(res, {username:data.uname, token: data.token, id: data.uid}, {status: 1, msg: 'Obtain user information successfully'})
            // } else {
// resEnd(res, {}, {status: -1, msg: 'Login timeout'})
// }
            conn.release(); //put back into connection pool
          })
        })
      )
      .catch(e => {
        console.log(e)
      })
  })
});

module.exports = router;
