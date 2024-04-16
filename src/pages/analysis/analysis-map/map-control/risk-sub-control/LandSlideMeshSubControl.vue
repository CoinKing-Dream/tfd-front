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
  name: "LandSlideMeshSubControl",
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
            title: "土砂災害警戒判定値",
            colors: [
              { color: "rgba(12,0,12)", value: "災害切迫　　【5】" },
              { color: "rgba(170,0,170)", value: "危険　　　　【4】" },
              { color: "rgba(255,40,0)", value: "警戒　　　　【3】" },
              { color: "rgba(242,231,0)", value: "注意　　　　【2】" },
              { color: "#FFFFFF", value: "今後の情報等に留意" }
            ],
            text: "※【 】内は相当する警戒レベル"
          }
        ],
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
        unit: null,
        colors: []
      }
    });
  },
  computed: {
    opacity: {
      get() {
        return this.$store.getters[rootGetters.LAND_SLIDE_MESH_OPTIONS](
          this.analysisMapData.storeId
        ).opacity;
      },
      set(opacity) {
        this.$store.commit(rootMutations.UPDATE_LAND_SLIDE_MESH_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          landSlideMeshOptions: {
            opacity: opacity
          }
        });
      }
    }
  }
};
</script>

<style scoped></style>
