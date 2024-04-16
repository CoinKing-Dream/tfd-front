<template>
  <l-tile-layer
    layer-type="base"
    v-if="selectedBaseTile"
    :url="selectedBaseTile.url"
    :options="{
      maxNativeZoom: getMaxNativeZoom(),
      updateWhenIdle: false
    }"
    :attribution="selectedBaseTile.attribution"
  ></l-tile-layer>
</template>

<script>
import { rootGetters } from "../../store/store-functions";
import LTileLayer from "vue2-leaflet/src/components/LTileLayer";
import { BaseTile } from "../../enums/BaseTile";

export default {
  name: "BaseTile",
  components: { LTileLayer },
  inject: {
    baseMapData: {
      default: []
    }
  },
  data() {
    return {
      maxNativeZoom: 17
    };
  },
  computed: {
    selectedBaseTile() {
      return this.$store.getters[rootGetters.SELECTED_BASE_TILE](
        this.baseMapData.storeId
      );
    }
  },
  methods: {
    getMaxNativeZoom() {
      let maxNativeZoom;
      switch (this.selectedBaseTile) {
        case BaseTile.WHITE:
          maxNativeZoom = 14;
          break;
        case BaseTile.GRAY:
          maxNativeZoom = 15;
          break;
        default:
          maxNativeZoom = 17;
          break;
      }
      return maxNativeZoom;
    }
  }
};
</script>

<style scoped></style>
