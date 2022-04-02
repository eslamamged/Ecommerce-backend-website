const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const authenticationJoi = require('../validations/authenticationJoi');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const validateJoi = authenticationJoi.authValidate(req.body);
    if (validateJoi) {
        return next(new AppError(validateJoi.message, 400));
    }

    // authValidation.authValidate(req.body);
    const {
        name,
        email,
        password,
        passwordConfirm,
        role,
        photo,
        phone,
        address: { country, city, street, zip }
    } = req.body;
    const newUser = await User.create({
        name,
        email,
        phone,
        password,
        passwordConfirm,
        role,
        photo,
        phone,
        address: { country, city, street, zip }
    });
    createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('please provide email and password!', 400));
    }
    const user = await User.findOne({ email }).select('+password'); // to retern pass

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('InCorrect Email or Password!', 401));
    }
    createAndSendToken(user, 200, res);
});
exports.logout = (req, res) => {
    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
    // to check if has token ?
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please Login to get access',
                401
            )
        );
    }

    const decoded = await promisify(jwt.verify)(
        // to check token
        token,
        process.env.JWT_SECRET,
        {}
    );
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token no longer exists.',
                401
            )
        );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User Recently Changed the Password, Please Login Again',
                401
            )
        );
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});
exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        // roles [ 'admin','seller','user']
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'YOu are not authorized to perform this action',
                    403 // 403 forbidden
                )
            );
        }
        next();
    };

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1) Get the user based on the posted email and password
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new AppError(
                'Please provide a valid email for resetting your password',
                404
            ) // 404: not found
        );
    }
    //2) Generate Random Token for resetting the password
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // user.findByIdAndUpdate() will not work because password confirm validate only works with save() and create Not update , also all pre('save' ,func) middleware functions defined in the userModel will not work either

    // { validateBeforeSave: false } is required because if we need to stop all validation when we update these data

    // because we changed the user data in createPasswordREsetToken function but we didn't save it yet

    //3) send it back to the user email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your Password? Submit a request with your new password and password confirmation to: ${resetURL}.\nif you didn't forget your password please ignore this email`;

    // we make try, catch  because we want to do more than just send an error to the client
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your Password Reset Token (Valid for 10 mins)',
            message: message
        });
        res.status(200).json({
            status: 'success',
            message: 'token sent to email',
            resetToken: resetToken
        });
    } catch (err) {
        //if error happened: we want to reset the token and expires properties
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false }); // user.findByIdAndUpdate() will not work because password confirm validate only works with save() and create Not update , also all pre('save' ,func) middleware functions defined in the userModel will not work either
        return next(
            new AppError(
                'There was an Error Sending the email, try again later',
                500
            ) // 404: not found
        );
    }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    // 2)if token hasnot expired , and there is user , set the new password
    if (!user) {
        return next(
            new AppError('Token is invalid or has expired', 400) // 404: not found
        );
    }
    //set the password and password confirmatino
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    // resetting the token expiry date and resettoken
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false }); // user.findByIdAndUpdate() will not work because password confirm validate only works with save() and create Not update , also all pre('save' ,func) middleware functions defined in the userModel will not work either
    // 3) update changedPasswordAt property for the current user
    // > in the userModel in the pre save schema
    // 4) log the user in send the jwt to the client
    createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) get the user from the collection
    const user = await User.findById(req.user.id).select('+password'); // we make select('+password") because in the userModel Schema we defined that  select: false  so any user returned will not has the password field unless we select it manually

    if (!user) {
        return next(new AppError('No user found', 400));
    }

    // 2)check if the posted password is correct
    if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
        return next(new AppError('Password provided is incorrect', 400));
    }
    // 3)if correct, update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save({ validateBeforeSave: false }); // user.findByIdAndUpdate() will not work because password confirm validate only works with save() and create Not update , also all pre('save' ,func) middleware functions defined in the userModel will not work either
    // 4)log user in, send jwt
    createAndSendToken(user, 200, res);
});
