var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var app = express();
  
// import routes
var productRouter = require('./routes/product');
var usersRouter = require('./routes/users');
var ordersRouter = require('./routes/orders');


// U se Routes 
app.use('/api/products', productRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin:'*',
  methods:['GET','POST','PATCH','PUT','DELETE'],
  allowedHeaders:'Content-Type, Authorization, Origin, X-Requested-Width, Accept'
}))




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', productRouter);
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
