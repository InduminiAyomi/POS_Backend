var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var corsOptions = {
  // origin: 'http://10.1.14.171:3001',
  origin: 'http://192.168.1.102:3001',
  // origin: '*',
  Credentials: true
};
 
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const bodyParser = require('body-parser');
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())


// Configuring the database
const mongoose = require('mongoose');
const config=require('config');

const dbUrl=config.get('dbConfig.url');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbUrl, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Require Routes
require('./app/routes/user.route.js')(app);
require('./app/routes/auth.route.js')(app);
require('./app/routes/item.route.js')(app);
require('./app/routes/order.route.js')(app);

// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

module.exports = app;
