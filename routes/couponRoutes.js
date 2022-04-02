const express = require('express');

const router = express.Router();
const couponController = require('../controllers/couponController');

router.route('/:id').get(couponController.getCoupon);

router
    .route('/')
    .get(couponController.getAllCoupons)
    .post(couponController.createCoupon);

router
    .route('/:id')
    .patch(couponController.updateCoupon)
    .delete(couponController.deleteCoupon);

module.exports = router;
