const multer = require("multer");

exports.Uploads = async (req, res, next) => {
	try {
		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, "./uploads/blogs");
			},
			filename: function (req, file, cb) {
				const uniqueSuffix =
					Date.now() + "-" + Math.round(Math.random() * 1e9);
				cb(null, `${uniqueSuffix}${file.originalname}`);
			},
		});

		const upload = multer({
			storage: storage,
			limits: {
				fileSize: 10000000,
			},
		}).fields([
			{ name: "thumbnailImage", maxCount: 1 },
			{ name: "coverImage", maxCount: 1 },
		  ])

		upload(req, res, (err) => {
			if (err) {
				console.error(err);
				res.send("File Upload Fail");
			} else {
				next();
			}
		});
	} catch (error) {
		res.json(error.message);
	}
};
