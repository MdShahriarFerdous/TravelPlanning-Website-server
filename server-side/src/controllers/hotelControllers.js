const Hotel = require('../models/hotelSchema');
require("dotenv").config();

const hotelController = {
    // Create a new hotel with manual validation
    createHotel : async (req, res) => {
        try {
            const { name, room_rent, city, thumbnail, status } = req.body;

            // Check for required fields
            if (!name || !city || !room_rent || !thumbnail || !status) {
                return res.status(400).json({ message: 'Name, room rent, city, thumbnail, and status are required fields' });
            }

            // Validate room_rent as a positive number
            if (typeof room_rent !== 'number' || room_rent <= 0) {
                return res.status(400).json({ message: 'Room rent should be a positive number' });
            }
            // Other validations can be added here as per requirements


            // Create a new hotel after validations pass
            const newHotelData = {
                name,
                city,
                room_rent,
                thumbnail,
                status
                // Add other properties here if needed
            };

            const newHotel = await Hotel.create(newHotelData);
            res.status(201).json(newHotel);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Retrieve all hotels and searching by parameter also

    getAllHotels: async (req, res) => {
        try {
            const pageSize = 4; // Number of items per page
            const page = Number(req.query.pageNumber) || 1;

            const keyword = req.query.keyword ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: "i" } },
                    { description: { $regex: req.query.keyword, $options: "i" } },
                    { city: { $regex: req.query.keyword, $options: "i" } },
                ]
            } : {};

            const count = await Hotel.countDocuments({ ...keyword });

            const totalPages = Math.ceil(count / pageSize);

            const hotels = await Hotel.find({ ...keyword })
                .limit(pageSize)
                .skip(pageSize * (page - 1));

            res.status(200).json({
                hotels,
                page,
                totalPages,
                count
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Retrieve a specific hotel by ID
    getHotelById : async (req, res) => {
        try {
            const { hotelId } = req.params;

            const hotel = await Hotel.findById(hotelId);

            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            res.status(200).json(hotel);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Update a hotel by ID
    updateHotel : async (req, res) => {
        try {
            const { hotelId } = req.params;
            const updateData = req.body;

            const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updateData, { new: true });

            if (!updatedHotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            res.status(200).json(updatedHotel);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Delete a hotel by ID
    deleteHotel : async (req, res) => {
        try {
            const { hotelId } = req.params;

            const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

            if (!deletedHotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            res.status(200).json({ message: 'Hotel deleted successfully' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    // Other controller methods...
};

module.exports = hotelController;
