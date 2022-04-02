// const express = require('express')
const mongoose = require('mongoose');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

const AppError = require('../utils/appError');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const orderJoi = require('../validations/orderJoi');

exports.getAll = factory.getAll(Order, {
    path: 'user',
    select: 'name'
});
exports.creatOrder = catchAsync(async (req, res, next) => {
    const validateOrder = orderJoi.createOrderJoi(req.body);
    if (validateOrder) {
        return next(new AppError(validateOrder.message, 400));
    }
    const { shippingAddress, location, paymentMethod, userId, orderItems } =
        req.body;
    //1) Get the total price of the orders
    let totalPrice = 0;
    orderItems.forEach(async (item) => {
        totalPrice += item.price * 1 * item.quantity * 1;
    });
    // session (for transactions)
    // // const session = await mongoose.startSession();
    // try {
    //     // session.startTransaction();
    //     // await session.commitTransaction();
    // } catch (error) {
    //     // await session.abortTransaction();
    //     next(error);
    // }
    const orderItemsList = orderItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
            return next(new AppError(`No Product Found With That id`, 404));
        }
        if (product.stock < item.quantity) {
            return next(
                new AppError(
                    `Product ${product.name} has maximum of ${product.stock} in stock`,
                    404
                )
            );
        }
        return OrderItem.create([
            {
                name: product.name,
                price: item.price,
                quantity: item.quantity,
                product: item.productId,
                category: product.category,
                subCategory: product.subCategory,
                seller: product.seller,
                user: userId,
                status: 'pending',
                variants: product.variants
            }
        ]);
    });
    const responses = await Promise.all(orderItemsList);
    const orderItemsIds = [];
    responses[0].forEach((item) => orderItemsIds.push(item._id));

    const order = await Order.create([
        {
            shippingAddress,
            location: location
                ? {
                      type: 'Point',
                      coordinates: [location.long * 1, location.lat * 1]
                  }
                : location,
            paymentMethod,
            orderItems: orderItemsIds,
            user: userId,
            status: 'pending',
            totalPrice: totalPrice
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: order
    });
});

exports.getOne = factory.getOne(Order, [
    {
        path: 'orderItems',
        Model: 'OrderItem',
        populate: {
            path: 'product',
            model: 'Product',
            select: 'name photo description listPrice ratingsAverage '
        }
    },
    {
        path: 'user',
        Model: 'User',
        select: 'name phone'
    }
]);

exports.deleteById = catchAsync(async (req, res, next) => {
    res.status(204).json({
        status: 'success Your Order is deleted',
        data: null
    });
});

exports.editById = catchAsync(async (req, res, next) => {
    const validatecontact = orderJoi.updateOrderJoi(req.body);
    if (validatecontact) {
        return next(new AppError(validatecontact.message, 400));
    }
    const updateorderItem = await OrderItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updateorderItem) {
        return next(new AppError(`No document Found With That id`, 404));
    }

    res.status(201).json({
        status: 'success',
        data: {
            data: updateorderItem
        }
    });
});
