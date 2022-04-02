const express = require('express');

const router = express.Router();
const brandController = require('../controllers/brandController');
const authController = require('../controllers/authenticationController');

router.use(authController.protect);
router.route('/:id').get(brandController.getBrand);

router.route('/').get(brandController.getAllBrands);
router
    .route('/')
    .post(
        authController.restrictTo('admin', 'seller'),
        brandController.createBrand
    );

router
    .route('/:id')
    .patch(
        authController.restrictTo('admin', 'seller'),
        brandController.updateBrand
    )
    .delete(
        authController.restrictTo('admin', 'seller'),
        brandController.deleteBrand
    );

module.exports = router;
