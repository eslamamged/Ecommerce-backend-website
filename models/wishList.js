const mongoose = require('mongoose');

const WishListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        default: [],
        required: true
    }
});

const WishList = mongoose.model('Favorite', WishListSchema);

module.exports = WishList;
