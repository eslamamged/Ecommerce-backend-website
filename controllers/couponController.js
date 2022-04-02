const Coupon = require('../models/Coupon');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const couJoi = require('../validations/couponJoi');
const AppError = require('../utils/appError');

exports.createCoupon = catchAsync(async (req, res, next) => {
    const validateCou = couJoi.createCouponJoi(req.body);
    if (validateCou) {
        return next(new AppError(validateCou.message, 400));
    }
    const createCou = await Coupon.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: createCou
        }
    });
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
    const validateCou = couJoi.updateCouponJoi(req.body);
    if (validateCou) {
        return next(new AppError(validateCou.message, 400));
    }
    const createCou = await Coupon.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(201).json({
        status: 'success',
        data: {
            data: createCou
        }
    });
});

exports.getAllCoupons = factory.getAll(Coupon);
exports.getCoupon = factory.getOne(Coupon);
exports.deleteCoupon = factory.deleteOne(Coupon);
