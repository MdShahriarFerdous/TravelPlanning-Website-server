const { jwtSecretKey, clientURL, jwtExpirationTime } = require("../../secrets");
const { hashPassword, comparePassword } = require("../helpers/hashPass");
const { createJsonWebToken } = require("../helpers/jsonWebToken");
const { sendEmail } = require("../helpers/sendEmail");
const User = require("../models/usermodel/userModel");
const jwt = require("jsonwebtoken");
const UserProfile = require("../models/usermodel/userProfileModel");

//send activation link to register user
exports.userRegister = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;

		//validation
		if (!username.trim() || username.length < 6 || username.length > 12) {
			return res.json({ error: "User name error" });
		}

		if (!email) {
			return res.json({ error: "Email is required" });
		}

		if (!password.trim() || password.length < 6) {
			return res.json({
				error: "Password must be at least 6 characters long",
			});
		}

		//check if email exist or not
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.json({ error: "Email is taken" });
		}

		//create jwt token
		const token = createJsonWebToken(
			{ username, email, password },
			jwtSecretKey,
			jwtExpirationTime
		);

		const verifyId = "user_" + Math.floor(Math.random() * 100000000);
		const activationURL = `${clientURL}/user/activate/${verifyId}`;

		//Create Email Data
		const emailData = {
			email,
			subject: "Account activation from Travello",
			html: `<h2>Hello ${username} !</h2>
						<h4>Please <a href="${activationURL}" target="_blank">click here</a> to acctivate your account.</h4>`,
		};
		//send email with nodemailer
		await sendEmail(emailData);
		res.status(200).json({
			status: "success",
			message:
				"Please go to your email for completing registration process",
			token,
			verifyId,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

//verify user through activation link
exports.userVerify = async (req, res, next) => {
	try {
		const { token } = req.body;
		//validation
		if (!token) {
			return res.json({ error: "Token not found!" });
		}
		const decoded = jwt.verify(token, jwtSecretKey);
		//validation
		if (!decoded) {
			return res.json({ error: "Unable to verify user!" });
		}

		//check if email exist or not
		const existingEmail = await User.findOne({ email: decoded.email });
		if (existingEmail) {
			return res.json({ error: "Email is taken" });
		}

		// Check username length
		if (
			!decoded.username ||
			decoded.username.length < 6 ||
			decoded.username.length > 12
		) {
			return res.status(400).json({ error: "Invalid username length" });
		}

		if (!decoded.password || decoded.password.length < 6) {
			return res
				.status(400)
				.json({ error: "Password length must be 6 characters long!" });
		}

		//hash password
		const hashedPassword = await hashPassword(decoded.password);

		const registerUser = await new User({
			username: decoded.username,
			email: decoded.email,
			password: hashedPassword,
		}).save();

		await UserProfile.create({ user: registerUser._id });
		// console.log(registerUser);

		//generate token for user
		const createdToken = createJsonWebToken(
			{ _id: registerUser._id },
			jwtSecretKey,
			jwtExpirationTime
		);

		res.status(201).json({
			status: "success",
			message: "User registered successfully!",
			user: {
				username: registerUser.username,
				email: registerUser.email,
			},
			createdToken,
		});
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ error: "Token expired" });
		} else if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ error: "JWT malformed" });
		} else {
			return res.status(401).json({ error: "Unauthorized" });
		}
	}
};

//user login
exports.userLogin = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// 1. all fields require validation
		if (!email) {
			return res.json({ error: "Email is required" });
		}
		if (!password || password.length < 6) {
			return res.json({
				error: "Password must be at least 6 characters long",
			});
		}
		// 2. check if email is taken
		const user = await User.findOne({ email });
		if (!user) {
			return res.json({ error: "User account not found" });
		}

		// 3. compare password
		const match = await comparePassword(password, user.password);
		if (!match) {
			return res.json({ error: "Invalid password" });
		}

		//5. is he banned?
		if (user.isBanned === true) {
			return res.json({
				error: "Sorry! You are banned, talk with admin",
			});
		}

		//generate token for user
		const createToken = createJsonWebToken(
			{ _id: user._id },
			jwtSecretKey,
			jwtExpirationTime
		);

		const userProfile = await UserProfile.findOne({ user: user._id });

		res.status(200).json({
			status: "success",
			message: "Welcome again",
			user: {
				username: user.username,
				email: user.email,
				isAdmin: user.isAdmin,
				image: userProfile.image,
			},
			createToken,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

//update user profile or create user profile
exports.updateProfile = async (req, res, next) => {
	try {
		const { city, bio, phone } = req.body;
		const { image, path } = req.file || {};
		const userId = req.user._id;

		// Validation for bio only
		if (bio && bio.length > 120) {
			return res.json({ error: "Bio must be in 120 characters" });
		}
		if (image && image.size > 10000000) {
			return res.json({
				error: "Image should be less than 10mb in size",
			});
		}

		// Check if UserProfile document exists
		let profile = await UserProfile.findOne({ user: userId });

		if (!profile) {
			// If UserProfile doesn't exist, create a new one
			profile = await UserProfile.create({
				user: userId,
				city,
				bio,
				image: path,
				phone,
			});
		} else {
			// If UserProfile exists, update it
			profile = await UserProfile.findByIdAndUpdate(
				userId,
				{
					user: userId,
					city,
					bio,
					image: path,
					phone,
				},
				{ new: true }
			);
		}

		res.status(201).json({
			status: "Success",
			message: "Your data has been saved!",
			profile,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

//update user profile
exports.updateUser = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = User.findById(req.user._id);

		if (password && password.length < 6) {
			return res.json({
				error: "Password must be at least 6 characters long",
			});
		}
		const hashedPass = password ? await hashPassword(password) : undefined;

		const updated = await User.findByIdAndUpdate(
			req.user._id,
			{
				username: username || user.username,
				password: hashedPass || user.password,
			},
			{ new: true }
		);

		updated.password = undefined; // so that in the response password will not be shown.

		res.status(201).json({
			status: "Success",
			message: "Your data updated!",
			updated,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

//get user detail
exports.getUserInfo = async (req, res, next) => {
	try {
		// parsing user if from token
		const userId = req.user._id;

		// Check if User exists or not
		let user = await User.findById(userId);
		if (!user) {
			return res.json({
				error: "User Doesnt Exist",
			});
		}

		// nullify user password
		user.password = undefined;

		//generate response
		res.status(200).json({
			status: "Success",
			user,
		});
	} catch (error) {
		next(error);
		console.error(error.message);
	}
};
