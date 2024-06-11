export default {
  roundedValues: () => (weatherData) => {
    const roundData = {};
    Object.keys(weatherData).forEach((key) => {
      if (typeof weatherData[key] === "number") {
        roundData[key] = Math.round(weatherData[key]);
      } else {
        roundData[key] = weatherData[key];
      }
    });
    return roundData;
  },
};
