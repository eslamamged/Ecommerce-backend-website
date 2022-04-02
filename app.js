const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const app = express();

const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const sellerReviewRouter = require('./routes/sellerReviewRoutes');
const productReviewRouter = require('./routes/productReviewRoutes');
const orderRouter = require('./routes/orderRoutes');
const productRouter = require('./routes/productRoutes');
const brandRoutes = require('./routes/brandRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const categoryRoutes = require('./routes/categoryRoutes'); ////////
const subCategoryRoute = require('./routes/subCategoryRoute'); ////////
const variantRoute = require('./routes/VariantRoutes'); ////////
const variantOptionRoute = require('./routes/VariantOptionsRoutes'); ////////
const heroRoutes = require('./routes/heroRoutes'); ////////
const couponRoute = require('./routes/couponRoutes'); ////////
const contactRoute = require('./routes/contactRoutes');

const orderItemRoute = require('./routes/orderItemRoutes');
const settingsRoute = require('./routes/SettingsRouts');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
/****************** 1) Global Middlewares ******************************/
app.use(cors());

//Set Security HTTP Headers
app.use(helmet());
// (Logging)  Use Morgan Middleware to give information about the request ( in development only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// router
// rate limiting prevent the same ip from making too many requests to our api and if exceeds that maximum number of requrest block that request
// limit request from same api
const limiter = rateLimit({
    max: 10000, // 100 requrests depend on the application
    windowMs: 60 * 60 * 1000, // 1 hr
    message: 'Too many requests from this ip, please try again in an hour!'
});
app.use('/api', limiter); // apply this rate limiter to all requests that start with /api

// Body Parser ( reading data from body into req.body)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// Data Sanitization against NOSQl Query INjection ex:email:{"$gt":""}
app.use(mongoSanitize()); // look at the request body, params,queryStrings and remove all dollar signs and dots

// Data Sanitization Against XSS(cross site scripting attacks)
app.use(xss()); // this clean any user code form malicious html
// prevent  parameter pollution middleware
app.use(
    hpp({
        // white list is an array of properties that we actually allow in our query string
        whitelist: [
            'duration',
            'ratingsQuantitiy',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);
// Serving Static Files
// app.use(express.static(path.join(__dirname, 'public')));

// Test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

/****************** 2) routes ******************************/

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createNewTour);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/subCategory', subCategoryRoute);
app.use('/api/v1/brand', brandRoutes);
app.use('/api/v1/order', orderRouter);

//this api run for all request methods (get-post-delete-patch)
app.use('/api/v1/users', userRouter);
app.use('/api/v1/sellerReviews', sellerReviewRouter);
app.use('/api/v1/productReviews', productReviewRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/variant', variantRoute);
app.use('/api/v1/variantOption', variantOptionRoute);

app.use('/api/v1/coupon', couponRoute);
app.use('/api/v1/hero', heroRoutes);

app.use('/api/v1/contactUs', contactRoute);
app.use('/api/v1/orderItem', orderItemRoute);
app.use('/api/v1/settings', settingsRoute);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 400)); // 400 bad requrest
});
app.use(globalErrorHandler);

module.exports = app;
