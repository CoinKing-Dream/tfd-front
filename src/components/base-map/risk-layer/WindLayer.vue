<template></template>

<script>
import {
  rootActions,
  rootGetters,
  rootMutations
} from "../../../store/store-functions";
import { Risk } from "../../../enums/Risk";
import _ from "lodash";

import L from "leaflet";
import "leaflet-velocity/dist/leaflet-velocity.css";
import "leaflet-velocity";
import sampleData from "../../../assets/sample/wind.json";
import moment from "moment";

export default {
  name: "WindLayer",
  inject: {
    baseMapData: {
      default: []
    }
  },
  data() {
    return {
      layer: L.velocityLayer({
        displayValues: false,
        displayOptions: {
          velocityType: "GBR Wind",
          displayPosition: "bottomleft",
          displayEmptyString: "No wind data"
        },
        data: [],
        lineWidth: 3,
        colorScale: [
          "rgb(252,217,125)",
          "rgb(252,217,125)",
          "rgb(255,182,100)",
          "rgb(255,182,100)",
          "rgb(252,150,75)",
          "rgb(252,150,75)",
          "rgb(250,122,52)",
          "rgb(250,122,52)",
          "rgb(245,64,32)",
          "rgb(245,64,32)",
          "rgb(237,45,28)",
          "rgb(237,45,28)",
          "rgb(220,24,32)",
          "rgb(220,24,32)",
          "rgb(180,0,35)",
          "rgb(180,0,35)"
        ],
        minVelocity: 0,
        maxVelocity: 15,
        velocityScale: this.windScale,
        onAdd: null,
        onRemove: null,
        paneName: "overlayPane"
      }),
      rectangleLayer: null,
      windScale: 0.005,
      windSpeed: 0,
      windDirection: 0
    };
  },
  computed: {
    map() {
      return this.$store.getters[rootGetters.MAP_OBJECT](
        this.baseMapData.storeId
      );
    },
    windRisk() {
      return this.$store.getters[rootGetters.FIND_RISK](Risk.WIND);
    },
    selectedDate() {
      return this.$store.getters[rootGetters.SELECTED_DATE](
        this.baseMapData.storeId
      );
    },
    selectedDateRiskData() {
      return _.find(this.windRisk.data.contents, o => {
        return this.selectedDate.isSame(moment.utc(o.date, "YYYY/MM/DD HH:mm"));
      });
    },
    selectedDateWind() {
      const data = _.find(this.windRisk.data.contents, o => {
        return this.selectedDate.isSame(moment.utc(o.date, "YYYY/MM/DD HH:mm"));
      });

      if (data && data.json) {
        return data.json;
      } else {
        return undefined;
      }
    },
    baseDate() {
      return this.$store.getters[rootGetters.BASE_DATE](
        this.baseMapData.storeId
      );
    },
    height() {
      return this.$store.getters[rootGetters.WIND_OPTIONS](
        this.baseMapData.storeId
      ).height;
    },
    sample() {
      return this.$store.getters[rootGetters.WIND_OPTIONS](
        this.baseMapData.storeId
      ).sample;
    }
  },
  watch: {
    baseDate() {
      this.map.removeLayer(this.layer);
      this.loadWindDateList();
    },
    height() {
      this.map.removeLayer(this.layer);
      this.loadWindDateList(true);
    },
    sample() {
      if (this.sample) {
        if (!this.map.hasLayer(this.layer)) {
          this.map.addLayer(this.layer);
        }
        this.layer.setData(sampleData);
        this.updateLoading(false);
      } else {
        this.map.removeLayer(this.layer);
        this.loadWindDateList();
      }
    },
    selectedDateRiskData() {
      this.loadWind(this.selectedDateRiskData.date);
    },
    selectedDateWind() {
      if (this.selectedDateWind) {
        if (!this.map.hasLayer(this.layer)) {
          this.map.addLayer(this.layer);
        }
        this.layer.setData(this.selectedDateWind);
        this.updateLoading(false);
      } else {
        this.map.removeLayer(this.layer);
      }
    }
  },
  created() {
    this.loadWindDateList();
  },
  mounted() {
    this.map.on("mousemove", this.addMouseMoveListener);
    // todo: rectangle描画これでよい？
    this.rectangleLayer = L.layerGroup([
      L.rectangle(
        [
          [37.359001, 137.899993],
          [34.209, 141.178]
        ],
        {
          color: "#FF0000",
          weight: 3,
          opacity: 1,
          fillColor: "#FFFFFF",
          fillOpacity: 0
        }
      )
    ]);
    this.map.addLayer(this.rectangleLayer);
  },
  beforeDestroy() {
    if (this.map) {
      this.map.off("mousemove", this.addMouseMoveListener);
      this.map.removeLayer(this.layer);
      this.map.removeLayer(this.rectangleLayer);
    }
  },
  methods: {
    loadWindDateList(safeSelectedDate=false) {
      this.updateLoading(true);
      const params = {
        storeId: this.baseMapData.storeId,
        height: this.height,
      }
      if (safeSelectedDate) {
        params.selectedDate= this.selectedDate
      }
      this.$store.dispatch(rootActions.LOAD_WIND_DATE_LIST, params);
    },
    loadWind(date) {
      this.updateLoading(true);
      this.$store.dispatch(rootActions.LOAD_WIND, {
        storeId: this.baseMapData.storeId,
        windDate: date,
        height: this.height
      });
    },
    updateLoading(bool) {
      this.$store.commit(rootMutations.UPDATE_WIND_OPTIONS, {
        storeId: this.baseMapData.storeId,
        windOptions: {
          loading: bool
        }
      });
    },
    addMouseMoveListener(e) {
      if (
        (!this.selectedDateRiskData || !this.selectedDateWind) &&
        !this.sample
      ) {
        return;
      }
      const mousePosition = [e.latlng.lat, e.latlng.lng];
      let temp;
      if (this.sample) {
        temp = sampleData;
      } else {
        temp = this.selectedDateRiskData.json;
      }

      const nx = temp[0].header.nx;
      const ny = temp[0].header.ny;
      const dx = temp[0].header.dx;
      const dy = temp[0].header.dy;
      const leftTopPosition = [temp[0].header.la1, temp[0].header.lo1];
      const rightBottomPosition = [
        leftTopPosition[0] - dy * ny,
        leftTopPosition[1] + dx * nx
      ];
      const windData = [temp[0].data, temp[1].data];

      if (
        leftTopPosition[0] > mousePosition[0] &&
        rightBottomPosition[0] < mousePosition[0] &&
        leftTopPosition[1] < mousePosition[1] &&
        rightBottomPosition[1] > mousePosition[1]
      ) {
        const distanceY = Math.floor(
          Math.abs(mousePosition[0] - leftTopPosition[0]) / dy
        );
        const distanceX = Math.floor(
          Math.abs(mousePosition[1] - leftTopPosition[1]) / dx
        );
        const index = distanceY * nx + distanceX;

        let speed = Math.sqrt(
          Math.pow(windData[0][index], 2) + Math.pow(windData[1][index], 2)
        );
        speed = speed.toFixed(2);

        const windRad = Math.atan2(windData[0][index], windData[1][index]) * -1;
        let direction = (windRad / Math.PI) * 180 + (windRad > 0 ? 0 : 360);
        direction = direction.toFixed(2);

        const storeId = this.baseMapData.storeId;
        const selectedWind = {
          speed,
          direction
        };
        this.$store.commit(rootMutations.UPDATE_SELECTED_WIND, {
          storeId,
          selectedWind
        });
      }
    }
  }
};
</script>
