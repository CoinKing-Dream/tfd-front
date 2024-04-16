<template>
  <div class="water-gate-detail pa-5">

    <water-gate-chart
        :key="chartKey"
        :observatory-id="selectedObservatory._id"
        :init-inner-levels="selectedObservatory.innerLevels"
        :init-outer-levels="selectedObservatory.outerLevels"
        :init-times="selectedObservatory.times"
        :base-date="selectedObservatory.baseDate"
    ></water-gate-chart>
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
            <v-list-item-subtitle
                v-text="getStatus(selectedObservatory)"
            ></v-list-item-subtitle>
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
import WaterGateChart from "../../../../../../../components/charts/WaterGateChart";
import moment from "moment";
export default {
  name: "WaterGateDetail",
  components: { WaterGateChart },
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
  },
  methods: {
    getStatus(o) {
      switch (o.status) {
        case -1:
          return "休止・欠測等";
        case 2:
          return "全開";
        case 1:
          return "半開";
        case 0:
          return "全閉";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../../../../common";
.water-gate-detail {
  background-color: $base-color-1;
}
.v-list-item__title {
  font-size: 20px !important;
}
</style>
