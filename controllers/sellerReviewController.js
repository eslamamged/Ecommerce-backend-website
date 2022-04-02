const sellerReview = require('../models/SellerReview');
const factory = require('./handlerFactory');

exports.createReview = factory.createOne(sellerReview);
exports.getAllReviews = factory.getAll(sellerReview);
exports.getReview = factory.getOne(sellerReview);
exports.updateReview = factory.updateOne(sellerReview);
exports.deleteReview = factory.deleteOne(sellerReview);
