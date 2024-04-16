<template>
  <div class="wind-sub-control">
    <v-row no-gutters align="center" class="mb-1">
      <v-col>
        <h5>
          高度（地上）
        </h5>
      </v-col>
      <v-col v-if="loading" class="progress-circular">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="12"
          :width="2"
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-radio-group
      dense
      hide-details
      v-model="height"
      :mandatory="false"
      :disabled="loading || sample"
    >
      <v-radio label="10m" :value="10"></v-radio>
      <v-radio label="100m" :value="100"></v-radio>
      <v-radio label="150m" :value="150"></v-radio>
      <v-radio label="250m" :value="250"></v-radio>
      <v-radio label="500m" :value="500"></v-radio>
      <v-radio label="750m" :value="750"></v-radio>
      <v-radio label="1000m" :value="1000"></v-radio>
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
  name: "WindSubControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  computed: {
    height: {
      get() {
        return this.$store.getters[rootGetters.WIND_OPTIONS](
          this.analysisMapData.storeId
        ).height;
      },
      set(height) {
        this.$store.commit(rootMutations.UPDATE_WIND_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          windOptions: {
            height: height
          }
        });
      }
    },
    sample: {
      get() {
        return this.$store.getters[rootGetters.WIND_OPTIONS](
          this.analysisMapData.storeId
        ).sample;
      },
      set(sample) {
        this.$store.commit(rootMutations.UPDATE_WIND_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          windOptions: {
            sample: sample
          }
        });
      }
    },
    loading() {
      return this.$store.getters[rootGetters.WIND_OPTIONS](
        this.analysisMapData.storeId
      ).loading;
    }
  },
  mounted() {
    this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
      storeId: this.analysisMapData.storeId,
      colorLegend: {
        title: "風速(m/s)",
        colors: [
          { color: "rgb(180,0,35)", value: "14 ~" },
          { color: "rgb(220,24,32)", value: "12 ~ 13" },
          { color: "rgb(237,45,28)", value: "10 ~ 11" },
          { color: "rgb(245,64,32)", value: "8 ~ 9" },
          { color: "rgb(250,122,52)", value: "6 ~ 7" },
          { color: "rgb(252,150,75)", value: "4 ~ 5" },
          { color: "rgb(255,182,100)", value: "2 ~ 3" },
          { color: "rgb(252,217,125)", value: "0 ~ 1" }
        ]
      }
    });
  },
  beforeDestroy() {
    this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
      storeId: this.analysisMapData.storeId,
      colorLegend: {
        title: null,
        colors: []
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.wind-sub-control {
  width: 150px;

  .v-input--selection-controls {
    margin-top: 0;
  }
  .progress-circular {
    line-height: 1;
  }
}
</style>
