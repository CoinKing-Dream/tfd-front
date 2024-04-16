<template>
  <div
      class="feature-sub-control"
      :class="{ active: panel === 0, passive: panel !== 0 }"
      :style="{ display: selectedFeatures && selectedFeatures.includes(Feature.HYDRANT) ? '' : 'none' }"
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
        <v-expansion-panel-content v-if="selectedFeatures">
          <hydrant-sub-control></hydrant-sub-control>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import {Feature} from "@/enums/Feature";
import {rootGetters} from "@/store/store-functions";
import HydrantSubControl from "@/pages/analysis/analysis-map/map-control/feature-sub-control/HydrantSubControl";

export default {
  name: "FeatureSubControl",
  components: {HydrantSubControl},
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      Feature: Feature,
      panel: 0,
    };
  },
  computed: {
    selectedFeatures() {
      return this.$store.getters[rootGetters.SELECTED_FEATURES](
          this.analysisMapData.storeId
      );
    }
  }
}
</script>

<style lang="scss">
.feature-sub-control {
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