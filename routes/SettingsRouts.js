const express = require('express');

const router = express.Router();
const sittingController = require('../controllers/settingsController')
const authController = require('../controllers/authenticationController');


router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(sittingController.getAll)

router
    .route('/:id')
    .patch(sittingController.updateSetting)


module.exports = router;