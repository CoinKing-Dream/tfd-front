<template>
  <div class="rainfall-detail pa-5">
    <rain-chart
      :key="chartKey"
      :rains="selectedObservatory.rains"
      :total-rains="selectedObservatory.totalRains"
      :times="selectedObservatory.times"
      :base-date="selectedObservatory.baseDate"
    ></rain-chart>
    <v-list disabled nav>
      <v-list-item-group color="primary">
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-home-modern</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              v-text="selectedObservatory.name"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-map-marker</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              v-text="`${selectedObservatory.lat},${selectedObservatory.lng}`"
            ></v-list-item-title>
            <v-list-item-subtitle
              v-text="selectedObservatory.address"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import { rootGetters } from "../../../../../../../store/store-functions";
import RainChart from "../../../../../../../components/charts/RainChart";
import moment from "moment";
export default {
  name: "RainfallDetail",
  components: { RainChart },
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      chartKey: moment().format("X")
    };
  },
  computed: {
    selectedObservatory() {
      return this.$store.getters[rootGetters.SELECTED_OBSERVATORY](
        this.analysisMapData.storeId
      );
    }
  },
  watch: {
    selectedObservatory() {
      this.chartKey = moment().format("X");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../../../../common";
.rainfall-detail {
  background-color: $base-color-1;
}
.v-list-item__title {
  font-size: 20px !important;
}
</style>
