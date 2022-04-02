const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Contact title is required']
    },
    message: {
        type: String,
        required: [true, 'Contact message is required']
    },
    email: {
        type: String,
        ref: 'User',
        required: [true, 'Contact email is required']
    },
    is_seen: {
        type: Boolean,
        default: 0
    }
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
