const hotelController = {
  getAllHotels: async (req, res, next) => {
    try {
      // generate response
      res.status(200).json({
        status: "Success",
        message: "Hotels List Found",
        data: [],
      });
    } catch (error) {
      next(error);
      console.error(error.message);
    }
  },
};

module.exports = hotelController;
