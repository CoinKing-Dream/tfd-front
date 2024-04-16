<template>
  <div class="small-river-flooding-sub-control">
    <h5 class="mb-1">表示</h5>
    <v-radio-group hide-details v-model="type" :mandatory="false">
      <v-radio label="内外水" :value="3"></v-radio>
      <v-radio label="内水" :value="1"></v-radio>
      <v-radio label="外水" :value="2"></v-radio>
    </v-radio-group>
    <v-divider class="my-2"></v-divider>
    <div>
      <v-checkbox
        v-model="sample"
        :label="'サンプル表示'"
        hide-details
      ></v-checkbox>
    </div>
  </div>
</template>

<script>
import {
  rootGetters,
  rootMutations
} from "../../../../../store/store-functions";

export default {
  name: "SmallRiverFloodingSubControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  methods: {
    showColorLegend() {
      this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
        storeId: this.analysisMapData.storeId,
        colorLegend: [
          {
            title: "内水リスク",
            colors: [
              { color: "#fecd37", value: "3" },
              { color: "#fecd9b", value: "2" },
              { color: "#feefdd", value: "1" }
            ]
          },
          {
            title: "外水リスク(m)",
            colors: [
              { color: "#003f7f", value: "1.5" },
              { color: "#379bfe", value: "1.0" },
              { color: "#9bcdfe", value: "0.5" },
              { color: "#ddeffe", value: "0.01" }
            ]
          }
        ]
      });
    }
  },
  mounted() {
    this.showColorLegend();
  },
  beforeDestroy() {
    this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
      storeId: this.analysisMapData.storeId,
      colorLegend: {
        title: null,
        colors: []
      }
    });
  },
  computed: {
    type: {
      get() {
        return this.$store.getters[rootGetters.SMALL_RIVER_FLOODING_OPTIONS](
          this.analysisMapData.storeId
        ).type;
      },
      set(type) {
        this.$store.commit(rootMutations.UPDATE_SMALL_RIVER_FLOODING_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          smallRiverFloodingOptions: {
            type: type
          }
        });
      }
    },
    sample: {
      get() {
        return this.$store.getters[rootGetters.SMALL_RIVER_FLOODING_OPTIONS](
          this.analysisMapData.storeId
        ).sample;
      },
      set(sample) {
        this.$store.commit(rootMutations.UPDATE_SMALL_RIVER_FLOODING_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          smallRiverFloodingOptions: {
            sample: sample
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.small-river-flooding-sub-control {
  .v-input--selection-controls {
    margin-top: 0;
  }
}
</style>
