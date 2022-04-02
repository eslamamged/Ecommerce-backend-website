const express = require('express');

const router = express.Router();
const heroController = require('../controllers/heroController');
const authController = require('../controllers/authenticationController');
const upload = require('../utils/multer');

router.route('/:id').get(heroController.getHero);
router.route('/').get(heroController.getAllHero);

router.use(authController.protect);

router.route('/').post(
    upload.single('image'),
    // heroController.uploadHeroPhoto,
    // heroController.resizeHeroPhoto,
    authController.restrictTo('admin', 'seller'),
    heroController.createHero
);

router
    .route('/:id')
    .patch(
        upload.single('image'),
        authController.restrictTo('admin', 'seller'),
        heroController.updateHero
    )
    .delete(
        authController.restrictTo('admin', 'seller'),
        heroController.deleteHero
    );

module.exports = router;
