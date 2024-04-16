<template>
  <l-image-overlay
    v-if="selectedDateRiskData"
    :bounds="xRainRisk.data.bounds"
    :url="selectedDateRiskData.image.src"
    :opacity="opacity"
  ></l-image-overlay>
</template>
<script>
import LImageOverlay from "vue2-leaflet/src/components/LImageOverlay";
import {
  rootMutations,
  rootActions,
  rootGetters
} from "../../../store/store-functions";
import _ from "lodash";
import { Risk } from "../../../enums/Risk";
import moment from "moment";

export default {
  name: "XRainLayer",
  components: { LImageOverlay },
  inject: {
    baseMapData: {
      default: []
    }
  },
  props: {
    storeId: {
      type: Number,
      require: false,
      default: -1
    }
  },
  computed: {
    xRainRisk() {
      return this.$store.getters[rootGetters.FIND_RISK](Risk.X_RAIN);
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
      return _.find(this.xRainRisk.data.contents, o => {
        return this.selectedDate.isSame(moment.utc(o.date, "YYYY/MM/DD HH:mm"));
      });
    },
    baseDate() {
      return this.$store.getters[rootGetters.BASE_DATE](
        this.baseMapData.storeId
      );
    },
    opacity() {
      return this.$store.getters[rootGetters.X_RAIN_OPTIONS](
        this.baseMapData.storeId
      ).opacity;
    }
  },
  watch: {
    baseDate() {
      this.loadData();
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$store.dispatch(rootActions.LOAD_X_RAIN, this.baseMapData.storeId);
    }
  }
};
</script>

<style scoped></style>
