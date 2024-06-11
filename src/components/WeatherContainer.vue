<template>
  <div class="container-wrapper">
    <div class="nav-bar">
      <div
        class="nav-bar-tab"
        :class="['nav-bar-tab', selectedCard === index ? 'active-button' : '']"
        @click="() => selectCard(index)"
        v-for="(card, index) in store.recentSearches"
        :key="index"
      >
        {{ card.name }}
        <button
          v-if="index !== 0"
          class="nav-bar-button"
          @click.stop="confirmRemoveCard(index)"
        >
          x
        </button>
      </div>
    </div>
    <div class="card-container">
      <WeatherCard
        v-if="selectedCard !== null && store.recentSearches[selectedCard]"
        :weatherData="store.recentSearches[selectedCard]"
      />
    </div>
    <ModalWindow
      v-if="isModalVisible"
      :title="'Підтвердження видалення'"
      :isVisible="isModalVisible"
      @confirm="removeCard"
      @cancel="cancelRemove"
    >
      Ви впевненні що хочете видалити цю картку?
    </ModalWindow>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "../store";
import WeatherCard from "./WeatherCard.vue";
import ModalWindow from "./ModalWindow.vue";

const store = useStore();
const selectedCard = ref(null);
const isModalVisible = ref(false);
const cardToRemove = ref(null);

const selectCard = (index) => {
  selectedCard.value = index;
};

const confirmRemoveCard = (index) => {
  cardToRemove.value = index;
  isModalVisible.value = true;
};

const removeCard = () => {
  if (selectedCard.value === cardToRemove.value) {
    selectedCard.value = store.recentSearches.length - 2;
  }
  store.recentSearches.splice(cardToRemove.value, 1);
  isModalVisible.value = false;
  cardToRemove.value = null;
};

const cancelRemove = () => {
  isModalVisible.value = false;
  cardToRemove.value = null;
};

onMounted(() => {
  if (store.recentSearches.length > 0) {
    selectedCard.value = 0;
  }
});
</script>

<style scoped>
.container-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-bar {
  display: flex;
  width: 97%;
  min-width: 360px;
  margin: 0 20px;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  flex-wrap: wrap;
}

.nav-bar-tab {
  background-color: #1e90ff;
  color: white;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 5px 5px 0 0;
  font-weight: 600;
  margin-left: 20px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-bar-tab.active-button {
  background-color: #104e8b;
}

.nav-bar-tab:hover {
  transform: translateY(-3px);
  background-color: #4682b4;
}

.nav-bar-button {
  border: 1px solid #1e90ff;
  border-radius: 50%;
  font-weight: 600;
  margin-left: 10px;
  transition: background-color 0.3s ease, border 0.3s ease;
}

.nav-bar-button:hover {
  border: 1px solid black;
  background-color: grey;
  color: white;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

.add-card-button {
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 2rem;
  width: 60px;
  height: 60px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.add-card-button:hover {
  background-color: #104e8b;
  transform: scale(1.1);
}

@media (max-width: 1200px) {
  .nav-bar-tab {
    padding: 8px 12px;
  }
  .add-card-button {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}

@media (max-width: 992px) {
  .nav-bar-tab {
    padding: 6px 10px;
    margin-left: 15px;
  }
}

@media (max-width: 768px) {
  .nav-bar-tab {
    padding: 5px 8px;
    margin-left: 10px;
    font-size: 14px;
  }
  .add-card-button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

@media (max-width: 576px) {
  .nav-bar {
    margin: 0 10px;
  }
  .nav-bar-tab {
    padding: 4px 6px;
    margin-left: 5px;
    font-size: 12px;
  }
  .add-card-button {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}

@media (max-width: 360px) {
  .nav-bar-tab {
    padding: 3px 5px;
    margin-left: 3px;
    font-size: 10px;
  }
  .add-card-button {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
}
</style>
