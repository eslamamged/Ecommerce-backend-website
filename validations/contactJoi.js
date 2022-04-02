const joi = require('joi');

exports.creteContact = (contact) => {

    const schema = joi.object({
        subject: joi.string().required(),
        message: joi.string().required(),
        email: joi
            .string().required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

    });
    const validationResult = schema.validate(contact);

    // console.log(validationResult.error)

    return validationResult.error

};

exports.updateContact = (contact) => {

    const schema = joi.object({
        subject: joi.string(),
        message: joi.string(),
        email: joi
            .string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

    });
    const validationResult = schema.validate(contact);

    // console.log(validationResult.error)

    return validationResult.error

};

