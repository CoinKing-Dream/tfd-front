import conf from "../config";
import _ from "lodash";
export const Feature = {
  RIVER: {
    index: 1,
    key: "river",
    string: "河川",
    group: "地理情報",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/river/{z}/{x}/{y}.png`
  },
  RAILWAY: {
    index: 2,
    key: "railway",
    string: "JR・私鉄",
    group: "地理情報",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/railway/{z}/{x}/{y}.png`
  },
  SUBWAY: {
    index: 3,
    key: "subway",
    string: "地下鉄",
    group: "地理情報",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/subway/{z}/{x}/{y}.png`
  },
  ADMIN_AREA: {
    index: 4,
    key: "adminArea",
    string: "行政区域",
    group: "地理情報",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/admin-area/{z}/{x}/{y}.png`
  },
  FIRE_STATION: {
    index: 5,
    key: "fireStation",
    string: "消防署",
    group: "地物",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/fire-station/{z}/{x}/{y}.png`
  },
  FIRE_JURISDICTION: {
    index: 6,
    key: "fireArea",
    string: "消防管轄エリア",
    group: "地理情報",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/fire-jurisdiction/{z}/{x}/{y}.png`
  },
  MEDICAL: {
    index: 7,
    key: "medical",
    string: "医療機関",
    group: "地物",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/medical/{z}/{x}/{y}.png`
  },
  HYDRANT: {
    index: 8,
    key: "hydrant",
    string: "消火栓",
    group: "地物",
    url: [
      `${conf.staticServer.url}/ctie.tfd.web/static/tile/hydrant1/{z}/{x}/{y}.png`,
      `${conf.staticServer.url}/ctie.tfd.web/static/tile/hydrant2/{z}/{x}/{y}.png`,
      `${conf.staticServer.url}/ctie.tfd.web/static/tile/hydrant3/{z}/{x}/{y}.png`
    ]
  },
  GOVERNMENT: {
    index: 9,
    key: "government",
    string: "行政機関",
    group: "地物",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/government/{z}/{x}/{y}.png`
  },
  WELFARE_FACILITY: {
    index: 10,
    key: "welfareFacility",
    string: "福祉施設",
    group: "地物",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/welfare-facility/{z}/{x}/{y}.png`
  },
  EVACUATION_CENTER: {
    index: 11,
    key: "evacuationCenter",
    string: "避難場所",
    group: "防災",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/evacuation-center/{z}/{x}/{y}.png`
  },
  SUIBOU: {
    index: 12,
    key: "suibou",
    string: "重要水防箇所",
    group: "防災",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/suibou/{z}/{x}/{y}.png`
  },
  UNDER_PATH: {
    index: 13,
    key: "underPath",
    string: "道路冠水危険箇所",
    group: "防災",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/under-path/{z}/{x}/{y}.png`
  },

  SAND_WARNING_AREA: {
    index: 14,
    key: "sandArea",
    string: "土砂災害警戒区域",
    group: "防災",
    url: [
      "https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki_data/13/{z}/{x}/{y}.png",
      "https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki_data/13/{z}/{x}/{y}.png",
      "https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki_data/13/{z}/{x}/{y}.png"
    ]
  },
  SAND_DANGER_AREA: {
    index: 15,
    key: "sandDangerArea",
    string: "土砂災害危険箇所",
    group: "防災",
    url: [
      "https://disaportaldata.gsi.go.jp/raster/05_dosekiryukikenkeiryu_data/13/{z}/{x}/{y}.png",
      "https://disaportaldata.gsi.go.jp/raster/05_kyukeisyachihoukai_data/13/{z}/{x}/{y}.png",
      "https://disaportaldata.gsi.go.jp/raster/05_jisuberikikenkasyo_data/13/{z}/{x}/{y}.png"
    ]
  },
  DEPTH: {
    index: 15,
    key: "depth",
    string: "高潮浸水想定区域",
    group: "防災",
    url: `${conf.staticServer.url}/ctie.tfd.web/static/tile/depth/{z}/{x}/{y}.png`
  },

  getFeatureFromIndex(index) {
    return _.find(this, feature => {
      return _.isMatch(feature, { index: index });
    });
  }
};
