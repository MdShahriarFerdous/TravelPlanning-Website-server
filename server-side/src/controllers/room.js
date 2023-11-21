const Room = require('../models/roomSchema');

//const User = require('../models/User');
const Hotel = require('../models/hotelSchema');

const roomController = {
    createRoom : async (req, res) => {
        try {
            const {
                name,
                description,
                images,
                pricePerNight,
                address,
                guestCapacity,
                numOfBeds,
                internet,
                breakfast,
                airConditioned,
                petsAllowed,
                roomCleaning,
                pricePerNightKing,
                pricePerNightSingle,
                pricePerNightTwins,
                category,
                //user, // user ID is provided in the request
                hotel // hotel ID is provided in the request
            } = req.body;

            // Custom validation logic
            if (!name || !description || !pricePerNight || !address || !category || !hotel) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Validate if the provided user ID exists
            // const userExists = await User.exists({ _id: user });
            // if (!userExists) {
            //     return res.status(400).json({ message: 'Invalid user ID' });
            // }

            // Validate if the provided hotel ID exists
            const hotelExists = await Hotel.exists({ _id: hotel });
            if (!hotelExists) {
                return res.status(400).json({ message: 'Invalid hotel ID' });
            }

            // Additional custom validations based on specific requirements can be added here

            // Create a new room associated with a specific hotel and user
            const newRoom = await Room.create({
                name,
                description,
                images,
                pricePerNight,
                address,
                guestCapacity,
                numOfBeds,
                internet,
                breakfast,
                airConditioned,
                petsAllowed,
                roomCleaning,
                category,
                pricePerNightKing,
                pricePerNightSingle,
                pricePerNightTwins,
                //user,
                hotel
            });

            res.status(201).json(newRoom);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    //Get room by parameter or any
    getAllRoom : async (req, res) => {
        try {
            const pageSize = 4; // Number of items per page
            const page = Number(req.query.pageNumber) || 1; // Get page number from query parameter or default to 1

            const keyword = req.query.keyword ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: "i" } },
                    { description: { $regex: req.query.keyword, $options: "i" } },
                    { address: { $regex: req.query.keyword, $options: "i" } },
                ]
            } : {};

            const numOfBeds = req.query.numOfBeds ? { numOfBeds: req.query.numOfBeds } : {};

            const category = req.query.category ? { category: req.query.category } : {};

            const count = await Room.countDocuments({ ...keyword, ...numOfBeds, ...category });

            const totalPages = Math.ceil(count / pageSize);

            const rooms = await Room.find({ ...keyword, ...numOfBeds, ...category })
                .limit(pageSize)
                .skip(pageSize * (page - 1));

            res.status(200).json({
                rooms,
                page,
                totalPages,
                count
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    //Get Room by id
    getRoomById : async (req, res) => {
        try {
            const { roomId } = req.params;

            // Fetch room by ID
            const room = await Room.findById(roomId);

            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            res.status(200).json(room);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    //Update Room
    updateRoom : async (req, res) => {
        try {
            const { roomId } = req.params;
            const updateData = req.body;

            // Fetch room by ID
            const room = await Room.findById(roomId);

            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            // Calculate total cost based on the selected room category and number of nights
            if (updateData.numberOfNights && updateData.category) {
                const { numberOfNights, category } = updateData;

                let pricePerNight = 0;

                // Choose the price based on the selected category
                switch (category) {
                    case 'King':
                        pricePerNight = room.pricePerNightKing || room.pricePerNight;
                        break;
                    case 'Single':
                        pricePerNight = room.pricePerNightSingle || room.pricePerNight;
                        break;
                    case 'Twins':
                        pricePerNight = room.pricePerNightTwins || room.pricePerNight;
                        break;
                    default:
                        // Handle if category is not provided or not valid
                        return res.status(400).json({ message: 'Invalid room category' });
                }

                // Calculate the total cost based on the selected category's price and number of nights
                const totalCost = pricePerNight * numberOfNights;

                // Update room data including the total cost
                const updatedRoom = await Room.findByIdAndUpdate(
                    roomId,
                    { ...updateData, totalCost },
                    { new: true }
                );

                return res.status(200).json(updatedRoom);
            }

            // If required data (numberOfNights or category) is not provided, update room data without calculating total cost
            const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, { new: true });

            res.status(200).json(updatedRoom);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    //Delete Room
    deleteRoom : async (req, res) => {
        try {
            const { roomId } = req.params;

            // Delete room by ID
            const deletedRoom = await Room.findByIdAndDelete(roomId);

            if (!deletedRoom) {
                return res.status(404).json({ message: 'Room not found' });
            }

            res.status(200).json({ message: 'Room deleted successfully' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

};

module.exports = roomController;
