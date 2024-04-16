<template>
  <div class="warning-status-viewer">
    <v-chip
      small
      :color="getColor(topLevel)"
      @click="showDetail = !showDetail"
      >{{ getTopWarning(topLevel) }}</v-chip
    >
    <div v-if="showDetail" class="warnings-area pa-4 mt-2">
      <div class="base-date" v-if="updateDate">
        {{ updateDate.format("MM/DD HH:mm") }} 更新
      </div>
      <template v-for="(area, areaIndex) in areas">
        <v-row
          no-gutters
          class="row pa-2 mb-2"
          :key="areaIndex"
          v-if="area.warnings.length > 0"
        >
          <v-col cols="3">
            {{ area.town }}
          </v-col>
          <v-col>
            <v-chip
              v-for="(o, warningIndex) in area.warnings"
              :key="warningIndex"
              small
              class="mx-1"
              :color="getColor(o.level)"
            >
              {{ o.warning }}
            </v-chip>
          </v-col>
        </v-row>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { rootGetters, rootMutations } from "../../../../store/store-functions";
import _ from "lodash";
import config from "../../../../config";
import moment from "moment";

export default {
  name: "WarningStatusViewer",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      areas: [],
      showDetail: false,
      topLevel: -1,
      updateDate: null
    };
  },
  computed: {
    alerts() {
      return this.$store.getters[rootGetters.ALERTS];
    }
  },
  watch: {
    alerts() {
      this.loadWarnings();
    }
  },
  created() {
    this.loadWarnings();
  },
  methods: {
    loadWarnings() {
      axios
        .create({
          responseType: "json",
          baseURL: config.apiServer.url
        })
        .get("/api/warnings")
        .then(response => {
          this.areas = response.data.data;
          this.updateDate = moment
            .utc(response.data.updateDate, "YYYY/MM/DD HH:mm")
            .local();
          let topLevel = -1;
          _.forEach(this.areas, area => {
            _.forEach(area.warnings, warning => {
              if (warning.level > topLevel) {
                topLevel = warning.level;
              }
            });
          });
          this.topLevel = topLevel;
        });
    },
    getColor(level) {
      let color;
      switch (level) {
        case 0:
          color = "yellow";
          break;
        case 1:
          color = "red";
          break;
        case 2:
          color = "pink";
          break;
      }
      return color;
    },
    getTopWarning(level) {
      let warning;
      switch (level) {
        case -1:
          warning = "発令中警報なし";
          break;
        case 0:
          warning = "注意報発令中";
          break;
        case 1:
          warning = "警報発令中";
          break;
        case 2:
          warning = "特別警報発令中";
          break;
      }
      return warning;
    }
  }
};
</script>

<style lang="scss" scoped>
.warning-status-viewer {
  position: relative;
  .warnings-area {
    z-index: 1501;
    position: absolute;
    text-align: left;
    top: 100%;
    right: 0;
    width: 280px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 14px;
    height: 300px;
    overflow-y: scroll;
    .base-date {
      font-weight: bold;
      text-align: center;
      font-size: 20px;
    }
    .row {
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
