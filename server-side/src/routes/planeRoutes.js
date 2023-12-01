const express = require('express');
const { create, list, readById, update, remove } = require('../controllers/PlaneController');

const router = express.Router();

router.post('/plane', create);
router.get('/planes', list);
router.get('/plane/:id', readById);
router.put('/plane/:id', update);
router.delete('/plane/:id', remove);

module.exports = router;