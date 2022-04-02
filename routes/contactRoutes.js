const express = require('express');

const router = express.Router();
const contactController = require('../controllers/contactController')


router
    .route('/:id')
    .get(contactController.getOne)

router
    .route('/')
    .get(contactController.getAll)
    .post(contactController.creatCategory)

router
    .route('/:id')
    .patch(contactController.editById)
    .delete(contactController.deleteById);


module.exports = router;