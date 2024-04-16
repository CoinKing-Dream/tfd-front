<template>
  <div class="zoom-control" v-if="map">
    <div class="zoom-button">
      <v-btn
        small
        height="35"
        dark
        color="primary"
        @click="zoomIn"
        class="zoom-up-btn"
      >
        <v-icon small>mdi-plus</v-icon>
      </v-btn>
    </div>
    <v-btn small tile height="22" width="100%">
      {{ zoom }}
    </v-btn>
    <div class="zoom-button">
      <v-btn
        small
        height="35"
        dark
        color="primary"
        @click="zoomOut"
        class="zoom-down-btn"
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
  .zoom-button {
    width: 100%;
  }
  .v-size--small {
    width: 100%;
    min-width: 35px;
  }
  .zoom {
    text-align: center;
    background-color: white;
    font-weight: bold;
  }

  .zoom-up-btn {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .zoom-down-btn {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>
