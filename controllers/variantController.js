const Variant = require('../models/Variant');
const VariantOption = require('../models/VariantOption');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteVariant = catchAsync(async (req, res, next) => {
    const v = await Variant.findByIdAndDelete(req.params.id); //get All Variants
    if (!v) {
        return next(new AppError(`No document Found With That id`, 404));
    }
    await v.options.forEach(
        async (e) => await VariantOption.findByIdAndDelete(e)
    ); // Delete All VariantOptions

    res.status(204).json({
        status: 'success Your Variants is deleted',
        data: null
    });
});

exports.createVariant = factory.createOne(Variant);
exports.getAllVariants = factory.getAll(Variant);
exports.getVariant = factory.getOne(Variant);
exports.updateVariant = factory.updateOne(Variant);
