<template>
  <l-map
    ref="map"
    class="base-map"
    :class="{ 'read-only': readOnly }"
    :minZoom="minZoom"
    :maxZoom="maxZoom"
    :zoom="zoom"
    :center="centerPosition"
    :options="options"
    :zoomAnimation="false"
  >
    <feature-layers></feature-layers>
    <base-tile-layer></base-tile-layer>
    <template v-if="mapObject && selectedRisk">
      <template v-if="Risk.RAIN === selectedRisk.type">
        <linear-rain-layer></linear-rain-layer>
        <rain-layer ></rain-layer>
      </template>
      <wind-layer v-if="Risk.WIND === selectedRisk.type"></wind-layer>
      <small-river-flooding-layer
        v-if="Risk.SMALL_RIVER_FLOODING === selectedRisk.type"
      ></small-river-flooding-layer>
      <river-risk-distribution-layer
        v-if="Risk.RIVER_RISK_DISTRIBUTION === selectedRisk.type"
      ></river-risk-distribution-layer>
      <observatory-layer
        v-if="Risk.OBSERVATORY === selectedRisk.type"
      ></observatory-layer>
      <big-river-flooding-layer
        v-if="Risk.BIG_RIVER_FLOODING === selectedRisk.type"
      ></big-river-flooding-layer>
      <flooding-history-layer
        v-if="Risk.FLOODING_HISTORY === selectedRisk.type"
      ></flooding-history-layer>
      <land-slide-layer
        v-if="Risk.LAND_SLIDE === selectedRisk.type"
      ></land-slide-layer>
      <x-rain-layer v-if="Risk.X_RAIN === selectedRisk.type"></x-rain-layer>
      <land-slide-mesh-layer
        v-if="Risk.LAND_SLIDE_MESH === selectedRisk.type"
      ></land-slide-mesh-layer>

      <address-marker></address-marker>
    </template>
    <l-control-scale
      v-if="!readOnly"
      position="topleft"
      :imperial="false"
      :metric="true"
    ></l-control-scale>
  </l-map>
</template>

<script>
import { Risk } from "../../enums/Risk";
import {
  rootMutations,
  rootGetters,
  rootActions
} from "../../store/store-functions";

import _ from "lodash";

import { LMap, LMarker, LGridLayer, LControlScale } from "vue2-leaflet";
import BaseTileLayer from "./BaseTileLayer";
import WindLayer from "./risk-layer/WindLayer";
import ObservatoryLayer from "./risk-layer/ObservatoryLayer";
import LIcon from "vue2-leaflet/src/components/LIcon";
import RiverRiskDistributionLayer from "./risk-layer/RiverRiskDistributionLayer";
import FeatureLayers from "./FeatureLayers";
import BigRiverFloodingLayer from "./risk-layer/BigRiverFloodingLayer";
import RainLayer from "./risk-layer/RainLayer";
import SmallRiverFloodingLayer from "./risk-layer/SmallRiverFloodingLayer";
import AddressMarker from "./AddressMarker";
import L from "leaflet";
import FloodingHistoryLayer from "./risk-layer/FloodingHistoryLayer";
import LandSlideLayer from "./risk-layer/LandSlideLayer";
import axios from "axios";
import XRainLayer from "./risk-layer/XRainLayer";
import LandSlideMeshLayer from "./risk-layer/LandSlideMeshLayer";
import LinearRainLayer from "@/components/base-map/risk-layer/LinearRainLayer.vue";

