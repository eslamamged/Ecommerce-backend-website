const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        // console.log(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });
exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;
        if (!doc) {
            return next(new AppError('No doc Found With That id', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });

exports.getAll = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let filter = {};
        if (req.params.tourId) {
            filter = { tour: req.params.tourId };
        }
        let queryBeforeFilter;
        if (popOptions) {
            queryBeforeFilter = Model.find(filter).populate(popOptions);
        } else {
            queryBeforeFilter = Model.find(filter);
        }
        const features = new ApiFeatures(queryBeforeFilter, req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const doc = await features.query;
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc
            }
        });
    });
exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new AppError(`No document Found With That id`, 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    });
exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!doc) {
            return next(new AppError('No document Found With That id', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });
