//Config Lib import and configured
require("dotenv").config();
const ServerPort = process.env.SERVER_PORT || process.env.PORT;
const MongoDBAtlasConnection = process.env.MONGODB_ATLAS_CONNECTION;
const defaultPageSize = process.env.DEFAULT_PAGE_SIZE || 5;
const defaultImagePath =
	process.env.DEFAULT_IMAGE_PATH || "public/images/users/profile.png";
const jwtSecretKey =
	process.env.JWT_SECRET_KEY || "@ll_F-f9q_[U%XSA6SCrBfg}_gLfg";
const jwtExpirationTime = process.env.JWT_EXPIRATION_TIME || "1d";
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientURL = process.env.CLIENT_URL;
const loginCodeAdmin = process.env.ADMIN_LOGIN_CODE;
const deployClientURL = process.env.DEPLOY_CLIENT_URL;

const cloudinaryFolder = process.env.CLOUDINARY_FOLDER_NAME || "we-travel";
const cloudinaryName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryAPIKey = process.env.CLOUDINARY_API_KEY;
const cloudinarySecretKey = process.env.CLOUDINARY_API_SECRET_KEY;

module.exports = {
	ServerPort,
	defaultImagePath,
	jwtSecretKey,
	smtpUsername,
	smtpPassword,
	clientURL,
	MongoDBAtlasConnection,
	loginCodeAdmin,
	defaultPageSize,
	jwtExpirationTime,
	cloudinaryName,
	cloudinaryAPIKey,
	cloudinarySecretKey,
	deployClientURL,
	cloudinaryFolder,
};
