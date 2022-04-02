const Product = require('../models/Product');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');

exports.createProduct = catchAsync(async (req, res, next) => {
    const {
        name,
        salePrice,
        listPrice,
        description,
        seller,
        category,
        subCategory,
        stock,
        sku
    } = req.body;
    console.log(req.files.photo[0].path);
    // console.log(req.files.album);
    const photo = await cloudinary.uploader.upload(req.files.photo[0].path, {
        upload_preset: 'ecommerce'
    });
    if (!photo) {
        return next(new AppError('Photo Not Uploaded', 400));
    }
    // const album = await Promise.all(
    //     req.files.album.map(async (file) => {
    //         return cloudinary.uploader.upload(file.path, {
    //             upload_preset: 'ecommerce'
    //         });
    //     })
    // );
    const prod = await Product.create({
        name,
        salePrice,
        listPrice,
        description,
        seller,
        category,
        subCategory,
        stock,
        sku,
        photo: photo.secure_url,
        photo_id: photo.public_id
        // album: album.map((item) => item.secure_url),
        // album_id: album.map((item) => item.public_id)
    });
    // console.log(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: prod
        }
    });
});
exports.getAllProducts = factory.getAll(Product, [
    {
        path: 'category',
        Model: 'Category'
    },
    {
        path: 'subCategory',
        Model: 'SubCategory'
    },
    {
        path: 'seller',
        Model: 'User'
    }
]);
exports.getProduct = factory.getOne(Product, [
    {
        path: 'categories',
        Model: 'Category'
    },
    {
        path: 'subCategory',
        Model: 'SubCategory'
    },
    {
        path: 'seller',
        Model: 'User'
    }
]);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
