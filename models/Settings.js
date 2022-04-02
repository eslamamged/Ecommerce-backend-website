const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        default: 'Shakka'
    },
    description: {
        type: String,
        required: [true, 'description is required'],
        default: 'website description here'
    },
    phone: {
        type: String,
        required: [true, 'phone is required'],
        default: 'website phone here'
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        default: 'website email here'
    },
    logo: {
        type: String,
        required: [true, 'logo is required'],
        default:
            'https://w7.pngwing.com/pngs/621/196/png-transparent-e-commerce-logo-logo-e-commerce-electronic-business-ecommerce-angle-text-service.png'
    },
    copyright: {
        type: String,
        required: [true, 'copyright is required'],
        default: 'website copyright text here'
    },
    facebook: {
        type: String,
        required: [true, 'facebook is required'],
        default: 'website facebook text here'
    },
    instagram: {
        type: String,
        required: [true, 'instagram is required'],
        default: 'website instagram text here'
    },
    pinterest: {
        type: String,
        required: [true, 'pinterest is required'],
        default: 'website pinterest text here'
    },
    youtube: {
        type: String,
        required: [true, 'youtube is required'],
        default: 'website youtube text here'
    },
    currency: {
        type: String,
        required: [true, 'currency is required'],
        default: 'Egyptian Pound'
    },
    currencySymbol: {
        type: String,
        required: [true, 'currencySymbol is required'],
        default: 'L.E'
    }
});

const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = Settings;
