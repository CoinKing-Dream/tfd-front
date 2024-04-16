<template>
  <div>
    <h5>透明度</h5>
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
  name: "RainSubControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  computed: {
    opacity: {
      get() {
        return this.$store.getters[rootGetters.RAIN_OPTIONS](
          this.analysisMapData.storeId
        ).opacity;
      },
      set(opacity) {
        this.$store.commit(rootMutations.UPDATE_RAIN_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          rainOptions: {
            opacity: opacity
          }
        });
      }
    }
  },
  mounted() {
    this.$store.commit(rootMutations.UPDATE_COLOR_LEGEND, {
      storeId: this.analysisMapData.storeId,
      colorLegend: {
        title: "予測降雨(mm)",
        colors: [
          { color: "#ba206e", value: "80" },
          { color: "#ff3700", value: "50" },
          { color: "#ffa021", value: "30" },
          { color: "#fbf43c", value: "20" },
          { color: "#004efb", value: "10" },
          { color: "#2595fd", value: "5" },
          { color: "#a6d5fe", value: "1" },
          { color: "#ffffff", value: "0" }
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

<style scoped></style>
