/* eslint-disable prettier/prettier */
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400); // 400 bad requrest
};

const handleDuplicateFieldDB = (err) => {
    const message = `duplicate field value ${
        err.keyValue.name || ''
    }, please use another value`;
    return new AppError(message, 400); // 400 bad requrest
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid Input Data. ${errors.join(', ')}`;
    return new AppError(message, 400); // 400 bad requrest
};

const handleJWTError = () =>
    new AppError('Invalid token, please login again!', 401); //401 unauthorized
const handleJWTExpiredError = () =>
    new AppError('Your Token Has Expired, please login again!', 401); //401 unauthorized
const sendErrorDev = (err, req, res) => {
    //!)Api
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        });
    }
    //B)Rendered Website
    console.log('Error 🔥', err);

    return res.status(err.statusCode).render('error', {
        title: 'something went wrong',
        msg: err.message
    });
};

const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // B) Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }

    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        console.log(err);
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
};
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        console.log(err);
        console.log(err.name);
        let error = Object.assign({}, err);
        error.message = err.message;
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        }
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
        if (err.code === 11000) error = handleDuplicateFieldDB(error);
        sendErrorProd(error, req, res);
    }
};