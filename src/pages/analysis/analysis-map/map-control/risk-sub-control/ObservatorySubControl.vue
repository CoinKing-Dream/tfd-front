<template>
  <div class="observatory-control">
    <div class="mb-3">
      <h5 class="mb-1">表示範囲</h5>
      <v-autocomplete
        class="select-box"
        v-model="selectedRiverId"
        dense
        hide-details
        outlined
        append-icon=""
        :items="rivers"
        :menu-props="{ closeOnContentClick: true }"
        @change="onChangeRiverSelectBox"
      >
        <template slot="prepend-item" v-if="histories.length > 0">
          <v-list class="histories" flat dense>
            <div class="sub-title px-2 mb-2">
              <v-icon small class="mr-1">mdi-history</v-icon>履歴
            </div>
            <v-list-item
              v-for="(river, i) in histories"
              :key="i"
              active-class="active"
            >
              <v-list-item-content @click="onClickHistory(river)">
                <v-list-item-title v-text="river.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <div class="sub-title my-2 px-2">
            <v-icon small class="mr-1">mdi-playlist-check</v-icon>川
          </div>
        </template>
      </v-autocomplete>
    </div>
    <div>
      <h5>Filter</h5>
      <v-row no-gutters align="center">
        <v-col>
          <v-checkbox
            hide-details
            dense
            v-model="enabledObservatories"
            label="水位"
            value="水位"
            @change="onChangeFilters"
          ></v-checkbox>
        </v-col>
        <v-col cols="auto">
          <v-icon>mdi-triangle</v-icon>
        </v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col>
          <v-checkbox
            dense
            hide-details
            v-model="enabledObservatories"
            label="カメラ"
            value="カメラ"
            :disabled="selectedRiverId !== -1"
            @change="onChangeFilters"
          ></v-checkbox>
        </v-col>
        <v-col cols="auto"> <v-icon>mdi-camera</v-icon></v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col>
          <v-checkbox
            hide-details
            dense
            v-model="enabledObservatories"
            label="雨量"
            value="雨量"
            :disabled="selectedRiverId !== -1"
            @change="onChangeFilters"
          ></v-checkbox>
        </v-col>
        <v-col cols="auto"> <v-icon>mdi-checkbox-blank-circle</v-icon></v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col>
          <v-checkbox
            hide-details
            dense
            v-model="enabledObservatories"
            label="水門"
            value="水門"
            :disabled="selectedRiverId !== -1"
            @change="onChangeFilters"
          ></v-checkbox>
        </v-col>
        <v-col cols="auto"> <v-icon>mdi-view-sequential</v-icon></v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col>
          <v-checkbox
            hide-details
            dense
            v-model="enabledObservatories"
            label="調節池"
            value="調節池"
            :disabled="selectedRiverId !== -1"
            @change="onChangeFilters"
          ></v-checkbox>
        </v-col>
        <v-col cols="auto"> <v-icon>mdi-car-windshield</v-icon></v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import {
  rootActions,
  rootGetters,
  rootMutations
} from "../../../../../store/store-functions";
export default {
  name: "ObservatorySubControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data: () => ({
    selectedRiverId: -1,
    enabledObservatories: ["水位", "雨量", "カメラ", "水門", "調節池"],
    histories: []
  }),
  computed: {
    rivers() {
      return this.$store.getters[rootGetters.OBSERVATORY_RIVERS];
    },
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
    observatoryOptions() {
      return this.$store.getters[rootGetters.OBSERVATORY_OPTIONS](
        this.analysisMapData.storeId
      );
    }
  },
  watch: {
    histories() {
      localStorage.setItem(
        "observatory-control/river-history",
        JSON.stringify(this.histories)
      );
    },
    rivers() {
      this.selectedRiverId = this.rivers[0].value;
    }
  },
  created() {
    if (this.rivers && this.rivers.length > 0) {
      if (this.observatoryOptions.river) {
        this.selectedRiverId = this.observatoryOptions.river.value;
      }
    } else {
      this.$store.dispatch(rootActions.LOAD_OBSERVATORY_RIVERS, this.storeId);
    }

    if (this.observatoryOptions.filter) {
      this.enabledObservatories = this.observatoryOptions.filter;
    }
  },
  mounted() {
    this.showColorLegend();
    this.histories = JSON.parse(
      localStorage.getItem("observatory-control/river-history")
    );
    if (this.histories === null || typeof this.histories !== "object") {
      this.histories = [];
    }
  },
  beforeDestroy() {
    this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
      storeId: this.analysisMapData.storeId,
      colorLegend: {
        unit: null,
        colors: []
      }
    });
  },
  methods: {
    updateHistories() {
      const selectedRiver = _.find(this.rivers, {
        value: this.selectedRiverId
      });
      if (this.rivers.includes(selectedRiver)) {
        if (this.histories.includes(selectedRiver)) {
          _.remove(this.histories, o => {
            return o.value === selectedRiver.value;
          });
        }
        this.histories.unshift(selectedRiver);
        this.histories = this.histories.slice(0, 3);
      } else {
        _.remove(this.histories, o => {
          return o.value === selectedRiver.value;
        });
      }
    },
    onChangeRiverSelectBox() {
      if (this.selectedRiverId !== -1) {
        this.enabledObservatories = ["水位"];
        this.updateHistories();
      }

      this.$store.commit(rootMutations.UPDATE_OBSERVATORY_OPTIONS, {
        storeId: this.analysisMapData.storeId,
        observatoryOptions: {
          river: _.find(this.rivers, { value: this.selectedRiverId }),
          filter: this.enabledObservatories
        }
      });
    },
    onChangeFilters() {
      this.$store.commit(rootMutations.UPDATE_OBSERVATORY_OPTIONS, {
        storeId: this.analysisMapData.storeId,
        observatoryOptions: {
          river: _.find(this.rivers, { value: this.selectedRiverId }),
          filter: this.enabledObservatories
        }
      });

      this.showColorLegend();
    },
    onClickHistory(river) {
      this.selectedRiverId = river.value;
      this.onChangeRiverSelectBox();
      this.updateHistories();
    },
    showColorLegend() {
      const colorLegend = [
        {
          key: "水位",
          title: "水位",
          colors: [
            { color: "#FF0000", value: "氾濫発生水位" },
            { color: "#AD02AD", value: "氾濫危険水位" },
            { color: "#FFA500", value: "氾濫注意水位" },
            { color: "#008000", value: "水防団待機水位" },
            { color: "#233559", value: "平常" },
            { color: "#AAAAAA", value: "休止・欠測等" }
          ]
        },
        {
          key: "雨量",
          title: "雨量(mm)",
          colors: [
            { color: "#FF0000", value: "20～" },
            { color: "#800080", value: "10～19" },
            { color: "#D88100", value: "5～9" },
            { color: "#1E42AF", value: "1～4" },
            { color: "#233559", value: "0" },
            { color: "#AAAAAA", value: "休止・欠測等" }
          ]
        },
        {
          key: "水門",
          title: "水門",
          colors: [
            { color: "#FF0000", value: "全閉" },
            { color: "#D88100", value: "半開" },
            { color: "#233559", value: "全開" },
            { color: "#AAAAAA", value: "休止・欠測等" }
          ]
        },
        {
          key: "調節池",
          title: "調節池(%)",
          colors: [
            { color: "#FF0000", value: "100" },
            { color: "#800080", value: "80～99" },
            { color: "#D88100", value: "40～79" },
            { color: "#008000", value: "1～39" },
            { color: "#233559", value: "~1" },
            { color: "#AAAAAA", value: "休止・欠測等" }
          ]
        }
      ];

      const param = _.filter(colorLegend, (o) => {
        return this.enabledObservatories.includes(o.key)
      })

      this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
        storeId: this.analysisMapData.storeId,
        colorLegend: param
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.observatory-control {
  width: 150px;

  .v-input--selection-controls {
    margin-top: 0;
  }

  .select-box {
    z-index: 1500;
  }
}

.histories {
  padding: 0 0 5px 0;
}
.sub-title {
  color: dimgray;
  font-size: 12px;
}
.active {
  color: rgba(0, 0, 0, 0.87) !important;
}
</style>
