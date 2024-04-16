<template>
  <div class="analysis">
    <div class="" :class="{ footer: true, 'training-mode': trainingMode }">
      <div class="map-title">
        <v-row v-if="selectedRisk" no-gutters align="center" justify="center">
          <v-col cols="auto">
            {{ selectedRisk.type.string }}
          </v-col>
        </v-row>
      </div>
      <v-row no-gutters align="center" justify="end">
        <v-col>
          <v-btn x-small class="ma-2" text @click="close" color="white">
            <v-icon left>mdi-chevron-left</v-icon> ダッシュボード
          </v-btn>
        </v-col>
        <v-col cols="auto" class="alert-area mr-2">
          <v-badge
            :content="notReadAlertCount"
            :value="notReadAlertCount"
            color="red"
            overlap
            left
            offset-x="10"
            offset-y="15"
          >
            <v-btn small icon @click="onClickMessage">
              <v-icon size="18" color="white">mdi-message-alert</v-icon>
            </v-btn>
          </v-badge>
          <div v-if="showMessageBox" class="alert-warning-area py-2">
            <alert-warning></alert-warning>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="maps-area">
      <v-row no-gutters align="stretch">
        <v-col>
          <analysis-map ref="leftMap" :store-id="leftStoreId"></analysis-map>
        </v-col>
        <v-col class="multiple-map-control-area" cols="auto">
          <multiple-map-control
            @change-show="toggleMultiMapShow"
            @change-sync="toggleMultiMapSync"
          ></multiple-map-control>
        </v-col>
        <v-col v-if="multiMapShow">
          <analysis-map ref="rightMap" :store-id="rightStoreId"></analysis-map>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { BaseTile } from "../../enums/BaseTile";
import { Risk } from "../../enums/Risk";
import { rootGetters, rootMutations } from "../../store/store-functions";

