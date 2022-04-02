const express = require('express')

const router = express.Router()
const orderItemController = require('../controllers/orderItemController')

router
    .route('/:id')
    .get(orderItemController.getById)
    .patch(orderItemController.editById)


module.exports = router;

