import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import { store as rootData } from "./root-data";
import { store as mapData } from "./map-data";
import { store as riskData } from "./risk-data";

export const store = new Vuex.Store({
  modules: {
    rootData,
    mapData,
    riskData
  }
});
