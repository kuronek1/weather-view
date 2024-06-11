import axios from "axios";

export default {
  async getCurrentLocationWeather() {
    const defaultLatitude = 40.7143;
    const defaultLongitude = -74.006;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          await this.fetchWeatherData(latitude, longitude);
        },
        async (error) => {
          this.error = error;
          await this.fetchWeatherData(defaultLatitude, defaultLongitude);
        }
      );
    } else {
      this.error = new Error("Geolocation is not supported by this browser.");
      await this.fetchWeatherData(defaultLatitude, defaultLongitude);
    }
  },

  async fetchWeatherData(lat, lon) {
    try {
      const currentWeatherPromise = axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=daily&appid=7eceb2cd107bad214cbae47f398242a3&units=metric`
      );

      const forecastPromise = axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=7eceb2cd107bad214cbae47f398242a3&units=metric`
      );

      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        currentWeatherPromise,
        forecastPromise,
      ]);

      const currentData = currentWeatherResponse.data;
      const forecastData = forecastResponse.data;

      const weatherData = {
        temp: currentData.current.temp,
        feels_like: currentData.current.feels_like,
        pressure: currentData.current.pressure,
        humidity: currentData.current.humidity,
        dateTime: new Date(currentData.current.dt * 1000).toLocaleString(
          "en-US"
        ),
        name: currentData.timezone,
        hourly: currentData.hourly.slice(0, 25),
        iconUrl: `https://openweathermap.org/img/wn/${currentData.current.weather[0].icon}.png`,
        forecast: forecastData,
      };

      const conditions = currentData.current.weather.map((elm) => ({
        description: elm.description,
      }));

      this.storeRecentSearch(
        weatherData.name,
        null,
        weatherData,
        conditions,
        weatherData.dateTime
      );
    } catch (error) {
      this.error = error;
    }
  },

  storeRecentSearch(name, zip, data, conditions, dateTime) {
    const searchItem = {
      name,
      zip,
      data: this.roundedValues(data),
      conditions: conditions.length > 0 ? conditions[0] : null,
      dateTime,
    };

    if (!this.recentSearches.find((e) => e.name === searchItem.name)) {
      this.recentSearches.push(searchItem);

      if (this.recentSearches.length > 5) {
        this.recentSearches.shift();
      }
    }
  },
};
