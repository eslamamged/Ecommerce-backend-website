const mongoose = require('mongoose');
// const SubCategory = require('./SubCategory');
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'products must have a name']
    },
    description: {
        type: String,
        required: [true, 'products must have a description']
    },
    photo: {
        type: String
    },
    photo_id: {
        type: String
    },
    // album: [String],
    // album_id: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product Must Belong To a Category']
    },
    subCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
        required: [true, 'Product Must Belong To a Sub Category']
    },
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Product Must Belong To a Seller']
    },
    salePrice: Number,
    listPrice: {
        type: Number,
        required: [true, 'product must have a price']
    },
    sku: {
        type: String
    },
    stock: Number,
    ratingsAverage: {
        type: Number,
        default: 4,
        min: [1, 'Rating Must be Greater than or equal to 1'],
        max: [5, 'Rating Must be Less than or equal to 5'],
        set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantitiy: {
        type: Number,
        default: 0
    },
    colors: [String],
    sizes: [String],
    brand: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Brand'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    is_featured: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: false
    },
    variants: {
        type: Object
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
