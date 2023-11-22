const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../../secrets");

exports.requireSignIn = async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		if (!token) {
			return res
				.status(401)
				.json({ error: "Unauthorized: No token provided" });
		}
		const decoded = jwt.verify(token, jwtSecretKey);
		req.user = decoded;

		// console.log(req.headers.auth);
		// console.log(req.user);
		next();
	} catch (error) {
		return res
			.status(401)
			.json({ status: error.message, failed: "Unauthorized" });
	}
};

<<<<<<< HEAD
// 		if (user.isAdmin === false) {
// 			return res.status(401).send("Unauthorized");
// 		} else {
// 			next();
// 		}
// 	} catch (error) {
// 		res.json(error.message);
// 	}
// };
=======
>>>>>>> development
