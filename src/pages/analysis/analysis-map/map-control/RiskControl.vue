<template>
  <div class="risk-control">
    <div class="select-area">
      <expansion-panels
        :data="[panelData]"
        :background-color="'#ffbe3d'"
        :default-open="0"
        @change="callback"
      ></expansion-panels>
      <div class="risk-sub-control-area ml-2">
        <risk-sub-control></risk-sub-control>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { Risk } from "../../../../enums/Risk";
import ExpansionPanels from "../../../../components/ExpansionPanels";
import { rootGetters, rootMutations } from "../../../../store/store-functions";
import RiskSubControl from "./risk-sub-control/RiskSubControl";

export default {
  name: "RiskControl",
  components: { RiskSubControl, ExpansionPanels },
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      panelData: {
        label: "リスク",
        icon: "mdi-weather-lightning-rainy",
        iconColor: "black",
        selectedItem: {},
        items: []
      }
    };
  },
  computed: {
    selectedRisk() {
      return this.$store.getters[rootGetters.SELECTED_RISK](
        this.analysisMapData.storeId
      );
    },
    trainingMode() {
      return this.$store.getters[rootGetters.TRAINING_MODE];
    }
  },
  watch: {
    trainingMode() {
      this.init();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const panelDataItems = []
      _.forEach(Risk, risk => {
        if (typeof risk === "object") {
          if (!this.trainingMode && risk.index === Risk.FLOOD_ZONE_ESTIMATION_SITE.index) {
            return;
          }
          panelDataItems.push({
            label: risk.string,
            value: risk
          });
        }
      });
      this.panelData.items = panelDataItems;
      this.panelData.selectedItem = _.find(this.panelData.items, o => {
        return this.selectedRisk.type === o.value;
      });
    },
    callback(selectedItem) {
      const storeId = this.analysisMapData.storeId;
      this.$store.commit(rootMutations.UPDATE_SELECTED_RISK, {
        storeId,
        selectedRiskType: selectedItem.value
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../common";

.risk-control {
  width: 135px;
}
.select-area {
  position: relative;
}
.risk-sub-control-area {
  position: absolute;
  top: 0;
  left: 100%;
}
</style>
