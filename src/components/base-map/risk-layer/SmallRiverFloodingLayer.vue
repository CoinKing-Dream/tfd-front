<template>
  <div v-if="sample">
    <l-image-overlay
      v-if="type === 3"
      :bounds="sampleBounds"
      :url="
        require('../../../assets/images/sample/small-river-flooding/0300_3_5.png')
      "
    >
    </l-image-overlay>
    <l-image-overlay
      v-else-if="type === 1"
      :bounds="sampleBounds"
      :url="
        require('../../../assets/images/sample/small-river-flooding/0300_1_5.png')
      "
    >
    </l-image-overlay>
    <l-image-overlay
      v-else-if="type === 2"
      :bounds="sampleBounds"
      :url="
        require('../../../assets/images/sample/small-river-flooding/0300_2_5.png')
      "
    >
    </l-image-overlay>
  </div>
  <div v-else>
    <l-image-overlay
      v-if="selectedDateRiskData"
      :bounds="smallRiverFloodingRisk.data.bounds"
      :url="selectedDateRiskData.image.src"
    >
    </l-image-overlay>
  </div>
</template>
<script>
import LImageOverlay from "vue2-leaflet/src/components/LImageOverlay";
import {
  rootActions,
  rootGetters,
  rootMutations
} from "../../../store/store-functions";
import _ from "lodash";
import { Risk } from "../../../enums/Risk";
import moment from "moment";

export default {
  name: "SmallRiverFloodingLayer",
  components: { LImageOverlay },
  inject: {
    baseMapData: {
      default: []
    }
  },
  data() {
    return {
      sampleBounds: [
        [35.5, 138.984375],
        [35.85, 139.921875]
      ]
    }
  },
  computed: {
    smallRiverFloodingRisk() {
      return this.$store.getters[rootGetters.FIND_RISK](
        Risk.SMALL_RIVER_FLOODING
      );
    },
    selectedDate() {
      return this.$store.getters[rootGetters.SELECTED_DATE](
        this.baseMapData.storeId
      );
    },
    selectedDateRiskData() {
      if (!this.selectedDate) {
        return;
      }
      return _.find(this.smallRiverFloodingRisk.data.contents, o => {
        return this.selectedDate.isSame(moment.utc(o.date, "YYYY/MM/DD HH:mm"));
      });
    },
    baseDate() {
      return this.$store.getters[rootGetters.BASE_DATE](
        this.baseMapData.storeId
      );
    },
    type() {
      return this.$store.getters[rootGetters.SMALL_RIVER_FLOODING_OPTIONS](
        this.baseMapData.storeId
      ).type;
    },
    sample() {
      return this.$store.getters[rootGetters.SMALL_RIVER_FLOODING_OPTIONS](
        this.baseMapData.storeId
      ).sample;
    }
  },
  watch: {
    baseDate() {
      this.loadData();
    },
    type() {
      this.loadData(true);
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData(safeSelectedDate=false) {
      const params = {
        storeId: this.baseMapData.storeId,
        type: this.type
      };
      if (safeSelectedDate) {
        params.selectedDate = this.selectedDate
      }
      this.$store.dispatch(rootActions.LOAD_SMALL_RIVER_FLOODING, params);
    }
  }
};
</script>

<style scoped></style>
