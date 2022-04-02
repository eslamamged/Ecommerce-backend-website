const express = require('express');

const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authenticationController');
const upload = require('../utils/multer');

router.route('/:id').get(categoryController.getOne);

router.route('/').get(categoryController.getAll);

router.use(authController.protect); ///////

router
    .route('/')
    .post(
        upload.single('photo'),
        authController.restrictTo('admin', 'seller'),
        categoryController.creatCategory
    );

router
    .route('/:id')
    .patch(
        upload.single('photo'),
        authController.restrictTo('admin', 'seller'),
        categoryController.editById
    )
    .delete(
        authController.restrictTo('admin', 'seller'),
        categoryController.deleteById
    );

module.exports = router;
