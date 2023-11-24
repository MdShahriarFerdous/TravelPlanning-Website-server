const fs = require("fs");
const path = require("path");

const updateImage = {
  updateSrc: async (newFile, OldFilePath, sizeLimit = 1000000) => {
    // check old image (path only) given
    if (!OldFilePath) {
      return { status: false };
    }

    // check new image (file) given
    if (!newFile?.[0]?.path) {
      return { status: false };
    }

    // if new image has not maintained required size
    if (newFile && newFile.size > sizeLimit) {
      return { status: false };
    }

    // if new image & old image path are same
    // but this condition is theoritically impossible, because time differs,
    // so the location path also differs
    if (newFile?.[0]?.path === OldFilePath) {
      return { status: false };
    }

    // remove old file from directory
    try {
      await new Promise((resolve, reject) =>
        fs.unlink(path.resolve(OldFilePath), (err) =>
          err ? reject(err) : resolve()
        )
      );
    } catch (error) {
      return { status: true, path: newFile?.[0]?.path };
    }

    return { status: true, path: newFile?.[0]?.path };
  },
  deleteSrc: async (filePath) => {
    // check file path is given or not
    if (!filePath) {
      return;
    }

    // remove old file from directory
    try {
      await new Promise((resolve, reject) =>
        fs.unlink(path.resolve(filePath), (err) =>
          err ? reject(err) : resolve()
        )
      );
    } catch (error) {
      return;
    }
    return;
  },
};

module.exports = updateImage;
