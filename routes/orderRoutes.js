const express = require('express');

const router = express.Router();
const orderController = require('../controllers/orderController');

router.route('/:id')
    .get(orderController.getOne);

router.route('/')
    .get(orderController.getAll)
    .post(orderController.creatOrder);

router
    .route('/:id')
    .patch(orderController.editById)
    .delete(orderController.deleteById);

module.exports = router;
