import { createWebHistory, createRouter } from "vue-router";
import WeatherComponent from "../views/WeatherComponent.vue";

const routes = [
  {
    path: "/",
    name: "WeatherBoard",
    component: WeatherComponent,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
