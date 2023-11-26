const express = require('express');
const { create, list, readById, update, remove } = require('../controllers/AirlineContoller');

const router = express.Router();

router.post('/airline', create);
router.get('/airlines', list);
router.get('/airline/:id', readById);
router.put('/airline/:id', update);
router.delete('/airline/:id', remove);

module.exports = router;