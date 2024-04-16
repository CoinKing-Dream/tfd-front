<template>
  <div class="observatory-list">
    <template>
      <v-tabs v-model="tabs" grow>
        <v-tabs-slider></v-tabs-slider>
        <template
          v-if="selectedObservatory && selectedObservatory.type === 'カメラ'"
        >
          <v-tab href="#camera" class="primary--text">
            <v-icon>mdi-view-grid</v-icon>
          </v-tab>
        </template>
        <template v-else>
          <v-tab href="#chart" class="primary--text">
            <v-icon>mdi-chart-bar</v-icon>
          </v-tab>
          <v-tab href="#table" class="primary--text">
            <v-icon>mdi-table-large</v-icon>
          </v-tab>
        </template>
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <template
          v-if="selectedObservatory && selectedObservatory.type === 'カメラ'"
        >
          <v-tab-item :value="'camera'">
            <observatory-list-chart-tab></observatory-list-chart-tab>
          </v-tab-item>
        </template>
        <template v-else>
          <v-tab-item :value="'chart'">
            <observatory-list-chart-tab></observatory-list-chart-tab>
          </v-tab-item>
          <v-tab-item :value="'table'">
            <observatory-list-table-tab></observatory-list-table-tab> </v-tab-item
        ></template>
      </v-tabs-items>
    </template>
  </div>
</template>

<script>
import ObservatoryListChartTab from "./ObservatoryListChartTab";
import ObservatoryListTableTab from "./ObservatoryListTableTab";
import { rootGetters } from "../../../../../../../store/store-functions";

export default {
  name: "ObservatoryList",
  components: { ObservatoryListTableTab, ObservatoryListChartTab },
  inject: {
    analysisMapData: {
      default: []
    }
  },
  computed: {
    selectedObservatory() {
      return this.$store.getters[rootGetters.SELECTED_OBSERVATORY](
        this.analysisMapData.storeId
      );
    }
  },
  data() {
    return {
      tabs: null
    };
  }
};
</script>
<style lang="scss">
.v-window-item.v-window-item--active > div {
  height: calc(100vh - 133px);
  overflow-y: auto;
}
</style>
<style lang="scss" scoped>
.observatory-list {
  height: 100%;
}
</style>
