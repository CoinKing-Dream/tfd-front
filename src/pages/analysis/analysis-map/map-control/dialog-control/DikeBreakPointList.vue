<template>
  <div class="dike-break-point-list" ref="container">
    <v-list two-line subheader dense>
      <v-list-item
        v-for="(point, index) in this.selectedRiskData.points"
        :key="index"
        ref="points"
        @click="onClickPoint(point)"
      >
        <v-list-item-icon>
          <v-icon
            v-if="
              selectedDikeBreakPoint &&
                selectedDikeBreakPoint.property.name === point.property.name
            "
            color="indigo"
            >mdi-check</v-icon
          >
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ point.property.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ point.property.node }}</v-list-item-subtitle>
          <v-list-item-subtitle v-if="point.property.address">{{
            point.property.address
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import {
  rootGetters,
  rootMutations
} from "../../../../../store/store-functions";
import _ from "lodash";

export default {
  name: "DikeBreakPointList",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      headers: [
        {
          text: "破堤点番号",
          align: "left",
          sortable: false,
          value: "name",
          class: ""
        },
        {
          text: "河口からの距離",
          align: "right",
          sortable: false,
          value: "node",
          class: ""
        }
      ],
    };
  },
  computed: {
    selectedRiskData() {
      return this.$store.getters[rootGetters.SELECTED_RISK](
        this.analysisMapData.storeId
      ).data;
    },
    selectedDikeBreakPoint() {
      return this.$store.getters[rootGetters.SELECTED_DIKE_BREAK_POINT](
        this.analysisMapData.storeId
      );
    }
  },
  watch: {
    selectedDikeBreakPoint() {
      this.$nextTick(() => {
        const index = _.findIndex(
          this.selectedRiskData.points,
          this.selectedDikeBreakPoint
        );
        this.$refs.container.scrollTop =
          this.$refs.points[index].$el.offsetTop -
          this.$refs.points[index].$el.offsetHeight;
      });
    }
  },
  methods: {
    onClickPoint(point) {
      const storeId = this.analysisMapData.storeId;
      this.$store.commit(rootMutations.UPDATE_SELECTED_DIKE_BREAK_POINT, {
        storeId,
        selectedDikeBreakPoint: point
      });
    }
  }
};
</script>

<style lang="scss">
/*.v-window-item.v-window-item--active > div {*/
/*  height: calc(100vh - 133px);*/
/*  overflow-y: auto;*/
/*}*/
</style>
<style lang="scss" scoped>
.dike-break-point-list {
  height: 100%;
  overflow-y: scroll;
}
</style>
