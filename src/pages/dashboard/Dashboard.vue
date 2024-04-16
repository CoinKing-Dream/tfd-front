<template>
  <div class="dashboard">
    <v-row no-gutters align="stretch" class="full-height">
      <v-col class="risks-panel">
        <div class="printer-button">
          <v-btn
            class="ma-1"
            fab
            dark
            small
            color="primary"
            @click="to('print')"
          >
            <v-icon dark>mdi-printer</v-icon>
          </v-btn>
          <v-btn
            class="ma-1"
            fab
            dark
            small
            color="#fb8c00"
            @click="dialog = true"
          >
            <v-icon dark>mdi-cog</v-icon>
          </v-btn>
        </div>
        <div class="river-level-monitor-area pa-2 pb-1">
          <v-card class="full-height">
            <river-level-monitor
              :store-id="riverLevelMonitorStoreId"
              class="full-height"
            ></river-level-monitor>
          </v-card>
        </div>
        <v-row no-gutters class="map-list-area pa-1" :class="{'system-message': sysMsg}">
          <template v-for="(map, index) in maps">
            <v-col class="pa-1" :key="index">
              <v-card class="map-card" @click="to('analysis', map)">
                <div class="map-area">
                  <base-map
                    :initial-store-id="map.storeId"
                    :read-only="true"
                    :zoom="9"
                  ></base-map>
                </div>
                <div class="info-area">
                  <v-row no-gutters align="end">
                    <v-col>{{ map.label }}</v-col>
                  </v-row>
                </div>
              </v-card>
            </v-col>
            <v-responsive
              v-if="index === 2 || index === 5"
              :key="`width-${index}`"
              width="100%"
            ></v-responsive>
          </template>
        </v-row>
        <v-row v-if="sysMsg" no-gutters align="center" class="system-message-area">
          <v-col cols="12">{{ sysMsg }}</v-col>
        </v-row>
      </v-col>
      <v-col
        cols="3"
        class="alert-panel"
        :class="{ 'training-mode': trainingMode !== '平常' }"
      >
        <v-row no-gutters class="pa-2 mb-2" align="center" justify="center">
          <div class="logo-area">
            <v-img
              :src="require('../../assets/images/logo.png')"
              width="100%"
              height="100%"
            ></v-img>
          </div>
        </v-row>
        <div class="date-area text-center mb-2">
          <v-row no-gutters justify="center" align="center">
            <v-col cols="auto">
              <datetime
                v-model="timePickerValue"
                type="datetime"
                :max-datetime="currentDate"
              >
                <template slot="button-cancel">
                  <v-btn text color="error">
                    キャンセル
                  </v-btn>
                </template>
                <template slot="button-confirm" slot-scope="scope">
                  <span v-if="scope.step === 'date'">
                    <v-btn icon color="indigo">
                      <v-icon>mdi-clock</v-icon>
                    </v-btn>
                  </span>
                  <span v-else>
                    <v-btn text color="success" @click="changeDate()">
                      確定
                    </v-btn>
                  </span>
                </template>
              </datetime>
            </v-col>
            <v-col cols="auto" class="training-mode-area">
              <v-btn
                small
                @click="trainingModeItemsShow = !trainingModeItemsShow"
                color="black"
                tile
                dark
                height="22"
                >モード</v-btn
              >
              <v-list
                v-if="trainingModeItemsShow"
                dense
                class="training-mode-list"
              >
                <v-list-item
                  v-for="(item, index) in trainingModeItems"
                  :key="index"
                  @click="updateTrainingMode(item)"
                  :class="{ active: trainingMode === item ? 'active' : '' }"
                  >{{ item }}</v-list-item
                >
              </v-list>
            </v-col>
          </v-row>
        </div>
        <div class="alert-warning-area">
          <v-row no-gutters class="tabs px-3">
            <v-col>
              <v-btn
                block
                depressed
                :color="
                  tab === 'alert'
                    ? 'rgba(0,0,0,0.4)'
                    : trainingMode === '平常'
                    ? '#12263f'
                    : '#631d21'
                "
                @click="tab = 'alert'"
              >
                <span class="orange-text">警報</span
                ><span class="white-text">タイムライン</span>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                block
                depressed
                :color="
                  tab === 'tweet'
                    ? 'rgba(0,0,0,0.4)'
                    : trainingMode === '平常'
                    ? '#12263f'
                    : '#631d21'
                "
                @click="tab = 'tweet'"
              >
                <v-icon color="white">mdi-twitter</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <div class="tab-items">
            <template v-if="tab === 'alert'">
              <alert-warning></alert-warning>
            </template>
            <template v-if="tab === 'tweet'">
              <tweet-list
                :base-date="baseDate"
                :auto-update="trainingMode === '平常'"
              ></tweet-list>
            </template>
          </div>
          <div class="mt-2">
            <weather-forecast :base-date="baseDate"></weather-forecast>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <settings @close-dialog="dialog = false"></settings>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import { Datetime } from "vue-datetime";
