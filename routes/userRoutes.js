const express = require('express');
const authController = require('../controllers/authenticationController');
const userController = require('../controllers/userController');

const router = express.Router();
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);
router.route('/').get(userController.getAllUsers);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword); //only recive the email address
router.patch('/resetPassword/:token', authController.resetPassword); //recive the token as well as the new password

router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.use(authController.restrictTo('admin'));
// only admins can do the below routes and middlewares
// router
//     .route('/:id')
//     .get(userController.getUser)
//     .patch(userController.updateUser)
//     .delete(userController.deleteUser);
// router.route('/').get(userController.getAllUsers);

// .post(userController.createUser);
router.use(authController.restrictTo('user'));
// only users can do the below routes and middlewares

router
    .route('/wishlist/:id')
    .post(userController.addWishList)
    .delete(userController.deleteWishList);

module.exports = router;
