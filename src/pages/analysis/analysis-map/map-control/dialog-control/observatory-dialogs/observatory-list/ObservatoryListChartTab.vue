<template>
  <div class="observatory-list-chart-tab">
    <v-row no-gutters class="pa-2">
      <template v-for="(observatory, index) in selectedObservatoriesView">
        <v-col :key="index" cols="4" class="pa-2">
          <!--          todo : class warning-observatory 整理-->
          <v-card
            outlined
            tile
            class="pa-2"
            :class="{
              selected: selectedObservatory._id === observatory._id,
              'warning-observatory': isDanger(observatory)
            }"
            :height="'100%'"
          >
            <div class="observatory-name text-center">
              <v-icon
                v-if="isDanger(observatory)"
                small
                class="mr-1 warning-icon"
                >mdi-alert</v-icon
              >
              {{ getRiver(observatory.riverAreaId) }}
              {{ observatory.name }}
              <span v-if="observatory.type === '水門'"
                >/{{ getWaterGateStatus(observatory) }}</span
              >
            </div>
            <div @click="updateSelectedObservatory(observatory)">
              <river-level-chart
                v-if="observatory.type === '水位'"
                :height="150"
                :observatory-id="observatory._id"
                :init-river-levels="observatory.riverLevels"
                :standby-level="observatory.standbyLevel"
                :warning-level="observatory.warningLevel"
                :evacuation-level="observatory.evacuationLevel"
                :dangerous-level="observatory.dangerousLevel"
                :outbreak-level="observatory.outbreakLevel"
                :landform="observatory.landform"
                :init-times="observatory.times"
                :base-date="observatory.baseDate"
                :mini-mode="true"
              ></river-level-chart>
              <rain-chart
                v-else-if="observatory.type === '雨量'"
                :height="150"
                :mini-mode="true"
                :rains="observatory.rains"
                :total-rains="observatory.totalRains"
                :times="observatory.times"
                :base-date="observatory.baseDate"
              ></rain-chart>
              <retarding-basin-chart
                v-else-if="observatory.type === '調節池'"
                :height="150"
                :observatory-id="observatory._id"
                :max-storage="parseFloat(observatory.maxStorage)"
                :init-volumes="observatory.volumes"
                :init-times="observatory.times"
                :base-date="observatory.baseDate"
                :mini-mode="true"
              ></retarding-basin-chart>
              <water-gate-chart
                v-else-if="observatory.type === '水門'"
                :height="150"
                :observatory-id="observatory._id"
                :init-inner-levels="observatory.innerLevels"
                :init-outer-levels="observatory.outerLevels"
                :init-times="observatory.times"
                :base-date="observatory.baseDate"
                :mini-mode="true"
              ></water-gate-chart>
              <v-row
                v-else-if="observatory.type === 'カメラ'"
                no-gutters
                justify="center"
                align="center"
                class="camera-area"
              >
                <div
                  v-if="observatory.imageInfo.length === 0"
                  class="display-3"
                >
                  調整中
                </div>
                <v-img
                  v-else
                  :src="getCurrentCameraImageUrl(observatory)"
                  height="100%"
                ></v-img>
              </v-row>
            </div>
            <div class="my-1">
              <v-btn
                small
                text
                block
                @click="onClickShowDetailButton(observatory)"
              >
                詳細をみる
              </v-btn>
            </div>
          </v-card>
        </v-col>
        <v-responsive
          v-if="index === 2"
          :key="`width-${index}`"
          width="100%"
        ></v-responsive>
      </template>
    </v-row>
  </div>
</template>

<script>
import {
  rootActions,
  rootGetters,
  rootMutations
} from "../../../../../../../store/store-functions";

import RiverLevelChart from "../../../../../../../components/charts/RiverLevelChart";
import RainChart from "../../../../../../../components/charts/RainChart";
import _ from "lodash";
import RetardingBasinChart from "@/components/charts/RetardingBasinChart";
import WaterGateChart from "@/components/charts/WaterGateChart";
export default {
  name: "ObservatoryListChartTab",
  components: {WaterGateChart, RetardingBasinChart, RainChart, RiverLevelChart },
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      selectedObservatoriesView: []
    };
  },
  mounted() {
    this.updateChartList();
  },
  watch: {
    selectedObservatories() {
      this.updateChartList();
    },
  },
  computed: {
    selectedObservatory() {
      return this.$store.getters[rootGetters.SELECTED_OBSERVATORY](
        this.analysisMapData.storeId
      );
    },
    selectedObservatories() {
      return this.$store.getters[rootGetters.SELECTED_OBSERVATORIES](
        this.analysisMapData.storeId
      );
    },
    rivers() {
      return this.$store.getters[rootGetters.OBSERVATORY_RIVERS];
    }
  },
  methods: {
    updateSelectedObservatory(observatory) {
      const storeId = this.analysisMapData.storeId;
      this.$store.commit(rootMutations.UPDATE_SELECTED_OBSERVATORY, {
        storeId,
        selectedObservatory: observatory
      });
    },
    moveObservatoryDetail(observatory) {
      const storeId = this.analysisMapData.storeId;
      const dialog = {};
      switch (observatory.type) {
        case "水位":
          dialog.contents = "river-level-detail";
          break;
        case "雨量":
          dialog.contents = "rainfall-detail";
          break;
        case "カメラ":
          dialog.contents = "camera-detail";
          break;
        case "調節池":
          dialog.contents = "retarding-basin-detail";
          break;
        case "水門":
          dialog.contents = "water-gate-detail";
          break;
        default:
          break;
      }

      this.$store.commit(rootMutations.UPDATE_DIALOG, { storeId, dialog });
    },
    async onClickShowDetailButton(observatory) {
      this.updateSelectedObservatory(observatory);
      this.moveObservatoryDetail(observatory);
    },
    updateChartList() {
      this.selectedObservatoriesView = [];
      this.$nextTick(() => {
        this.selectedObservatoriesView = this.selectedObservatories;
      });
    },
    getRiver(riverAreaId) {
      const river = _.find(this.rivers, { value: riverAreaId });
      if (river) {
        return `[${river.text}]`;
      }
    },
    getCurrentCameraImageUrl(observatory) {
      return _.last(observatory.imageInfo).url;
    },
    getWaterGateStatus(o) {
      switch (o.status) {
        case -1:
          return "休止・欠測等";
        case 2:
          return "全開";
        case 1:
          return "半開";
        case 0:
          return "全閉";
      }
    },
    isDanger(observatory) {
      switch (observatory.status) {
        case "outbreak":
        case "dangerous":
          return true;
        default :
          return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.observatory-list-chart-tab {
  background-color: #f2f3f8;
}
.theme--light.v-card.selected {
  border: 1px solid red;
}
.observatory-name {
  font-size: 14px;
}
.theme--light.v-card.warning-observatory {
  background-color: rgba(#ff3f56, 0.12);
}
.warning-icon {
  animation: pulse 1s infinite;
}
.camera-area {
  height: 137px;
  color: white;
  background-color: black;
}

@keyframes pulse {
  0% {
    color: rgba(0, 0, 0, 0);
  }
  100% {
    color: rgba(orange, 1);
  }
}
</style>
