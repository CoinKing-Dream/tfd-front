<template>
  <div class="map-control">
    <v-row no-gutters>
      <v-col class="controls-area">
        <div class="main-controls">
          <div class="controls top left">
            <realtime-data-control></realtime-data-control>
            <base-tile-control></base-tile-control>
            <feature-control></feature-control>
          </div>
          <div class="controls top right">
            <map-tool-control></map-tool-control>
            <warning-status-viewer></warning-status-viewer>
            <color-legend class="pointer-event-disable"></color-legend>
            <feature-color-legend class="pointer-event-disable"></feature-color-legend>
          </div>
          <div class="controls bottom right">
            <zoom-control></zoom-control>
          </div>
          <div class="controls bottom center">
            <wind-viewer></wind-viewer>
          </div>
        </div>
        <div class="bottom-controls pt-6">
          <big-river-flooding-control
            v-if="selectedRisk && selectedRisk.type === Risk.BIG_RIVER_FLOODING"
          ></big-river-flooding-control>
          <date-control
            v-if="selectedRisk && selectedRisk.timeAxis"
          ></date-control>
        </div>
      </v-col>
      <v-col
        v-if="dialog && dialog.isShowing"
        class="dialog-area"
        :cols="cols"
        :class="{ 'multi-map-dialog': multiMapShow }"
      >
        <dialog-control></dialog-control>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { rootGetters } from "../../../../store/store-functions";

import BaseTileControl from "./BaseTileControl";
import RealtimeDataControl from "./RiskControl";
import FeatureControl from "./FeatureControl";
import DateControl from "./date-control/DateControl";
import DialogControl from "./dialog-control/DialogControl";
import WindViewer from "./WindViewer";
import ZoomControl from "./ZoomControl";
import MapToolControl from "./MapToolControl";
import BigRiverFloodingControl from "./BigRiverFloodingControl";
import ColorLegend from "./ColorLegend";

import { Risk } from "../../../../enums/Risk";
import WarningStatusViewer from "./WarningStatusViewer";
import FeatureColorLegend from "./FeatureColorLegend";

export default {
  name: "MapControl",
  components: {
    FeatureColorLegend,
    WarningStatusViewer,
    ColorLegend,
    BigRiverFloodingControl,
    MapToolControl,
    ZoomControl,
    WindViewer,
    DialogControl,
    DateControl,
    FeatureControl,
    RealtimeDataControl,
    BaseTileControl
  },
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      Risk: Risk
    };
  },
  computed: {
    selectedRisk() {
      return this.$store.getters[rootGetters.SELECTED_RISK](
        this.analysisMapData.storeId
      );
    },
    dialog() {
      return this.$store.getters[rootGetters.DIALOG](
        this.analysisMapData.storeId
      );
    },
    cols() {
      return this.$store.getters[rootGetters.DIALOG](
        this.analysisMapData.storeId
      ).cols;
    },
    multiMapShow() {
      return this.$store.getters[rootGetters.MULTI_MAP_SHOW];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../common";
$date-control-height: 100px;
.map-control {
  > .row {
    height: 100%;
  }
  .controls-area {
    .main-controls {
      position: relative;
      height: calc(100% - #{$date-control-height + 10});

      .controls {
        position: absolute;
        > * {
          position: relative;
          clear: both;
        }
      }
      .controls > div {
        pointer-events: auto;
      }
      .controls > .pointer-event-disable {
        pointer-events: none;
      }
      .top {
        top: 0;
        > * {
          margin: 10px 10px 0 10px;
        }
      }
      .left {
        left: 0;
        text-align: left;
        > * {
          float: left;
        }
      }
      .right {
        right: 0;
        text-align: right;
        > * {
          float: right;
        }
      }
      .center {
        left: 50%;
        transform: translateX(-50%);
        > * {
          float: left;
        }
      }
      .bottom {
        bottom: 0;
        > * {
          margin: 0 10px 10px 10px;
        }
      }
    }
    .bottom-controls {
      margin-top: 10px;
      height: $date-control-height;
      > * {
        pointer-events: auto;
      }
    }
  }
  .dialog-area {
    pointer-events: auto;
    background-color: $base-color-1;
    height: 100%;
    z-index: 1500;
  }

  .multi-map-dialog {
    position: absolute;
    right: 0;
  }
}
</style>
