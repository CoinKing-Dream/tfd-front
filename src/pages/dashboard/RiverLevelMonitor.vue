<template>
  <v-row no-gutters class="river-level-monitor">
    <v-col cols="8" class="full-height mr-1">
      <v-data-table
        dense
        :headers="riverLevelHeaders"
        :items="riverLevelRows"
        :items-per-page="-1"
        hide-default-footer
        class="data-table full-height"
        @click:row="onClickRow"
      >
        <template v-slot:item.riverLevel="{ item }">
          <v-chip
            v-if="item.riverLevel !== '欠測'"
            x-small
            :color="item.graph.riverLevel >= 50 ? 'error' : 'success'"
            dark
            >{{ item.riverLevel }}
          </v-chip>
          <template v-else>{{ item.riverLevel }}</template>
        </template>
        <template v-slot:item.graph="{ item }">
          <div class="graph-area">
            <v-progress-linear
              v-model="item.graph.riverLevel"
              color="#3388ff"
              height="18"
            ></v-progress-linear>
            <div
              v-if="item.graph.warning !== null"
              class="level-line warning-color"
              :style="{ left: item.graph.warning + '%', 'z-index': '1000' }"
            ></div>
            <div
              v-if="item.graph.evacuation !== null"
              class="level-line evacuation-color"
              :style="{ left: item.graph.evacuation + '%' }"
            ></div>
            <div
              v-if="item.graph.dangerous !== null"
              class="level-line dangerous-color"
              :style="{ left: item.graph.dangerous + '%' }"
            ></div>
          </div>
        </template>
      </v-data-table>
    </v-col>
    <v-col class="map-info-area" @click="to">
      <div class="map-area full-height">
        <l-map
          ref="riverLevelMap"
          :zoom="zoom"
          :center="center"
          :options="{ zoomControl: false }"
        >
          <l-tile-layer :url="url" :center="center" :zoom="zoom" :attribution="attribution"></l-tile-layer>
          <template v-for="o in riverLevelRows">
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
      </div>
      <div class="info-area">
        <v-row no-gutters align="end">
          <v-col>{{ mapLabel }}</v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { rootActions, rootGetters } from "../../store/store-functions";
import { LMap, LTileLayer, LMarker, LIcon, LTooltip } from "vue2-leaflet";
import L from "leaflet";
import _ from "lodash";
import { Risk } from "../../enums/Risk";
import { BaseTile } from "../../enums/BaseTile";

