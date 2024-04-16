<template>
  <div>
    <div class="river-level-contents">
      <v-row no-gutters>
        <v-col>
          <div class="unit text-right">
            (単位: m)
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters align="stretch">
        <v-col cols="4" style="min-height: 200px">
          <l-map
            ref="riverLevelMap"
            :zoom="zoom"
            :center="center"
            :attribution="attribution"
            :options="{ zoomControl: false }"
          >
            <l-tile-layer
              :url="url"
              :center="center"
              :zoom="zoom"
            ></l-tile-layer>
            <template v-for="o in riverLevelObservatories">
              <l-marker :lat-lng="o.latlng">
                <l-icon :icon-size="[16, 16]" :icon-anchor="[8, 16]">
                  <v-icon :color="getIconColor(o)">mdi-triangle</v-icon>
                </l-icon>
                <l-tooltip :options="{ direction: 'top' }">
                  {{ o.observatory }}
                </l-tooltip>
              </l-marker>
            </template>
          </l-map>
        </v-col>
        <v-col>
          <v-data-table
            dense
            :headers="riverLevelHeaders"
            :items="riverLevelObservatories"
            :height="'100%'"
            hide-default-footer
            class="river-level-table ml-2"
          >
          </v-data-table>
        </v-col>
      </v-row>

    </div>
    <div class="rainfall-contents">
      <v-row no-gutters>
        <v-col>
          <div class="unit text-right">
            (単位: mm)
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters align="stretch">
        <v-col cols="4" style="min-height: 200px">
          <l-map
              ref="rainfallMap"
              :zoom="zoom"
              :center="center"
              :options="{ zoomControl: false }"
          >
            <l-tile-layer
                :url="url"
                :center="center"
                :zoom="zoom"
                :attribution="attribution"
            ></l-tile-layer>
            <template v-for="o in rainfallObservatories">
              <l-marker :lat-lng="o.latlng">
                <l-icon :icon-size="[16, 16]" :icon-anchor="[8, 16]">
                  <v-icon :color="getIconColor(o)">mdi-circle</v-icon>
                </l-icon>
                <l-tooltip :options="{ direction: 'top' }">
                  {{ o.observatory }}
                </l-tooltip>
              </l-marker>
            </template>
          </l-map>
        </v-col>
        <v-col>
          <v-data-table
              dense
              :headers="rainfallHeaders"
              :items="rainfallObservatories"
              :height="'100%'"
              hide-default-footer
              class="rainfall-table ml-2"
          >
          </v-data-table>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
  import {rootActions, rootGetters, rootMutations} from "../../../store/store-functions";
import { LMap, LTileLayer, LMarker, LIcon, LTooltip } from "vue2-leaflet";
import L from "leaflet";
import moment from "moment";
import _ from "lodash";
import { Risk } from "../../../enums/Risk";
import { BaseTile } from "../../../enums/BaseTile";

