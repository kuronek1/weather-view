import { defineStore } from "pinia";
import state from "./state";
import getters from "./getters";
import actions from "./actions";

export const useStore = defineStore({
  id: "store",
  state,
  getters,
  actions,
});
