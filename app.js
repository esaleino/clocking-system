var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
const logErrors = require('express-log-errors');
/* const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error;
} */
console.log(result.parsed);
var connection = require('./connectPostgres');
const pgSession = require('connect-pg-simple')(session);
const Preset = require('./tools/databasePresetBuilder');
var databasePreset = new Preset();

/* ---------------------------- // DEFINE ROUTERS --------------------------- */
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var adminRouter = require('./routes/admin');
var appRouter = require('./routes/app');
var logoutRouter = require('./routes/logout');

/* ----------------------------- // DEFINE POSTS ---------------------------- */
var registerPost = require('./posts/registerpost');
var authPost = require('./posts/authpost').app;
var userPost = require('./posts/userpost');
var clockingPost = require('./posts/clocking');
var adminPost = require('./posts/adminpost');

/* ------------------------------ // DEFINE GET ----------------------------- */
var adminGet = require('./get/adminget');

var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new pgSession({
      pool: connection,
      createTableIfMissing: true,
      tableName: 'sessions', // Use another table-name than the default "session" one
      // Insert connect-pg-simple options here
    }),
    resave: true,
    cookie: { maxAge: 1 * 8 * 60 * 60 * 1000 },
    saveUninitialized: false,
  })
);

// set the views directory
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3000);
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(logErrors());
app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* ----------------------------- // Use routers ----------------------------- */
app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/admin', adminRouter);
app.use('/app', appRouter);
app.use('/logout', logoutRouter);

/* ------------------------------ // Use POSTS ------------------------------ */
app.use('', adminPost);
app.use('', registerPost);
app.use('', authPost);
app.use('', userPost);
app.use('', clockingPost);

/* ------------------------------- // Use GET ------------------------------- */
app.use('', adminGet);

console.log(process.env.run_builder);
if (process.env.run_builder == 'true') {
  databasePreset.presetBuilder();
} else {
  console.log('builder not set to run');
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err.status);
  res.status(err.status || 500);

  res.render('error');
});

module.exports = app;
