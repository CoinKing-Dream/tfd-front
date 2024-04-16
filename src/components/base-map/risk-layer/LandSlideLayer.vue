<template>
  <div>
    <template v-if="sample">
      <l-image-overlay
        :bounds="[
          [35.416666666, 140],
          [35.91666666, 138.75]
        ]"
        :url="
          require('../../../assets/images/sample/land-slide/land-slide3.png')
        "
        :opacity="opacity"
      >
      </l-image-overlay>
    </template>
    <template v-else>
      <l-image-overlay
        v-if="selectedDateRiskData"
        :bounds="landSlideRisk.data.bounds"
        :url="selectedDateRiskData.image.src"
        :opacity="opacity"
      ></l-image-overlay>
    </template>
  </div>
</template>

<script>
import LImageOverlay from "vue2-leaflet/src/components/LImageOverlay";
import {
  rootActions,
  rootGetters,
  rootMutations
} from "../../../store/store-functions";
import { Risk } from "../../../enums/Risk";
import _ from "lodash";
import moment from "moment";
export default {
  name: "LandSlideLayer",
  components: { LImageOverlay },
  inject: {
    baseMapData: {
      default: []
    }
  },
  computed: {
    landSlideRisk() {
      return this.$store.getters[rootGetters.FIND_RISK](Risk.LAND_SLIDE);
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
      return _.find(this.landSlideRisk.data.contents, o => {
        return this.selectedDate.isSame(moment.utc(o.date, "YYYY/MM/DD HH:mm"));
      });
    },
    baseDate() {
      return this.$store.getters[rootGetters.BASE_DATE](
        this.baseMapData.storeId
      );
    },
    sample() {
      return this.$store.getters[rootGetters.LAND_SLIDE_OPTIONS](
        this.baseMapData.storeId
      ).sample;
    },
    opacity() {
      return this.$store.getters[rootGetters.LAND_SLIDE_OPTIONS](
        this.baseMapData.storeId
      ).opacity;
    },
    level() {
      return this.$store.getters[rootGetters.LAND_SLIDE_OPTIONS](
        this.baseMapData.storeId
      ).level;
    }
  },
  watch: {
    baseDate() {
      this.loadData();
    },
    level() {
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
        level: this.level
      };
      if (safeSelectedDate) {
        params.selectedDate = this.selectedDate
      }
      this.$store.dispatch(rootActions.LOAD_LAND_SLIDE, params);
    }
  }
};
</script>

<style scoped></style>
