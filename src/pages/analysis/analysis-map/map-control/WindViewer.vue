<template>
  <div
    v-if="selectedRisk && selectedRisk.type === Risk.WIND"
    class="wind-data-viewport text-center mb-2 mx-auto"
  >
    <div class="pa-2">
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-icon
            large
            class="mx-1"
            color="blue"
            :style="windDirectionIconStyle"
            >mdi-send</v-icon
          >
        </v-col>
        <v-col>
          <span class="wind-speed">{{ windSpeed }}</span
          ><span class="unit ml-1">m/s</span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { Risk } from "../../../../enums/Risk";
import { rootGetters } from "../../../../store/store-functions";

export default {
  name: "WindViewer",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      Risk: Risk
    };
  },
  computed: {
    windSpeed() {
      return this.$store.getters[rootGetters.SELECTED_WIND](
        this.analysisMapData.storeId
      ).speed;
    },
    windDirection() {
      return this.$store.getters[rootGetters.SELECTED_WIND](
        this.analysisMapData.storeId
      ).direction;
    },
    windDirectionIconStyle() {
      return { transform: `rotate(${-1 * (this.windDirection - 270)}deg)` };
    },
    selectedRisk() {
      return this.$store.getters[rootGetters.SELECTED_RISK](
        this.analysisMapData.storeId
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.wind-data-viewport {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  width: 200px;
}
.wind-direction {
  font-size: 10px;
}
.wind-speed {
  font-size: 30px;
  font-weight: bold;
  color: white;
}
.unit {
  font-size: 12px;
  font-weight: bold;
  color: white;
}
</style>