export default {
  name: "RiverLevelMonitor",
  props: {
    baseDate: {
      type: Object,
      require: true
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LTooltip
  },
  data() {
    return {
      riverLevelStoreId: 0,
      rainfallStoreId: 1,
      mapLabel: Risk.OBSERVATORY.string,
      url: "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
      zoom: 10,
      center: [35.693825, 139.703356],
      attribution:
          '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
      riverLevelObservatories: [],
      riverLevelHeaders: [
        {
          text: "観測所",
          align: "left",
          sortable: false,
          value: "observatory",
          class: "data-table-header"
        },
        {
          text: "氾濫注意",
          align: "right",
          sortable: false,
          value: "warning",
          width: "13%",
          class: "data-table-header"
        },
        {
          text: "避難判断",
          align: "right",
          sortable: false,
          value: "evacuation",
          width: "13%",
          class: "data-table-header"
        },
        {
          text: "氾濫危険",
          align: "right",
          sortable: false,
          value: "dangerous",
          width: "13%",
          class: "data-table-header"
        },
        {
          text: "現在水位",
          align: "right",
          sortable: false,
          value: "riverLevel",
          width: "13%",
          class: "data-table-header"
        },
        {
          text: "50分先\n予測水位",
          align: "right",
          sortable: false,
          value: "forecastRiverLevel",
          width: "13%",
          class: "data-table-header"
        }
      ],
      rainfallObservatories: [],
      rainfallHeaders: [
        {
          text: "観測所",
          align: "left",
          sortable: false,
          value: "observatory",
          class: "data-table-header"
        },
        {
          text: "現在雨量",
          align: "right",
          sortable: false,
          value: "rain",
          width: "30%",
          class: "data-table-header"
        },
        {
          text: "累加雨量",
          align: "right",
          sortable: false,
          value: "totalRain",
          width: "30%",
          class: "data-table-header"
        }
      ],
      rainfallObservatories: []
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters[rootGetters.USER_INFO];
    },
    linkedRiverLevelObservatoriesData() {
      const linkedObservatories = this.$store.getters[
        rootGetters.LINKED_OBSERVATORY_DATA
      ];
      if (!linkedObservatories) {
        return [];
      }
      return linkedObservatories.waterResult;
    },
    linkedRainfallObservatoriesData() {
      const linkedObservatories = this.$store.getters[
        rootGetters.LINKED_OBSERVATORY_DATA
      ];
      if (!linkedObservatories) {
        return [];
      }
      return linkedObservatories.rainResult;
    },
    observatories() {
      return this.$store.getters[rootGetters.FIND_RISK](Risk.OBSERVATORY).data
        .contents;
    }
  },
  watch: {
    baseDate() {
      if (!this.baseDate) {
        return;
      }

      this.loadData().then(() => {
        this.riverLevelObservatories = _.filter(this.observatories, o => {
          return o.type === "水位";
        });
        this.rainfallObservatories = _.filter(this.observatories, o => {
          return o.type === "雨量";
        });

        this.loadLinkedObservatories().then(() => {
          this.setRiverLevelObservatories();
          this.setRainfallObservatories();
        });
      });
    },
  },
  created() {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });

    this.initMapData(this.riverLevelStoreId, {
      baseDate: this.baseDate,
      selectedBaseTile: this.baseTile,
      selectedRiskType: this.risk,
      observatoryOptions: {
        river: { text: "全体", value: -1 },
        filter: ["水位"]
      }
    });
    this.initMapData(this.rainfallStoreId, {
      baseDate: this.baseDate,
      selectedBaseTile: this.baseTile,
      selectedRiskType: this.risk,
      observatoryOptions: {
        river: { text: "全体", value: -1 },
        filter: ["雨量"]
      }
    });

    this.loadData().then(() => {
      this.riverLevelObservatories = _.filter(this.observatories, o => {
        return o.type === "水位";
      });
      this.rainfallObservatories = _.filter(this.observatories, o => {
        return o.type === "雨量";
      });

      this.loadLinkedObservatories().then(() => {
        this.setRiverLevelObservatories();
        this.setRainfallObservatories();
      });
    });
  },
  beforeDestroy() {
    this.removeMapData(this.riverLevelStoreId);
    this.removeMapData(this.rainfallStoreId);
  },
  methods: {
    initMapData(storeId, mapData) {
      this.$store.commit(rootMutations.INIT_MAP_DATA, { storeId, mapData });
    },
    removeMapData(storeId) {
      this.$store.commit(rootMutations.REMOVE_MAP_DATA, storeId);
    },
    to() {
      this.$router.push({
        path: "analysis",
        query: {
          tile: BaseTile.GRAY.index,
          risk: Risk.OBSERVATORY.index
        }
      });
    },
    loadData() {
      return this.$store.dispatch(
        rootActions.LOAD_OBSERVATORY,
        this.riverLevelStoreId
      );
    },
    loadLinkedObservatories() {
      return this.$store.dispatch(rootActions.LOAD_LINKED_OBSERVATORY_DATA, {
        baseDate: this.baseDate
      });
    },
    setRiverLevelObservatories() {
      const observatories = [];
      _.forEach(
        this.linkedRiverLevelObservatoriesData,
        (linkedObservatory, index) => {
          const linkedObservatoryMaster = _.find(
            this.riverLevelObservatories,
            o => {
              return o._id === linkedObservatory._id;
            }
          );

          if (linkedObservatoryMaster) {
            const observatory = Object.assign(
              {},
              linkedObservatoryMaster,
              linkedObservatory
            );
            const row = {
              observatoryId: observatory._id,
              observatory: observatory.name,
              type: observatory.type,
              latlng: [observatory.lat, observatory.lng],
              status: observatory.status,
              warning: observatory.warningLevel
                ? _.floor(observatory.warningLevel, 2)
                : "・",
              evacuation: observatory.evacuationLevel
                ? _.floor(observatory.evacuationLevel, 2)
                : "・",
              dangerous: observatory.dangerousLevel
                ? _.floor(observatory.dangerousLevel, 2)
                : "・",
              riverLevel: _.floor(_.last(observatory.riverLevels), 2),
              forecastRiverLevel: _.floor(_.last(observatory.riverLevels), 2)
            };

            const baseDateIndex = _.findIndex(observatory.times, time => {
              return observatory.baseDate.isSame(
                moment.utc(time, "YYYY/MM/DD HH:mm")
              );
            });
            const oneHourAfterIndex = _.findIndex(observatory.times, time => {
              return observatory.baseDate
                .clone()
                .add(50, "minute")
                .isSame(moment.utc(time, "YYYY/MM/DD HH:mm"));
            });

            if (baseDateIndex !== -1) {
              const pastData = observatory.riverLevels.slice(
                0,
                baseDateIndex + 1
              );
              const currentRiverLevel = _.findLast(pastData, level => {
                return level !== null;
              });
              row.riverLevel = currentRiverLevel ? currentRiverLevel : "欠測";
            }
            if (oneHourAfterIndex !== -1) {
              const forecastRiverLevel =
                observatory.riverLevels[oneHourAfterIndex];
              row.forecastRiverLevel = forecastRiverLevel
                ? forecastRiverLevel
                : "欠測";
            }

            observatories.push(row);
          }
        }
      );
      this.riverLevelObservatories = observatories;
      this.panToMainObservatory();
    },
    getIconColor(observatory) {
      switch (observatory.type) {
        case "水位":
          switch (observatory.status) {
            case "deficit":
              return "#AAAAAA";
            case "normal":
              return "#233559";
            case "standby":
              return "#008000";
            case "warning":
              return "#FFA500";
            case "dangerous":
              return "#AD02AD";
            case "outbreak":
              return "#FF0000";
            default:
              return "#233559";
          }
        case "カメラ":
          return "#BF045B";
        case "雨量":
          switch (observatory.status) {
            case "deficit":
              return "#AAAAAA";
            case "0":
              return "#233559";
            case "1":
              return "#1E42AF";
            case "2":
              return "#D88100";
            case "3":
              return "#800080";
            case "4":
              return "#FF0000";
            default:
              return "#233559";
          }
        default:
          return "#233559";
      }
    },
    panToMainObservatory() {
      const mainObservatory = _.find(this.riverLevelObservatories, o => {
        return o.observatoryId === this.userInfo.mainObservatoryId;
      });
      if (mainObservatory) {
        this.$refs.riverLevelMap.mapObject.panTo(mainObservatory.latlng);
      }
    },
    setRainfallObservatories() {
      const observatories = [];
      _.forEach(
        this.linkedRainfallObservatoriesData,
        (linkedObservatory, index) => {
          const linkedObservatoryMaster = _.find(
            this.rainfallObservatories,
            o => {
              return o._id === linkedObservatory._id;
            }
          );

          if (linkedObservatoryMaster) {
            const observatory = Object.assign(
              {},
              linkedObservatoryMaster,
              linkedObservatory
            );
            const row = {
              observatoryId: observatory._id,
              type: observatory.type,
              latlng: [observatory.lat, observatory.lng],
              status: observatory.status,
              observatory: observatory.name,
              rain: _.floor(_.last(observatory.rains), 2),
              totalRain: _.floor(_.last(observatory.totalRains), 2)
            };

            const index = _.findIndex(observatory.times, time => {
              return observatory.baseDate.isSame(
                moment.utc(time, "YYYY/MM/DD HH:mm")
              );
            });

            const currentRain = observatory.rains[index];
            const currentTotalRain = observatory.totalRains[index];
            row.rain = currentRain ? currentRain : "欠測";
            row.totalRain = currentTotalRain ? currentTotalRain : "欠測";

            this.rainfallHeaders[1].text =
              "現在雨量" +
              moment
                .utc(observatory.times[index], "YYYY/MM/DD HH:mm")
                .local()
                .format("(HH:mm)");

            observatories.push(row);
          }
        }
      );
      this.rainfallObservatories = observatories;

      const mainObservatory = this.rainfallObservatories[0];
      this.$refs.rainfallMap.mapObject.panTo(mainObservatory.latlng);
    }
  }
};
</script>
<style lang="scss">
.river-level-contents {
  .data-table-header {
    padding: 2px 4px !important;
    font-size: 11px;
    font-weight: bold;
    text-align: center !important;
  }
  .data-table-header:nth-child(5) {
    background-color: lightgrey;
  }
  .data-table-header:nth-child(6) {
    background-color: lightgrey;
  }
  .theme--light.v-data-table thead tr th {
    color: black;
  }
  .theme--light.v-data-table thead tr:last-child th {
    border-bottom: 1px double black;
  }
}
.river-level-table {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-radius: 0;
  td {
    font-size: 10px;
    padding: 3px 4px;
    line-height: 1;
    height: inherit;
  }
  tr td:first-child {
    font-weight: bold;
    font-size: 11px;
  }
  tr td:nth-child(5) {
    background-color: lightgrey;
  }
  tr td:nth-child(6) {
    background-color: lightgrey;
  }
}
.rainfall-contents {
  .data-table-header {
    padding: 2px 4px !important;
    font-size: 11px;
    font-weight: bold;
    text-align: center !important;
  }
  .data-table-header:nth-child(2) {
    background-color: lightgrey;
  }
  .data-table-header:nth-child(3) {
    background-color: lightgrey;
  }
  .theme--light.v-data-table thead tr th {
    color: black;
  }
  .theme--light.v-data-table thead tr:last-child th {
    border-bottom: 1px double black;
  }
}
.rainfall-table {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-radius: 0;
  td {
    font-size: 10px;
    padding: 3px 4px;
    line-height: 1;
    height: inherit;
  }
  tr td:first-child {
    font-weight: bold;
    font-size: 11px;
  }
  tr td:nth-child(2) {
    background-color: lightgrey;
  }
  tr td:nth-child(3) {
    background-color: lightgrey;
  }
}
</style>
<style lang="scss" scoped>
.unit {
  font-size: 10px;
}
</style>
