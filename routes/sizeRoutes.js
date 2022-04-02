const express = require('express');

const router = express.Router();
const sizeController = require('../controllers/sizeController');

router.route('/:id').get(sizeController.getOne);

router.route('/').get(sizeController.getAll).post(sizeController.creatsize);

router
    .route('/:id')
    .patch(sizeController.editById)
    .delete(sizeController.deleteById);

module.exports = router;
