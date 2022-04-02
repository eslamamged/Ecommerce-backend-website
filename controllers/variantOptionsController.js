const VariantOption = require('../models/VariantOption');
const Variant = require('../models/Variant');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.createVariantOption = catchAsync(async (req, res, next) => {
    const { name, variant } = req.body;
    const variantOptions = await VariantOption.create({ name, variant });
    await Variant.findOneAndUpdate(
        { _id: req.body.variant },
        {
            $push: { options: variantOptions._id }
        }
    );
    res.status(201).json({
        status: 'success',
        data: {
            data: variantOptions
        }
    });
});

exports.deleteVariantOption = catchAsync(async (req, res, next) => {
    const variantOptionID = req.params.id;
    const varian = await VariantOption.findOneAndDelete({
        _id: variantOptionID
    });
    await Variant.findOneAndUpdate(
        { _id: req.body.variant },
        {
            $pull: { options: variantOptionID }
        }
    );
    res.status(201).json({
        status: 'success',
        data: {
            data: varian
        }
    });
});

exports.getAllVariantOptions = factory.getAll(VariantOption, {
    path: 'variant'
});
exports.getVariantOption = factory.getOne(VariantOption);
exports.updateVariantOption = factory.updateOne(VariantOption);
