const app = require("./app");
const { ServerPort } = require("./secrets");
const databaseConnection = require("./src/config/db");

app.listen(ServerPort || 8000, () => {
	console.log(`Server is running on port: ${ServerPort}`);
	databaseConnection();
});
