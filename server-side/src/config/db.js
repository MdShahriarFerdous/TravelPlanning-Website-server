// Database Lib import
const mongoose = require("mongoose");
const {
	MongoDBConnectionPort,
	MongoDBAtlasConnection,
} = require("../../secrets");

const databaseConnection = () => {
	mongoose.set("strictQuery", false);
	mongoose
		.connect(MongoDBAtlasConnection)
		.then(() => {
			console.log("MongoDB connected!!");
		})
		.catch((err) => {
			console.log("Failed to connect to MongoDB", err.message);
		});
};
module.exports = databaseConnection;
