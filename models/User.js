/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide Your Name!']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please Provide Your Email!'],
        validate: [validator.isEmail, 'invalid email']
    },
    phone: {
        type: String,
        unique: true
    },
    address: {
        country: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        street: {
            type: String,
            default: ''
        },
        zip: {
            type: String,
            default: ''
        }
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        required: [true, 'Please Provide Role Name!'],
        enum: ['admin', 'user', 'seller'],
        default: 'user'
    },
    wishList: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            default: [],
            unique: [true, 'Product can be added to wish list only once']
        }
    ],
    ratingsAverage: {
        type: Number,
        default: 4,
        min: [1, 'Rating Must be Greater than or equal to 1'],
        max: [5, 'Rating Must be Less than or equal to 5'],
        set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantitiy: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: [true, 'Please Provide Password!'],
        minLength: 8,
        select: false // to prevent the return of password in any response
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please Provide Password Confirmation!'],
        //putting it to required means it's required input not to be required inside database
        minLength: 8,
        validate: {
            // this only works on save or create not findOneAndUpdate
            // anything related to password updating we need to use user.save() not findByIdAndUpdate()
            validator: function (el) {
                return el === this.password;
            },
            message: "Password and Password Confirmation don't Match"
        }
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// these middleware only works on save() and create() not on findandupdate()  find(Set)
// So any password updating we need to use user.save() not findByIdAndUpdate()
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});
userSchema.pre('save', async function (next) {
    // this middleware only workds on save(), create() not findAndUpdate()

    //only run this password i fthe password is modified and the document is not new
    if (!this.isModified('password') || this.isNew) return next();
    //we update the passwordchangeat
    this.passwordChangedAt = Date.now() - 1000;
    // we substract 1 sec from the passwordChangedAt because we wanna avoid the jwt creating the token before the passwordChangeAt Date
    // so  substract 1 sec we make sure that the token is always created after the password has been changed
    next();
});
/******************  2) Query Middleware ****************/
userSchema.pre(/^find/, function (next) {
    //^find > any query that has find (find, findOne,findOneAndUpdate....)
    /* This Refer to current Query */
    this.find({ active: { $ne: false } }); // we say active:ne:false instead of active:true because if some users don't have the active part and they are active we wanna include them
    next();
});
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return jwtTimestamp < changedTimeStamp;
    }
    return false;
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    // this token is what we will send to the user (it's like a reset password that user can use to create new real password)
    // we should never store a plain reset token in the database, (because if hacker get access to our database account he can reset password) , so we should hash it using crypto.hash(and then save it in the DB)
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    console.log(
        { resetToken },
        { passwordResetToken: this.passwordResetToken }
    );
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
