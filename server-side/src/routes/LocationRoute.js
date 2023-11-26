const express = require('express');
const { create, list, readById, update, remove } = require('../controllers/LocationController');

const router = express.Router();

router.post('/location', create);
router.get('/locations', list);
router.get('/location/:id', readById);
router.put('/location/:id', update);
router.delete('/location/:id', remove);

module.exports = router;