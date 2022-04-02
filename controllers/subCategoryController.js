const SubCategory = require('../models/SubCategory');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const Category = require('../models/Category');
const AppError = require('../utils/appError');
const Product = require('../models/Product');
const ProductReviews = require('../models/ProductReview');
const subCategoryJoi = require('../validations/subCategoryJoi');
const cloudinary = require('../utils/cloudinary');

exports.getAll = factory.getAll(SubCategory, {
    path: 'category'
});
exports.creatSubCategory = catchAsync(async (req, res, next) => {
    const validateSubCat = subCategoryJoi.subcatJoi(req.body);
    if (validateSubCat) {
        return next(new AppError(validateSubCat.message, 400));
    }

    const { name, category: categoryId, brands } = req.body;

    if (!req.file) {
        return next(new AppError('Please upload a file', 400));
    }
    const response = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: 'ecommerce'
    });
    if (!response) {
        return next(new AppError('Photo Not Uploaded', 400));
    }
    const subCategory = await SubCategory.create({
        name,
        photo: response.secure_url,
        cloudinary_id: response.public_id,
        brands,
        category: categoryId
    });
    if (!subCategory) {
        return next(new AppError('Sub Category not created', 400));
    }
    const cat = await Category.findOneAndUpdate(
        { _id: categoryId },
        {
            $push: { subCategories: subCategory._id }
        }
    );
    res.status(201).json({
        status: 'success',
        data: {
            data: subCategory
        }
    });
});
exports.getOne = factory.getOne(SubCategory);

exports.editById = catchAsync(async (req, res, next) => {
    const validatecontact = subCategoryJoi.editsubcatJoi(req.body);
    if (validatecontact) {
        return next(new AppError(validatecontact.message, 400));
    }
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
        return next(new AppError('No document Found With That id', 404));
    }
    let response;
    if (req.file) {
        await cloudinary.uploader.destroy(subCategory.cloudinary_id, {
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
        name: req.body.name || subCategory.name,
        brands: req.body.brands || subCategory.brands,
        brands: req.body.category || subCategory.category,
        photo: response?.secure_url || subCategory.photo,
        cloudinary_id: response?.public_id || subCategory.cloudinary_id
    };
    const updateSubCategory = await SubCategory.findByIdAndUpdate(
        req.params.id,
        data
        // { new: true, runValidators: true }
    );
    if (!updateSubCategory) {
        return next(new AppError('Sub Category not updated', 400));
    }
    res.status(201).json({
        status: 'success',
        data: {
            data: updateSubCategory
        }
    });
});

/// Delete SubCat and the product, Review associated with this SubCat ////
exports.deleteById = catchAsync(async (req, res, next) => {
    const subcat = await SubCategory.findById(req.params.id);
    if (!subcat) {
        return next(new AppError('No document Found With That id', 404));
    }
    const products = await Product.find({ subCategory: subcat._id });
    const reviews = await ProductReviews.find({ subCategory: subcat._id });
    if (products.length > 0) {
        await Product.deleteMany({ subCategory: subcat._id });
    }
    if (reviews.length > 0) {
        await ProductReviews.deleteMany({ subCategory: subcat._id });
    }
    await cloudinary.uploader.destroy(subcat.cloudinary_id, {
        upload_preset: 'ecommerce'
    });
    await SubCategory.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});
