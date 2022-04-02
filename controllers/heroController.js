const multer = require('multer');
const sharp = require('sharp');
const Hero = require('../models/Hero');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');

// // create multer upload
// when we do image processing its better to use sharp and save the image to memory so we ca use it later as a buffer in sharp
// const multerStorage = multer.memoryStorage();
// // create multer filter
// const multerFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(new AppError('Not an image! Please upload only images', 400), false);
//     }
// };

// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter
// });

// exports.uploadHeroPhoto = upload.single('image');
// exports.resizeHeroPhoto = catchAsync(async (req, res, next) => {
//     if (!req.file) return next();
//     // we set the file name because when we save it to memory we don't set the filename
//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//     sharp(req.file.buffer)
//         .resize(1360, 575)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toFile(`public/img/${req.file.filename}`);

//     next();
// });

// exports.uploadImage = catchAsync(async (req, res, next) => {
//     const response = await cloudinary.uploader.upload(req.file, {
//         upload_preset: 'ecommerce'
//     });
//     res.send(response);
//     // res.send(response);
// });

exports.createHero = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a file', 400));
    }
    const { title } = req.body;
    // const response = await cloudinary.uploader.upload(req.file.path);
    const response = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: 'ecommerce'
    });
    if (!response) {
        return next(new AppError('Photo Not Uploaded', 400));
    }
    const hero = await Hero.create({
        title,
        image: response.secure_url,
        cloudinary_id: response.public_id
    });
    if (!hero) {
        return next(new AppError('Hero not created', 400));
    }
    res.status(201).json({
        status: 'success',
        data: {
            data: hero
        }
    });
});

exports.updateHero = catchAsync(async (req, res, next) => {
    const { title } = req.body;
    const hero = await Hero.findById(req.params.id);
    console.log(req.body.title);
    if (!hero) {
        return next(new AppError('No document Found With That id', 404));
    }
    let response;
    if (req.file) {
        console.log('i entered the function');
        await cloudinary.uploader.destroy(hero.cloudinary_id, {
            upload_preset: 'ecommerce'
        });
        console.log('i deleted the image');
        response = await cloudinary.uploader.upload(req.file.path, {
            upload_preset: 'ecommerce'
        });
        console.log('i uploaded the image', response);
        if (!response) {
            return next(new AppError('Photo Not Uploaded', 400));
        }
    }

    const data = {
        title: req.body.title || hero.title,
        image: response?.secure_url || hero.image,
        cloudinary_id: response?.public_id || hero.cloudinary_id
    };
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         data: req.params.id
    //     }
    // });
    const editedHero = await Hero.findByIdAndUpdate(req.params.id, data, {
        new: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            data: editedHero
        }
    });
});

exports.getAllHero = factory.getAll(Hero);
exports.getHero = factory.getOne(Hero);
exports.deleteHero = catchAsync(async (req, res, next) => {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
        return next(new AppError('No document Found With That id', 404));
    }
    await cloudinary.uploader.destroy(hero.cloudinary_id, {
        upload_preset: 'ecommerce'
    });
    await hero.remove();
    res.status(204).json({
        status: 'success',
        data: null
    });
});
