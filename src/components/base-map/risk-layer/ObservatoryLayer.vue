<template> </template>

<script>
import _ from "lodash";
import {
  rootMutations,
  rootGetters,
  rootActions
} from "../../../store/store-functions";
import { Risk } from "../../../enums/Risk";

import L from "leaflet";
import { LMarker, LIcon } from "vue2-leaflet";

export default {
  name: "ObservatoryLayer",
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
      Risk: Risk,
      layer: null,
      markers: []
    };
  },
  computed: {
    map() {
      return this.$store.getters[rootGetters.MAP_OBJECT](
        this.baseMapData.storeId
      );
    },
    selectedObservatory() {
      return this.$store.getters[rootGetters.SELECTED_OBSERVATORY](
        this.baseMapData.storeId
      );
    },
    selectedObservatories() {
      return this.$store.getters[rootGetters.SELECTED_OBSERVATORIES](
        this.baseMapData.storeId
      );
    },
    observatoryRiskContents() {
      return this.$store.getters[rootGetters.FIND_RISK](Risk.OBSERVATORY).data
        .contents;
    },
    multiMapShow() {
      return this.$store.getters[rootGetters.MULTI_MAP_SHOW];
    },
    observatoryOptions() {
      return this.$store.getters[rootGetters.OBSERVATORY_OPTIONS](
        this.baseMapData.storeId
      );
    },
    filter() {
      return this.$store.getters[rootGetters.OBSERVATORY_OPTIONS](
        this.baseMapData.storeId
      ).filter;
    },
    river() {
      return this.$store.getters[rootGetters.OBSERVATORY_OPTIONS](
        this.baseMapData.storeId
      ).river;
    },
    baseDate() {
      return this.$store.getters[rootGetters.BASE_DATE](
        this.baseMapData.storeId
      );
    },
    userInfo() {
      return this.$store.getters[rootGetters.USER_INFO];
    },
    dialogContents() {
      return this.$store.getters[rootGetters.DIALOG](this.baseMapData.storeId)
        .contents;
    }
  },
  watch: {
    baseDate(before, after) {
      if (before.isSame(after)) {
        return;
      }

      this.loadData();
    },
    selectedObservatory(before, after) {
      if (_.isEqual(before, after)) {
        return;
      }
      if (_.has(this.selectedObservatory, "lat") === false) {
        return;
      }
      if (_.has(this.selectedObservatory, "lng") === false) {
        return;
      }

      const layerPoint = this.map.latLngToLayerPoint([
        this.selectedObservatory.lat,
        this.selectedObservatory.lng
      ]);
      if (this.multiMapShow === false) {
        layerPoint.x += window.innerWidth / 4;
      }

      this.map.panTo(this.map.layerPointToLatLng(layerPoint));

      _.forEach(this.markers, (marker, index) => {
        const observatory = marker.options.observatory;
        if (this.selectedObservatory._id === observatory._id) {
          const element = document.getElementById(
            `marker-${this.baseMapData.storeId}-${index}`
          );
          if (element) {
            element.classList.add("outlined-red");
          }
        } else {
          const element = document.getElementById(
            `marker-${this.baseMapData.storeId}-${index}`
          );
          if (element) {
            element.classList.remove("outlined-red");
          }
        }
      });
    },
    selectedObservatories(before, after) {
      if (_.isEqual(before, after)) {
        return;
      }
      _.forEach(this.markers, (marker, index) => {
        const observatory = marker.options.observatory;
        const selectedObservatories = _.find(this.selectedObservatories, {
          _id: observatory._id
        });
        if (selectedObservatories) {
          const element = document.getElementById(
            `marker-${this.baseMapData.storeId}-${index}`
          );
          if (element) {
            element.classList.add("outlined-blue");
          }
        } else {
          const element = document.getElementById(
            `marker-${this.baseMapData.storeId}-${index}`
          );
          if (element) {
            element.classList.remove("outlined-blue");
          }
        }
      });
    },
    observatoryRiskContents() {
      _.forEach(this.markers, marker => {
        marker.off("click").unbindTooltip();
        this.layer.removeLayer(marker);
      });
      if (this.layer) {
        this.map.removeLayer(this.layer);
      }

      const markers = [];
      _.forEach(this.observatoryRiskContents, (observatory, index) => {
        const marker = this.generateMarkerByObservatory(observatory, index);
        markers.push(marker);
      });
      this.markers = markers;
      this.layer = L.layerGroup();

      _.forEach(this.markers, marker => {
        const observatory = marker.options.observatory;
        if (
          this.filter.includes(observatory.type) &&
          this.isSelectedRiver(observatory)
        ) {
          this.layer.addLayer(marker);
        }
      });
      this.map.addLayer(this.layer);
    },
    filter() {
      if (this.layer) {
        this.layer.clearLayers();
      }

      _.forEach(this.markers, marker => {
        const observatory = marker.options.observatory;

        if (
          this.filter.includes(observatory.type) &&
          this.isSelectedRiver(observatory)
        ) {
          this.layer.addLayer(marker);
        }
      });
    },
    river() {
      if (this.layer) {
        this.layer.clearLayers();
      }

      _.forEach(this.markers, marker => {
        const observatory = marker.options.observatory;
        if (
          this.filter.includes(observatory.type) &&
          this.isSelectedRiver(observatory)
        ) {
          this.layer.addLayer(marker);
        }
      });
    }
  },
  created() {
    if (!this.selectedObservatory) {
      this.loadData();
    } else {
      const markers = [];

      _.forEach(this.observatoryRiskContents, (observatory, index) => {
        const marker = this.generateMarkerByObservatory(observatory, index);
        markers.push(marker);
      });
      this.markers = markers;
      this.layer = L.layerGroup();

      _.forEach(this.markers, marker => {
        const observatory = marker.options.observatory;

        if (
          this.filter.includes(observatory.type) &&
          this.isSelectedRiver(observatory)
        ) {
          this.layer.addLayer(marker);
        }
      });
      this.map.addLayer(this.layer);
    }
  },
  mounted() {},
  beforeDestroy() {
    this.$store.commit(rootMutations.UPDATE_DIALOG, {
      storeId: this.baseMapData.storeId,
      dialog: {
        isShowing: false
      }
    });

    _.forEach(this.markers, marker => {
      marker.off("click").unbindTooltip();
    });
    this.layer.clearLayers();

    if (this.map) {
      this.map.removeLayer(this.layer);
    }
  },
  methods: {
    async loadData() {
      await this.$store
        .dispatch(rootActions.LOAD_OBSERVATORY, this.baseMapData.storeId);

      if (_.has(this.selectedObservatory, "_id")) {
        if (this.dialogContents === "river-level-detail") {
          this.loadObservatoryDetailData();
        }
        this.loadObservatoryData();
      } else {
        this.setSelectedObservatoryByCookie();
      }
    },
    loadObservatoryData() {
      this.$store.dispatch(rootActions.LOAD_OBSERVATION_DATA, {
        storeId: this.baseMapData.storeId,
        observatoryId: this.selectedObservatory._id,
        ids: this.getClosestObservatory(this.selectedObservatory),
        isRiverArea: this.observatoryOptions.river.value !== -1
      });
    },
    loadObservatoryDetailData() {
      return this.$store.dispatch(rootActions.LOAD_OBSERVATION_DETAIL_DATA, {
        storeId: this.baseMapData.storeId,
        observatoryId: this.selectedObservatory._id
      });
    },
    getOnClickObservatoryListener(observatory) {
      return () => {
        if (this.baseMapData.readOnly) {
          return;
        }

        this.$store.dispatch(rootActions.LOAD_OBSERVATION_DATA, {
          storeId: this.baseMapData.storeId,
          observatoryId: observatory._id,
          ids: this.getClosestObservatory(observatory),
          isRiverArea: this.observatoryOptions.river.value !== -1
        });

        this.$store.commit(rootMutations.UPDATE_DIALOG, {
          storeId: this.baseMapData.storeId,
          dialog: {
            isShowing: true,
            cols: 6,
            title: "観測所",
            contents: "observatory-list"
          }
        });
      };
    },
    getClosestObservatory(observatory) {
      const filtered = _.filter(this.observatoryRiskContents, {
        type: observatory.type
      });
      let ids = _.sortBy(filtered, o => {
        return (
          Math.abs(observatory.lat - o.lat) + Math.abs(observatory.lng - o.lng)
        );
      }).slice(0, 9);
      return (ids = _.map(ids, "_id"));
    },
    getIcon(observatory) {
      switch (observatory.type) {
        case "水位":
          return "mdi-triangle";
        case "カメラ":
          return "mdi-camera";
        case "雨量":
          return "mdi-checkbox-blank-circle";
        case "水門":
          return "mdi-view-sequential";
        case "調節池":
          return "mdi-car-windshield";
        default:
          return "mdi-help";
      }
    },
    getIconSize(observatory) {
      switch (observatory.type) {
        case "水位":
          return 20;
        case "カメラ":
          return 16;
        case "雨量":
          return 20;
        case "水門":
          return 20;
        case "調節池":
          return 20;
        default:
          return 20;
      }
    },
    getIconColor(observatory) {
      switch (observatory.type) {
        case "水位":
          switch (observatory.status) {
            case "deficit":
              return "#AAAAAA";
            case "normal":
              return "#233559";
            case "standby":
              return "#008000";
            case "warning":
              return "#FFA500";
            case "dangerous":
              return "#AD02AD";
            case "outbreak":
              return "#FF0000";
            default:
              return "#233559";
          }
        case "カメラ":
          return "#BF045B";
        case "雨量":
          switch (observatory.status) {
            case "deficit":
              return "#AAAAAA";
            case "0":
              return "#233559";
            case "1":
              return "#1E42AF";
            case "2":
              return "#D88100";
            case "3":
              return "#800080";
            case "4":
              return "#FF0000";
            default:
              return "#233559";
          }
        case "水門":
          switch (observatory.status) {
            case -1:
              return "#AAAAAA";
            case 2:
              return "#233559";
            case 1:
              return "#D88100";
            case 0:
              return "#FF0000";
            default:
              return "#233559";
          }
        case "調節池":
          switch (observatory.status) {
            case -1:
              return "#AAAAAA";
            case 0:
              return "#233559";
            case 1:
              return "#008000";
            case 2:
              return "#D88100";
            case 3:
              return "#800080";
            case 4:
              return "#FF0000";
            default:
              return "#AAAAAA";
          }
        default:
          return "#233559";
      }
    },
    isSelectedRiver(observatory) {
      if (this.observatoryOptions.river.value === -1) {
        return true;
      } else {
        if (
          observatory.type === "水位" &&
          this.observatoryOptions.river.value === observatory.riverAreaId
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    generateMarkerByObservatory(observatory, index) {
      const iconName = this.getIcon(observatory);
      const iconColor = this.getIconColor(observatory);
      const iconSize = this.getIconSize(observatory);

      const selectedObservatories = _.find(this.selectedObservatories, {
        _id: observatory._id
      });
      const outlineBlue = selectedObservatories ? "outlined-blue" : "";
      const outlineRed =
        this.selectedObservatory &&
        this.selectedObservatory._id === observatory._id
          ? "outlined-red"
          : "";

      const icon = L.divIcon({
        className: "l-icon-custom",
        iconSize: [16, 16],
        iconAnchor: [8, 16],
        tooltipAnchor: [0, -20],
        html: `<i aria-hidden="true" id="marker-${this.baseMapData.storeId}-${index}" class="v-icon notranslate mdi ${iconName} ${outlineBlue} ${outlineRed} theme--light" style="font-size: ${iconSize}px; color: ${iconColor}; caret-color: rgb(35, 53, 89);"></i>`
      });

      let tooltip = `（${observatory.type}）${observatory.name}`;
      if (observatory.type === "水門") {
        const door = (() => {
          switch (observatory.status) {
            case -1:
              return "休止・欠測等";
            case 2:
              return "全開";
            case 1:
              return "半開";
            case 0:
              return "全閉";
          }
        })();
        tooltip += `<br>開閉：${door}`;
      }

      return L.marker([observatory.lat, observatory.lng], {
        icon: icon,
        observatory: observatory
      })
        .on("click", this.getOnClickObservatoryListener(observatory))
        .bindTooltip(tooltip, {
          direction: "top"
        });
    },
    setSelectedObservatoryByCookie() {
      this.$nextTick(() => {
        const observatoryId =
          this.$cookies.get("observatoryId") ||
          this.userInfo.mainObservatoryId ||
          "99999-2D12";
        const observatory = _.find(this.observatoryRiskContents, {
          _id: observatoryId
        });

        if (observatory) {
          const onClickObservatory = this.getOnClickObservatoryListener(
            observatory
          );
          onClickObservatory();
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../../common";

$shadow-color-blue: #4e9cff;
$shadow-color-red: #fa2d33;
.outlined-blue {
  text-shadow: -4px -4px 4px $shadow-color-blue, 4px -4px 4px $shadow-color-blue,
    -4px 4px 4px $shadow-color-blue, 4px 4px 4px $shadow-color-blue;
}
.outlined-red {
  text-shadow: -4px -4px 4px $shadow-color-red, 4px -4px 4px $shadow-color-red,
    -4px 4px 4px $shadow-color-red, 4px 4px 4px $shadow-color-red;
}
</style>
