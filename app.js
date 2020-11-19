var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
const logErrors = require('express-log-errors');
//require("./telegrambot/telegrambot");
var sessionStore = require('./sessionstore');
var config = require('./config');
const Preset = require('./tools/databasePresetBuilder');
var databasePreset = new Preset();

// DEFINE ROUTERS
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var adminRouter = require('./routes/admin');
var appRouter = require('./routes/app');
var logoutRouter = require('./routes/logout');

// DEFINE TESTS
var testPost = require('./posts/testpost');

// DEFINE POSTS
var registerPost = require('./posts/registerpost');
var authPost = require('./posts/authpost');
var userPost = require('./posts/userpost');
var clockingPost = require('./posts/clocking');

var cors = require('cors');
sessionStore.clear();
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
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

// set the views directory
app.set('views', path.join(__dirname, 'views'));
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

// Use routers
app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/admin', adminRouter);
app.use('/app', appRouter);
app.use('/logout', logoutRouter);

// Use POSTS
app.use('', registerPost);
app.use('', authPost);
app.use('', userPost);
app.use('', clockingPost);
app.use('', testPost);

if (config.runBuilder) {
  databasePreset.presetBuilder();
  databasePreset.fillTemplate();
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
