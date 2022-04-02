const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'variant name must be required'],
        unique: [true, 'category name must be unique']
    },
    options: [
        { type: mongoose.Schema.ObjectId, ref: 'VariantOption', default: [] }
    ]
});

const Variant = mongoose.model('Variant', variantSchema);

module.exports = Variant;
