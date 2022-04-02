const express = require('express');

const router = express.Router();
const variantController = require('../controllers/variantController');
const authController = require('../controllers/authenticationController');

router.route('/:id').get(variantController.getVariant);

router.route('/').get(variantController.getAllVariants);

router.use(authController.protect);

router
    .route('/')
    .post(
        authController.restrictTo('admin', 'user'),
        variantController.createVariant
    );

router
    .route('/:id')
    .patch(
        authController.restrictTo('admin', 'user'),
        variantController.updateVariant
    )
    .delete(
        authController.restrictTo('admin', 'user'),
        variantController.deleteVariant
    );

module.exports = router;