import AnalysisMap from "./analysis-map/AnalysisMap";
import MultipleMapControl from "./MultipleMapControl";
import AlertWarning from "../../components/AlertWarning";
export default {
  name: "Analysis",
  components: { AlertWarning, MultipleMapControl, AnalysisMap },
  data() {
    return {
      urlParameters: {
        selectedBaseTile: BaseTile.GRAY,
        selectedRiskType: Risk.RAIN,
        baseDate: moment()
      },
      leftStoreId: this._uid,
      rightStoreId: this._uid + 1,
      messages: 3,
      showMessageBox: false,
      autoUpdateInterval: null
    };
  },
  computed: {
    leftMapObject() {
      return this.$store.getters[rootGetters.MAP_OBJECT](this.leftStoreId);
    },
    selectedRisk() {
      return this.$store.getters[rootGetters.SELECTED_RISK](this.leftStoreId);
    },
    multiMapShow() {
      return this.$store.getters[rootGetters.MULTI_MAP_SHOW];
    },
    multiMapSync() {
      return this.$store.getters[rootGetters.MULTI_MAP_SYNC];
    },
    alertCheckDate() {
      return this.$store.getters[rootGetters.ALERT_CHECK_DATE];
    },
    alerts() {
      return this.$store.getters[rootGetters.ALERTS];
    },
    notReadAlertCount() {
      if (!this.alertCheckDate) {
        return this.alerts.length;
      }
      const notRead = _.filter(this.alerts, alert => {
        return (
          this.alertCheckDate.diff(moment(alert.time, "YYYY/MM/DD HH:mm")) <= 0
        );
      });

      return notRead.length;
    },
    hasChangeDate() {
      return this.$store.getters[rootGetters.HAS_CHANGE_DATE];
    },
    trainingMode() {
      return this.$store.getters[rootGetters.TRAINING_MODE];
    }
  },
  watch: {
    hasChangeDate() {
      if (this.hasChangeDate) {
        clearInterval(this.autoUpdateInterval);
      } else {
        this.autoUpdate();
      }
    }
  },
  created() {
    if (typeof this.$route.query.training !== "undefined") {
      this.$store.commit(
        rootMutations.UPDATE_TRAINING_MODE,
        this.$route.query.training === 'true'
      );

      const query = Object.assign({}, this.$route.query);
      delete query.training;
      this.$router.replace({ query });
    }
    if (typeof this.$route.query.tile !== "undefined") {
      this.urlParameters.selectedBaseTile = BaseTile.getBaseTileFromIndex(
        parseInt(this.$route.query.tile)
      );
    }
    if (typeof this.$route.query.risk !== "undefined") {
      this.urlParameters.selectedRiskType = Risk.getRiskFromIndex(
        parseInt(this.$route.query.risk)
      );
    }
    if (typeof this.$route.query.baseDate !== "undefined") {
      this.urlParameters.baseDate = moment(
        parseInt(this.$route.query.baseDate),
        "X"
      );
      const query = Object.assign({}, this.$route.query);
      delete query.baseDate;
      this.$router.replace({ query });
    }

    this.initMapData(this.leftStoreId, this.urlParameters);
    this.initMapData(this.rightStoreId, this.urlParameters);
  },
  mounted() {
    this.autoUpdate();
    if (this.hasChangeDate) {
      clearInterval(this.autoUpdateInterval);
    }
  },
  methods: {
    to() {
      clearInterval(this.autoUpdateInterval);
      this.resetRiskData();
      this.removeMapData(this.leftStoreId);
      this.removeMapData(this.rightStoreId);

      this.$nextTick(() => {
        this.$router.push({
          path: "dashboard"
        });
      });
    },
    close() {
      window.close();
    },
    toggleMultiMapShow() {
      this.$store.commit(
        rootMutations.UPDATE_MULTI_MAP_SHOW,
        !this.multiMapShow
      );
      this.$nextTick(() => {
        this.leftMapObject.invalidateSize();
      });
    },
    toggleMultiMapSync() {
      this.$store.commit(
        rootMutations.UPDATE_MULTI_MAP_SYNC,
        !this.multiMapSync
      );
    },
    onClickMessage() {
      if (this.showMessageBox) {
        this.$store.commit(rootMutations.UPDATE_ALERT_CHECK_DATE, moment());
      }
      this.showMessageBox = !this.showMessageBox;
    },
    initMapData(storeId, mapData) {
      this.$store.commit(rootMutations.INIT_MAP_DATA, { storeId, mapData });
    },
    removeMapData(storeId) {
      this.$store.commit(rootMutations.REMOVE_MAP_DATA, storeId);
    },
    resetRiskData() {
      this.$store.commit(rootMutations.RESET_ALL_RISK_DATA);
    },
    autoUpdate() {
      this.autoUpdateInterval = setInterval(() => {
        const date = moment();
        this.updateBaseDate(date);
      }, 1000 * 60 * 5);
    },
    updateBaseDate(date) {
      this.baseDate = date;
      this.$store.commit(rootMutations.UPDATE_BASE_DATE, {
        storeId: this.leftStoreId,
        baseDate: date
      });
      this.$store.commit(rootMutations.UPDATE_BASE_DATE, {
        storeId: this.rightStoreId,
        baseDate: date
      });
    }
  }
};
</script>
<style lang="scss">
.footer {
  .v-badge__badge {
    height: 16px;
    min-height: 16px;
    font-size: 10px;
  }
}
</style>
<style lang="scss" scoped>
@import "../../common";
$footer-height: 35px;

.analysis {
  width: 100vw;
  height: 100vh;

  .maps-area {
    width: 100%;
    height: calc(100% - #{$footer-height});

    > div {
      height: 100%;
    }

    .multiple-map-control-area {
      z-index: 1600;
    }
  }
  .footer {
    height: $footer-height;
    background-color: #0d47a1;
    position: relative;

    > div {
      height: 100%;

      a {
        font-size: 11px;
        font-weight: bold;
        color: $base-color-1;
        margin-left: 10px;
        margin-right: 10px;
      }
    }

    .map-title {
      position: absolute;
      color: white;
      font-size: 25px;
      font-weight: bold;
      text-align: center;
      height: 100%;
      width: 100%;

      .row {
        height: 100%;
      }
    }

    .alert-area {
      position: relative;
      .alert-warning-area {
        height: 90vh;
        z-index: 2000;
        position: absolute;
        background-color: #2c3e50;
        top: 100%;
        right: -2px;
        margin-top: 12px;
        width: 265px;
      }
      .alert-warning-area:after {
        content: "";
        position: absolute;
        top: -18px;
        right: 10px;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-bottom-color: #2c3e50;
      }
    }
  }
  .training-mode {
    background-color: #631d21;
  }
}
</style>
