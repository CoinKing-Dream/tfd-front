import _ from "lodash";
export const Risk = {
  X_RAIN: {
    index: 0,
    key: "xRain",
    string: "気象レーダ"
  },
  OBSERVATORY: {
    index: 1,
    key: "observatory",
    string: "観測所"
  },
  WIND: {
    index: 2,
    key: "wind",
    string: "風"
  },
  RAIN: {
    index: 3,
    key: "rain",
    string: "予測降雨"
  },
  LAND_SLIDE_MESH: {
    index: 4,
    key: "landSlideMesh",
    string: "土砂災害警戒判定メッシュ(気象庁)"
  },
  LAND_SLIDE: {
    index: 5,
    key: "landSlide",
    string: "土砂災害リスク"
  },
  BIG_RIVER_FLOODING: {
    index: 6,
    key: "bigRiver",
    string: "大規模河川氾濫"
  },
  SMALL_RIVER_FLOODING: {
    index: 7,
    key: "smallRiver",
    string: "中小河川氾濫"
  },
  TYPHOON: {
    index: 9,
    key: "typhoon",
    string: "台風情報"
  },
  TIDE: {
    index: 11,
    key: "tide",
    string: "潮汐情報"
  },
  FLOODING_HISTORY: {
    index: 8,
    key: "floodingHistory",
    string: "浸水実績"
  },
  RIVER_RISK_DISTRIBUTION: {
    index: 10,
    key: "riverRiskDistribution",
    string: "河川危険度(気象庁)"
  },
  getRiskFromIndex(index) {
    return _.find(this, risk => {
      return _.isMatch(risk, { index: index });
    });
  }
};
