const mongoose = require('mongoose');
// const SubCategory = require('./SubCategory');
const OrderItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Order Item name must have a name']
        },
        price: {
            type: Number,
            required: [true, 'Order Item price is required']
        },
        // order: {
        //     type: mongoose.Schema.ObjectId,
        //     ref: 'Order',
        //     required: [true, 'Order Item Must Belong To an Order']
        // },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: [true, 'Order Item Must Belong To a Product']
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'Order Item Must Belong To a category']
        },
        subCategory: {
            type: mongoose.Schema.ObjectId,
            ref: 'SubCategory',
            required: [true, 'Order Item Must Belong To a sub category']
        },
        seller: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Order Item Must Belong To a Seller']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Order Item Must Belong To a User']
        },
        status: {
            type: String,
            enum: [
                'pending',
                'on_the_way',
                'delivered',
                'retrieved',
                'canceled',
            ]
        },
        variants: {
            type: Object
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const OrderItem = mongoose.model('OrderItem', OrderItemSchema);

module.exports = OrderItem;
