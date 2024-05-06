
const resEnd = require('../modules/end')

// Check whether the token is legal
const checkToken = (req, res) => (resolve, reject) => {
  if(req && req.token && req.token.user){
    resolve()
  } else {
    const msg = 'Login timeout'
    resEnd(res, {}, {status: -1, msg: msg})
    reject(msg)
  }
}
module.exports = checkToken