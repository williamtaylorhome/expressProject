var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var index = require('./routes/index')
var users = require('./routes/users')
var userInfo = require('./routes/userInfo')
var login = require('./routes/login')
var register = require('./routes/register')

// var session = require('express-session')

var session = require('client-sessions')

// Introduce express
var app = express()

// Set port
process.env.PORT = 3001

// Session basic settings
app.use(session({
  cookieName: 'token',
  secret: 'nodeDemo', // A random string. Because the client data is not secure, it needs to be encrypted.
  duration: 10 * 1000, // The expiration time of the session must be reset after it expires.
  activeDuration: 10 * 1000, // If the activation time is set to 30 minutes, for example, then as long as the user interacts with the server within 30 minutes, it will be reactivated.
}));


//Set up cross-domain access
/* 
  If the client does not make any settings in the request header, that is, the entire request is a simple request,
  Then the server can set the value of Access-Control-Allow-Origin to *,
  But if the client settings allow the client to upload cookie settings, such as credentials: 'include',
  Then the value of Access-Control-Allow-Credentials on the server side must be true, otherwise it will not succeed;

  If the client adds custom fields to the request header, that is, headers, for example, headers are
  headers: {
    Authorization_token: '111',
    Authorization_key: '222',
  },
  Or if Content-Type or the like is defined, then this is a complex request for the browser, and the return header needs to be modified.
  For example, the value of Access-Control-Allow-Origin cannot be *, but should be req.headers.origin or a specific domain.
  The Access-Control-Allow-Headers field must be set and should be consistent with the client's headers settings (note that it cannot be *)
  For example, the client here sets the Authorization_token field in the request header, and the client and server must be consistent.
  The Access-Control-Allow-Methods field must contain the options browser preflight request method. For example, here we allow
  Options are more post and get,
  There is another field setting that is very important, Access-Control-Max-Age. If it is not set, the browser will perform options pre-checking every time it makes a complex request.
  This operation is quite disgusting, so here we have the value 172800, that is, within two days, the current client request will send options except for the first time.
  After preflight, options will not be sent for other requests.
*/
app.all('*', function(req, res, next) {
  
  // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true);
  // res.header("Access-Control-Allow-Headers", "Authorization_token, Authorization_key, Content-type");
// res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
// res.header("Access-Control-Max-Age", "172800")
// res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var endFix = '.json'
app.use('/', index)
app.use('/users', users)
app.use(`/userInfo${endFix}` , userInfo)
app.use(`/login${endFix}` , login)
app.use(`/register${endFix}` , register)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;