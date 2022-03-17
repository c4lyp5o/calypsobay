const express = require('express');
const createError = require('http-errors');
const cors = require('cors');
// const bodyParser = require('body-parser');
// const morgan = require('morgan');
// const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');
const fileUpload = require('express-fileupload');
require('dotenv').config();

// create express app
const app = express();

// enable middleware
app.use(cors());
app.use(fileUpload({createParentPath: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// init routes
const theBay = require('./routes/calypsobay');
app.use('/', theBay);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// init DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to Bay Database!');
  })
  .catch(err => {
    console.error('Could not Connect to Database!', err);
});

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