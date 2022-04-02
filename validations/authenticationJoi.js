const joi = require('joi');

exports.authValidate = (user) => {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi
            .string()
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: joi.string().min(3).required(),
        phone: joi.string().required(),
        passwordConfirm: joi.ref('password'),
        role: joi.string().required(),
        address: {
            country: joi.string().required(),
            city: joi.string().required(),
            street: joi.string().required(),
            zip: joi.number().integer()
        }
    });
    const validationResult = schema.validate(user);

    // console.log(validationResult.error)

    return validationResult.error;
};
