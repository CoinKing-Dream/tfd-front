<template>
  <div class="base-tile-control">
    <h5>地図</h5>
    <expansion-panels :data="[panelData]" @change="callback"></expansion-panels>
  </div>
</template>

<script>
import _ from "lodash";
import { rootGetters, rootMutations } from "../../../../store/store-functions";

import { BaseTile } from "../../../../enums/BaseTile";
import ExpansionPanels from "../../../../components/ExpansionPanels";
import { Risk } from "../../../../enums/Risk";

export default {
  name: "BaseTileControl",
  components: { ExpansionPanels },
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      panelData: {
        label: "タイル",
        icon: "mdi-map",
        iconColor: "#2c7be5",
        selectedItem: {},
        items: []
      }
    };
  },
  computed: {
    selectedBaseTile() {
      return this.$store.getters[rootGetters.SELECTED_BASE_TILE](
        this.analysisMapData.storeId
      );
    }
  },
  created() {
    _.forEach(BaseTile, baseTile => {
      if (typeof baseTile === "object") {
        this.panelData.items.push({
          label: baseTile.string,
          value: baseTile
        });
      }
    });

    this.panelData.selectedItem = _.find(this.panelData.items, o => {
      return this.selectedBaseTile === o.value;
    });
  },
  methods: {
    callback(selectedItem) {
      const storeId = this.analysisMapData.storeId;
      const selectedBaseTile = selectedItem.value;

      this.$store.commit(rootMutations.UPDATE_SELECTED_BASE_TILE, {
        storeId: storeId,
        baseTile: selectedBaseTile
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.base-tile-control {
  width: 135px;
}
</style>
