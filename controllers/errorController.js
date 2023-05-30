const AppError = require('../utils/appError');

const handleValidationError = (err) => {
  // console.log(err.errors);
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(' ')}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsError = (err) => {
  const value = Object.values(err.keyValue)[0];
  // console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Token expired. Please log in again', 401);
};

// Send errors to development
const sendErrorDev = (err, res) => {
  console.log('Error 💥', err);

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// Send errors to production
const sendErrorProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || '500';
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // console.log(err.name);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    // console.log('Error 💥', error);

    if (err.name === 'ValidationError') {
      error = handleValidationError(error);
      // console.log('Message', err.errors);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsError(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};
