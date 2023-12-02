const express = require('express');
const { create, list, readById, update, remove } = require('../controllers/PlaceController');

const router = express.Router();

router.post('/place', create);
router.get('/places', list);
router.get('/place/:id', readById);
router.put('/place/:id', update);
router.delete('/place/:id', remove);

module.exports = router;