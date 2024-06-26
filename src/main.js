import { createPinia } from "pinia";
import { createApp, watch } from "vue";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();

if (localStorage.getItem("state")) {
  pinia.state.value = JSON.parse(localStorage.getItem("state"));
}

watch(
  pinia.state,
  (state) => {
    localStorage.setItem("state", JSON.stringify(state));
  },
  { deep: true }
);

createApp(App).use(router).use(pinia).mount("#app");
