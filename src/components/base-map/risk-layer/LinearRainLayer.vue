<template>
  <l-geo-json
    v-if="geojson"
    :geojson="geojson"
    :options="{ style: styleFunction }"
  ></l-geo-json>
</template>
<script>
import { rootGetters } from "../../../store/store-functions";
import axios from "axios";
import { LGeoJson } from "vue2-leaflet";

export default {
  name: "LinearRainLayer",
  inject: {
    baseMapData: {
      default: []
    }
  },
  components: {
    LGeoJson
  },
  data() {
    return {
      geojson: null
    };
  },
  computed: {
    selectedDate() {
      return this.$store.getters[rootGetters.SELECTED_DATE](
        this.baseMapData.storeId
      );
    },
    baseDate() {
      return this.$store.getters[rootGetters.BASE_DATE](
        this.baseMapData.storeId
      );
    }
  },
  watch: {
    selectedDate() {
      this.fetchData();
    }
  },
  mounted() {},
  methods: {
    async fetchData(date = this.selectedDate) {
      this.geojson = null;
      if (date.diff(this.baseDate) > 0) {
        return;
      }
      const tempDate = date.clone();
      tempDate.minutes(Math.floor(tempDate.minutes() / 10) * 10);
      let YYYYMMDD = tempDate.utc().format("YYYYMMDD");
      let HHmm = tempDate.utc().format("HHmm");

      try {
        const res = await axios.get(
          `https://d5okuvtehhzjw.cloudfront.net/${YYYYMMDD}/${YYYYMMDD}_${HHmm}.geojson`
        );
        this.geojson = res.data;
      } catch (error) {}
    },
    styleFunction(feature) {
      const style = {
        weight: 5,
        color: "red",
        opacity: 1,
        fillOpacity: 0,
        "z-index": 20000
      };

      if (feature.properties.FCSTTYPE === "2") {
        style.weight = 3;
        style.dashArray = "10, 10";
      }

      return style;
    }
  }
};
</script>
