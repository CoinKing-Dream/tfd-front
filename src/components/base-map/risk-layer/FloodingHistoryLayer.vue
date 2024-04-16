<template>
  <div>
    <template v-if="zoom >= minZoom">
      <template v-for="(geojson, index) in riskData">
        <template v-if="!areaSelectMode">
          <l-geo-json
            :key="index"
            :geojson="geojson"
            :optionsStyle="styleFunction(geojson)"
          ></l-geo-json>
        </template>
      </template>
      <l-marker
        v-if="!areaSelectMode && popupPosition"
        :lat-lng="popupPosition"
        :icon="null"
        ref="marker"
      >
        <l-icon><div></div></l-icon>
        <l-popup
          ref="popup"
          :options="{
            autoClose: false,
            closeOnClick: false,
            maxWidth: '500px'
          }"
        >
          <div v-if="selectedArea && !removeMode" class="selected-area-info">
            <div class="area-title">
              浸水実績
            </div>
            <v-row no-gutters>
              <v-col cols="4">{{ selectedArea.createUser.key }}</v-col>
              <v-col>{{ selectedArea.createUser.value }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="4">{{ selectedArea.type.key }}</v-col>
              <v-col>{{ selectedArea.type.value }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="4">{{ selectedArea.cause.key }}</v-col>
              <v-col>{{ selectedArea.cause.value }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="4">{{ selectedArea.from.key }}</v-col>
              <v-col>{{ selectedArea.from.value }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="4">{{ selectedArea.remarks.key }}</v-col>
              <v-col>{{ selectedArea.remarks.value }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="4">{{ selectedArea.createTime.key }}</v-col>
              <v-col>{{ selectedArea.createTime.value }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="4">{{ selectedArea.updateTime.key }}</v-col>
              <v-col>{{ selectedArea.updateTime.value }}</v-col>
            </v-row>
            <div class="mt-2" v-if="checkUserType(selectedArea)">
              <v-row no-gutters>
                <v-col>
                  <v-btn
                    x-small
                    block
                    tile
                    ref="areaEditButton"
                    @click="editFloodingHistory()"
                  >
                    修正
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    x-small
                    block
                    tile
                    color="error"
                    ref="onRemoveMode"
                    @click="changeRemoveMode(true)"
                  >
                    削除
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </div>
          <div
            v-else-if="selectedArea && removeMode"
            class="selected-area-info"
          >
            <div class="ma-2 text-center">本当に削除しますか</div>
            <v-row no-gutters>
              <v-col>
                <v-btn
                  x-small
                  block
                  tile
                  ref="offRemoveMode"
                  @click="changeRemoveMode(false)"
                >
                  取り消し
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  x-small
                  block
                  tile
                  color="error"
                  ref="removeButton"
                  @click="removeFloodingHistory(selectedArea._id)"
                >
                  削除確認
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <div v-else-if="selectedList" class="selected-area-info">
            <div class="area-title">
              浸水実績リスト
            </div>
            <table class="selected-list-table">
              <thead>
                <tr>
                  <th>登録者</th>
                  <th>内外水</th>
                  <th>原因</th>
                  <th>出典</th>
                  <th>最終更新日</th>
                </tr>
              </thead>
              <tr
                v-for="(item, i) in selectedList"
                :key="i"
                @click="showAreaInfo(item)"
                style="min-height: 10px;"
              >
                <td>{{ item.createName }}</td>
                <td>{{ item.properties["内外水"] }}</td>
                <td>{{ item.properties["原因"] }}</td>
                <td>{{ item.properties["出典"] }}</td>
                <td>
                  {{
                    dateFormat(item.updateTime) || dateFormat(item.createTime)
                  }}
                </td>
              </tr>
            </table>
          </div>
          <div v-else></div>
        </l-popup>
      </l-marker>
    </template>
    <template v-if="newArea">
      <l-circle-marker
        v-for="(area, i) in newArea"
        :key="i"
        :lat-lng="area"
        :radius="2"
        color="red"
      ></l-circle-marker>
      <l-polygon :lat-lngs="newArea" :color="'#008000'"></l-polygon>
    </template>
  </div>
</template>
<script>
import {
  rootActions,
  rootGetters,
  rootMutations
} from "../../../store/store-functions";
import { Risk } from "../../../enums/Risk";
import {
  LGeoJson,
  LMarker,
  LPopup,
  LPolygon,
  LCircleMarker,
  LIcon
} from "vue2-leaflet";
import _ from "lodash";
import moment from "moment";
import L from "leaflet";

const MANAGER_TYPES = [2, 99];

export default {
  name: "FloodingHistoryLayer",
  components: {
    "l-geo-json": LGeoJson,
    "l-marker": LMarker,
    "l-popup": LPopup,
    "l-icon": LIcon,
    "l-polygon": LPolygon,
    "l-circle-marker": LCircleMarker
  },
  inject: {
    baseMapData: {
      default: []
    }
  },
  data() {
    return {
      minZoom: 14,
      popupPosition: null,
      beforeBounds: [],
      timeout: null,
      selectedList: null,
      selectedArea: null,
      removeMode: false,
      userType: null,
      userId: null
    };
  },
  computed: {
    map() {
      return this.$store.getters[rootGetters.MAP_OBJECT](
        this.baseMapData.storeId
      );
    },
    zoom() {
      return this.map.getZoom();
    },
    riskData() {
      return this.$store.getters[rootGetters.FIND_RISK](Risk.FLOODING_HISTORY)
        .data;
    },
    areaSelectMode: {
      get() {
        return this.$store.getters[rootGetters.FLOODING_HISTORY_OPTIONS](
          this.baseMapData.storeId
        ).areaSelectMode;
      },
      set(areaSelectMode) {
        this.$store.commit(rootMutations.UPDATE_FLOODING_HISTORY_OPTIONS, {
          storeId: this.baseMapData.storeId,
          floodingHistoryOptions: {
            areaSelectMode: areaSelectMode
          }
        });
      }
    },
    newArea: {
      get() {
        return this.$store.getters[rootGetters.FLOODING_HISTORY_OPTIONS](
          this.baseMapData.storeId
        ).newArea;
      },
      set(newArea) {
        this.$store.commit(rootMutations.UPDATE_FLOODING_HISTORY_OPTIONS, {
          storeId: this.baseMapData.storeId,
          floodingHistoryOptions: {
            newArea: newArea
          }
        });
      }
    },
    editAreaInfo: {
      get() {
        return this.$store.getters[rootGetters.FLOODING_HISTORY_OPTIONS](
          this.baseMapData.storeId
        ).editAreaInfo;
      },
      set(editAreaInfo) {
        this.$store.commit(rootMutations.UPDATE_FLOODING_HISTORY_OPTIONS, {
          storeId: this.baseMapData.storeId,
          floodingHistoryOptions: {
            editAreaInfo: editAreaInfo
          }
        });
      }
    }
  },
  watch: {
    areaSelectMode() {
      if (this.areaSelectMode) {
        this.map.off("click", this.mapOnClick);
        this.map.on("click", this.addPointToNewArea);
      } else {
        this.mapMoveEnd();

        this.map.off("click", this.addPointToNewArea);
        this.map.on("click", this.mapOnClick);
      }
    }
  },
  created() {
    this.userType = parseInt(this.$cookies.get("userType"));
    this.userId = this.$cookies.get("userId");
  },
  mounted() {
    this.$root.$emit("showSystemMessage", {
      message: `浸水実績データはズームレベル${this.minZoom}以上から表示できます。`
    });
    this.mapMoveEnd();
    this.map.on("moveend", this.mapMoveEnd);
    this.map.on("popupclose", this.mapPopupClose);
    this.map.on("click", this.mapOnClick);
  },
  beforeDestroy() {
    this.selectedArea = null;
    this.map.off("moveend", this.mapMoveEnd);
    this.map.off("popupclose", this.mapPopupClose);
    this.map.off("click", this.mapOnClick);
    if (this.areaSelectMode) {
      this.map.off("click", this.addPointToNewArea);
    }
    if (this.map) {
      this.map.off("click", this.addPointToNewArea);
    }
  },
  methods: {
    mapMoveEnd() {
      if (this.zoom >= this.minZoom) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.loadData(this.map.getBounds());
          this.beforeBounds = this.map.getBounds();
        }, 100);
      }
    },
    mapPopupClose() {
      this.selectedArea = null;
      this.selectedList = null;
    },
    mapOnClick(e) {
      const selectedList = _.filter(this.riskData, geojson => {
        const polyPoints = geojson.geometry.coordinates[0];
        const centerLatlng = L.latLng(
          geojson.properties.cent_Y,
          geojson.properties.cent_X
        );
        const longDistancePoint = _.maxBy(polyPoints, point => {
          const pointLatlng = L.latLng(point[1], point[0]);
          return this.map.distance(centerLatlng, pointLatlng);
        });
        const longDistancePointLatlng = L.latLng(
          longDistancePoint[1],
          longDistancePoint[0]
        );
        const maxDistance = this.map.distance(
          centerLatlng,
          longDistancePointLatlng
        );
        const clickDistance = this.map.distance(centerLatlng, e.latlng);

        return maxDistance >= clickDistance;
      });

      if (selectedList && selectedList.length > 0) {
        if (selectedList.length === 1) {
          this.popupPosition = [
            selectedList[0].properties.cent_Y,
            selectedList[0].properties.cent_X
          ];
          this.showAreaInfo(selectedList[0]);
        } else if (selectedList.length >= 2) {
          this.selectedArea = null;
          this.popupPosition = [e.latlng.lat, e.latlng.lng];
          this.showAreaList(selectedList);
        }
        this.$nextTick(() => {
          this.$refs.marker.mapObject.openPopup();
        });
      } else {
        this.selectedArea = null;
        this.selectedList = null;
        this.popupPosition = null;
      }
    },
    loadData(bounds) {
      this.$store.dispatch(rootActions.LOAD_FLOODING_HISTORY, bounds);
    },
    showAreaInfo(geojson) {
      if (this.areaSelectMode) {
        return;
      }
      this.selectedList = null;
      this.removeMode = false;

      let coordinates = geojson.geometry.coordinates[0];
      coordinates = _.map(coordinates, o => {
        return _.reverse(Object.assign([], o));
      });

      const userId = geojson.updateId || geojson.createId;
      const userName = geojson.updateName || geojson.createName;
      this.selectedArea = {
        coordinates: coordinates,
        createUser: { key: "登録者", value: userName },
        type: { key: "内外水", value: geojson.properties["内外水"] },
        cause: { key: "原因", value: geojson.properties["原因"] },
        from: { key: "出典", value: geojson.properties["出典"] },
        remarks: { key: "備考", value: geojson.properties["備考"] },
        createTime: {
          key: "登録日",
          value: moment(geojson.createTime).format("YYYY-MM-DD HH:mm")
        },
        updateTime: {
          key: "最終更新日",
          value:
            moment(geojson.updateTime).format("YYYY-MM-DD HH:mm") ||
            moment(geojson.createTime).format("YYYY-MM-DD HH:mm")
        },
        userName: userName,
        userId: userId,
        _id: geojson._id
      };
    },
    showAreaList(list) {
      this.selectedList = list;
    },
    styleFunction(geojson) {
      if (!geojson) {
        return;
      }
      const id = geojson.updateId || geojson.createId;
      return () => {
        if (this.selectedArea && this.selectedArea._id === geojson._id) {
          return {
            weight: 3,
            color: "#3ec030",
            opacity: 1,
            fillColor: "#3ec030",
            fillOpacity: 1
          };
        } else {
          const isIncludes = _.find(this.selectedList, { _id: geojson._id });
          if (isIncludes) {
            return {
              weight: 3,
              color: "#3ec030",
              opacity: 1,
              fillColor: "#3ec030",
              fillOpacity: 0.2
            }
          }
        }

        if (id === "system") {
          return {
            weight: 3,
            color: "#3388ff",
            opacity: 1,
            fillColor: "#3388ff",
            fillOpacity: 0.2
          };
        } else {
          return {
            weight: 3,
            color: "#ff632c",
            opacity: 1,
            fillColor: "#ff632c",
            fillOpacity: 0.2
          };
        }
      };
    },
    addPointToNewArea(e) {
      if (!this.newArea) {
        this.newArea = [];
      }
      this.newArea.push([e.latlng.lat, e.latlng.lng]);
    },
    removeFloodingHistory(_id) {
      this.$store
        .dispatch(rootActions.DELETE_FLOODING_HISTORY, {
          _id: _id
        })
        .then(({ err, response }) => {
          if (err) {
            throw new Error("load failed : /flood_history/remove");
          }

          this.selectedArea = null;
          this.selectedList = null;
          this.popupPosition = null;
        });
    },
    editFloodingHistory() {
      this.areaSelectMode = true;
      this.newArea = _.clone(this.selectedArea.coordinates);
      this.editAreaInfo = _.clone(this.selectedArea);

      this.$nextTick(() => {
        this.selectedArea = null;
      });
    },
    changeRemoveMode(mode) {
      this.removeMode = mode;
    },
    dateFormat(time) {
      return moment(time).format("YYYY-MM-DD HH:mm");
    },
    checkUserType() {
      if (MANAGER_TYPES.includes(this.userType)) {
        return true;
      } else {
        if (this.userId === this.selectedArea.userId) {
          return true;
        }
      }

      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
.selected-area-info {
  width: 500px;
  .area-title {
    text-align: center;
    background-color: #0d47a1;
    color: white;
  }

  table,
  td,
  th {
    border: 1px solid black;
    border-collapse: collapse;
  }
  table {
    width: 100%;
  }
  table tr:hover {
    background-color: #eeeeee;
    cursor: pointer;
  }
  table td,
  th {
    padding: 2px;
  }
}
</style>
