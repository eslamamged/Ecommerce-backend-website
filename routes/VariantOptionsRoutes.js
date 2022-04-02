const express = require('express');

const router = express.Router();
const variantOptionsController = require('../controllers/variantOptionsController');
const authController = require('../controllers/authenticationController');


router
    .route('/:id')
    .get(variantOptionsController.getVariantOption);

router
    .route('/')
    .get(variantOptionsController.getAllVariantOptions)

router.use(authController.protect); ///// 

router
    .route('/')
    .post(
        authController.restrictTo('admin', 'user'),
        variantOptionsController.createVariantOption
    );

router
    .route('/:id')
    .patch(
        authController.restrictTo('admin', 'user'),
        variantOptionsController.updateVariantOption
    )
    .delete(
        authController.restrictTo('admin', 'user'),
        variantOptionsController.deleteVariantOption
    );

module.exports = router;
