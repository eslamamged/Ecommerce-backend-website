const joi = require('joi');

const shippingAddressSchema = joi.object().keys({
    country: joi.string().required(),
    city: joi.string().required(),
    street: joi.string().required(),
    buildingNum: joi.string().required(),
    zip: joi.string().required()
});

const orderItemSchema = joi.object().keys({
    quantity: joi.number().required(),
    price: joi.number().required(),
    productId: joi.string().required()
});
const orderItems = joi.array().items(orderItemSchema);

exports.createOrderJoi = (Order) => {
    const schema = joi.object({
        shippingAddress: shippingAddressSchema,
        location: joi.object(),
        paymentMethod: joi.string().valid('cash_on_delivery', 'card'),
        userId: joi.string().required(),
        orderItems: orderItems
    });
    const validationResult = schema.validate(Order);
    return validationResult.error;
};
exports.updateOrderJoi = (Order) => {
    const schema = joi.object({
        status: joi
            .string()
            .required()
            .valid(
                'pending',
                'on_the_way',
                'delivered',
                'canceled',
                'retrieved',
                'partiallyDelivered'
            )
    });
    const validationResult = schema.validate(Order);

    return validationResult.error;
};
