
const joi = require('joi')

exports.editState = (state) => {
    const schema = joi.object({
        status: joi.string().required().valid('retrieved'),
        orderId:joi.string().required()
        
    });
    const validationResult = schema.validate(state);

    return validationResult.error;
};



