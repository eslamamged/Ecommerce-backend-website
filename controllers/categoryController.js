// const express = require('express')
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Product = require('../models/Product');
const ProductReviews = require('../models/ProductReview');
const AppError = require('../utils/appError');
const catJoi = require('../validations/categoryJoi');
const cloudinary = require('../utils/cloudinary');

exports.getAll = factory.getAll(Category, {
    path: 'subCategories'
});
exports.creatCategory = catchAsync(async (req, res, next) => {
    const validateCat = catJoi.categoryJoi(req.body);
    if (validateCat) {
        return next(new AppError(validateCat.message, 400));
    }
    if (!req.file) {
        return next(new AppError('Please upload a file', 400));
    }
    const { name } = req.body;

    const response = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: 'ecommerce'
    });
    console.log(response);
    if (!response) {
        return next(new AppError('Photo Not Uploaded', 400));
    }
    const creatCat = await Category.create({
        name,
        photo: response.secure_url,
        cloudinary_id: response.public_id
    });
    if (!creatCat) {
        return next(new AppError('Category not created', 400));
    }
    res.status(201).json({
        status: 'success',
        data: {
            data: creatCat
        }
    });
});
exports.getOne = factory.getOne(Category, {
    path: 'subCategories'
});

exports.editById = catchAsync(async (req, res, next) => {
    const validatecontact = catJoi.editcCtegoryJoi(req.body);
    if (validatecontact) {
        return next(new AppError(validatecontact.message, 400));
    }
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(new AppError('No document Found With That id', 404));
    }
    let response;
    if (req.file) {
        await cloudinary.uploader.destroy(category.cloudinary_id, {
            upload_preset: 'ecommerce'
        });
        response = await cloudinary.uploader.upload(req.file.path, {
            upload_preset: 'ecommerce'
        });
        if (!response) {
            return next(new AppError('Photo Not Uploaded', 400));
        }
    }
    const data = {
        name: req.body.name || category.name,
        photo: response?.secure_url || category.photo,
        cloudinary_id: response?.public_id || category.cloudinary_id
    };
    const updateCat = await Category.findByIdAndUpdate(
        req.params.id,
        data
        // 	, {
        //     new: true,
        //     runValidators: true
        // }
    );
    if (!updateCat) {
        return next(new AppError('Category not updated', 400));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: updateCat
        }
    });
});

exports.deleteById = catchAsync(async (req, res, next) => {
    const cat = await Category.findById(req.params.id); //get All Categories
    if (!cat) {
        return next(new AppError(`No document Found With That id`, 404));
    }
    await cat.subCategories.forEach(
        async (e) => await SubCategory.findByIdAndDelete(e)
    ); // Delete All SubCateg

    const prod = await Product.find({ category: req.params.id }); // git Product
    await prod.forEach(
        async (productt) =>
            await ProductReviews.findOneAndDelete({ product: productt._id })
    ); // Delete Review
    await Product.deleteMany({
        category: req.params.id
    }); // delete product
    console.log(cat.photo);
    await cloudinary.uploader.destroy('q59lvg8b8ydkgpfixkwd.jpg', {
        upload_preset: 'ecommerce'
    });
    await cloudinary.uploader.destroy(cat.cloudinary_id, {
        upload_preset: 'ecommerce'
    });
    const deleteCat = await Category.findByIdAndDelete(req.params.id);
    if (!deleteCat) {
        return next(new AppError('Category not deleted', 400));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});
