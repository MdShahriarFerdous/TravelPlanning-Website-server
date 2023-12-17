const express = require('express');
const { create, list, readById, update, remove, searchFlights} = require('../controllers/FlightController');

const router = express.Router();

router.post('/flight', create);
router.get('/flights', list);
router.get('/flight/:id/:travelers', readById);
router.put('/flight/:id', update);
router.delete('/flight/:id', remove);
router.post('/flight-search', searchFlights);

module.exports = router;