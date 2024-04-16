import conf from "../config";
import moment from "moment";
import _ from "lodash";

import {
  riskData as functions,
  rootGetters as rootGetterFunctions,
  rootMutations as rootMutationFunctions
} from "./store-functions";
import { Risk } from "../enums/Risk";
import { get, post } from "./apiAxios";
import router from "../router";

moment.locale("ja");

const DATE_FORMAT = "YYYY/MM/DD HH:mm";
const helper = {
  localizationSmallRiverFloodingResponse(response) {
    const riskData = {
      baseDate: null,
      contents: []
    };

    riskData.baseDate = this.stringDateToLocalMoment(response.baseDate);
    riskData.bounds = response.bounds;
    riskData.contents = _.map(response.floodings, o => {
      const image = new Image();
      image.src = o.url;
      return {
        image: image,
        date: o.date
      };
    });

    return riskData;
  },
  localizationXRainResponse(response) {
    const riskData = {
      baseDate: null,
      contents: []
    };

    riskData.baseDate = this.stringDateToLocalMoment(response.baseDate);
    riskData.bounds = response.bounds;
    riskData.contents = _.map(response.xrains, o => {
      const image = new Image();
      image.src = o.url;
      return {
        image: image,
        date: o.date
      };
    });

    return riskData;
  },
  localizationLandSlideResponse(response) {
    const riskData = {
      baseDate: null,
      contents: []
    };

    riskData.baseDate = this.stringDateToLocalMoment(response.baseDate);
    riskData.bounds = response.bounds;
    riskData.contents = _.map(response.risks, o => {
      const image = new Image();
      image.src = o.url;
      return {
        image: image,
        date: o.date
      };
    });

    return riskData;
  },
  localizationLandSlideMeshResponse(response) {
    const riskData = {
      baseDate: null,
      contents: []
    };

    riskData.baseDate = this.stringDateToLocalMoment(response.baseDate);
    riskData.bounds = response.bounds;
    riskData.contents = _.map(response.meshs, o => {
      const image = new Image();
      image.src = o.url;
      return {
        image: image,
        date: o.date
      };
    });

    return riskData;
  },
  localizationRainResponse(response) {
    const riskData = {
      baseDate: null,
      contents: []
    };
    riskData.baseDate = this.stringDateToLocalMoment(response.baseDate);
    riskData.bounds = response.bounds;
    riskData.imageInfo = response.imageInfo;
    riskData.contents = _.map(response.rains, o => {
      const image = new Image();
      image.src = o.url;
      return {
        image: image,
        date: o.date,
        type: o.type
      };
    });

    return riskData;
  },
  localizationWindResponse(response) {
    const riskData = {
      baseDate: null,
      contents: []
    };

    riskData.baseDate = this.stringDateToLocalMoment(response.baseDate);
    riskData.contents = _.map(response.winds, o => {
      return {
        date: o.date,
        json: o.wind
      };
    });

    return riskData;
  },
  localizationRiverRiskDistributionResponse(response) {
    const riskData = {
      baseDate: null,
      contents: []
    };

    riskData.baseDate = this.stringDateToLocalMoment(response.baseDate);
    riskData.contents = _.map(response.riverRisks, o => {
      return {
        date: this.stringDateToLocalMoment(o.date),
        url: o.url
      };
    });

    return riskData;
  },
  localizationObservatoryResponse(response) {
    const riskData = {
      contents: []
    };

    riskData.contents = _.map(response.contents, (o, index) => {
      o.index = index;
      return o;
    });

    return riskData;
  },
  stringDateToLocalMoment(string) {
    return moment.utc(string, DATE_FORMAT);
  },
  isDashboard() {
    const path = router.currentRoute.path;
    return (path === "/" || path === "/dashboard")
  },
  round(date, duration, method) {
    return moment(Math[method](+date / +duration) * +duration);
  },
};
const defaultRisks = {
  [Risk.SMALL_RIVER_FLOODING.key]: {
    type: Risk.SMALL_RIVER_FLOODING,
    displayType: "image",
    updateType: "realtime",
    timeAxis: true,
    slider: true,
    subControl: true,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.LAND_SLIDE.key]: {
    type: Risk.LAND_SLIDE,
    displayType: "image",
    updateType: "realtime",
    timeAxis: true,
    slider: true,
    subControl: true,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.LAND_SLIDE_MESH.key]: {
    type: Risk.LAND_SLIDE_MESH,
    displayType: "image",
    updateType: "realtime",
    timeAxis: true,
    slider: true,
    subControl: true,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.X_RAIN.key]: {
    type: Risk.X_RAIN,
    displayType: "image",
    updateType: "realtime",
    timeAxis: true,
    slider: true,
    subControl: true,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.WIND.key]: {
    type: Risk.WIND,
    displayType: "customLayer",
    updateType: "realtime",
    timeAxis: true,
    slider: true,
    subControl: true,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.RIVER_RISK_DISTRIBUTION.key]: {
    type: Risk.RIVER_RISK_DISTRIBUTION,
    displayType: "customLayer",
    updateType: "realtime",
    timeAxis: true,
    slider: true,
    subControl: false,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.OBSERVATORY.key]: {
    type: Risk.OBSERVATORY,
    displayType: "customLayer",
    updateType: "realtime",
    timeAxis: true,
    slider: false,
    subControl: true,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.BIG_RIVER_FLOODING.key]: {
    type: Risk.BIG_RIVER_FLOODING,
    displayType: "tile",
    updateType: "static",
    timeAxis: false,
    slider: false,
    subControl: true,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.RAIN.key]: {
    type: Risk.RAIN,
    displayType: "image",
    updateType: "realtime",
    timeAxis: true,
    slider: true,
    subControl: true,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.FLOODING_HISTORY.key]: {
    type: Risk.FLOODING_HISTORY,
    displayType: "customLayer",
    updateType: "realtime",
    timeAxis: false,
    slider: false,
    subControl: true,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.TYPHOON.key]: {
    type: Risk.TYPHOON,
    displayType: "customLayer",
    updateType: "realtime",
    timeAxis: false,
    slider: false,
    subControl: false,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.TIDE.key]: {
    type: Risk.TIDE,
    displayType: "customLayer",
    updateType: "realtime",
    timeAxis: false,
    slider: false,
    subControl: false,
    data: {
      baseDate: null,
      contents: []
    }
  },
  [Risk.FLOOD_ZONE_ESTIMATION_SITE.key]: {
    type: Risk.FLOOD_ZONE_ESTIMATION_SITE,
    displayType: "customLayer",
    updateType: "realtime",
    timeAxis: false,
    slider: false,
    subControl: false,
    data: {
      baseDate: null,
      contents: []
    }
  },
};
export const store = {
  namespaced: true,
  state: {
    observatoryRivers: [],
    bigRiverFloodingRivers: [],
    risks: _.clone(defaultRisks)
  },
  getters: {
    [functions.getters.FIND_RISK]: state => riskType => {
      return _.find(state.risks, { type: riskType });
    },
    [functions.getters.FILTER_RISK]: state => query => {
      const filteredRisk = [];

      // todo _lodashを使ってもっと簡単にできるはず
      _.forEach(state.risks, o => {
        if (query.displayType && o.displayType === query.displayType) {
          filteredRisk.push(o);
        } else if (query.updateType && o.updateType === query.updateType) {
          filteredRisk.push(o);
        } else if (query.timeAxis && o.timeAxis === query.timeAxis) {
          filteredRisk.push(o);
        } else if (query.slider && o.slider === query.slider) {
          filteredRisk.push(o);
        }
      });

      return filteredRisk;
    },
    [functions.getters.OBSERVATORY_RIVERS]: state => {
      return state.observatoryRivers;
    },
    [functions.getters.BIG_RIVER_FLOODING_RIVERS]: state => {
      return state.bigRiverFloodingRivers;
    }
  },
  mutations: {
    [functions.mutations.RESET_ALL_RISK_DATA](state) {
      _.forEach(state.risks, risk => {
        risk.data = {
          baseDate: null,
          contents: []
        };
      });
    },
    [functions.mutations.UPDATE_SMALL_RIVER_FLOODING](state, data) {
      state.risks[Risk.SMALL_RIVER_FLOODING.key].data = data;
    },
    [functions.mutations.UPDATE_LAND_SLIDE](state, data) {
      state.risks[Risk.LAND_SLIDE.key].data = data;
    },
    [functions.mutations.UPDATE_LAND_SLIDE_MESH](state, data) {
      state.risks[Risk.LAND_SLIDE_MESH.key].data = data;
    },
    [functions.mutations.UPDATE_RAIN](state, data) {
      state.risks[Risk.RAIN.key].data = data;
    },
    [functions.mutations.UPDATE_X_RAIN](state, data) {
      state.risks[Risk.X_RAIN.key].data = data;
    },
    [functions.mutations.UPDATE_WIND_DATE_LIST](state, data) {
      state.risks[Risk.WIND.key].data = data;
    },
    [functions.mutations.UPDATE_WIND](state, { windDate, riskData }) {
      const selectedDate = moment.utc(windDate, DATE_FORMAT);
      const windDateList = state.risks[Risk.WIND.key].data.contents;
      const index = _.findIndex(windDateList, o => {
        return selectedDate.isSame(moment.utc(o.date, DATE_FORMAT));
      });

      windDateList[index].json = riskData.json;
    },
    [functions.mutations.UPDATE_RIVER_RISK_DISTRIBUTION](state, data) {
      state.risks[Risk.RIVER_RISK_DISTRIBUTION.key].data = data;
    },
    [functions.mutations.UPDATE_OBSERVATORY](state, data) {
      state.risks[Risk.OBSERVATORY.key].data = data;
    },
    [functions.mutations.UPDATE_BIG_RIVER_FLOODING](state, data) {
      state.risks[Risk.BIG_RIVER_FLOODING.key].data = data;
    },
    [functions.mutations.UPDATE_OBSERVATORY_RIVERS](state, data) {
      state.observatoryRivers = data;
    },
    [functions.mutations.UPDATE_BIG_RIVER_FLOODING_RIVERS](state, data) {
      state.bigRiverFloodingRivers = data;
    },
    [functions.mutations.UPDATE_FLOODING_HISTORY](state, data) {
      state.risks[Risk.FLOODING_HISTORY.key].data = data;
    }
  },
  actions: {
    async [functions.actions.LOAD_SMALL_RIVER_FLOODING](
      { dispatch, commit, getters, rootGetters },
      { storeId, type, selectedDate=null }
    ) {
      const baseDate = rootGetters[rootGetterFunctions.BASE_DATE](
        storeId
      ).clone();
      const paramDate = helper.round(
          baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );
      const parameters = {
        date: paramDate.utc().format(DATE_FORMAT),
        type: type,
      };
      if(helper.isDashboard()) {
        parameters.mode = "dashboard"
      }

      let [err, response] = await get(
        conf.apiServer.url,
        "/api/small-river-flooding",
        parameters
      );
      if (err) throw new Error("load failed : small-river-flooding");

      const riskData = helper.localizationSmallRiverFloodingResponse(response);
      commit(
        rootMutationFunctions.UPDATE_SELECTED_DATE,
        { storeId, selectedDate: selectedDate || riskData.baseDate },
        { root: true }
      );
      commit(functions.mutations.UPDATE_SMALL_RIVER_FLOODING, riskData);
    },
    async [functions.actions.LOAD_RIVER_RISK_DISTRIBUTION](
      { dispatch, commit, getters, rootGetters },
      storeId
    ) {
      const baseDate = rootGetters[rootGetterFunctions.BASE_DATE](
        storeId
      ).clone();
      const paramDate = helper.round(
          baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );
      const parameters = {
        date: paramDate.utc().format(DATE_FORMAT)
      };
      let [err, response] = await get(
        conf.apiServer.url,
        "/api/river-risk",
        parameters
      );
      if (err) throw new Error("load failed : /river-risk");

      const riskData = helper.localizationRiverRiskDistributionResponse(
        response
      );
      commit(
        rootMutationFunctions.UPDATE_SELECTED_DATE,
        { storeId, selectedDate: riskData.baseDate },
        { root: true }
      );
      commit(functions.mutations.UPDATE_RIVER_RISK_DISTRIBUTION, riskData);
    },
    async [functions.actions.LOAD_RAIN](
      { dispatch, commit, getters, rootGetters },
      { storeId, level, selectedDate=null }
    ) {
      const baseDate = rootGetters[rootGetterFunctions.BASE_DATE](
        storeId
      ).clone();
      const paramDate = helper.round(
          baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );
      const parameters = {
        date: paramDate.utc().format(DATE_FORMAT),
        level: level,
      };
      if(helper.isDashboard()) {
        parameters.mode = "dashboard"
      }

      let [err, response] = await get(
        conf.apiServer.url,
        "/api/rain",
        parameters
      );
      if (err) throw new Error("load failed : rain");

      const riskData = helper.localizationRainResponse(response);
      commit(
        rootMutationFunctions.UPDATE_SELECTED_DATE,
        { storeId, selectedDate: selectedDate || riskData.baseDate },
        { root: true }
      );
      commit(functions.mutations.UPDATE_RAIN, riskData);
    },
    async [functions.actions.LOAD_X_RAIN](
      { dispatch, commit, getters, rootGetters },
      storeId
    ) {
      const baseDate = rootGetters[rootGetterFunctions.BASE_DATE](
        storeId
      ).clone();
      const paramDate = helper.round(
          baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );
      const parameters = {
        date: paramDate.utc().format(DATE_FORMAT),
      };
      if(helper.isDashboard()) {
        parameters.mode = "dashboard"
      }

      let [err, response] = await get(
        conf.apiServer.url,
        "/api/xrain",
        parameters
      );
      if (err) throw new Error("load failed : xrain");

      const riskData = helper.localizationXRainResponse(response);
      commit(
        rootMutationFunctions.UPDATE_SELECTED_DATE,
        { storeId, selectedDate: riskData.baseDate },
        { root: true }
      );
      commit(functions.mutations.UPDATE_X_RAIN, riskData);
    },
    async [functions.actions.LOAD_WIND_DATE_LIST](
      { dispatch, commit, getters, rootGetters },
      { storeId, height, selectedDate=null }
    ) {
      const baseDate = rootGetters[rootGetterFunctions.BASE_DATE](
        storeId
      ).clone();
      const paramDate = helper.round(
          baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );
      const parameters = {
        baseDate: paramDate.utc().format(DATE_FORMAT),
        height: height
      };
      let [err, response] = await get(
        conf.apiServer.url,
        "/api/wind-info",
        parameters
      );
      if (err) throw new Error("load failed : wind-info");

      const riskData = helper.localizationWindResponse(response);
      commit(
        rootMutationFunctions.UPDATE_SELECTED_DATE,
        { storeId, selectedDate: selectedDate || riskData.baseDate },
        { root: true }
      );
      commit(functions.mutations.UPDATE_WIND_DATE_LIST, riskData);
    },
    async [functions.actions.LOAD_WIND](
      { dispatch, commit, getters, rootGetters },
      { storeId, windDate, height }
    ) {
      const selectedDate = moment.utc(windDate, DATE_FORMAT);
      const parameters = {
        windDate: selectedDate.format(DATE_FORMAT),
        height: height
      };
      let [err, response] = await get(
        conf.apiServer.url,
        "/api/wind",
        parameters
      );
      if (err) throw new Error("load failed : wind");

      const riskData = {
        date: helper.stringDateToLocalMoment(response.date),
        json: response.wind
      };

      commit(functions.mutations.UPDATE_WIND, { windDate, riskData });
    },
    async [functions.actions.LOAD_OBSERVATORY](
      { dispatch, commit, getters, rootGetters },
      storeId
    ) {
      const baseDate = rootGetters[rootGetterFunctions.BASE_DATE](
        storeId
      ).clone();
      const paramDate = helper.round(
          baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );
      const parameters = {
        date: paramDate.utc().format(DATE_FORMAT)
      };

      let [err, observatories] = await get(
        conf.apiServer.url,
        "/api/observatories",
        parameters
      );
      if (err) throw new Error("load failed : observatories");

      const response = {
        contents: observatories
      };
      const riskData = helper.localizationObservatoryResponse(response);
      commit(functions.mutations.UPDATE_OBSERVATORY, riskData);

      return new Promise((resolve, reject) => {
        resolve(null);
      });
    },
    async [functions.actions.LOAD_OBSERVATORY_BY_USER](
      { dispatch, commit, getters, rootGetters },
      storeId
    ) {
      const baseDate = rootGetters[rootGetterFunctions.BASE_DATE](
        storeId
      ).clone();
      const paramDate = helper.round(
          baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );
      const parameters = {
        date: paramDate.utc().format(DATE_FORMAT)
      };

      let [err, observatories] = await get(
        conf.apiServer.url,
        "/api/observatories/byUser",
        parameters
      );
      if (err) throw new Error("load failed : /observatories/byUser");

      const response = {
        contents: observatories
      };
      const riskData = helper.localizationObservatoryResponse(response);
      commit(functions.mutations.UPDATE_OBSERVATORY, riskData);

      return new Promise((resolve, reject) => {
        resolve(null);
      });
    },
    async [functions.actions.LOAD_BIG_RIVER_FLOODING](
      { dispatch, commit, getters, rootGetters },
      { storeId, level, riverId }
    ) {
      let [err, response] = await get(
        conf.staticServer.url,
        `/ctie.tfd.web/static/dike_break/${riverId}_${level}/points.json`
      );
      if (err)
        throw new Error(
          "load failed : /ctie.tfd.web/static/dike_break/${riverId}_${level}/points.json"
        );

      response.riverId = riverId;
      commit(functions.mutations.UPDATE_BIG_RIVER_FLOODING, response);
    },
    async [functions.actions.LOAD_OBSERVATORY_RIVERS]({
      dispatch,
      commit,
      getters,
      rootGetters
    }) {
      let [err, response] = await get(conf.apiServer.url, "/api/rivers");
      if (err) throw new Error("load failed : /rivers");

      const rivers = [{ text: "全体", value: -1 }];
      _.forEach(response, o => {
        rivers.push({
          text: o.name,
          value: o._id
        });
      });

      commit(functions.mutations.UPDATE_OBSERVATORY_RIVERS, rivers);
    },
    async [functions.actions.LOAD_BIG_RIVER_FLOODING_RIVERS]({
      dispatch,
      commit,
      getters,
      rootGetters
    }) {
      let [err, response] = await get(
        conf.staticServer.url,
        "/ctie.tfd.web/static/dike_break/rivers_list.json"
      );
      if (err)
        throw new Error(
          "load failed : /ctie.tfd.web/static/dike_break/rivers_list.json"
        );

      const rivers = [];
      _.forEach(response, o => {
        rivers.push({
          text: o.name,
          value: o
        });
      });

      commit(functions.mutations.UPDATE_BIG_RIVER_FLOODING_RIVERS, rivers);
    },
    async [functions.actions.LOAD_LAND_SLIDE](
      { dispatch, commit, getters, rootGetters },
      { storeId, level, selectedDate=null }
    ) {
      const baseDate = rootGetters[rootGetterFunctions.BASE_DATE](
        storeId
      ).clone();
      const paramDate = helper.round(
          baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );
      const parameters = {
        date: paramDate.utc().format(DATE_FORMAT),
        level: level
      };

      let [err, response] = await get(
        conf.apiServer.url,
        "/api/dosya-risk",
        parameters
      );
      if (err) throw new Error("load failed : dosya-mesh");

      const riskData = helper.localizationLandSlideResponse(response);
      commit(
        rootMutationFunctions.UPDATE_SELECTED_DATE,
        { storeId, selectedDate: selectedDate || riskData.baseDate },
        { root: true }
      );
      commit(functions.mutations.UPDATE_LAND_SLIDE, riskData);
    },
    async [functions.actions.LOAD_LAND_SLIDE_MESH](
      { dispatch, commit, getters, rootGetters },
      storeId
    ) {
      const baseDate = rootGetters[rootGetterFunctions.BASE_DATE](
        storeId
      ).clone();
      const paramDate = helper.round(
          baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );
      const parameters = {
        date: paramDate.utc().format(DATE_FORMAT),
        level: 1
      };

      let [err, response] = await get(
        conf.apiServer.url,
        "/api/dosya-mesh",
        parameters
      );
      if (err) throw new Error("load failed : dosya-mesh");

      const riskData = helper.localizationLandSlideMeshResponse(response);
      commit(
        rootMutationFunctions.UPDATE_SELECTED_DATE,
        { storeId, selectedDate: riskData.baseDate },
        { root: true }
      );
      commit(functions.mutations.UPDATE_LAND_SLIDE_MESH, riskData);
    },
    async [functions.actions.LOAD_FLOODING_HISTORY](
      { dispatch, commit, getters, rootGetters },
      bounds
    ) {
      let [err, response] = await get(
        conf.apiServer.url,
        "/api/flood_history/search",
        {
          startX: bounds._southWest.lng,
          startY: bounds._southWest.lat,
          endX: bounds._northEast.lng,
          endY: bounds._northEast.lat
        }
      );
      if (err) throw new Error("load failed : /flood_history/search");

      commit(functions.mutations.UPDATE_FLOODING_HISTORY, response);
    },
    async [functions.actions.PUSH_FLOODING_HISTORY](
      { dispatch, commit, getters, rootGetters },
      { coordinates, inout, reason, source, remark }
    ) {
      const reqCoordinates = _.map(coordinates, coordinate => {
        return _.reverse(Object.assign([], coordinate));
      });

      let [err, response] = await post(
        conf.apiServer.url,
        "/api/flood_history/regist",
        {
          coordinates: reqCoordinates,
          properties: {
            日時: moment.utc().format(DATE_FORMAT),
            内外水: inout,
            原因: reason,
            出典: source,
            備考: remark
          }
        }
      );

      if (!err) {
        const floodHistory = getters[functions.getters.FIND_RISK](
          Risk.FLOODING_HISTORY
        ).data;
        floodHistory.push(response.ops[0]);
        commit(functions.mutations.UPDATE_FLOODING_HISTORY, floodHistory);
      }

      return { err, response };
    },
    async [functions.actions.UPDATE_FLOODING_HISTORY](
        { dispatch, commit, getters, rootGetters },
        { _id, coordinates, inout, reason, source, remark }
    ) {
      const reqCoordinates = _.map(coordinates, coordinate => {
        return _.reverse(Object.assign([], coordinate));
      });

      let [err, response] = await post(
          conf.apiServer.url,
          "/api/flood_history/update",
          {
            _id: _id,
            coordinates: reqCoordinates,
            properties: {
              日時: moment.utc().format(DATE_FORMAT),
              内外水: inout,
              原因: reason,
              出典: source,
              備考: remark
            }
          }
      );

      return { err, response };
    },
    async [functions.actions.DELETE_FLOODING_HISTORY](
      { dispatch, commit, getters, rootGetters },
      { _id }
    ) {
      let [err, response] = await post(
        conf.apiServer.url,
        "/api/flood_history/remove",
        {
          _id: _id
        }
      );

      if (!err) {
        const floodHistory = getters[functions.getters.FIND_RISK](
          Risk.FLOODING_HISTORY
        ).data;
        _.remove(floodHistory, o => {
          return _id === o._id;
        });
        commit(functions.mutations.UPDATE_FLOODING_HISTORY, floodHistory);
      }

      return { err, response };
    }
  }
};
