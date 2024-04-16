<template>
  <div class="analysis-map">
    <base-map :initial-store-id="storeId"></base-map>
    <map-controls class="map-controls"></map-controls>
  </div>
</template>

<script>
import BaseMap from "../../../components/base-map/BaseMap";
import MapControls from "./map-control/MapControl";

export default {
  name: "AnalysisMap",
  components: { MapControls, BaseMap },
  props: {
    storeId: {
      type: Number,
      require: true,
    },
  },
  provide() {
    const analysisMapData = {};
    Object.defineProperty(analysisMapData, "storeId", {
      enumerable: true,
      get: () => this.storeId
    });
    return { analysisMapData };
  },
};
</script>

<style lang="scss" scoped>
.analysis-map {
  width: 100%;
  height: 100%;
  position: relative;

  .map-controls {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    pointer-events: none;
    z-index: 1500;
  }
}
</style>
