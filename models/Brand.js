const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        unique: [true, 'Brand name must be unique']
    },
    status: {
        type: String,
        enum: ['Active', 'Pending'],
        default: 'Active'
    }
});

const Brand = mongoose.model('Brand', BrandSchema);

module.exports = Brand;
