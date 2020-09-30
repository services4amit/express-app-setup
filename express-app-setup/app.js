var createError = require('http-errors');
var express = require('express');
const helmet = require("helmet");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(helmet());
// This disables the `contentSecurityPolicy` middleware but keeps the rest.
// app.use(
//     helmet({
//       contentSecurityPolicy: false,
//     })
//   );

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



//Routing and app wise middlewares
//Choose res.render() or res.json()
//res.render()-- server side rendering
//res.json()-- client side rendering
//res.download()-- to download the file

//res.render()-- server side rendering--
//view engines like pug/Jade
// We will give 2 things to res.render() 1. view name and data in view
//app.set() used to set view engine app.set('view engine',ejs) & app.set('views',path)
// Need to set the path of folder where views are present app.set('views',path.join(__dirname,'myViews'))
// res.render("index")



// HEADERS already sent ,we can check like if(!res.headersSent) for handling this

// view engine setup start
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup end


//Routes

app.get('/home1', (req, res) => {
  res.send('<h1>Hello Express Home</h1>');
  //res.end();
  // res.sendFile(); // To send a file like html
})

app.get('/home2', (req, res) => {
  let obj = { "A": "a" };

  res.json(obj)
})

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
