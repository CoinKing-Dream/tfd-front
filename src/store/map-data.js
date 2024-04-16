import Vue from "vue";
import _ from "lodash";

import moment from "moment";
import {
  mapData as functions,
  rootGetters as rootGetterFunctions
} from "./store-functions";
import { BaseTile } from "../enums/BaseTile";
import { Risk } from "../enums/Risk";
import conf from "../config";
const DATE_FORMAT = "YYYY/MM/DD HH:mm";
import { get } from "./apiAxios";
import axios from "axios";

const defaultMapData = {
  mapObject: null,
  selectedBaseTile: BaseTile.GRAY,
  selectedRisk: Risk.RAIN,
  selectedFeatures: [],
  selectedDate: null,
  baseDate: moment(),
  dialog: {
    isShowing: false,
    title: "",
    cols: 6,
    contents: ""
  },
  rivers: [],
  selectedObservatory: null,
  selectedObservatoryDetail: null,
  selectedObservatories: [],
  observatoryOptions: {
    river: { text: "全体", value: -1 },
    filter: ["水位", "雨量", "カメラ", "水門", "調節池"]
  },
  selectedWind: {
    speed: 0,
    direction: 0
  },
  windOptions: {
    height: 10,
    loading: true,
    sample: false
  },
  selectedDikeBreakPoint: null,
  bigRiverFloodingOptions: {
    river: null,
    level: "L2",
    displayDataType: "浸水深",
    selectedIndex: 0,
    opacity: 0.7
  },
  floodingHistoryOptions: {
    areaSelectMode: false,
    newArea: null,
    editAreaInfo: null,
  },
  smallRiverFloodingOptions: {
    type: 3, //内外水 todo : enum化
    sample: false
  },
  landSlideOptions: {
    opacity: 0.7,
    sample: false,
    level: 0
  },
  landSlideMeshOptions: {
    opacity: 0.7
  },
  colorLegend: {
    unit: null,
    colors: []
  },
  mapTool: {
    addressMarker: false
  },
  rainOptions: {
    opacity: 0.7
  },
  xRainOptions: {
    chart: false,
    opacity: 0.7
  },
  hydrantOptions: {
    enabledTypes: []
  }
};
const helper = {
  localizationObservatoryDataResponse(response) {
    const riskData = [];
    _.forEach(response.observatories, o => {
      const observatory = {
        _id: null,
        baseDate: null,
        times: []
      };

      observatory._id = o._id;
      observatory.baseDate = this.stringDateToLocalMoment(o.baseDate);
      observatory.times = _.map(response.times, time => {
        return time;
      });
      if (o.riverLevels) {
        observatory.riverLevels = [];
        observatory.riverLevels = _.map(o.riverLevels, level => {
          if (level === null || level <= -998) {
            return null;
          }
          return level.toFixed(2);
        });
      }
      if (o.rains) {
        observatory.rains = [];
        observatory.rains = _.map(o.rains, rainfall => {
          if (rainfall === null || rainfall <= -998) {
            return null;
          }
          return rainfall.toFixed(2);
        });
      }
      if (o.totalRains) {
        observatory.totalRains = [];
        observatory.totalRains = _.map(o.totalRains, rainfall => {
          if (rainfall === null || rainfall <= -998) {
            return null;
          }
          return rainfall.toFixed(2);
        });
      }
      if (o.imageInfo) {
        observatory.imageInfo = o.imageInfo;
      }
      if (o.volumes) {
        observatory.volumes = [];
        observatory.volumes = _.map(o.volumes, volume => {
          if (volume === null || volume <= -998) {
            return null;
          }
          return volume.toFixed(2);
        });
      }
      if (o.inner_levels) {
        observatory.innerLevels = [];
        observatory.innerLevels = _.map(o.inner_levels, level => {
          if (level === null || level <= -998) {
            return null;
          }
          return level.toFixed(2);
        });
      }
      if (o.outer_levels) {
        observatory.outerLevels = [];
        observatory.outerLevels = _.map(o.outer_levels, level => {
          if (level === null || level <= -998) {
            return null;
          }
          return level.toFixed(2);
        });
      }

      riskData.push(observatory);
    });

    return riskData;
  },
  stringDateToLocalMoment(string) {
    return moment.utc(string, DATE_FORMAT);
  },
  round(date, duration, method) {
    return moment(Math[method](+date / +duration) * +duration);
  }
};
export const store = {
  namespaced: true,
  state: {
    maps: {}
  },
  getters: {
    [functions.getters.MAP_DATA]: state => storeId => {
      return state.maps[storeId];
    },
    [functions.getters.MAP_OBJECT]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].mapObject
        : undefined;
    },
    [functions.getters.SELECTED_BASE_TILE]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].selectedBaseTile
        : undefined;
    },
    [functions.getters.SELECTED_RISK]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].selectedRisk
        : undefined;
    },
    [functions.getters.SELECTED_FEATURES]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].selectedFeatures
        : undefined;
    },
    [functions.getters.SELECTED_DATE]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].selectedDate
        : undefined;
    },
    [functions.getters.BASE_DATE]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].baseDate
        : undefined;
    },
    [functions.getters.DIALOG]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].dialog
        : undefined;
    },
    [functions.getters.SELECTED_OBSERVATORY]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].selectedObservatory
        : undefined;
    },
    [functions.getters.SELECTED_OBSERVATORY_DETAIL]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].selectedObservatoryDetail
        : undefined;
    },
    [functions.getters.SELECTED_OBSERVATORIES]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].selectedObservatories
        : undefined;
    },
    [functions.getters.OBSERVATORY_OPTIONS]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].observatoryOptions
        : undefined;
    },
    [functions.getters.SELECTED_WIND]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].selectedWind
        : undefined;
    },
    [functions.getters.WIND_OPTIONS]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].windOptions
        : undefined;
    },
    [functions.getters.SELECTED_DIKE_BREAK_POINT]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].selectedDikeBreakPoint
        : undefined;
    },
    [functions.getters.BIG_RIVER_FLOODING_OPTIONS]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].bigRiverFloodingOptions
        : undefined;
    },
    [functions.getters.FLOODING_HISTORY_OPTIONS]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].floodingHistoryOptions
        : undefined;
    },
    [functions.getters.SMALL_RIVER_FLOODING_OPTIONS]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].smallRiverFloodingOptions
        : undefined;
    },
    [functions.getters.LAND_SLIDE_OPTIONS]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].landSlideOptions
        : undefined;
    },
    [functions.getters.LAND_SLIDE_MESH_OPTIONS]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].landSlideMeshOptions
        : undefined;
    },
    [functions.getters.COLOR_LEGEND]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].colorLegend
        : undefined;
    },
    [functions.getters.MAP_TOOL]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].mapTool
        : undefined;
    },
    [functions.getters.X_RAIN_OPTIONS]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].xRainOptions
        : undefined;
    },
    [functions.getters.RAIN_OPTIONS]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].rainOptions
        : undefined;
    },
    [functions.getters.HYDRANT_OPTIONS]: state => storeId => {
      return _.has(state.maps, storeId)
        ? state.maps[storeId].hydrantOptions
        : undefined;
    }
  },
  mutations: {
    [functions.mutations.INIT_MAP_DATA](state, { storeId, mapData }) {
      const userMapData = _.cloneDeep(defaultMapData);
      if (_.has(mapData, "mapObject")) {
        userMapData.mapObject = mapData.mapObject;
      }
      if (_.has(mapData, "selectedBaseTile")) {
        userMapData.selectedBaseTile = mapData.selectedBaseTile;
      }
      if (_.has(mapData, "selectedRiskType")) {
        userMapData.selectedRisk = this.getters[rootGetterFunctions.FIND_RISK](
          mapData.selectedRiskType
        );
      }
      if (_.has(mapData, "selectedFeatures")) {
        userMapData.selectedFeatures = mapData.selectedFeatures;
      }
      if (_.has(mapData, "selectedDate")) {
        userMapData.selectedDate = mapData.selectedDate;
      }
      if (_.has(mapData, "baseDate")) {
        userMapData.baseDate = mapData.baseDate;
      }
      if (_.has(mapData, "dialog")) {
        userMapData.dialog = mapData.dialog;
      }
      if (_.has(mapData, "observatoryOptions")) {
        userMapData.observatoryOptions = mapData.observatoryOptions;
      }

      Vue.set(state.maps, storeId, userMapData);
    },
    [functions.mutations.REMOVE_MAP_DATA](state, storeId) {
      state.maps[storeId] = defaultMapData;
      Vue.delete(state.maps, storeId);
    },
    [functions.mutations.UPDATE_MAP_OBJECT](state, { storeId, mapObject }) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      state.maps[storeId].mapObject = mapObject;
    },
    [functions.mutations.UPDATE_SELECTED_BASE_TILE](
      state,
      { storeId, baseTile }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      state.maps[storeId].selectedBaseTile = baseTile;
    },
    [functions.mutations.UPDATE_SELECTED_RISK](
      state,
      { storeId, selectedRiskType }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      state.maps[storeId].selectedRisk = this.getters[
        rootGetterFunctions.FIND_RISK
      ](selectedRiskType);
    },
    [functions.mutations.UPDATE_SELECTED_FEATURES](
      state,
      { storeId, selectedFeatures }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      state.maps[storeId].selectedFeatures = selectedFeatures;
    },
    [functions.mutations.UPDATE_SELECTED_DATE](
      state,
      { storeId, selectedDate }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      state.maps[storeId].selectedDate = selectedDate;
    },
    [functions.mutations.UPDATE_BASE_DATE](state, { storeId, baseDate }) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      state.maps[storeId].baseDate = baseDate;
    },
    [functions.mutations.UPDATE_DIALOG](state, { storeId, dialog }) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(dialog, "isShowing")) {
        state.maps[storeId].dialog.isShowing = dialog.isShowing;
      }
      if (_.has(dialog, "title")) {
        state.maps[storeId].dialog.title = dialog.title;
      }
      if (_.has(dialog, "cols")) {
        state.maps[storeId].dialog.cols = dialog.cols;
      }
      if (_.has(dialog, "contents")) {
        state.maps[storeId].dialog.contents = dialog.contents;
      }
    },
    [functions.mutations.UPDATE_SELECTED_OBSERVATORY](
      state,
      { storeId, selectedObservatory }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      state.maps[storeId].selectedObservatory = selectedObservatory;
    },
    [functions.mutations.UPDATE_SELECTED_OBSERVATORY_DETAIL](
      state,
      { storeId, selectedObservatoryDetail }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      state.maps[storeId].selectedObservatoryDetail = selectedObservatoryDetail;
    },
    [functions.mutations.UPDATE_SELECTED_OBSERVATORIES](
      state,
      { storeId, selectedObservatories }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      state.maps[storeId].selectedObservatories = selectedObservatories;
    },
    [functions.mutations.UPDATE_OBSERVATORY_OPTIONS](
      state,
      { storeId, observatoryOptions }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(observatoryOptions, "river")) {
        state.maps[storeId].observatoryOptions.river = observatoryOptions.river;
      }
      if (_.has(observatoryOptions, "filter")) {
        state.maps[storeId].observatoryOptions.filter =
          observatoryOptions.filter;
      }
    },
    [functions.mutations.UPDATE_SELECTED_WIND](
      state,
      { storeId, selectedWind }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(selectedWind, "speed")) {
        state.maps[storeId].selectedWind.speed = selectedWind.speed;
      }
      if (_.has(selectedWind, "direction")) {
        state.maps[storeId].selectedWind.direction = selectedWind.direction;
      }
    },
    [functions.mutations.UPDATE_WIND_OPTIONS](state, { storeId, windOptions }) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(windOptions, "height")) {
        state.maps[storeId].windOptions.height = windOptions.height;
      }
      if (_.has(windOptions, "sample")) {
        state.maps[storeId].windOptions.sample = windOptions.sample;
      }
      if (_.has(windOptions, "loading")) {
        state.maps[storeId].windOptions.loading = windOptions.loading;
      }
    },
    [functions.mutations.UPDATE_SELECTED_DIKE_BREAK_POINT](
      state,
      { storeId, selectedDikeBreakPoint }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      state.maps[storeId].selectedDikeBreakPoint = selectedDikeBreakPoint;
    },
    [functions.mutations.UPDATE_BIG_RIVER_FLOODING_OPTIONS](
      state,
      { storeId, bigRiverFloodingOptions }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(bigRiverFloodingOptions, "river")) {
        state.maps[storeId].bigRiverFloodingOptions.river =
          bigRiverFloodingOptions.river;
      }
      if (_.has(bigRiverFloodingOptions, "level")) {
        state.maps[storeId].bigRiverFloodingOptions.level =
          bigRiverFloodingOptions.level;
      }
      if (_.has(bigRiverFloodingOptions, "displayDataType")) {
        state.maps[storeId].bigRiverFloodingOptions.displayDataType =
          bigRiverFloodingOptions.displayDataType;
      }
      if (_.has(bigRiverFloodingOptions, "selectedIndex")) {
        state.maps[storeId].bigRiverFloodingOptions.selectedIndex =
          bigRiverFloodingOptions.selectedIndex;
      }
      if (_.has(bigRiverFloodingOptions, "opacity")) {
        state.maps[storeId].bigRiverFloodingOptions.opacity =
          bigRiverFloodingOptions.opacity;
      }
    },
    [functions.mutations.UPDATE_FLOODING_HISTORY_OPTIONS](
      state,
      { storeId, floodingHistoryOptions }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(floodingHistoryOptions, "areaSelectMode")) {
        state.maps[storeId].floodingHistoryOptions.areaSelectMode =
          floodingHistoryOptions.areaSelectMode;
      }
      if (_.has(floodingHistoryOptions, "newArea")) {
        state.maps[storeId].floodingHistoryOptions.newArea =
          floodingHistoryOptions.newArea;
      }
      if (_.has(floodingHistoryOptions, "editAreaInfo")) {
        state.maps[storeId].floodingHistoryOptions.editAreaInfo =
            floodingHistoryOptions.editAreaInfo;
      }
    },
    [functions.mutations.UPDATE_SMALL_RIVER_FLOODING_OPTIONS](
      state,
      { storeId, smallRiverFloodingOptions }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(smallRiverFloodingOptions, "type")) {
        state.maps[storeId].smallRiverFloodingOptions.type =
          smallRiverFloodingOptions.type;
      }
      if (_.has(smallRiverFloodingOptions, "sample")) {
        state.maps[storeId].smallRiverFloodingOptions.sample =
          smallRiverFloodingOptions.sample;
      }
    },
    [functions.mutations.UPDATE_LAND_SLIDE_OPTIONS](
      state,
      { storeId, landSlideOptions }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(landSlideOptions, "sample")) {
        state.maps[storeId].landSlideOptions.sample = landSlideOptions.sample;
      }
      if (_.has(landSlideOptions, "opacity")) {
        state.maps[storeId].landSlideOptions.opacity = landSlideOptions.opacity;
      }
      if (_.has(landSlideOptions, "level")) {
        state.maps[storeId].landSlideOptions.level = landSlideOptions.level;
      }
    },
    [functions.mutations.UPDATE_LAND_SLIDE_MESH_OPTIONS](
      state,
      { storeId, landSlideMeshOptions }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(landSlideMeshOptions, "opacity")) {
        state.maps[storeId].landSlideMeshOptions.opacity =
          landSlideMeshOptions.opacity;
      }
    },
    [functions.mutations.UPDATE_COLOR_LEGEND](state, { storeId, colorLegend }) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      state.maps[storeId].colorLegend = colorLegend;
    },
    [functions.mutations.UPDATE_MAP_TOOL](state, { storeId, mapTool }) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(mapTool, "addressMarker")) {
        state.maps[storeId].mapTool.addressMarker = mapTool.addressMarker;
      }
    },
    [functions.mutations.UPDATE_X_RAIN_OPTIONS](
      state,
      { storeId, xRainOptions }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(xRainOptions, "chart")) {
        state.maps[storeId].xRainOptions.chart = xRainOptions.chart;
      }
      if (_.has(xRainOptions, "opacity")) {
        state.maps[storeId].xRainOptions.opacity = xRainOptions.opacity;
      }
    },
    [functions.mutations.UPDATE_RAIN_OPTIONS](state, { storeId, rainOptions }) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(rainOptions, "opacity")) {
        state.maps[storeId].rainOptions.opacity = rainOptions.opacity;
      }
    },
    [functions.mutations.UPDATE_HYDRANT_OPTIONS](
      state,
      { storeId, hydrantOptions }
    ) {
      if (_.has(state.maps, storeId) === false) {
        return;
      }
      if (_.has(hydrantOptions, "enabledTypes")) {
        state.maps[storeId].hydrantOptions.enabledTypes =
          hydrantOptions.enabledTypes;
      }
    }
  },
  actions: {
    async [functions.actions.LOAD_OBSERVATION_DATA](
      { dispatch, commit, getters, rootGetters },
      { storeId, observatoryId, ids, isRiverArea, isDetailMode = false }
    ) {
      const baseDate = getters[functions.getters.BASE_DATE](storeId).clone();
      const paramDate = helper.round(
        baseDate,
        moment.duration(5, "minutes"),
        "floor"
      );

      const requests = [];
      _.forEach(ids, (id)=> {
        const parameters = {
          date: paramDate.utc().format(DATE_FORMAT),
          observatory_id: id
        };
        if (isRiverArea) {
          parameters.isRiverArea = isRiverArea;
        }
        const request = axios.get(
            conf.apiServer.url + "/api/observatories/data",
            { params: parameters }
        );
        requests.push(request);
      })

      const responses = await axios.all(requests);
      let response = {
        times: responses[0].data.times,
        observatories: []
      };
      _.forEach(responses, (r)=> {
        response.observatories = _.concat(response.observatories, r.data.observatories)
      });

      const observationData = helper.localizationObservatoryDataResponse(
        response
      );
      const selectedObservatories = [];
      let selectedObservatory = null;
      _.forEach(observationData, o => {
        const masterContents = rootGetters[rootGetterFunctions.FIND_RISK](
          Risk.OBSERVATORY
        ).data.contents;
        const index = _.findIndex(masterContents, mo => {
          return o._id === mo._id;
        });
        if (index !== -1) {
          const observatoryMaster = Object.assign({}, masterContents[index]);
          Object.assign(observatoryMaster, o);
          selectedObservatories.push(observatoryMaster);
          if (observatoryId === observatoryMaster._id) {
            selectedObservatory = observatoryMaster;
          }
        }
      });

      commit(functions.mutations.UPDATE_SELECTED_OBSERVATORIES, {
        storeId,
        selectedObservatories: selectedObservatories
      });
      commit(functions.mutations.UPDATE_SELECTED_OBSERVATORY, {
        storeId,
        selectedObservatory: selectedObservatory
      });
    },
    async [functions.actions.LOAD_OBSERVATION_DETAIL_DATA](
        { dispatch, commit, getters, rootGetters },
        { storeId, observatoryId }
    ) {
      const baseDate = getters[functions.getters.BASE_DATE](storeId).clone();
      const paramDate = helper.round(
          baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );

      const parameters = {
        date: paramDate.utc().format(DATE_FORMAT),
        observatory_id: observatoryId,
        isDetailMode: true
      };
      let [err, response] = await get(
          conf.apiServer.url,
          "/api/observatories/data",
          parameters
      );
      if (err) throw new Error("load failed : /observatories/data");

      const observationData = helper.localizationObservatoryDataResponse(
          response
      );

      let selectedObservatoryDetail = null;
      _.forEach(observationData, o => {
        const masterContents = rootGetters[rootGetterFunctions.FIND_RISK](
            Risk.OBSERVATORY
        ).data.contents;
        const index = _.findIndex(masterContents, mo => {
          return o._id === mo._id;
        });
        if (index !== -1) {
          const observatoryMaster = Object.assign({}, masterContents[index]);
          Object.assign(observatoryMaster, o);
          if (observatoryId === observatoryMaster._id) {
            selectedObservatoryDetail = observatoryMaster;
          }
        }
      });
      commit(functions.mutations.UPDATE_SELECTED_OBSERVATORY_DETAIL, {
        storeId,
        selectedObservatoryDetail: selectedObservatoryDetail
      });
    }
  }
};
