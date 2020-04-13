const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose')
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/test-albums-task', {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => {
        console.log(err);
        console.log('start the mongo db server');
    });
mongoose.set('debug', true);
require('./models/Albums');

const indexRouter = require('./routes/index');

app.use('/', indexRouter);

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
  console.log(err)
  res.json({error: err.message})
});

module.exports = app;
