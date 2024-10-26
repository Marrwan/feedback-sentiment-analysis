const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');

const app = express();


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});


module.exports = app;
