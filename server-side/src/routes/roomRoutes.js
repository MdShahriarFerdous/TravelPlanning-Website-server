const express = require("express");
const router = express.Router();

const roomController = require("../controllers/roomControllers");

// Routes for Room CRUD operations
router.post("/rooms/create", roomController.createRoom); // Create a new room
router.get("/rooms/allRoom", roomController.getAllRoom); //get all room
router.get("/rooms/:roomId", roomController.getRoomById); // Get room by ID
router.put("/rooms/update/:roomId", roomController.updateRoom); // Update room by ID
router.delete("/rooms/delete/:roomId", roomController.deleteRoom); // Delete room by ID

module.exports = router;
