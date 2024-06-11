<template>
  <div class="wrapper">
    <nav class="weather-tabs-wrapper">
      <button
        :class="['weather-tab', !activeTab ? 'active-tab' : '']"
        @click="handleTabChange"
      >
        Головна
      </button>
      <button
        :class="['weather-tab', activeTab ? 'active-tab' : '']"
        @click="handleTabChange"
      >
        Обране
      </button>
    </nav>
    <div class="input-wrapper" v-if="!activeTab">
      <input
        type="text"
        v-model="cityName"
        @input="getSuggestions"
        @keydown.down.prevent="moveDown"
        @keydown.up.prevent="moveUp"
        class="input"
        placeholder="Enter city name..."
      />
      <ul v-if="suggestions.length" class="suggestions-list">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="index"
          :class="{ 'active-suggestion': index === selectedIndex }"
          @click="selectCity(index)"
        >
          {{ suggestion.name }}
        </li>
      </ul>
      <button class="input-button" type="button" @click="search">Go!</button>
    </div>
    <WeatherContainer v-if="!activeTab" />
    <FavoriteContainer v-if="activeTab" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "../store";
import WeatherContainer from "../components/WeatherContainer";
import FavoriteContainer from "../components/FavoriteContainer";
import axios from "axios";

const store = useStore();
const city = ref(null);
const cityName = ref("");
const activeTab = ref(false);
const suggestions = ref([]);
const selectedIndex = ref(-1);

const getSuggestions = async (e) => {
  const query = e.target.value;
  if (query.length > 2) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=7eceb2cd107bad214cbae47f398242a3`
      );
      suggestions.value = response.data;
      selectedIndex.value = -1;
    } catch (error) {
      console.error(error);
    }
  } else {
    suggestions.value = [];
  }
};

const moveDown = () => {
  if (selectedIndex.value < suggestions.value.length - 1) {
    selectedIndex.value++;
  }
};

const moveUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
};

const selectCity = (index) => {
  if (city.value || cityName.value) {
    city.value = suggestions.value[index];
    cityName.value = suggestions.value[index].name;
    suggestions.value = [];
  }
};

const search = async () => {
  if (city.value) {
    await store.fetchWeatherData(city.value.lat, city.value.lon);
    if (store.error !== null) {
      console.log({ store });
    } else {
      console.log(store.error);
    }
    city.value = null;
    cityName.value = "";
  } else {
    console.log("Please enter a city name");
  }
};

const handleTabChange = () => {
  activeTab.value = !activeTab.value;
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 50vh;
  max-width: 1200px;
  border: 1px solid cornflowerblue;
  border-top: 0;
  position: relative;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.wrapper:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.weather-tabs-wrapper {
  margin: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.weather-tab {
  background-color: #1e90ff;
  color: white;
  font-weight: 600;
  border: 1px solid grey;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px 5px 0 0;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.weather-tab:last-child {
  margin-left: 5px;
}

.weather-tab:hover {
  transform: translateY(-3px);
  background-color: #4682b4;
}

.active-tab {
  background-color: #104e8b;
}

.input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  margin: 40px 0;
  position: relative;
}

.input {
  border-radius: 10px 0 0 10px;
  border: 1px solid grey;
  padding: 10px;
  font-size: 20px;
  transition: box-shadow 0.3s ease;
}

.input:focus {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  background: white;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
  z-index: 9999;
}

.suggestions-list li {
  padding: 10px;
  cursor: pointer;
}

.suggestions-list li.active-suggestion {
  background-color: #1e90ff;
  color: white;
}

.input-button {
  background-color: #1e90ff;
  border: 1px solid grey;
  cursor: pointer;
  padding: 12.5px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  border-radius: 0 10px 10px 0;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.input-button:hover {
  background-color: #104e8b;
  transform: scale(1.1);
}

/* Responsive Styles */

@media (max-width: 1200px) {
  .wrapper {
    padding: 15px;
  }
  .weather-tab {
    padding: 8px 16px;
    font-size: 16px;
  }
  .input {
    font-size: 18px;
    padding: 8px;
  }
  .input-button {
    padding: 10.5px 16px;
    font-size: 0.9rem;
  }
}

@media (max-width: 992px) {
  .wrapper {
    padding: 10px;
  }
  .weather-tab {
    padding: 6px 12px;
    font-size: 14px;
  }
  .input {
    font-size: 16px;
    padding: 6px;
  }
  .input-button {
    padding: 7.5px 12px;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .weather-tabs-wrapper {
    flex-direction: column;
    align-items: center;
    margin: 10px 0;
  }
  .weather-tab {
    margin: 5px 0;
    width: 100%;
    max-width: 300px;
  }
  .input-wrapper {
    margin: 10px 0;
    flex-direction: column;
  }
  .input {
    font-size: 14px;
    padding: 5px;
    width: 100%;
    max-width: 300px;
    border-radius: 5px 5px 0 0;
  }
  .input-button {
    font-size: 0.7rem;
    padding: 5px 10px;
    width: 100%;
    max-width: 312px;
    border-radius: 0 0 5px 5px;
  }
}

@media (max-width: 576px) {
  .wrapper {
    padding: 0;
    margin: 0 auto;
    border: 0;
  }
  .weather-tab {
    padding: 5px 10px;
    font-size: 12px;
  }
  .input {
    font-size: 12px;
    padding: 4px;
  }
  .input-button {
    padding: 4px 10px;
    font-size: 0.6rem;
  }
}

@media (max-width: 360px) {
  .weather-tab {
    padding: 4px 8px;
    font-size: 10px;
  }
  .input {
    font-size: 10px;
    padding: 3px;
  }
  .input-button {
    padding: 3px 8px;
    font-size: 0.5rem;
  }
}
</style>
