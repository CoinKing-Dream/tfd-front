<template>
  <l-geo-json
    :geojson="geojson"
    :options="{ style: styleFunction }"
  ></l-geo-json>
</template>
<script>
import {
  rootActions,
  rootGetters,
  rootMutations
} from "../../../store/store-functions";
import _ from "lodash";
import { LGeoJson } from "vue2-leaflet";

import { Risk } from "../../../enums/Risk";
import axios from "axios";
import moment from "moment";

export default {
  name: "RiverRiskDistributionLayer",
  components: {
    LGeoJson
  },
  inject: {
    baseMapData: {
      default: []
    }
  },
  data() {
    return {
      geojson: null
    };
  },
  computed: {
    map() {
      return this.$store.getters[rootGetters.MAP_OBJECT](
        this.baseMapData.storeId
      );
    },
    selectedDate() {
      return this.$store.getters[rootGetters.SELECTED_DATE](
        this.baseMapData.storeId
      );
    },
    riverRiskDistributionRisk() {
      return this.$store.getters[rootGetters.FIND_RISK](
        Risk.RIVER_RISK_DISTRIBUTION
      );
    },
    selectedDateRiskData() {
      return _.find(this.riverRiskDistributionRisk.data.contents, o => {
        return this.selectedDate.isSame(moment.utc(o.date, "YYYY/MM/DD HH:mm"));
      });
    },
    baseDate() {
      return this.$store.getters[rootGetters.BASE_DATE](
        this.baseMapData.storeId
      );
    }
  },
  watch: {
    async selectedDateRiskData() {
      if (this.selectedDateRiskData) {
        let [err, json] = await this.loadJson(this.selectedDateRiskData.url);
        if (err) throw new Error("load failed : /river-risk");

        this.geojson = _.orderBy(
          json.features,
          [
            o => {
              return o.properties && o.properties.FLOODFCST;
            }
          ],
          ["desc"]
        );
      }
    },
    baseDate() {
      this.loadData();
    }
  },
  created() {
    this.loadData();
  },
  mounted() {
    // todo:ここでいい？
    this.$nextTick(() => {
      this.showColorLegend();
    });
  },
  beforeDestroy() {
    //todo リセット方法改善
    this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
      storeId: this.baseMapData.storeId,
      colorLegend: {
        unit: null,
        colors: []
      }
    });
  },
  methods: {
    loadData() {
      this.$store.dispatch(
        rootActions.LOAD_RIVER_RISK_DISTRIBUTION,
        this.baseMapData.storeId
      );
    },
    styleFunction(feature) {
      const style = {
        weight: 3,
        color: "#4ffeff",
        opacity: 1,
        fillColor: "#4ffeff",
        fillOpacity: 0.2,
        "fill-outline-color": "rgba(255,255,255,0.0)",
        outlineColor: "blue"
      };

      if (feature.properties.FLOODRISK) {
        switch (parseInt(feature.properties.FLOODRISK)) {
          case 1:
            style.color = "rgba(242,231,0)";
            style.fillColor = "rgba(242,231,0)";
            break;
          case 2:
            style.color = "rgba(255,40,0)";
            style.fillColor = "rgba(255,40,0)";
            break;
          case 3:
            style.color = "rgba(170,0,170)";
            style.fillColor = "rgba(170,0,170)";
            break;
          case 4:
            style.color = "rgba(12,0,12)";
            style.fillColor = "rgba(12,0,12)";
            break;
        }
      }
      if (feature.properties.FLOODFCST) {
        style.weight = 10;
        switch (parseInt(feature.properties.FLOODFCST)) {
          case 2:
            style.color = "rgba(242,231,0)";
            style.fillColor = "rgba(242,231,0)";
            break;
          case 3:
            style.color = "rgba(255,40,0)";
            style.fillColor = "rgba(255,40,0)";
            break;
          case 4:
            style.color = "rgba(170,0,170)";
            style.fillColor = "rgba(170,0,170)";
            break;
          case 5:
            style.color = "rgba(12,0,12)";
            style.fillColor = "rgba(12,0,12)";
            break;
        }
      }
      return style;
    },
    async loadJson(url) {
      return axios
        .create({
          responseType: "json"
        })
        .get(url)
        .then(response => {
          return [null, response.data];
        })
        .catch(err => [err]);
    },
    showColorLegend() {
      // 【】の内の警戒レベルはFLOODFCSTやFLOODRISKとズレがある
      this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
        storeId: this.baseMapData.storeId,
        colorLegend: [
          {
            title: "洪水警報の危険度分布",
            colors: [
              { color: "rgba(12,0,12)", value: "災害切迫　　【5】" },
              { color: "rgba(170,0,170)", value: "危険　　　　【4】" },
              { color: "rgba(255,40,0)", value: "警戒　　　　【3】" },
              { color: "rgba(242,231,0)", value: "注意　　　　【2】" },
              { color: "rgba(60,255,255)", value: "今後の情報等に留意" }
            ],
            text: "※【 】内は相当する警戒レベル"
          },
          {
            title: "指定河川洪水予報",
            colors: [
              { color: "rgba(12,0,12)", value: "氾濫発生情報　【5】" },
              { color: "rgba(170,0,170)", value: "氾濫危険情報　【4】" },
              { color: "rgba(255,40,0)", value: "氾濫警戒情報　【3】" },
              { color: "rgba(242,231,0)", value: "氾濫注意情報　【2】" },
              { color: "rgba(60,255,255)", value: "発表なし" }
            ],
            text: "※【 】内は相当する警戒レベル"
          }
        ]
      });
    }
  }
};
</script>

<style scoped></style>
