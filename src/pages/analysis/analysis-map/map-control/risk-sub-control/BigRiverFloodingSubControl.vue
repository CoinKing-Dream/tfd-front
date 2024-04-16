<template>
  <div class="big-river-flooding-control">
    <div class="mb-4">
      <v-autocomplete
        class="select-box"
        v-model="river"
        dense
        hide-details
        outlined
        append-icon=""
        label="川"
        :items="rivers"
        :menu-props="{ closeOnContentClick: true }"
        @change="onChangeRiver"
      >
      </v-autocomplete>
    </div>
    <div class="message" v-if="!river">川を選んでください</div>
    <div v-if="river" class="mb-4">
      <h5>種別</h5>
      <v-radio-group
        hide-details
        v-model="level"
        :mandatory="false"
        @change="onChangeLevel"
      >
        <v-radio label="想定最大規模" value="L2"></v-radio>
        <v-radio label="計画規模" value="L1"></v-radio>
      </v-radio-group>
    </div>
    <div v-if="river" class="mb-4">
      <h5>表示データ</h5>
      <v-radio-group
        hide-details
        v-model="displayDataType"
        @change="onChangeDisplayDataType"
        :mandatory="false"
      >
        <v-radio label="浸水深" value="浸水深"></v-radio>
        <v-radio label="浸水継続時間" value="浸水継続時間"></v-radio>
        <v-radio label="時系列" value="時系列"></v-radio>
      </v-radio-group>
      <div
        class="message mt-2"
        v-if="displayDataType === '時系列' && !selectedDikeBreakPoint"
      >
        地図上で破堤地点を選ぶと時間別データが表示されます
      </div>
    </div>
    <div v-if="river">
      <h5>透明度</h5>
      <v-slider
        v-model="opacity"
        hide-details
        :step="0.01"
        :max="1"
        :min="0"
        @change="onChangeOpacity"
      >
      </v-slider>
    </div>
  </div>
</template>

<script>
import {
  rootActions,
  rootGetters,
  rootMutations
} from "../../../../../store/store-functions";
import _ from "lodash";
import { Risk } from "../../../../../enums/Risk";

export default {
  name: "BigRiverFloodingSubControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data: () => ({
    river: null,
    level: "L2",
    displayDataType: "浸水深",
    opacity: 0.7
  }),
  computed: {
    rivers() {
      return this.$store.getters[rootGetters.BIG_RIVER_FLOODING_RIVERS];
    },
    bigRiverFloodingRisk() {
      return this.$store.getters[rootGetters.FIND_RISK](
        Risk.BIG_RIVER_FLOODING
      );
    },
    selectedDikeBreakPoint() {
      return this.$store.getters[rootGetters.SELECTED_DIKE_BREAK_POINT](
        this.analysisMapData.storeId
      );
    },
    bigRiverFloodingOptions() {
      return this.$store.getters[rootGetters.BIG_RIVER_FLOODING_OPTIONS](
        this.analysisMapData.storeId
      );
    }
  },
  created() {
    this.$store.dispatch(rootActions.LOAD_BIG_RIVER_FLOODING_RIVERS);
  },
  mounted() {
    this.$nextTick(() => {
      if (this.bigRiverFloodingRisk.data.riverId) {
        if (this.rivers && this.rivers.length > 0) {
          this.river = _.find(this.rivers, {
            value: { id: this.bigRiverFloodingRisk.data.riverId }
          });
        }
      }
    });
  },
  beforeDestroy() {
    this.$store.commit(rootMutations.UPDATE_BIG_RIVER_FLOODING_OPTIONS, {
      storeId: this.analysisMapData.storeId,
      bigRiverFloodingOptions: {
        displayDataType: "浸水深"
      }
    });
    this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
      storeId: this.analysisMapData.storeId,
      colorLegend: {
        title: null,
        colors: []
      }
    });
    this.$store.commit(rootMutations.UPDATE_DIALOG, {
      storeId: this.analysisMapData.storeId,
      dialog: {
        isShowing: false
      }
    });
  },
  methods: {
    onChangeRiver() {
      this.$store.commit(rootMutations.UPDATE_BIG_RIVER_FLOODING_OPTIONS, {
        storeId: this.analysisMapData.storeId,
        bigRiverFloodingOptions: {
          river: this.river
        }
      });
      this.updateUiByDisplayDataType();
    },
    onChangeLevel() {
      this.$store.commit(rootMutations.UPDATE_BIG_RIVER_FLOODING_OPTIONS, {
        storeId: this.analysisMapData.storeId,
        bigRiverFloodingOptions: {
          level: this.level
        }
      });
    },
    onChangeDisplayDataType() {
      this.$store.commit(rootMutations.UPDATE_BIG_RIVER_FLOODING_OPTIONS, {
        storeId: this.analysisMapData.storeId,
        bigRiverFloodingOptions: {
          displayDataType: this.displayDataType
        }
      });
      this.updateUiByDisplayDataType();
    },
    onChangeOpacity() {
      this.$store.commit(rootMutations.UPDATE_BIG_RIVER_FLOODING_OPTIONS, {
        storeId: this.analysisMapData.storeId,
        bigRiverFloodingOptions: {
          opacity: this.opacity
        }
      });
    },
    updateUiByDisplayDataType() {
      switch (this.displayDataType) {
        case "浸水深":
          this.closeDialog();
          this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
            storeId: this.analysisMapData.storeId,
            colorLegend: {
              title: "浸水深",
              colors: [
                { color: "#08306B", value: "5m" },
                { color: "#2171B5", value: "4m" },
                { color: "#6BAED6", value: "3m" },
                { color: "#C6DBEF", value: "2m" },
                { color: "#F7FBFF", value: "1m" }
              ]
            }
          });
          break;
        case "浸水継続時間":
          this.closeDialog();
          this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
            storeId: this.analysisMapData.storeId,
            colorLegend: {
              title: "浸水継続時間",
              colors: [
                { color: "#7F2704", value: 576 * 5 + "分" },
                { color: "#D94801", value: 576 * 4 + "分" },
                { color: "#FD8D3C", value: 576 * 3 + "分" },
                { color: "#FDD0A2", value: 576 * 2 + "分" },
                { color: "#FFF5EB", value: 576 + "分" }
              ]
            }
          });
          break;
        case "時系列":
          this.closeDialog();
          this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
            storeId: this.analysisMapData.storeId,
            colorLegend: {
              title: "時系列",
              colors: [
                { color: "#08306B", value: "5m" },
                { color: "#2171B5", value: "4m" },
                { color: "#6BAED6", value: "3m" },
                { color: "#C6DBEF", value: "2m" },
                { color: "#F7FBFF", value: "1m" }
              ]
            }
          });
          this.openDialog();
          break;
      }
    },
    openDialog() {
      this.$store.commit(rootMutations.UPDATE_DIALOG, {
        storeId: this.analysisMapData.storeId,
        dialog: {
          isShowing: true,
          cols: 3,
          title: "大規模河川氾濫",
          contents: "dike-break-point-list"
        }
      });
    },
    closeDialog() {
      this.$store.commit(rootMutations.UPDATE_DIALOG, {
        storeId: this.analysisMapData.storeId,
        dialog: {
          isShowing: false
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.big-river-flooding-control {
  width: 150px;
  .v-input--selection-controls {
    margin-top: 0;
  }
  .select-box {
    z-index: 1500;
  }
  .message {
    color: red;
    font-size: 12px;
    width: 100%;
    word-break: break-all;
  }
}
</style>
