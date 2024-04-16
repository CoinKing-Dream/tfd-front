<template>
  <div class="river-level-detail pa-5">
    <river-level-detail-chart></river-level-detail-chart>
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
import RiverLevelDetailChart from "./RiverLevelDetailChart";
import { rootGetters } from "../../../../../../../store/store-functions";
export default {
  name: "RiverLevelDetail",
  components: { RiverLevelDetailChart },
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
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../../../../common";
.river-level-detail {
  background-color: $base-color-1;
}
.v-list-item__title {
  font-size: 20px !important;
}
</style>
