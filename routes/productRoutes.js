const express = require('express');

const router = express.Router({ mergeParams: true });
const productController = require('../controllers/productsController');
const authController = require('../controllers/authenticationController');
const upload = require('../utils/multer');

router
    .route('/')
    .post(
        upload.fields([
            { name: 'photo', maxCount: 1 }
            // { name: 'album', maxCount: 4 }
        ]),
        authController.protect,
        productController.createProduct
    )
    .get(productController.getAllProducts);

router
    .route('/:id')
    .get(productController.getProduct)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'seller'),
        productController.deleteProduct
    )
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'seller'),
        productController.updateProduct
    );
module.exports = router;
