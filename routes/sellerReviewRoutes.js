const express = require('express');

const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/sellerReviewController');
const authController = require('../controllers/authenticationController');

router.use(authController.protect);
router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.createReview);
router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(
        authController.restrictTo('admin', 'user'),
        reviewController.deleteReview
    )
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview
    );
module.exports = router;
