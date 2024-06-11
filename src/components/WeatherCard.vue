<template>
  <div class="card">
    <div class="card-header">
      <div>
        <button
          :class="['view-button', currentView === 'day' ? 'active-button' : '']"
          @click="setView('day')"
        >
          День
        </button>
        <button
          :class="[
            'view-button',
            currentView === 'week' ? 'active-button' : '',
          ]"
          @click="setView('week')"
        >
          Тиждень
        </button>
      </div>
      <button class="favorite-button" @click="toggleFavorite(weatherData)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-star"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          :fill="isFavorite ? 'yellow' : 'none'"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M12 17.75l-5.172 3.061l.989 -5.768l-4.183 -4.074l5.78 -.84l2.587 -5.235l2.587 5.235l5.78 .84l-4.183 4.074l.989 5.768z"
          />
        </svg>
      </button>
    </div>
    <div class="card-content-wrapper" :key="currentView">
      <div class="card-content" v-if="currentView === 'day'">
        <div>
          <p class="card-content-time">{{ weatherData.dateTime || 0 }}</p>
          <p class="card-content-city">{{ weatherData.name || 0 }}</p>
          <p
            class="card-content-city"
            style="display: flex; align-items: center"
          >
            <img
              :src="weatherData.data.iconUrl"
              alt="Weather Icon"
              class="weather-icon"
            />

            {{ weatherData.data.temp || 0 }}°С
          </p>
          <p>
            <strong>Відчувається як:</strong>
            {{ weatherData.data.feels_like || 0 }}°С
          </p>
          <p>
            <strong>Вологість:</strong>
            {{ weatherData.data.humidity || 0 }}%
          </p>
          <p><strong>Тиск: </strong>{{ weatherData.data.pressure || 0 }} hPa</p>
        </div>
        <div class="chart-container">
          <canvas :id="canvasId"></canvas>
        </div>
      </div>
      <div v-if="currentView === 'week'" class="card-content-week">
        <p class="card-content-city">{{ weatherData.name || 0 }}</p>
        <div
          v-for="(item, index) in weatherData.data.forecast.list"
          :key="index"
          class="card-content-block"
        >
          <p class="card-content-time">{{ item.dt_txt.slice(0, 10) || 0 }}</p>
          <img
            :src="`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`"
            alt="Weather Icon"
            class="weather-icon"
          />
          <strong>
            {{ Math.round(item.main.temp_min) || 0 }}°С -
            {{ Math.round(item.main.temp_max) || 0 }}°С
          </strong>
          <p class="card-content-time">{{ item.dt_txt.slice(11, 16) || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
  <ModalWindow
    v-if="isModalVisible"
    :title="'Увага!'"
    :isVisible="isModalVisible"
    @cancel="cancelModal"
  >
    Нажаль у обранних може бути до 5 міст.
  </ModalWindow>
</template>

<script setup>
import {
  ref,
  defineProps,
  onMounted,
  watch,
  nextTick,
  watchEffect,
  computed,
} from "vue";
import Chart from "chart.js/auto";
import { useStore } from "../store";
import ModalWindow from "./ModalWindow.vue";

const props = defineProps({
  weatherData: {
    type: Object,
    required: true,
  },
});

const store = useStore();
const currentView = ref("day");
let chartInstance = null;
const canvasId = `hourlyChart-${Math.random().toString(36).substr(2, 9)}`;

const isModalVisible = ref(false);

const cancelModal = () => {
  isModalVisible.value = false;
};

const setView = (view) => {
  currentView.value = view;
};

const isFavorite = computed(() => {
  return store.favoriteSearches.some(
    (item) => item.name === props.weatherData.name
  );
});

const toggleFavorite = (card) => {
  const index = store.favoriteSearches.findIndex(
    (item) => item.name === card.name
  );
  if (index !== -1) {
    store.favoriteSearches.splice(index, 1);
  } else {
    if (store.favoriteSearches.length < 5) {
      store.favoriteSearches.push(card);
    } else {
      isModalVisible.value = true;
    }
  }
};

const createChart = () => {
  nextTick(() => {
    const ctx = document.getElementById(canvasId);
    if (ctx) {
      if (chartInstance) {
        chartInstance.destroy();
      }
      const hourlyData = props.weatherData.data.hourly;

      const labels = hourlyData.map((entry) =>
        new Date(entry.dt * 1000).toLocaleTimeString("en-US")
      );
      const temperatures = hourlyData.map((entry) => entry.temp);
      const feels = hourlyData.map((entry) => entry.feels_like);

      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Температура",
              data: temperatures,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              fill: false,
            },
            {
              label: "Відчувається як",
              data: feels,
              borderColor: "red",
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Час",
              },
            },
            y: {
              title: {
                display: true,
                text: "Температура (°С)",
              },
            },
          },
        },
      });
    }
  });
};

onMounted(() => {
  createChart();
});

watch(
  () => props.weatherData,
  () => {
    if (currentView.value === "day") {
      createChart();
    }
  },
  { deep: true }
);

watchEffect(() => {
  if (currentView.value === "day") {
    createChart();
  }
});
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  min-width: 320px;
  margin: 10px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.view-button {
  background-color: #1e90ff;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.view-button.active-button {
  background-color: #104e8b;
}

.view-button:hover {
  transform: translateY(-3px);
  background-color: #4682b4;
}

.favorite-button {
  border: 1px solid transparent;
  background-color: transparent;
  cursor: pointer;
}

.favorite-button.active-button {
  background-color: yellow;
}

.favorite-button:hover {
  border: 1px solid #f0f0f0;
}

.card-content-wrapper {
  width: 100%;
  text-align: left;
  color: #333;
  font-size: 14px;
}

.card-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.chart-container {
  width: 100%;
  max-width: 600px;
  max-height: 300px;
}

.card-content-time {
  font-weight: 600;
  color: #4682b4;
}

.card-content-city {
  font-size: 2rem;
  width: 100%;
  font-weight: 600;
}

.card-content-wrapper p {
  margin: 5px 0;
}

.card-content-week {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card-content-block {
  display: flex;
  flex-direction: column;
  width: 10%;
  align-items: center;
  border: 1px solid black;
  margin: 5px;
  border-radius: 10px;
  padding: 5px;
}

.weather-icon {
  width: 72px;
  height: 72px;
}

@media (max-width: 1200px) {
  .card-content-city {
    font-size: 1.8rem;
  }
  .weather-icon {
    width: 60px;
    height: 60px;
  }
  .card-content-block {
    width: 12%;
  }
}

@media (max-width: 992px) {
  .card-content-city {
    font-size: 1.5rem;
  }
  .weather-icon {
    width: 50px;
    height: 50px;
  }
  .card-content-block {
    width: 15%;
  }
}

@media (max-width: 768px) {
  .card-content-city {
    font-size: 1.2rem;
  }
  .weather-icon {
    width: 40px;
    height: 40px;
  }
  .card-content-block {
    width: 20%;
  }
  .view-button {
    padding: 8px 12px;
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .card {
    padding: 15px;
  }
  .card-content-city {
    font-size: 1rem;
  }
  .weather-icon {
    width: 30px;
    height: 30px;
  }
  .card-content-block {
    width: 30%;
  }
  .view-button {
    padding: 6px 10px;
    font-size: 10px;
  }
}

@media (max-width: 360px) {
  .card-content-city {
    font-size: 0.8rem;
  }

  .weather-icon {
    width: 25px;
    height: 25px;
  }
  .card-content-block {
    width: 45%;
  }
  .view-button {
    padding: 5px 8px;
    font-size: 8px;
  }
}
</style>
