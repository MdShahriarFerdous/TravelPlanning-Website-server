// Function to convert comma-separated string to array
exports.convertStringToArray = (inputString) => {
	if (!inputString) {
		return [];
	}
	return inputString.split(",").map((item) => item.trim());
};
