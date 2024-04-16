<template>
  <div>
    <l-image-overlay
      v-if="selectedRisk.data.maxDept && displayDataType === '浸水深'"
      :bounds="selectedRisk.data.maxDept.bounds"
      :url="selectedRisk.data.maxDept.image"
      :opacity="opacity"
    >
    </l-image-overlay>
    <l-image-overlay
      v-else-if="
        selectedRisk.data.maxTime && displayDataType === '浸水継続時間'
      "
      :bounds="selectedRisk.data.maxTime.bounds"
      :url="selectedRisk.data.maxTime.image"
      :opacity="opacity"
    >
    </l-image-overlay>
    <template
      v-else-if="
        selectedDikeBreakPoint &&
          selectedDikeBreakPoint.breakInfo &&
          displayDataType === '時系列'
      "
    >
      <l-image-overlay
        :bounds="selectedDikeBreakPoint.breakInfo.bounds"
        :url="selectedDikeBreakPoint.breakInfo.data[selectedIndex].image"
        :opacity="opacity"
      >
      </l-image-overlay>
    </template>
    <template v-if="displayDataType === '時系列'">
      <l-marker
        v-for="(breakPoint, index) in selectedRisk.data.points"
        ref="markers"
        :key="index"
        :lat-lng="[breakPoint.property.lat, breakPoint.property.lng]"
        @click="onClickBreakPoint(breakPoint)"
      >
        <l-icon
          :icon-size="[16, 16]"
          :icon-anchor="[8, 16]"
          :popupAnchor="[0, -30]"
        >
          <v-icon
            small
            :color="
              selectedDikeBreakPoint &&
              selectedDikeBreakPoint.property &&
              selectedDikeBreakPoint.property.name === breakPoint.property.name
                ? 'red'
                : 'black'
            "
            >mdi-pin</v-icon
          >
        </l-icon>
        <l-popup
          :options="{
            autoClose: false,
            closeOnClick: false
          }"
        >
          <div>{{ breakPoint.property.name }}</div>
          <div>{{ breakPoint.property.node }}</div>
          <div>{{ breakPoint.property.address }}</div>
        </l-popup>
      </l-marker>
    </template>
  </div>
</template>

<script>
import { LMarker, LIcon, LPopup, LImageOverlay } from "vue2-leaflet";
import {
  rootActions,
  rootGetters,
  rootMutations
} from "../../../store/store-functions";
import { Risk } from "../../../enums/Risk";
import _ from "lodash";
import L from "leaflet";

export default {
  name: "BigRiverFloodingLayer",
  components: {
    "l-marker": LMarker,
    "l-icon": LIcon,
    "l-popup": LPopup,
    "l-image-overlay": LImageOverlay
  },
  inject: {
    baseMapData: {
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
        this.baseMapData.storeId
      );
    },
    selectedDikeBreakPoint() {
      return this.$store.getters[rootGetters.SELECTED_DIKE_BREAK_POINT](
        this.baseMapData.storeId
      );
    },
    river() {
      return this.$store.getters[rootGetters.BIG_RIVER_FLOODING_OPTIONS](
        this.baseMapData.storeId
      ).river;
    },
    level() {
      return this.$store.getters[rootGetters.BIG_RIVER_FLOODING_OPTIONS](
        this.baseMapData.storeId
      ).level;
    },
    displayDataType() {
      return this.$store.getters[rootGetters.BIG_RIVER_FLOODING_OPTIONS](
        this.baseMapData.storeId
      ).displayDataType;
    },
    opacity() {
      return this.$store.getters[rootGetters.BIG_RIVER_FLOODING_OPTIONS](
        this.baseMapData.storeId
      ).opacity;
    },
    selectedIndex() {
      return this.$store.getters[rootGetters.BIG_RIVER_FLOODING_OPTIONS](
        this.baseMapData.storeId
      ).selectedIndex;
    },
    map() {
      return this.$store.getters[rootGetters.MAP_OBJECT](
        this.baseMapData.storeId
      );
    }
  },
  watch: {
    river() {
      this.loadData();
    },
    level() {
      this.loadData();
    },
    selectedDikeBreakPoint() {
      if (!this.selectedDikeBreakPoint) {
        return;
      }
      // todo:破堤地点番号を比較するようにする
      const index = _.findIndex(
        this.selectedRisk.data.points,
        this.selectedDikeBreakPoint
      );
      if (index !== -1) {
        this.map.closePopup();
        if (this.$refs.markers) {
          this.$refs.markers[index].mapObject.openPopup();
        }
        if (this.selectedDikeBreakPoint.property) {
          this.map.panTo([
            this.selectedDikeBreakPoint.property.lat,
            this.selectedDikeBreakPoint.property.lng
          ]);
        }
      }
    }
  },
  created() {
    this.loadData();
  },
  beforeDestroy() {
    this.$store.commit(rootMutations.UPDATE_SELECTED_DIKE_BREAK_POINT, {
      storeId: this.baseMapData.storeId,
      selectedDikeBreakPoint: null
    });
  },
  methods: {
    loadData() {
      if (!this.river) {
        return;
      }
      this.$store.dispatch(rootActions.LOAD_BIG_RIVER_FLOODING, {
        storeId: this.baseMapData.storeId,
        level: this.level,
        riverId: this.river.id
      });
    },
    onClickBreakPoint(dikeBreakPoint) {
      this.map.closePopup();
      this.$store.commit(rootMutations.UPDATE_SELECTED_DIKE_BREAK_POINT, {
        storeId: this.baseMapData.storeId,
        selectedDikeBreakPoint: dikeBreakPoint
      });
    }
  }
};
</script>
<style lang="scss">
.big-river-flooding-options {
  padding: 0;
}
</style>
<style scoped></style>