export default {
  name: "RiverLevelMonitor",
  props: {
    storeId: {
      type: Number,
      require: false,
      default: -1
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
      mapLabel: Risk.OBSERVATORY.string,
      url: "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
      attribution:
          '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
      zoom: 11,
      center: [35.693825, 139.703356],
      riverLevelRows: [],
      riverLevelHeaders: [
        {
          text: "観測所",
          align: "left",
          sortable: false,
          value: "observatory",
          class: "data-table-header"
        },
        {
          text: "氾濫注意(m)",
          align: "right",
          sortable: false,
          value: "warning",
          width: "12%",
          class: "warning-color"
        },
        {
          text: "避難判断(m)",
          align: "right",
          sortable: false,
          value: "evacuation",
          width: "12%",
          class: "evacuation-color"
        },
        {
          text: "氾濫危険(m)",
          align: "right",
          sortable: false,
          value: "dangerous",
          width: "12%",
          class: "dangerous-color"
        },
        {
          text: "現在水位(m)",
          align: "right",
          sortable: false,
          value: "riverLevel",
          width: "15%",
          class: "data-table-header"
        },
        {
          text: "グラフ",
          align: "center",
          sortable: false,
          value: "graph",
          width: "25%",
          class: "data-table-header"
        }
      ]
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters[rootGetters.USER_INFO];
    },
    baseDate() {
      return this.$store.getters[rootGetters.BASE_DATE](this.storeId);
    },
    observatories() {
      return this.$store.getters[rootGetters.FIND_RISK](Risk.OBSERVATORY).data
        .contents;
    },
    riverLevelObservatories() {
      return _.filter(this.observatories, o => {
        return (
          o.type === "水位" &&
          this.userInfo.riverLevelObservatories.includes(o._id)
        );
      });
    }
  },
  watch: {
    baseDate() {
      if (!this.baseDate) {
        return;
      }

      this.loadData().then(() => {
        this.setRiverLevelRows();
      });
    },
    userInfo(after, before) {
      if (
        after &&
        _.isEqual(
          _.sortBy(after.riverLevelObservatories),
          _.sortBy(before.riverLevelObservatories)
        ) &&
        after.mainObservatoryId === before.mainObservatoryId
      ) {
        return;
      }

      this.setRiverLevelRows();
    }
  },
  created() {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });

    this.loadData().then(() => {
      this.setRiverLevelRows();
    });
  },
  methods: {
    to() {
      const target = "tfd-sub";
      const subWindow = window.open("", target, "", true);
      const pastHref = subWindow.location.href;
      const url = `${window.location.origin}/index.html#/analysis?tile=${
        BaseTile.GRAY.index
      }&risk=${Risk.OBSERVATORY.index}&baseDate=${this.baseDate.format("X")}`;

      if (pastHref !== "about:blank") {
        subWindow.close();
        window.open(url, target, "", true);
      } else {
        subWindow.location.href = url;
      }
    },
    loadData() {
      return this.$store.dispatch(rootActions.LOAD_OBSERVATORY, this.storeId);
    },
    setRiverLevelRows() {
      let rows = [];
      _.forEach(this.riverLevelObservatories, observatory => {
        const row = {
          observatoryId: observatory._id,
          observatory: observatory.name,
          latlng: [observatory.lat, observatory.lng],
          status: observatory.status,
          outbreak: observatory.outbreakLevel
            ? _.floor(observatory.outbreakLevel, 2)
            : "・",
          dangerous: observatory.dangerousLevel
            ? _.floor(observatory.dangerousLevel, 2)
            : "・",
          evacuation: observatory.evacuationLevel
            ? _.floor(observatory.evacuationLevel, 2)
            : "・",
          warning: observatory.warningLevel
            ? _.floor(observatory.warningLevel, 2)
            : "・",
          standby: observatory.standbyLevel
            ? _.floor(observatory.standbyLevel, 2)
            : "・",
          riverLevel: observatory.level ? _.floor(observatory.level, 2) : "欠測"
        };

        let max = null;
        if (row.dangerous !== "・") {
          max = row.dangerous * 2;
        } else if (row.warning !== "・") {
          max = row.warning * 4;
        }

        if (max === null) {
          row.graph = {
            warning: null,
            evacuation: null,
            dangerous: null,
            riverLevel: null
          };
        } else {
          row.graph = {
            warning: row.warning !== "・" ? (row.warning / max) * 100 : null,
            evacuation:
              row.evacuation !== "・" ? (row.evacuation / max) * 100 : null,
            dangerous:
              row.dangerous !== "・" ? (row.dangerous / max) * 100 : null,
            riverLevel:
              row.riverLevel === "欠測" ? 0 : (row.riverLevel / max) * 100
          };
        }
        rows.push(row);
      });

      let outbreak = _.filter(rows, o => {
        return (
          o.riverLevel !== "欠測" &&
          o.outbreak !== "・" &&
          o.outbreak <= o.riverLevel
        );
      });
      outbreak = _.orderBy(
        outbreak,
        [
          o => {
            return o.riverLevel - o.outbreak;
          }
        ],
        ["desc"]
      );
      rows = _.differenceWith(rows, outbreak, _.isEqual);

      let dangerous = _.filter(rows, o => {
        return (
          o.riverLevel !== "欠測" &&
          o.dangerous !== "・" &&
          o.dangerous <= o.riverLevel
        );
      });
      dangerous = _.orderBy(
        dangerous,
        [
          o => {
            return o.riverLevel - o.dangerous;
          }
        ],
        ["desc"]
      );
      rows = _.differenceWith(rows, dangerous, _.isEqual);

      let evacuation = _.filter(rows, o => {
        return (
          o.riverLevel !== "欠測" &&
          o.evacuation !== "・" &&
          o.evacuation <= o.riverLevel
        );
      });
      evacuation = _.orderBy(
        evacuation,
        [
          o => {
            return o.riverLevel - o.evacuation;
          }
        ],
        ["desc"]
      );
      rows = _.differenceWith(rows, evacuation, _.isEqual);

      let warning = _.filter(rows, o => {
        return (
          o.riverLevel !== "欠測" &&
          o.warning !== "・" &&
          o.warning <= o.riverLevel
        );
      });
      warning = _.orderBy(
        warning,
        [
          o => {
            return o.riverLevel - o.warning;
          }
        ],
        ["desc"]
      );
      rows = _.differenceWith(rows, warning, _.isEqual);

      let standby = _.filter(rows, o => {
        return (
          o.riverLevel !== "欠測" &&
          o.standby !== "・" &&
          o.standby <= o.riverLevel
        );
      });
      standby = _.orderBy(
        standby,
        [
          o => {
            return o.riverLevel - o.standby;
          }
        ],
        ["desc"]
      );
      rows = _.differenceWith(rows, standby, _.isEqual);

      this.riverLevelRows = _.concat(
        outbreak,
        dangerous,
        evacuation,
        warning,
        standby,
        rows
      );

      this.panToMainObservatory();
    },
    getIconColor(observatory) {
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
    },
    panToMainObservatory() {
      const mainObservatory = _.find(this.riverLevelRows, o => {
        return o.observatoryId === this.userInfo.mainObservatoryId;
      });
      if (mainObservatory) {
        this.$refs.riverLevelMap.mapObject.panTo(mainObservatory.latlng);
      }
    },
    onClickRow(value) {
      this.$cookies.set("observatoryId", value.observatoryId);
      this.to();
    }
  }
};
</script>

<style lang="scss">
.river-level-monitor {
  .v-data-footer__select {
    display: none;
  }
  .warning-color {
    background-color: yellow;
    font-size: 10px;
  }
  .evacuation-color {
    background-color: orange;
    font-size: 10px;
  }
  .dangerous-color {
    background-color: orangered;
    font-size: 10px;
  }
  .data-table-header {
    background-color: #0d47a1;
    padding: 5px 16px !important;
    color: white !important;
    font-size: 10px;
  }
  .data-table td {
    font-size: 13px !important;
  }
  .v-data-table td,
  .v-data-table th {
    padding: 0 10px;
    cursor: pointer;
  }
  .v-data-table--dense td {
    height: 18px;
  }
}
</style>
<style lang="scss" scoped>
@import "../../common";
.river-level-monitor {
  height: 100%;
}
.header {
  background-color: #0d47a1;
  color: white;
  font-size: 14px;
}
.graph-area {
  pointer-events: none;
  position: relative;
  .level-line {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
  }
  .warning-color.level-line {
    left: 25%;
  }
}
.map-info-area {
  position: relative;
  cursor: pointer;
}
.map-area {
  pointer-events: none;
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

  .time {
    font-size: 12px;
    color: $point-color-4;
  }
}

.full-height {
  height: 100%;
}
.data-table {
  overflow-y: auto;
}
</style>
