const bookmarkModel = require('../models/bookmarkModel');


//  Add to Bookmarks
exports.addToBookmarks = async (req, res) => {
  try {

    // Extract userId from request headers and hotelId from request params
    const userId = req.headers.id;
    const { hotelId, tourId }= req.params;


    // Insert a new bookmark for the user
    await bookmarkModel.updateOne(
        {userId},
        {
            $set: { userId},
            // Add flightId and hotelId to the bookmarks 
            $addToSet: { hotelId, tourId }
        },
        
        {upsert: true})

    return res.status(200).json({
        status: 'success',
        message: 'Added to Bookmark'
    })

  } catch (error) {

    // Pass the error to the next middleware
    next(error)
    console.log(error.message)

  }
};

// Get All Bookmarks List  
exports.getAllBookmarks = async (req, res) => {
    try {
       
        let userId = req.headers.id;

        // Find all bookmarks for the specified user ID
        let data = await bookmarkModel.find({ userId })

        res.status(200).json({
            status: 'success',
            data: data
        })
    } catch (error) {
        // Pass the error to the next middleware
        next(error)
        console.log(error.message)
    }
}




// Remove the Bookmark
exports.removeBookmarks = async (req, res) => {
    try {

        const userId = req.headers.id;
        
        // Remove the bookmark with the specified userId
        await bookmarkModel.deleteOne({ userId });


        return res.status(200).json({
            status: 'success',
            message: 'Bookmark Removed'
        })


    } catch (error) {
        // Pass the error to the next middleware
        next(error)
        console.log(error.message)
    }
}

