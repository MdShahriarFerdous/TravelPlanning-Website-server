const cloudinary = require("../helpers/cloudinaryConfig");

const updateCloudinaryImage = {
  updateSrcCloudinary: async (
    newFile,
    OldFilePath,
    newFileOptional,
    newFileLocation = "",
    sizeLimit = 1000000
  ) => {
    // check old image path given or not
    if (!OldFilePath) {
      console.error("Old Image Path is Required");
      return { status: false };
    }

    // check new image (file) given
    if (!newFile?.path) {
      if (newFileOptional && OldFilePath === newFileOptional) {
        console.error("Old Image Path & New Image Optional path is Same");
        return { status: false };
      }
      if (newFileOptional && OldFilePath !== newFileOptional) {
        return { status: true, path: newFileOptional };
      }
      console.error("New Image File Or Atleast a Link is Required");
      return { status: false };
    }

    // if new image has not maintained required size
    if (newFile?.size > sizeLimit) {
      console.error("New Image File has not maintained required size");
      return { status: false };
    }

    // if new image & old image path are same
    // but this condition is theoritically impossible, because time differs,
    // so the location path also differs
    // but it is possible if 2 request sent at same time by a BOT
    if (newFile?.path === OldFilePath) {
      return { status: false };
    }

    // Add New File Image to Cloudinary
    let thumb = "";
    try {
      const uploadToCloudinary = await cloudinary.uploader.upload(
        newFile?.path,
        {
          folder: `${cloudinaryFolder}/${newFileLocation}`,
        }
      );
      thumb = uploadToCloudinary.secure_url;
    } catch (error) {
      console.error("Unknown Error while uploading image in cloudinary: ");
      console.error(error);
      return { status: false };
    }

    // Remove Old Uploaded File Image from cloudinary
    try {
      const response = await cloudinary.uploader.destroy(OldFilePath);
      if (response.result !== "ok") {
        console.error("Error while destroying image in cloudinary: ");
        console.error(response);
      }
    } catch (error) {
      console.error("Unknown Error while destroying image in cloudinary: ");
      console.error(error);
    }

    // Return the file path, if all process is OK
    return { status: true, path: thumb };
  },
  deleteSrcCloudinary: async (OldFilePath) => {
    // check file path is given or not
    if (!OldFilePath) {
      return;
    }

    // Remove Old Uploaded File Image from cloudinary
    try {
      const response = await cloudinary.uploader.destroy(OldFilePath);
      if (response.result !== "ok") {
        console.error("Error while destroying image in cloudinary: ");
        console.error(response);
      }
      return;
    } catch (error) {
      console.error("Unknown Error while destroying image in cloudinary: ");
      console.error(error);
      return;
    }
  },
};

module.exports = updateCloudinaryImage;