import { BaseTile } from "../../enums/BaseTile";
import { Risk } from "../../enums/Risk";

import { rootMutations } from "../../store/store-functions";

import BaseMap from "../../components/base-map/BaseMap";
import AlertWarning from "../../components/AlertWarning";
import RiverLevelMonitor from "./RiverLevelMonitor";
import TweetList from "./TweetList";
import { LMap, LTileLayer } from "vue2-leaflet";
import Settings from "../settings/Settings";
import WeatherForecast from "./WeatherForecast";
import axios from "axios";

export default {
  name: "Dashboard",
  components: {
    WeatherForecast,
    Settings,
    TweetList,
    RiverLevelMonitor,
    AlertWarning,
    BaseMap,
    LMap,
    LTileLayer,
    Datetime
  },
  data() {
    return {
      sysMsg: null,
      dialog: false,
      tab: "alert",
      baseDate: moment(),
      timePickerValue: moment().toISOString(),
      currentDate: moment().toISOString(),
      autoUpdateInterval: null,
      trainingMode: "平常",
      trainingModeItems: ["平常", "(訓練モード)台風", "(訓練モード)線状降水帯"],
      trainingModeItemsShow: false,
      riverLevelMonitorStoreId: -1,
      maps: [
        {
          storeId: -1,
          label: Risk.X_RAIN.string,
          risk: Risk.X_RAIN,
          lastUpdated: "1 hours ago",
          baseTile: BaseTile.GRAY
        },
        {
          storeId: -1,
          label: Risk.WIND.string,
          risk: Risk.WIND,
          lastUpdated: "1 hours ago",
          baseTile: BaseTile.PHOTO
        },
        {
          storeId: -1,
          label: Risk.RAIN.string,
          risk: Risk.RAIN,
          lastUpdated: "1 hours ago",
          baseTile: BaseTile.WHITE
        },
        {
          storeId: -1,
          label: Risk.BIG_RIVER_FLOODING.string,
          risk: Risk.BIG_RIVER_FLOODING,
          lastUpdated: "1 hours ago",
          baseTile: BaseTile.WHITE
        },
        {
          storeId: -1,
          label: Risk.SMALL_RIVER_FLOODING.string,
          risk: Risk.SMALL_RIVER_FLOODING,
          lastUpdated: "1 hours ago",
          baseTile: BaseTile.GRAY
        },
        {
          storeId: -1,
          label: Risk.LAND_SLIDE.string,
          risk: Risk.LAND_SLIDE,
          lastUpdated: "1 hours ago",
          baseTile: BaseTile.STANDARD
        }
      ],
      subWindow: null
    };
  },
  watch: {
    trainingMode() {
      this.$store.commit(
        rootMutations.UPDATE_ALERT_LISTENING,
        this.trainingMode === "平常"
      );
    },
    timePickerValue() {
      if (!this.timePickerValue) {
        // timePickerValue is undefined
        return;
      }
      this.updateBaseDate(moment(this.timePickerValue));
    }
  },
  created() {
    this.$store.commit(rootMutations.UPDATE_ALERT_BASE_DATE, this.baseDate);
    this.$store.commit(
      rootMutations.UPDATE_ALERT_LISTENING,
      this.trainingMode === "平常"
    );

    _.forEach(this.maps, (map, index) => {
      map.storeId = this._uid + index;
      const mapData = {
        selectedBaseTile: map.baseTile,
        selectedRiskType: map.risk
      };

      this.initMapData(map.storeId, mapData);
    });
    this.riverLevelMonitorStoreId = this._uid + this.maps.length;
    this.initMapData(this.riverLevelMonitorStoreId, {
      selectedBaseTile: BaseTile.GRAY,
      selectedRiskType: Risk.OBSERVATORY
    });
  },
  mounted() {
    this.loadServiceStatusJson();
    this.autoUpdate();
  },
  methods: {
    to(path, mapInfo) {
      const target = "tfd-sub";
      const subWindow = window.open("", target, "", true);
      const pastHref = subWindow.location.href;
      let url = `${window.location.origin}/index.html#/${path}`;
      if (path === "analysis") {
        url = `${window.location.origin}/index.html#/${path}?tile=${
          mapInfo.baseTile.index
        }&risk=${mapInfo.risk.index}&baseDate=${this.baseDate.format("X")}`;
      }

      if (pastHref !== "about:blank") {
        subWindow.close();
        window.open(url, target, "", true);
      } else {
        subWindow.location.href = url;
      }
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
        this.loadServiceStatusJson();
      }, 1000 * 60 * 5);
    },
    updateBaseDate(date) {
      this.baseDate = date;
      this.timePickerValue = date.toISOString();
      this.$store.commit(rootMutations.UPDATE_BASE_DATE, {
        storeId: this.riverLevelMonitorStoreId,
        baseDate: date
      });
      _.forEach(this.maps, map => {
        this.$store.commit(rootMutations.UPDATE_BASE_DATE, {
          storeId: map.storeId,
          baseDate: date
        });
      });
      this.$store.commit(rootMutations.UPDATE_ALERT_BASE_DATE, this.baseDate);
    },
    updateTrainingMode(item) {
      this.resetRiskData();
      switch (item) {
        case "平常":
          this.autoUpdate();
          this.timePickerValue = moment().toISOString();
          break;
        case "(訓練モード)台風":
          this.changeDate();
          this.timePickerValue = moment(
            "2016/08/22 01:00",
            "YYYY/MM/DD HH:mm"
          ).toISOString();
          break;
        case "(訓練モード)線状降水帯":
          this.changeDate();
          this.timePickerValue = moment(
            "2015/09/09 00:00",
            "YYYY/MM/DD HH:mm"
          ).toISOString();
          break;
      }
      this.trainingMode = item;
      this.trainingModeItemsShow = false;
    },
    changeDate() {
      // 時刻変更時は自動更新を停止
      clearInterval(this.autoUpdateInterval);
      this.$store.commit(rootMutations.UPDATE_HAS_CHANGE_DATE, true);
    },
    async loadServiceStatusJson() {
      return axios
        .create({
          responseType: "json"
        })
        .get(
          "https://s3-ap-northeast-1.amazonaws.com/ctie.tfd.web/system/sys_msg.json",
          {
            params: {
              ts: moment().unix()
            }
          }
        )
        .then(response => {
          if (response.data && response.data.msg) {
            this.sysMsg = response.data.msg;
          } else {
            this.sysMsg = null;
          }
        })
        .catch(err => {
          this.sysMsg = null;
          return err;
        });
    }
  }
};
</script>
<style lang="scss">
.date-area {
  .vdatetime-input {
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
@import "../../common";
.dashboard {
  width: 100vw;
  height: 100vh;
  background-color: #fbfbfb;

  .sub-title {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
  }
  .risks-panel {
    height: 100%;
    overflow-x: hidden;
    position: relative;
    .printer-button {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1500;
    }
    .river-level-monitor-area {
      height: 35vh;
    }
    .map-list-area {
      height: (100vh - 35vh);
      .map-area {
        height: calc((100vh - 35vh) / 2 - 16px);
      }
    }
    .map-list-area.system-message {
      height: (100vh - 40vh);
      .map-area {
        height: calc((100vh - 40vh) / 2 - 16px);
      }
    }
    .system-message-area {
      height: 5vh;
      background-color: #ff9800;
      color: black;
      font-weight: bold;
      text-align: center;
      font-size: 25px;
    }
  }

  .info-area {
    position: absolute;
    bottom: 0;
    z-index: 1500;
    width: 100%;
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.54);
    color: $base-color-1;
    font-size: 1.5rem !important;
    font-weight: 400;
  }
  .alert-panel {
    position: relative;
    height: 100%;
    background-color: $point-color-3;

    .logo-area {
      height: 105px;
      width: 260px;
      margin: 10px;
    }

    .date-area {
      position: relative;

      .vdatetime {
        color: white;
        font-weight: bold;
        font-size: 15px;
      }

      .date {
        color: white;
        font-weight: bold;
        font-size: 15px;
      }

      .training-mode-area {
        position: relative;
      }

      .training-mode-list {
        z-index: 1000;
        position: absolute;
        width: 150px;
        font-size: 12px;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
      }
      .active {
        background-color: #0d47a1;
        color: white !important;
      }
    }

    .alert-warning-area {
      width: 100%;
      height: calc(100% - 330px);
    }

    .tabs {
      text-align: center;
      .orange-text {
        color: #fb8c00;
        font-size: 15px;
        font-weight: bold;
        margin: 0 3px;
      }
      .white-text {
        color: white;
        font-size: 12px;
      }
    }
    .tab-items {
      height: calc(100%);
    }
  }
  .alert-panel.training-mode {
    background-color: #631d21;
  }
}
.full-height {
  height: 100%;
}
.half-height {
  height: 50%;
}
</style>
<style lang="scss">
@import "../../common";

.vdatetime-input {
  text-align: center;
}
.vdatetime-popup {
  z-index: 2000 !important;
}
.vdatetime-time-picker__item {
  font-size: 20px;
}
</style>
