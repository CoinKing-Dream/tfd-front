<template>
  <div class="dialog">
    <div v-if="selectedObservatoryDetail" class="charts-area">
      <div class="rain-chart-area">
        <rain-chart
          :key="chartKey"
          :rains="selectedObservatoryDetail.rains"
          :times="selectedObservatoryDetail.times"
          :base-date="selectedObservatoryDetail.baseDate"
          :reverse="true"
        ></rain-chart>
      </div>
      <div class="river-level-chart-area">
        <river-level-chart
          :key="chartKey"
          :observatory-id="selectedObservatoryDetail._id"
          :init-river-levels="selectedObservatoryDetail.riverLevels"
          :standby-level="selectedObservatoryDetail.standbyLevel"
          :warning-level="selectedObservatoryDetail.warningLevel"
          :evacuation-level="selectedObservatoryDetail.evacuationLevel"
          :dangerous-level="selectedObservatoryDetail.dangerousLevel"
          :outbreak-level="selectedObservatoryDetail.outbreakLevel"
          :landform="selectedObservatoryDetail.landform"
          :init-times="selectedObservatoryDetail.times"
          :base-date="selectedObservatoryDetail.baseDate"
        >
        </river-level-chart>
      </div>
    </div>
  </div>
</template>

<script>
import RiverLevelChart from "../../../../../../../components/charts/RiverLevelChart";
import {
  rootActions,
  rootGetters, rootMutations
} from "../../../../../../../store/store-functions";
import RainChart from "../../../../../../../components/charts/RainChart";
import moment from "moment";

export default {
  name: "ObservatoryDetailChart",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  components: { RainChart, RiverLevelChart },
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
    },
    selectedObservatoryDetail() {
      return this.$store.getters[rootGetters.SELECTED_OBSERVATORY_DETAIL](
        this.analysisMapData.storeId
      );
    }
  },
  watch: {
    selectedObservatoryDetail() {
      this.chartKey = moment().format("X");
    }
  },
  created() {
    this.loadDetailData();
  },
  beforeDestroy() {
    return this.$store.commit(rootMutations.UPDATE_SELECTED_OBSERVATORY_DETAIL, {
      storeId: this.analysisMapData.storeId,
      selectedObservatoryDetail: null
    });
  },
  methods: {
    async loadDetailData() {
      return this.$store.dispatch(rootActions.LOAD_OBSERVATION_DETAIL_DATA, {
        storeId: this.analysisMapData.storeId,
        observatoryId: this.selectedObservatory._id
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  .charts-area {
    overflow-y: hidden;
    .rain-chart-area {
      position: relative;
      height: 150px;
      div {
        height: 100%;
      }
    }

    .river-level-chart-area {
      height: 330px;

      div {
        height: 100%;
      }
    }
  }
}
</style>
