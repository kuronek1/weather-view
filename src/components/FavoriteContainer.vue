<template>
  <div v-if="store.favoriteSearches.length" class="card-container">
    <WeatherCard
      v-for="(card, index) in store.favoriteSearches"
      :key="index"
      :weatherData="store.favoriteSearches[index]"
    />
    <div v-if="!store.favoriteSearches.length" class="empty-card">
      Зараз тут нажаль порожньо :(
    </div>
  </div>
</template>

<script setup>
import { useStore } from "../store";
import WeatherCard from "./WeatherCard.vue";

const store = useStore();
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

.empty-card {
  width: 100%;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: large;
  font-weight: 600;
}
</style>
