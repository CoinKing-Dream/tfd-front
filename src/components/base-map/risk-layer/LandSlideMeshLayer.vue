<template>
  <l-image-overlay
    v-if="selectedDateRiskData"
    :bounds="landSlideMeshRisk.data.bounds"
    :url="selectedDateRiskData.image.src"
    :opacity="opacity"
  ></l-image-overlay>
</template>

<script>
import {
  rootActions,
  rootGetters,
  rootMutations
} from "../../../store/store-functions";
import moment from "moment";
import { Risk } from "../../../enums/Risk";
import _ from "lodash";
import LImageOverlay from "vue2-leaflet/src/components/LImageOverlay";

export default {
  name: "LandSlideMeshLayer",
  components: { LImageOverlay },
  inject: {
    baseMapData: {
      default: []
    }
  },
  computed: {
    landSlideMeshRisk() {
      return this.$store.getters[rootGetters.FIND_RISK](Risk.LAND_SLIDE_MESH);
    },
    selectedDate() {
      return this.$store.getters[rootGetters.SELECTED_DATE](
        this.baseMapData.storeId
      );
    },
    selectedDateRiskData() {
      return _.find(this.landSlideMeshRisk.data.contents, o => {
        return this.selectedDate.isSame(moment.utc(o.date, "YYYY/MM/DD HH:mm"));
      });
    },
    baseDate() {
      return this.$store.getters[rootGetters.BASE_DATE](
        this.baseMapData.storeId
      );
    },
    opacity() {
      return this.$store.getters[rootGetters.LAND_SLIDE_MESH_OPTIONS](
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
      this.$store.dispatch(
        rootActions.LOAD_LAND_SLIDE_MESH,
        this.baseMapData.storeId
      );
    }
  }
};
</script>

<style scoped></style>
