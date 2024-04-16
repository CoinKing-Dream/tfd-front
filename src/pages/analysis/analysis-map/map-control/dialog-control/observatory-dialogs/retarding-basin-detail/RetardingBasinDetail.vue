<template>
  <div class="rainfall-detail pa-5">
    <retarding-basin-chart
        :key="chartKey"
        :observatory-id="selectedObservatory._id"
        :max-storage="parseFloat(selectedObservatory.maxStorage)"
        :init-volumes="selectedObservatory.volumes"
        :init-times="selectedObservatory.times"
        :base-date="selectedObservatory.baseDate"
    ></retarding-basin-chart>
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
import moment from "moment";
import RetardingBasinChart from "@/components/charts/RetardingBasinChart";
export default {
  name: "RetardingBasinDetail",
  components: {RetardingBasinChart },
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
