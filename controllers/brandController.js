const Brand = require('../models/Brand');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.createBrand = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    const brand = await Brand.create({
        name,
        status: req.user.role === 'seller' ? 'Pending' : 'Active'
    });

    res.status(201).json({
        status: 'success',
        data: {
            data: brand
        }
    });
});

exports.updateBrand = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, {
        name,
        status: req.user.role === 'seller' ? 'Pending' : 'Active'
    });
    res.status(201).json({
        status: 'success',
        data: {
            data: updatedBrand
        }
    });
});

exports.getAllBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
