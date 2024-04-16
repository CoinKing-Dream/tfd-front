<template>
  <div class="tiles">
    <template v-for="(feature, index) in selectedFeatures">
      <div v-if="Feature.HYDRANT === feature" :key="index">
        <template v-for="(o, key) in feature.url">
          <l-tile-layer
            layer-type="overlay"
            v-if="hydrantEnabledTypes.includes(key)"
            :key="key"
            :url="o"
          ></l-tile-layer>
        </template>
      </div>
      <div v-else-if="Array.isArray(feature.url)" :key="index">
        <l-tile-layer
          layer-type="overlay"
          v-for="(o, key) in feature.url"
          :key="key"
          :url="o"
          :options="{ opacity: 0.7 }"
        ></l-tile-layer>
      </div>
      <l-tile-layer
        layer-type="overlay"
        v-else
        class="tiles"
        :key="index"
        :url="feature.url"
      ></l-tile-layer>
    </template>
  </div>
</template>

<script>
import { rootGetters } from "../../store/store-functions";
import LTileLayer from "vue2-leaflet/src/components/LTileLayer";
import { Feature } from "@/enums/Feature";

export default {
  name: "FeatureLayers",
  components: { LTileLayer },
  inject: {
    baseMapData: {
      default: []
    }
  },
  data() {
    return {
      Feature: Feature
    };
  },
  computed: {
    selectedFeatures() {
      return this.$store.getters[rootGetters.SELECTED_FEATURES](
        this.baseMapData.storeId
      );
    },
    hydrantEnabledTypes() {
      return this.$store.getters[rootGetters.HYDRANT_OPTIONS](
        this.baseMapData.storeId
      ).enabledTypes;
    }
  }
};
</script>

<style scoped>
.tiles {
  z-index: 5000;
}
</style>
