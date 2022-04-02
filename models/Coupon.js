const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon name is required'],
        unique: [true, 'Coupon name must be unique']
    },
    discount: {
        type: Number,
        required: [true, 'discount value is required']
    },
    usersNumber: {
        type: Number,
        required: [true, 'Number of users is required']
    },
    DiscountMethod: {
        type: String,
        enum: ['percentage', 'amount'],
        required: [
            true,
            'discount method is requierd and either percentage or amount'
        ]
    },
    startAt: {
        type: Date,
        required: [true, 'discount start Date is required']
    },
    endAt: {
        type: Date,
        required: [true, 'discount end Date is required']
    }
});

const Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;
