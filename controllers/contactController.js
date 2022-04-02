// const express = require('express')
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

const contact = require('../models/Contact');

const AppError = require('../utils/appError');
const contactJoi = require('../validations/contactJoi')


exports.getAll = factory.getAll(contact);
exports.creatCategory = catchAsync(async (req, res, next) => {
    const validateCat = contactJoi.creteContact(req.body)
    if (validateCat) {
        return next(new AppError(validateCat.message, 400));
    }
    const creatCat = await contact.create(req.body)

    res.status(201).json({
        status: 'success',
        data: {
            data: creatCat
        }
    });
})
exports.getOne = factory.getOne(contact);

exports.editById = catchAsync(async (req, res, next) => {
    const validatecontact = contactJoi.updateContact(req.body)
    if (validatecontact) {
        return next(new AppError(validatecontact.message, 400));
    }
    const updateContacts = await contact.findByIdAndUpdate(req.params.id, req.body,
         { new: true, runValidators: true })

    if (!updateContacts) {
        return next(new AppError(`No document Found With That id`, 404));
    }

    res.status(201).json({
        status: 'success',
        data: {
            data: updateContacts
        }
    })

})

exports.deleteById = factory.deleteOne(contact);

