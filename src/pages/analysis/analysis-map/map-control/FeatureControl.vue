<template>
  <div class="layer-control">
    <h5>地形地物</h5>
    <div class="select-area">
      <expansion-panels
        :data="layerGroups"
        :multiple-select="true"
        :multiple-select-init-data="initData"
        @change="callback"
      ></expansion-panels>
      <div class="feature-sub-control-area ml-2">
        <feature-sub-control></feature-sub-control>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { rootGetters, rootMutations } from "../../../../store/store-functions";
import ExpansionPanels from "../../../../components/ExpansionPanels";
import { Feature } from "../../../../enums/Feature";
import FeatureSubControl from "@/pages/analysis/analysis-map/map-control/feature-sub-control/FeatureSubControl";
export default {
  name: "FeatureControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  components: { FeatureSubControl, ExpansionPanels },
  data() {
    return {
      initData: Feature.RIVER,
      layerGroups: [
        {
          label: "地物",
          selectedItems: [],
          items: []
        },
        {
          label: "地理情報",
          selectedItems: [],
          items: []
        },
        {
          label: "防災",
          selectedItems: [],
          items: []
        }
      ]
    };
  },
  computed: {
    selectedFeatures() {
      return this.$store.getters[rootGetters.SELECTED_FEATURES](
        this.analysisMapData.storeId
      );
    },
    map() {
      return this.$store.getters[rootGetters.MAP_OBJECT](
          this.analysisMapData.storeId
      );
    },
    multiMapShow() {
      return this.$store.getters[rootGetters.MULTI_MAP_SHOW];
    },
  },
  created() {
    _.forEach(Feature, (feature, key) => {
      _.forEach(this.layerGroups, layerGroup => {
        if (layerGroup.label === feature.group) {
          layerGroup.items.push({
            label: feature.string,
            value: feature
          });

          return false;
        }
      });
    });
  },
  methods: {
    callback(selectedItems) {
      const isHydrant = _.find(selectedItems, (item)=>{
        return item.value === Feature.HYDRANT
      });
      if (isHydrant) {
        const center = this.map.getCenter();
        const layerPoint = this.map.latLngToLayerPoint(center);
        if (this.multiMapShow === false) {
          layerPoint.x -= window.innerWidth / 4;
        }

        this.map.setView(this.map.layerPointToLatLng(layerPoint), 16);
      }

      this.$nextTick(() => {
        this.$store.commit(rootMutations.UPDATE_SELECTED_FEATURES, {
          storeId: this.analysisMapData.storeId,
          selectedFeatures: _.map(selectedItems, "value")
        });
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.layer-control {
  width: 135px;
}
.select-area {
  position: relative;
}
.feature-sub-control-area {
  position: absolute;
  top: 0;
  left: 100%;
}
</style>
