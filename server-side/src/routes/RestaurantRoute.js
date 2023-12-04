const express = require('express');
const { create, list, readById, update, remove } = require('../controllers/RestaurantController');

const router = express.Router();

router.post('/restaurant', create);
router.get('/restaurants', list);
router.get('/restaurant/:id', readById);
router.put('/restaurant/:id', update);
router.delete('/restaurant/:id', remove);

module.exports = router;