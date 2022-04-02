const multer = require('multer');

const multerStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${Date.now()}.${ext}`);
    }
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images', 400), false);
    }
};
const upload = multer({
    storage: multerStorage,
    fileFlter: multerFilter
});

module.exports = upload;
