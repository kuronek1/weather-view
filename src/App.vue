<template>
  <div id="app">
    <header class="header">
      <img :src="WeatherVuew" alt="WeatherVuew" />
    </header>
    <WeatherComponent defaultGeo="store.position" />
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useStore } from "./store";
import WeatherVuew from "./assets/weatherVuew.svg";
import WeatherComponent from "./views/WeatherComponent.vue";

export default {
  name: "App",
  components: {
    WeatherComponent,
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      const favoriteSearchesBackup = [...store.favoriteSearches];
      store.$reset();
      store.favoriteSearches = favoriteSearchesBackup;
      store.getCurrentLocationWeather();
    });

    const clearError = () => {
      store.error = null;
    };

    return {
      WeatherVuew,
      store,
      clearError,
    };
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  min-width: 360px;
}

.header {
  background-color: cornflowerblue;
  width: 100%;
}

img {
  max-width: 100%;
  height: auto;
}

@media (max-width: 1200px) {
  #app {
    font-size: 18px;
  }

  .header {
    padding: 10px;
  }
}

@media (max-width: 992px) {
  #app {
    font-size: 16px;
  }

  .header {
    padding: 8px;
  }
}

@media (max-width: 768px) {
  #app {
    font-size: 14px;
  }

  .header {
    padding: 6px;
  }
}

@media (max-width: 576px) {
  #app {
    font-size: 12px;
  }

  .header {
    padding: 4px;
  }
}

@media (max-width: 360px) {
  #app {
    font-size: 10px;
  }

  .header {
    padding: 0;
  }
}
</style>
