<template>
  <div class="dynamic-contents">
    <div class="map-area">
      <base-map :initial-store-id="storeId"></base-map>
    </div>
  </div>
</template>

<script>
import { rootMutations, rootGetters } from "../../../store/store-functions";
import BaseMap from "../../../components/base-map/BaseMap";

import { Risk } from "../../../enums/Risk";
import { BaseTile } from "../../../enums/BaseTile";
import moment from "moment";

export default {
  name: "DynamicContents",
  components: { BaseMap },
  props: {
    storeId: {
      type: Number,
      require: true,
      default: -1
    },
    risk: {
      type: Object,
      require: true,
      default: Risk.RAIN
    },
    baseDate: {
      type: Object,
      require: true,
      default: () => moment()
    },
    addHour: {
      type: Number,
      require: false,
      default: -1
    }
  },
  data() {
    return {
      setData: false
    };
  },
  computed: {
    selectedDate() {
      return this.$store.getters[rootGetters.SELECTED_DATE](this.storeId);
    },
    colorLegend() {
      return this.$store.getters[rootGetters.COLOR_LEGEND](this.storeId);
    }
  },
  watch: {
    selectedDate() {
      if (!this.selectedDate) {
        return;
      }
      if (!this.setData && this.addHour !== -1) {
        this.$store.commit(rootMutations.UPDATE_SELECTED_DATE, {
          storeId: this.storeId,
          selectedDate: this.selectedDate.clone().add(this.addHour, "hours")
        });

        this.setData = true;
      }
    },
    baseDate() {
      const storeId = this.storeId;
      this.$store.commit(rootMutations.UPDATE_BASE_DATE, {
        storeId,
        baseDate: moment(this.baseDate)
      });

      this.setData = false;
    }
  },
  created() {
    this.initMapData(this.storeId, {
      selectedBaseTile: BaseTile.GRAY,
      selectedRiskType: this.risk,
      baseDate: this.baseDate
    });
  },
  beforeDestroy() {
    this.removeMapData(this.storeId);
  },
  methods: {
    isArray(o) {
      return Array.isArray(o);
    },
    initMapData(storeId, mapData) {
      this.$store.commit(rootMutations.INIT_MAP_DATA, { storeId, mapData });
    },
    removeMapData(storeId) {
      this.$store.commit(rootMutations.REMOVE_MAP_DATA, storeId);
    }
  }
};
</script>

<style lang="scss" scoped>
.dynamic-contents {
  position: relative;
}
</style>
