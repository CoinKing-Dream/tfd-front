import {rootData as functions, rootGetters as rootGetterFunctions} from "./store-functions";
import moment from "moment";
import conf from "../config";
import { get } from "./apiAxios";
import _ from "lodash";
import {Risk} from "../enums/Risk";
const DATE_FORMAT = "YYYY/MM/DD HH:mm";
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
          if (level <= -998) {
            return null;
          }
          return level.toFixed(2);
        });
      }
      if (o.rains) {
        observatory.rains = [];
        observatory.rains = _.map(o.rains, rainfall => {
          if (rainfall <= -998) {
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

      riskData.push(observatory);
    });

    return riskData;
  },
  stringDateToLocalMoment(string) {
    return moment.utc(string, DATE_FORMAT);
  },
  round(date, duration, method) {
    return moment(Math[method](+date / +duration) * +duration);
  },
};
export const store = {
  namespaced: true,
  state: {
    multiMapShow: false,
    multiMapSync: true,
    alerts: [],
    listening: true,
    baseDate: moment(),
    alertCheckDate: null,
    hasChangeDate: false,
    userInfo: null,
    linkedObservatories: null
  },
  getters: {
    [functions.getters.MULTI_MAP_SHOW](state) {
      return state.multiMapShow;
    },
    [functions.getters.MULTI_MAP_SYNC](state) {
      return state.multiMapSync;
    },
    [functions.getters.ALERTS](state) {
      return state.alerts;
    },
    [functions.getters.ALERT_BASE_DATE](state) {
      return state.baseDate;
    },
    [functions.getters.ALERT_LISTENING](state) {
      return state.listening;
    },
    [functions.getters.ALERT_CHECK_DATE](state) {
      return state.alertCheckDate;
    },
    [functions.getters.HAS_CHANGE_DATE](state) {
      return state.hasChangeDate;
    },
    [functions.getters.USER_INFO](state) {
      return state.userInfo;
    },
    [functions.getters.LINKED_OBSERVATORY_DATA](state) {
      return state.linkedObservatories;
    }
  },
  mutations: {
    [functions.mutations.UPDATE_MULTI_MAP_SHOW](state, data) {
      state.multiMapShow = data;
    },
    [functions.mutations.UPDATE_MULTI_MAP_SYNC](state, data) {
      state.multiMapSync = data;
    },
    [functions.mutations.UPDATE_ALERTS](state, data) {
      state.alerts = data;
    },
    [functions.mutations.UPDATE_ALERT_LISTENING](state, data) {
      state.listening = data;
    },
    [functions.mutations.UPDATE_ALERT_BASE_DATE](state, data) {
      state.baseDate = data;
    },
    [functions.mutations.UPDATE_ALERT_CHECK_DATE](state, data) {
      state.alertCheckDate = data;
      localStorage.setItem(
        "alertLastCheckDate",
        data.format("YYYY/MM/DD HH:mm")
      );
    },
    [functions.mutations.UPDATE_HAS_CHANGE_DATE](state, data) {
      state.hasChangeDate = data;
    },
    [functions.mutations.UPDATE_USER_INFO](state, data) {
      state.userInfo = data;
    },
    [functions.mutations.UPDATE_LINKED_OBSERVATORY_DATA](state, data) {
      state.linkedObservatories = data;
    }
  },
  actions: {
    async [functions.actions.LOAD_USER_INFO]({
      dispatch,
      commit,
      getters,
      rootGetters
    }) {
      const parameters = {
        mode: "all"
      };

      let [err, response] = await get(
        conf.apiServer.url,
        "/api/observatoryLink/get",
        parameters
      );
      if (err) throw new Error("load failed : /api/observatoryLink/get");

      commit(functions.mutations.UPDATE_USER_INFO, {
        name: response.userInfo.name,
        rainfallWarningVisible: response.userInfo.rain10WarningUseing,
        rainfallDangerVisible: response.userInfo.rain10AlarmUseing,
        rainfallWarningLimit: response.userInfo.rain10Warning,
        rainfallDangerLimit: response.userInfo.rain10Alarm,
        mainObservatoryId: response.userInfo.waterCenterId,
        riverLevelObservatories: response.waterList,
        rainfallObservatories: response.rainList,
      });
    },
    async [functions.actions.LOAD_LINKED_OBSERVATORY_DATA](
      { dispatch, commit, getters, rootGetters },
      { baseDate }
    ) {
      const paramDate = helper.round(
          baseDate.clone(),
          moment.duration(5, "minutes"),
          "floor"
      );
      const parameters = {
        date: paramDate.utc().format("YYYY/MM/DD HH:mm"),
      };
      let [err, response] = await get(
        conf.apiServer.url,
        "/api/observatoryLink/list",
        parameters
      );
      if (err) throw new Error("load failed : suii");

      response.waterResult = helper.localizationObservatoryDataResponse(response.waterResult);
      response.rainResult= helper.localizationObservatoryDataResponse(response.rainResult);

      commit(functions.mutations.UPDATE_LINKED_OBSERVATORY_DATA, response);

      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }
  }
};
