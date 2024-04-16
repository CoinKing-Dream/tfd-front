<template>
  <l-marker v-if="show" :lat-lng="latlng">
    <l-icon
      :icon-size="[36, 36]"
      :icon-anchor="[18, 36]"
      :popupAnchor="[0, -30]"
    >
      <div class="address-marker">
        <v-icon color="#facc33" large>mdi-map-marker-radius</v-icon>
        <v-card class="address pa-2 mb-3">
          <div class="pref" v-if="pref">{{ pref }}</div>
          <div class="city" v-if="city">{{ city }}</div>
        </v-card>
      </div>
    </l-icon>
  </l-marker>
</template>

<script>
import { LMarker } from "vue2-leaflet";
import { LIcon } from "vue2-leaflet";
import { rootGetters } from "../../store/store-functions";
import axios from "axios";
import { GSI } from "../../enums/Muni";
export default {
  name: "AddressMarker",
  components: {
    "l-marker": LMarker,
    "l-icon": LIcon
  },
  inject: {
    baseMapData: {
      default: []
    }
  },
  data() {
    return {
      show: false,
      latlng: null,
      pref: null,
      city: null
    };
  },
  computed: {
    map() {
      return this.$store.getters[rootGetters.MAP_OBJECT](
        this.baseMapData.storeId
      );
    },
    addressMarker() {
      const mapTool = this.$store.getters[rootGetters.MAP_TOOL](
        this.baseMapData.storeId
      );
      if (mapTool) {
        return mapTool.addressMarker;
      }
    }
  },
  watch: {
    addressMarker() {
      if (this.addressMarker) {
        this.map.on("click", this.searchByLatLng);
      } else {
        this.show = false;
        this.latlng = null;
        if (this.map) {
          this.map.off("click", this.searchByLatLng);
        }
      }
    }
  },
  beforeDestroy() {
    this.show = false;
    this.latlng = null;
    if (this.map) {
      this.map.off("click", this.searchByLatLng);
    }
  },
  methods: {
    searchByLatLng(e) {
      this.pref = null;
      this.address = null;
      axios
        .create({
          responseType: "json",
          baseURL: "https://mreversegeocoder.gsi.go.jp"
        })
        .get("/reverse-geocoder/LonLatToAddress", {
          params: {
            lat: e.latlng.lat,
            lon: e.latlng.lng
          }
        })
        .then(response => {
          this.show = true;
          this.latlng = e.latlng;
          if (response.data.results) {
            this.pref = GSI.MUNI_ARRAY[response.data.results.muniCd];
            this.city = response.data.results.lv01Nm;
          } else {
            //todo 検索結果がありません。
          }
        })
        .catch(err => [err]);
    }
  }
};
</script>

<style lang="scss" scoped>
.address-marker {
  height: 36px;
  width: 36px;
  position: relative;
}
.address {
  position: absolute;
  background-color: white;
  width: 150px;
  max-width: inherit;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  .pref {
    color: rgba(0, 0, 0, 0.7);
  }
  .city {
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
