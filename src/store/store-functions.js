import _ from "lodash";

const helpers = {
  getGlobalFuncName(path, funcNames) {
    return _.mapValues(funcNames, name => {
      return `${path}/${name}`;
    });
  }
};

export const rootData = {
  path: "rootData",
  getters: {
    MULTI_MAP_SHOW: "MULTI_MAP_SHOW",
    MULTI_MAP_SYNC: "MULTI_MAP_SYNC",
    ALERTS: "ALERTS",
    ALERT_LISTENING: "ALERT_LISTENING",
    ALERT_BASE_DATE: "ALERT_BASE_DATE",
    ALERT_CHECK_DATE: "ALERT_CHECK_DATE",
    HAS_CHANGE_DATE: "HAS_CHANGE_DATE",
    USER_INFO: "USER_INFO",
    LINKED_OBSERVATORY_DATA: "LINKED_OBSERVATORY_DATA",
    TRAINING_MODE: "TRAINING_MODE",
  },
  mutations: {
    UPDATE_MULTI_MAP_SHOW: "UPDATE_MULTI_MAP_SHOW",
    UPDATE_MULTI_MAP_SYNC: "UPDATE_MULTI_MAP_SYNC",
    UPDATE_ALERTS: "UPDATE_ALERTS",
    UPDATE_ALERT_LISTENING: "UPDATE_ALERT_LISTENING",
    UPDATE_ALERT_BASE_DATE: "UPDATE_ALERT_BASE_DATE",
    UPDATE_ALERT_CHECK_DATE: "UPDATE_ALERT_CHECK_DATE",
    UPDATE_HAS_CHANGE_DATE: "UPDATE_HAS_CHANGE_DATE",
    UPDATE_USER_INFO: "UPDATE_USER_INFO",
    UPDATE_LINKED_OBSERVATORY_DATA: "UPDATE_LINKED_OBSERVATORY_DATA",
    UPDATE_TRAINING_MODE: "UPDATE_TRAINING_MODE",
  },
  actions: {
    LOAD_USER_INFO: "LOAD_USER_INFO",
    LOAD_LINKED_OBSERVATORY_DATA: "LOAD_LINKED_OBSERVATORY_DATA"
  }
};
export const riskData = {
  path: "riskData",
  getters: {
    FIND_RISK: "FIND_RISK",
    FILTER_RISK: "FILTER_RISK",
    OBSERVATORY_RIVERS: "OBSERVATORY_RIVERS",
    BIG_RIVER_FLOODING_RIVERS: "BIG_RIVER_FLOODING_RIVERS"
  },
  mutations: {
    RESET_ALL_RISK_DATA: "RESET_ALL_RISK_DATA",
    UPDATE_SMALL_RIVER_FLOODING: "UPDATE_SMALL_RIVER_FLOODING",
    UPDATE_LAND_SLIDE: "UPDATE_LAND_SLIDE",
    UPDATE_LAND_SLIDE_MESH: "UPDATE_LAND_SLIDE_MESH",
    UPDATE_RAIN: "UPDATE_RAIN",
    UPDATE_X_RAIN: "UPDATE_X_RAIN",
    UPDATE_WIND_DATE_LIST: "UPDATE_WIND",
    UPDATE_WIND: "UPDATE_WIND_DATE_LIST",
    UPDATE_RIVER_RISK_DISTRIBUTION: "UPDATE_RIVER_RISK_DISTRIBUTION",
    UPDATE_OBSERVATORY: "UPDATE_OBSERVATORY",
    UPDATE_OBSERVATORY_BY_USER: "UPDATE_OBSERVATORY_BY_USER",
    UPDATE_BIG_RIVER_FLOODING: "UPDATE_BIG_RIVER_FLOODING",
    UPDATE_OBSERVATORY_RIVERS: "UPDATE_OBSERVATORY_RIVERS",
    UPDATE_BIG_RIVER_FLOODING_RIVERS: "UPDATE_BIG_RIVER_FLOODING_RIVERS",
    UPDATE_FLOODING_HISTORY: "UPDATE_FLOODING_HISTORY"
  },
  actions: {
    LOAD_SMALL_RIVER_FLOODING: "LOAD_SMALL_RIVER_FLOODING",
    LOAD_LAND_SLIDE: "LOAD_LAND_SLIDE",
    LOAD_LAND_SLIDE_MESH: "LOAD_LAND_SLIDE_MESH",
    LOAD_RAIN: "LOAD_RAIN",
    LOAD_X_RAIN: "LOAD_X_RAIN",
    LOAD_WIND_DATE_LIST: "LOAD_WIND_DATE_LIST",
    LOAD_WIND: "LOAD_WIND",
    LOAD_RIVER_RISK_DISTRIBUTION: "LOAD_RIVER_RISK_DISTRIBUTION",
    LOAD_OBSERVATORY: "LOAD_OBSERVATORY",
    LOAD_OBSERVATORY_BY_USER: "LOAD_OBSERVATORY_BY_USER",
    LOAD_BIG_RIVER_FLOODING: "LOAD_BIG_RIVER_FLOODING",
    LOAD_OBSERVATORY_RIVERS: "LOAD_OBSERVATORY_RIVERS",
    LOAD_BIG_RIVER_FLOODING_RIVERS: "LOAD_BIG_RIVER_FLOODING_RIVERS",
    LOAD_FLOODING_HISTORY: "LOAD_FLOODING_HISTORY",
    PUSH_FLOODING_HISTORY: "PUSH_FLOODING_HISTORY",
    UPDATE_FLOODING_HISTORY: "UPDATE_FLOODING_HISTORY",
    DELETE_FLOODING_HISTORY: "DELETE_FLOODING_HISTORY"
  }
};
export const mapData = {
  path: "mapData",
  getters: {
    MAP_DATA: "MAP_DATA",
    MAP_OBJECT: "MAP_OBJECT",
    SELECTED_RISK: "SELECTED_RISK",
    SELECTED_BASE_TILE: "SELECTED_BASE_TILE",
    SELECTED_FEATURES: "SELECTED_FEATURES",
    SELECTED_DATE: "SELECTED_DATE",
    BASE_DATE: "BASE_DATE",
    DIALOG: "DIALOG",
    SELECTED_OBSERVATORY: "SELECTED_OBSERVATORY",
    SELECTED_OBSERVATORY_DETAIL: "SELECTED_OBSERVATORY_DETAIL",
    SELECTED_OBSERVATORIES: "SELECTED_OBSERVATORIES",
    OBSERVATORY_OPTIONS: "OBSERVATORY_OPTIONS",
    SELECTED_WIND: "SELECTED_WIND",
    WIND_OPTIONS: "WIND_OPTIONS",
    SELECTED_DIKE_BREAK_POINT: "SELECTED_DIKE_BREAK_POINT",
    BIG_RIVER_FLOODING_OPTIONS: "BIG_RIVER_FLOODING_OPTIONS",
    FLOODING_HISTORY_OPTIONS: "FLOODING_HISTORY_OPTIONS",
    SMALL_RIVER_FLOODING_OPTIONS: "SMALL_RIVER_FLOODING_OPTIONS",
    LAND_SLIDE_OPTIONS: "LAND_SLIDE_OPTIONS",
    LAND_SLIDE_MESH_OPTIONS: "LAND_SLIDE_MESH_OPTIONS",
    COLOR_LEGEND: "COLOR_LEGEND",
    MAP_TOOL: "MAP_TOOL",
    X_RAIN_OPTIONS: "X_RAIN_OPTIONS",
    RAIN_OPTIONS: "RAIN_OPTIONS",
    HYDRANT_OPTIONS: "HYDRANT_OPTIONS"
  },
  mutations: {
    INIT_MAP_DATA: "INIT_MAP_DATA",
    REMOVE_MAP_DATA: "REMOVE_MAP_DATA",
    UPDATE_MAP_OBJECT: "UPDATE_MAP_OBJECT",
    UPDATE_SELECTED_BASE_TILE: "UPDATE_SELECTED_BASE_TILE",
    UPDATE_SELECTED_RISK: "UPDATE_SELECTED_RISK",
    UPDATE_SELECTED_FEATURES: "UPDATE_SELECTED_FEATURES",
    UPDATE_BASE_DATE: "UPDATE_BASE_DATE",
    UPDATE_SELECTED_DATE: "UPDATE_SELECTED_DATE",
    UPDATE_DIALOG: "UPDATE_DIALOG",
    UPDATE_SELECTED_OBSERVATORY: "UPDATE_SELECTED_OBSERVATORY",
    UPDATE_SELECTED_OBSERVATORY_DETAIL: "UPDATE_SELECTED_OBSERVATORY_DETAIL",
    UPDATE_SELECTED_OBSERVATORIES: "UPDATE_SELECTED_OBSERVATORIES",
    UPDATE_OBSERVATORY_OPTIONS: "UPDATE_OBSERVATORY_OPTIONS",
    UPDATE_SELECTED_WIND: "UPDATE_SELECTED_WIND",
    UPDATE_WIND_OPTIONS: "UPDATE_WIND_OPTIONS",
    UPDATE_SELECTED_DIKE_BREAK_POINT: "SELECTED_DIKE_BREAK_POINT",
    UPDATE_BIG_RIVER_FLOODING_OPTIONS: "UPDATE_BIG_RIVER_FLOODING_OPTIONS",
    UPDATE_FLOODING_HISTORY_OPTIONS: "UPDATE_FLOODING_HISTORY_OPTIONS",
    UPDATE_SMALL_RIVER_FLOODING_OPTIONS: "UPDATE_SMALL_RIVER_FLOODING_OPTIONS",
    UPDATE_LAND_SLIDE_OPTIONS: "UPDATE_LAND_SLIDE_OPTIONS",
    UPDATE_LAND_SLIDE_MESH_OPTIONS: "UPDATE_LAND_SLIDE_MESH_OPTIONS",
    UPDATE_COLOR_LEGEND: "UPDATE_COLOR_LEGEND",
    UPDATE_MAP_TOOL: "UPDATE_MAP_TOOL",
    UPDATE_X_RAIN_OPTIONS: "UPDATE_X_RAIN_OPTIONS",
    UPDATE_RAIN_OPTIONS: "UPDATE_RAIN_OPTIONS",
    UPDATE_HYDRANT_OPTIONS: "UPDATE_HYDRANT_OPTIONS"
  },
  actions: {
    LOAD_OBSERVATION_DATA: "LOAD_OBSERVATION_DATA",
    LOAD_OBSERVATION_DETAIL_DATA: "LOAD_OBSERVATION_DETAIL_DATA"
  }
};

export const rootGetters = _.assign(
  {},
  helpers.getGlobalFuncName(rootData.path, rootData.getters),
  helpers.getGlobalFuncName(riskData.path, riskData.getters),
  helpers.getGlobalFuncName(mapData.path, mapData.getters)
);
export const rootMutations = _.assign(
  {},
  helpers.getGlobalFuncName(rootData.path, rootData.mutations),
  helpers.getGlobalFuncName(riskData.path, riskData.mutations),
  helpers.getGlobalFuncName(mapData.path, mapData.mutations)
);
export const rootActions = _.assign(
  {},
  helpers.getGlobalFuncName(rootData.path, rootData.actions),
  helpers.getGlobalFuncName(riskData.path, riskData.actions),
  helpers.getGlobalFuncName(mapData.path, mapData.actions)
);
