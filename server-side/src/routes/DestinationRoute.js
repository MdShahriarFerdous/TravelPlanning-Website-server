const express = require('express');
const { create, list, readById, update, remove } = require('../controllers/DestinationController');

const router = express.Router();

router.post('/destination', create);
router.get('/destinations', list);
router.get('/destination/:id', readById);
router.put('/destination/:id', update);
router.delete('/destination/:id', remove);

module.exports = router;