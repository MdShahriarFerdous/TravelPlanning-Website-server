// Function to check if a given date format is Ok or Not
exports.isValidDateFormat = (dateString, format) => {
    const regexPatterns = {
      'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
      'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
      // Add more patterns as needed
    };
  
    const regex = regexPatterns[format];
    return regex && regex.test(dateString);
  };
