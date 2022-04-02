const mongoose = require('mongoose');
const Seller = require('./User');

const SellerReviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'A Review Must Have a review']
        },
        rating: {
            type: Number,
            required: [true, 'A Review Must Have a rating'],
            min: [1, 'Rating Must be Greater than or equal to 1'],
            max: [5, 'Rating Must be Less than or equal to 5']
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        seller: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review Must Belong To a Seller']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review Must Belong To a User']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
// this compound index make the user and tour unique so the user can only make one unique review for the tour that's why we set the unique value to true
// SellerReviewSchema.index({ user: 1 }, { unique: true });
// SellerReviewSchema.pre(/^find/, function (next) {
//     //^find > any query that has find (find, findOne,findOneAndUpdate....)
//     /* This Refer to current Query */
//     this.populate({
//         path: 'user',
//         select: 'name photo'
//     });
//     // populate({
//     //     path: 'seller',
//     //     select: 'name'
//     // });
//     next();
// });
// we use statics (method) because this refer to the model it self and we only ca call aggregate on the model it self not an instance of it (in case of .methods.methodName)
SellerReviewSchema.statics.calcAverageRatings = async function (sellerId) {
    // tour is the tour id to whcih this review is related to
    // this here refer to the current model , and aggregate method works on the model Tour.aggregate> that's why we used static method on the model
    const stats = await this.aggregate([
        {
            $match: { seller: sellerId }
        },
        {
            $group: {
                _id: '$seller',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    if (stats.length > 0) {
        await Seller.findByIdAndUpdate(sellerId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantitiy: stats[0].nRating
        });
    } else {
        await Seller.findByIdAndUpdate(sellerId, {
            ratingsAverage: 4.5,
            ratingsQuantitiy: 0
        });
    }
};
// we use post not pre because on pre save the current review is not in the collection yet.
// focus ( post does not have access to next)
SellerReviewSchema.post('save', async function () {
    //this point to the current document
    //construcctor is the model who created that document
    /* this.constructor refer to the current model */
    this.constructor.calcAverageRatings(this.seller);
});
/* We Want to use  calcAverageRatings on updating or deleting document*/
// the problem: this here refer to the current query, but we want to get access to the current review document
// findByIdAndUpdate/Delete is only short cut for findOneAndUpdate/Delete()
SellerReviewSchema.pre(/^findOneAnd/, async function (next) {
    // we save r (which is the current review document to the query so that we can pass it to the post middleware function (to get access to the document))

    this.r = await this.findOne();
    // this.findOne() : Get the document from the database, so it still didn't change the review in the database , so if we calcAverageRatings here it will do it for the non-updated data
    next();
});
SellerReviewSchema.post(/^findOneAnd/, async function () {
    // we couldn't perform the this.r = await this.findOne(); because at the post('find') the query has already been executed
    await this.r.constructor.calcAverageRatings(this.r.seller);
});
const SellerReview = mongoose.model('SellerReview', SellerReviewSchema);

module.exports = SellerReview;
