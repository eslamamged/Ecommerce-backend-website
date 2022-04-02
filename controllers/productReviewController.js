const productReview = require('../models/ProductReview');
const factory = require('./handlerFactory');

exports.createReview = factory.createOne(productReview);
exports.getAllReviews = factory.getAll(productReview);
exports.getReview = factory.getOne(productReview);
exports.updateReview = factory.updateOne(productReview);
exports.deleteReview = factory.deleteOne(productReview);
