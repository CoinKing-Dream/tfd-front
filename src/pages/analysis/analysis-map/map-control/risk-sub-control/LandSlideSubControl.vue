<template>
  <div class="land-slide-sub-control">
    <h5>表示</h5>
    <v-radio-group hide-details v-model="level" :mandatory="false">
      <v-radio label="すべてのレベル" :value="0"></v-radio>
      <v-radio label="レベル２以上" :value="2"></v-radio>
      <v-radio label="レベル３以上" :value="3"></v-radio>
      <v-radio label="レベル４以上" :value="4"></v-radio>
    </v-radio-group>
    <h5 class="mt-3">透明度</h5>
    <v-slider v-model="opacity" hide-details :step="0.01" :max="1" :min="0">
    </v-slider>
    <v-divider class="my-2"></v-divider>
    <v-checkbox
      v-model="sample"
      :label="'サンプル表示'"
      hide-details
    ></v-checkbox>
  </div>
</template>

<script>
import {
  rootGetters,
  rootMutations
} from "../../../../../store/store-functions";

export default {
  name: "LandSlideSubControl",
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
    sample: {
      get() {
        return this.$store.getters[rootGetters.LAND_SLIDE_OPTIONS](
          this.analysisMapData.storeId
        ).sample;
      },
      set(sample) {
        this.$store.commit(rootMutations.UPDATE_LAND_SLIDE_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          landSlideOptions: {
            sample: sample
          }
        });
      }
    },
    opacity: {
      get() {
        return this.$store.getters[rootGetters.LAND_SLIDE_OPTIONS](
          this.analysisMapData.storeId
        ).opacity;
      },
      set(opacity) {
        this.$store.commit(rootMutations.UPDATE_LAND_SLIDE_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          landSlideOptions: {
            opacity: opacity
          }
        });
      }
    },
    level: {
      get() {
        return this.$store.getters[rootGetters.LAND_SLIDE_OPTIONS](
          this.analysisMapData.storeId
        ).level;
      },
      set(level) {
        this.$store.commit(rootMutations.UPDATE_LAND_SLIDE_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          landSlideOptions: {
            level: level
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.land-slide-sub-control {
  .v-input--selection-controls {
    margin-top: 0;
  }
}
</style>
