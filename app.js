const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//###########MIDDLEWARES###########

//json middleware
//this will add data to the body of request object
app.use(express.json());

//morgan: formating logs
app.use(morgan('dev'));

//custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//###########CONSTS###########

const API_PATH = '/api/v1';

//###########MOUNTING ROUTES (middleware) ON APP###########
app.use(`${API_PATH}/tours`, tourRouter);
app.use(`${API_PATH}/users`, userRouter);

module.exports = app;
