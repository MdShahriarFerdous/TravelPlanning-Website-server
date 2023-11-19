//Config Lib import and configured
require("dotenv").config();
const ServerPort = process.env.SERVER_PORT;
const MongoDBConnectionPort = process.env.MONGO_DB_CONNECTION;
const MongoDBAtlasConnection = process.env.MONGODB_ATLAS_CONNECTION;
const defaultImagePath =
	process.env.DEFAULT_IMAGE_PATH || "public/images/users/profile.png";
const jwtSecretKey =
	process.env.JWT_SECRET_KEY || "@ll_F-f9q_[U%XSA6SCrBfg}_gLfg";

const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientURL = process.env.CLIENT_URL;

module.exports = {
	ServerPort,
	MongoDBConnectionPort,
	defaultImagePath,
	jwtSecretKey,
	smtpUsername,
	smtpPassword,
	clientURL,
	MongoDBAtlasConnection,
};
