<template>
  <div class="zoom-control" v-if="map">
    <div class="zoom-button">
      <v-btn
        small
        fab
        height="35"
        dark
        color="rgba(19, 55, 102, 0.72)"
        @click="zoomIn"
      >
        <v-icon small>mdi-plus</v-icon>
      </v-btn>
    </div>
    <v-btn small fab height="22">
      {{ zoom }}
    </v-btn>
    <div class="zoom-button">
      <v-btn
        small
        fab
        height="35"
        dark
        color="rgba(19, 55, 102, 0.72)"
        @click="zoomOut"
      >
        <v-icon small>mdi-minus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { rootGetters } from "../../../../store/store-functions";

export default {
  name: "ZoomControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  computed: {
    map() {
      return this.$store.getters[rootGetters.MAP_OBJECT](
        this.analysisMapData.storeId
      );
    },
    zoom() {
      return this.map.getZoom();
    }
  },
  methods: {
    zoomIn() {
      this.map.setZoom(this.map.getZoom() + 1);
    },
    zoomOut() {
      this.map.setZoom(this.map.getZoom() - 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.zoom-control {
  width: 36px;
  .v-btn {
    border-radius: 0;
  }
  .zoom-button {
    width: 100%;
  }
  .zoom {
    text-align: center;
    background-color: white;
    font-weight: bold;
  }
  .v-btn--fab.v-size--small {
    width: 100%;
    padding: auto;
  }
}
</style>
