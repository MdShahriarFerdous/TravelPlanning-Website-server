const multer = require("multer");

exports.upload = (fieldName, folderName) => async (req, res, next) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, `./uploads${folderName ? "/" + folderName : ""}`);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}`);
      },
    });
    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 1000000,
      },
    }).single(fieldName);
    upload(req, res, (err) => {
      if (err) {
        console.error(err);
        res.send(`${fieldName} Upload Fail`);
      } else {
        next();
      }
    });
  } catch (error) {
    res.json(error.message);
  }
};
