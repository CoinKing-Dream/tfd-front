<template>
  <div
    class="risk-sub-control"
    :class="{ active: panel === 0, passive: panel !== 0 }"
    :style="{ display: selectedRisk && selectedRisk.subControl ? '' : 'none' }"
  >
    <v-expansion-panels v-model="panel" accordion>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div v-if="panel === 0" class="mx-1">
            options
          </div>
          <template v-slot:actions>
            <v-icon :color="'blue'">mdi-chevron-right</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content v-if="selectedRisk">
          <template v-if="Risk.OBSERVATORY === this.selectedRisk.type">
            <observatory-sub-control></observatory-sub-control>
          </template>
          <template v-if="Risk.BIG_RIVER_FLOODING === this.selectedRisk.type">
            <big-river-flooding-sub-control></big-river-flooding-sub-control>
          </template>
          <template v-if="Risk.WIND === this.selectedRisk.type">
            <wind-sub-control></wind-sub-control>
          </template>
          <template v-if="Risk.FLOODING_HISTORY === this.selectedRisk.type">
            <flooding-history-sub-control></flooding-history-sub-control>
          </template>
          <template v-if="Risk.SMALL_RIVER_FLOODING === this.selectedRisk.type">
            <small-river-flooding-sub-control></small-river-flooding-sub-control>
          </template>
          <template v-if="Risk.LAND_SLIDE === this.selectedRisk.type">
            <land-slide-sub-control></land-slide-sub-control>
          </template>
          <template v-if="Risk.RAIN === this.selectedRisk.type">
            <rain-sub-control></rain-sub-control>
          </template>
          <template v-if="Risk.X_RAIN === this.selectedRisk.type">
            <x-rain-sub-control></x-rain-sub-control>
          </template>
          <template v-if="Risk.LAND_SLIDE_MESH === this.selectedRisk.type">
            <land-slide-mesh-sub-control></land-slide-mesh-sub-control>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { rootGetters } from "../../../../../store/store-functions";
import { Risk } from "../../../../../enums/Risk";
import ObservatorySubControl from "./ObservatorySubControl";
import BigRiverFloodingSubControl from "./BigRiverFloodingSubControl";
import WindSubControl from "./WindSubControl";
import FloodingHistorySubControl from "./FloodingHistorySubControl";
import SmallRiverFloodingSubControl from "./SmallRiverFloodingSubControl";
import LandSlideSubControl from "./LandSlideSubControl";
import RainSubControl from "./RainSubControl";
import XRainSubControl from "./XRainSubControl";
import LandSlideMeshSubControl from "./LandSlideMeshSubControl";

export default {
  name: "RiskSubControl",
  components: {
    LandSlideMeshSubControl,
    XRainSubControl,
    RainSubControl,
    LandSlideSubControl,
    SmallRiverFloodingSubControl,
    FloodingHistorySubControl,
    WindSubControl,
    ObservatorySubControl,
    BigRiverFloodingSubControl
  },
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      Risk: Risk,
      panel: 0,
      subPanelList: [
        Risk.OBSERVATORY,
        Risk.BIG_RIVER_FLOODING,
        Risk.WIND,
        Risk.FLOODING_HISTORY,
        Risk.SMALL_RIVER_FLOODING,
        Risk.LAND_SLIDE,
        Risk.RAIN,
        Risk.X_RAIN
      ]
    };
  },
  computed: {
    selectedRisk() {
      return this.$store.getters[rootGetters.SELECTED_RISK](
        this.analysisMapData.storeId
      );
    }
  }
};
</script>
<style lang="scss">
.risk-sub-control {
  .theme--light.v-expansion-panels .v-expansion-panel {
    margin: 1px 0;
    border-radius: 5px;
    max-width: inherit;
  }

  .v-expansion-panel--active .v-expansion-panel-header {
    min-height: 30px;
  }

  .v-expansion-panel-header {
    padding: 5px 5px;
    min-height: 30px;
  }

  .v-expansion-panel-content__wrap {
    padding: 10px;
  }

  .v-expansion-panel-header {
    font-size: 13px;
  }
}
</style>
<style lang="scss" scoped>
.risk-sub-control {
  max-width: inherit;
}
.active {
  width: 170px;
}
.passive {
  width: 34px;
  transition-property: width;
  transition-duration: 1s;
  transition-delay: 0.3s;
}
</style>
