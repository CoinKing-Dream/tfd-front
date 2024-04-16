<template>
  <div>
    <v-checkbox
      dense
      hide-details
      v-model="chart"
      :label="'地点別雨量'"
    ></v-checkbox>
    <h5 class="mt-3">透明度</h5>
    <v-slider v-model="opacity" hide-details :step="0.01" :max="1" :min="0">
    </v-slider>
  </div>
</template>

<script>
import {
  rootGetters,
  rootMutations
} from "../../../../../store/store-functions";

export default {
  name: "XRainSubControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  computed: {
    chart: {
      get() {
        return this.$store.getters[rootGetters.X_RAIN_OPTIONS](
          this.analysisMapData.storeId
        ).chart;
      },
      set(chart) {
        this.$store.commit(rootMutations.UPDATE_X_RAIN_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          xRainOptions: {
            chart: chart
          }
        });
      }
    },
    opacity: {
      get() {
        return this.$store.getters[rootGetters.X_RAIN_OPTIONS](
          this.analysisMapData.storeId
        ).opacity;
      },
      set(opacity) {
        this.$store.commit(rootMutations.UPDATE_X_RAIN_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          xRainOptions: {
            opacity: opacity
          }
        });
      }
    },
    mapObject() {
      return this.$store.getters[rootGetters.MAP_OBJECT](
        this.analysisMapData.storeId
      );
    }
  },
  watch: {
    chart() {
      if (this.chart) {
        this.mapObject.on("click", this.onClickMap);
      } else {
        this.mapObject.off("click", this.onClickMap);
      }
    }
  },
  mounted() {
    this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
      storeId: this.analysisMapData.storeId,
      colorLegend: {
        title: "気象レーダ(mm)",
        colors: [
          { color: "#ba206e", value: 80 },
          { color: "#ff3700", value: 50 },
          { color: "#ffa021", value: 30 },
          { color: "#fbf43c", value: 20 },
          { color: "#004efb", value: 10 },
          { color: "#2595fd", value: 5 },
          { color: "#a6d5fe", value: 1 },
          { color: "#ffffff", value: 0 }
        ]
      }
    });
  },
  beforeDestroy() {
    if (this.mapObject) {
      this.mapObject.off("click", this.onClickMap);
    }
    this.$store.commit(rootMutations.UPDATE_X_RAIN_OPTIONS, {
      storeId: this.analysisMapData.storeId,
      xRainOptions: {
        chart: false
      }
    });
    this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
      storeId: this.analysisMapData.storeId,
      colorLegend: {
        title: null,
        colors: []
      }
    });
  },
  methods: {
    onClickMap(e) {
      window.open(
        `https://mpr4tfd.bosai.go.jp/g/graph.php?lon=${e.latlng.lng}&lat=${e.latlng.lat}`,
        "_blank",
        "location=yes,height=600,width=548,scrollbars=yes,status=yes"
      );
    }
  }
};
</script>

<style scoped>
.v-input--selection-controls {
  margin-top: 0;
}
</style>
