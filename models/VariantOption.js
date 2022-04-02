const mongoose = require('mongoose');

const variantOptionsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'category name must be unique'],
        unique: [true, 'category name must be unique']
    },
    variant: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'variant option should have variant id'],
        ref: 'Variant'
    }
});
// variantOptionsSchema.pre('save', async function (next) {
//     this.variant = undefined;
//     next();
// });
const VariantOptions = mongoose.model('VariantOption', variantOptionsSchema);

module.exports = VariantOptions;
