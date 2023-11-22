const { comparePassword } = require("../helpers/hashPass");
const { jwtSecretKey } = require("../../secrets");
const { createJsonWebToken } = require("../helpers/jsonWebToken");
const User = require("../models/usermodel/userModel");
require("dotenv").config();





// admin login
exports.adminLogin = async (req, res, next) => {
    try {
        // destructure email,password,loginCode from req.body
        const {email, password, loginCode} = req.body;

        // validation
		if (!email) {
			return res.json({ error: "Email is required" });
		}
		if (!password || password.length < 6) {
			return res.json({ error: "Password must be at least 6 characters long" });
		}
        if(loginCode !== process.env.LOGIN_CODE ){
            return res.json({ error: "Login Code is required" });
        }


        // check if email is taken
		const user = await User.findOne({ email });
		if (!user) {
			return res.json({ error: "User account not found" });
		}

        // compare password
		const match = await comparePassword(password, user.password);
		if (!match) {
			return res.json({ error: "Invalid email or password" });
		}

		// Update isAdmin field 
        await User.findByIdAndUpdate(user._id, { isAdmin: true });

        //generate token for admin
		const createdToken = createJsonWebToken({ _id: user._id, isAdmin: true },jwtSecretKey, "1d" );

		res.status(200).json({
			status: "success",
			message: "Admin login successfully",
			createdToken
		});

        
    } catch (error) {
        next(error)
        console.log(error.message)
        
    }
}


// admin get all users
exports.getAllUsers = async (req, res, next) => {
    try {

        // retrieve all users with isAdmin set to false
        const users = await User.find({isAdmin: false});

        res.status(200).json({ status: "success", users });

    } catch (error) {

        next(error);
        console.log(error.message);
    }
};


// admin get user by id
exports.getUserById = async (req, res, next) => {
    try {

        const { userId } = req.params;
        
        // find the user
        const user = await User.findById(userId);

        // check user is not found or is an admin (admin cannot be deleted)
        if (!user || user.isAdmin == true) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        res.status(200).json({ status: "success", user });
    } catch (error) {

        next(error);
        console.log(error.message);
    }
};

// update user by id
exports.updateUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // find the user by id
        const user = await User.findById(userId);

        // check if the user exists
        if (!user || user.isAdmin == true) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // update the user (banned)
        await User.findByIdAndUpdate(user._id, { isBanned: true });

        res.status(200).json({ status: "success", message: "User banned successfully" });

    } catch (error) {
        next(error);
        console.log(error.message);
    }
};