export default {
  name: "BaseMap",
  components: {
    LinearRainLayer,
    LandSlideMeshLayer,
    XRainLayer,
    LandSlideLayer,
    FloodingHistoryLayer,
    AddressMarker,
    SmallRiverFloodingLayer,
    RainLayer,
    BigRiverFloodingLayer,
    FeatureLayers,
    RiverRiskDistributionLayer,
    LIcon,
    ObservatoryLayer,
    WindLayer,
    LMarker,
    LGridLayer,
    BaseTileLayer,
    LMap,
    LControlScale
  },
  props: {
    zoom: {
      type: Number,
      require: false,
      default: 11
    },
    readOnly: {
      type: Boolean,
      require: false,
      default: false
    },
    initialStoreId: {
      type: Number,
      require: false,
      default: -1
    },
    initialCenterPosition: {
      type: Array,
      require: false,
      default: () => [35.63981599900241, 139.6295297522245]
    }
  },
  provide() {
    const baseMapData = {};
    Object.defineProperty(baseMapData, "storeId", {
      enumerable: true,
      get: () => this.storeId
    });
    Object.defineProperty(baseMapData, "readOnly", {
      enumerable: true,
      get: () => this.readOnly
    });
    return { baseMapData };
  },
  data() {
    return {
      Risk: Risk,
      centerPosition: this.initialCenterPosition,
      storeId: this.initialStoreId,
      options: { zoomControl: false },
      isExternalMoving: false,
      isExternalZooming: false,
      mapObject: null,
      minZoom: 6,
      maxZoom: 17
    };
  },
  computed: {
    selectedRisk() {
      return this.$store.getters[rootGetters.SELECTED_RISK](this.storeId);
    },
    multiMapSync() {
      return this.$store.getters[rootGetters.MULTI_MAP_SYNC];
    }
  },
  watch: {
    selectedRisk() {
      if (this.selectedRisk && this.selectedRisk.type === Risk.TYPHOON) {
        window.open("https://www.jma.go.jp/jp/typh/", "_blank");
      } else if (this.selectedRisk && this.selectedRisk.type === Risk.TIDE) {
        window.open("https://www.data.jma.go.jp/gmd/kaiyou/db/tide/suisan/suisan.php?stn=TK", "_blank");
      } else if (this.selectedRisk && this.selectedRisk.type === Risk.FLOOD_ZONE_ESTIMATION_SITE) {
        window.open("https://midoplat.bosai.go.jp/web/shinsui/index.html", "_blank");
      }
    }
  },
  created() {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });

    this.$root.$on("externalPanTo", this.externalPanTo);
    this.$root.$on("externalUpdateZoom", this.externalUpdateZoom);
  },
  mounted() {
    this.mapObject = this.$refs.map.mapObject;
    this.updateMapObject();
    this.addMoveEndListener();
    this.addZoomEndListener();
  },
  beforeDestroy() {
    this.$store.commit(rootMutations.UPDATE_MAP_OBJECT, {
      storeId: this.storeId,
      mapObject: null
    });

    this.$root.$off("externalPanTo", this.externalPanTo);
    this.$root.$off("externalUpdateZoom", this.externalUpdateZoom);
  },
  methods: {
    addMoveEndListener() {
      this.mapObject.on("moveend", () => {
        if (this.multiMapSync === false) {
          return;
        }
        if (this.isExternalMoving) {
          this.isExternalMoving = false;
          return;
        }
        this.$root.$emit(
          "externalPanTo",
          this._uid,
          this.mapObject.getCenter()
        );
      });
    },
    addZoomEndListener() {
      this.mapObject.on("zoomend", () => {
        if (this.multiMapSync === false) {
          return;
        }
        if (this.isExternalZooming) {
          this.isExternalZooming = false;
          return;
        }
        this.$root.$emit(
          "externalUpdateZoom",
          this._uid,
          this.mapObject.getZoom()
        );
      });
    },
    updateMapObject() {
      const storeId = this.storeId;
      const mapObject = this.mapObject;
      this.$store.commit(rootMutations.UPDATE_MAP_OBJECT, {
        storeId,
        mapObject
      });
    },
    externalPanTo(_uid, position) {
      if (
        this._uid !== _uid &&
        this.isExternalMoving === false &&
        this.isExternalZooming === false
      ) {
        this.isExternalMoving = true;
        this.panTo(position);
      }
    },
    panTo(position) {
      this.mapObject.panTo(position);
    },
    externalUpdateZoom(_uid, zoom) {
      if (this._uid !== _uid && this.isExternalZooming === false) {
        this.isExternalZooming = true;
        this.isExternalMoving = true;
        this.updateZoom(zoom);
      }
    },
    updateZoom(zoom) {
      this.mapObject.setZoom(zoom);
    }
  }
};
</script>
<style lang="scss" scoped>
.base-map {
  width: 100%;
  height: 100%;
}
</style>
<style>
.leaflet-control-container,
.leaflet-top.leaflet-left {
  width: 100%;
}
.leaflet-control-scale.leaflet-control {
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}
.leaflet-overlay-pane {
  z-index: 700!important;
}
</style>
<style lang="scss">
.v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 20px;
}
.leaflet-image-layer {
  /*image-rendering:-webkit-optimize-contrast;*/
  image-rendering: pixelated;
  -ms-interpolation-mode: nearest-neighbor;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: crisp-edges;
}
.riskImage {
  /*image-rendering:-webkit-optimize-contrast;*/
  image-rendering: pixelated;
  -ms-interpolation-mode: nearest-neighbor;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: crisp-edges;
}
.read-only {
  pointer-events: none;
}
</style>
