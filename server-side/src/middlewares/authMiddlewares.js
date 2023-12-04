const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../../secrets");
const User = require("../models/usermodel/userModel");

exports.requireSignIn = async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		if (!token) {
			return res
				.status(401)
				.json({ error: "Unauthorized: No token provided" });
		}

		jwt.verify(token, jwtSecretKey, (err, decoded) => {
			if (err) {
				if (err.name === "TokenExpiredError") {
					return res.status(401).json({ error: "Token expired" });
				} else {
					return res
						.status(401)
						.json({ error: "Failed to authenticate token" });
				}
			}

			req.user = decoded;
			next();
		});
	} catch (error) {
		return res
			.status(401)
			.json({ status: error.message, failed: "Unauthorized" });
	}
};

exports.isAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id);
		if (user.isAdmin === false) {
			return res.status(401).send("Unauthorized");
		} else {
			next();
		}
	} catch (error) {
		res.json(error.message);
	}
};
