<template>
  <div class="settings">
    <div class="settings-header">
      <v-row no-gutters align="center" justify="end">
        <v-col>
          <v-btn
            x-small
            class="ma-2"
            text
            color="white"
            @click="onClickDialogCloseButton"
          >
            <v-icon left>mdi-chevron-left</v-icon> ダッシュボード
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="page pa-4">
      <div>
        <h2>水位観測所</h2>
        <div class="mt-2">
          TOP画面・印刷画面・アラート配信対象観測所を設定します。最大20地点の登録が可能です。また、オレンジマークの観測所は地図中心にくる観測所をあらわしてます。
        </div>
        <v-card>
          <v-row no-gutters justify="center" align="stretch">
            <v-col>
              <div style="height: 100%; min-height: 442px">
                <l-map ref="riverLevelMap" :zoom="zoom" :center="center">
                  <l-tile-layer
                    :url="url"
                    :center="center"
                    :zoom="zoom"
                    :attribution="attribution"
                  ></l-tile-layer>
                  <template v-for="o in riverLevelObservatories">
                    <l-marker
                      :lat-lng="o.latlng"
                      @click="onClickRiverLevelMarker(o)"
                    >
                      <l-icon :icon-size="[16, 16]" :icon-anchor="[8, 16]">
                        <v-icon
                          :color="
                            o.link
                              ? userInfo.mainObservatoryId === o.observatoryId
                                ? '#fb8c00'
                                : 'blue'
                              : 'black'
                          "
                          >mdi-triangle</v-icon
                        >
                      </l-icon>
                      <l-tooltip :options="{ direction: 'top' }">
                        {{ o.name }}
                      </l-tooltip>
                    </l-marker>
                  </template>
                </l-map>
              </div>
            </v-col>
            <v-col>
              <v-card outlined>
                <v-card-title>
                  水位観測所
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="riverLevelSearch"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    class="ml-2"
                  ></v-text-field>
                </v-card-title>
                <v-row no-gutters justify="end" class="pr-4 my-2">
                  <v-checkbox
                    v-model="riverLevelOnlyLink"
                    dense
                    hide-details
                    :label="'リンクのみ'"
                    @change="onClickRiverLevelOnlyLink"
                  >
                  </v-checkbox>
                </v-row>
                <v-data-table
                  dense
                  :headers="riverLevelHeaders"
                  :items="riverLevelObservatories"
                  :search="riverLevelSearch"
                  :page.sync="riverLevelPage"
                  @click:row="onClickRiverLevelRow"
                >
                  <template v-slot:item.link="{ item }">
                    <v-row no-gutters justify="center" class="text-center">
                        <v-checkbox
                          v-if="
                            userInfo.mainObservatoryId !== item.observatoryId
                          "
                          dense
                          hide-details
                          v-model="item.link"
                          :disabled="!item.link && !riverLevelCheckBoxVisible"
                          @change="onChangeRiverLevelLinkCheckbox"
                        ></v-checkbox>
                        <v-btn
                          v-if="item.link"
                          small
                          icon
                          :color="
                            userInfo.mainObservatoryId === item.observatoryId
                              ? '#fb8c00'
                              : 'default'
                          "
                          @click="onClickMainObservatory(item)"
                        >
                          <v-icon>mdi-map-marker</v-icon>
                        </v-btn>
                    </v-row>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
        <div class="mt-6">
          <h2>雨量観測所</h2>
        </div>
        <!--        <div class="mt-2">-->
        <!--          アラート配信の基準値を設定します。-->
        <!--        </div>-->
        <!--        <v-card>-->
        <!--          <v-row no-gutters align="center">-->
        <!--            <v-col>-->
        <!--              <v-row no-gutters align="center" class="px-6">-->
        <!--                <v-col cols="auto">-->
        <!--                  <v-checkbox-->
        <!--                    hide-details-->
        <!--                    v-model="rainfallWarningVisible"-->
        <!--                    @change="updateAlertsSettings"-->
        <!--                  ></v-checkbox>-->
        <!--                </v-col>-->
        <!--                <v-col cols="2" class="text-center">雨量注意報</v-col>-->
        <!--                <v-col class="px-2" v-if="rainfallWarningVisible">-->
        <!--                  <v-text-field-->
        <!--                    v-model="rainfallWarningLimit"-->
        <!--                    ref="rainfallWarningLimit"-->
        <!--                    type="number"-->
        <!--                    :disabled="!rainfallWarningUpdateMode"-->
        <!--                    :rules="[rules.required, rules.limit]"-->
        <!--                    suffix="mm / 10分"-->
        <!--                  >-->
        <!--                  </v-text-field>-->
        <!--                </v-col>-->
        <!--                <v-col-->
        <!--                  cols="2"-->
        <!--                  class="text-center"-->
        <!--                  v-if="rainfallWarningVisible"-->
        <!--                >-->
        <!--                  <v-btn-->
        <!--                    v-if="rainfallWarningUpdateMode"-->
        <!--                    tile-->
        <!--                    color="success"-->
        <!--                    @click="onClickWarningLimitUpdate"-->
        <!--                  >-->
        <!--                    確定-->
        <!--                  </v-btn>-->
        <!--                  <v-btn-->
        <!--                    v-else-->
        <!--                    tile-->
        <!--                    color="primary"-->
        <!--                    @click="rainfallWarningUpdateMode = true"-->
        <!--                  >-->
        <!--                    変更-->
        <!--                  </v-btn>-->
        <!--                </v-col>-->
        <!--              </v-row>-->
        <!--            </v-col>-->
        <!--            <v-col>-->
        <!--              <v-row no-gutters align="center" class="px-6">-->
        <!--                <v-col cols="auto">-->
        <!--                  <v-checkbox-->
        <!--                    hide-details-->
        <!--                    v-model="rainfallDangerVisible"-->
        <!--                    @change="updateAlertsSettings"-->
        <!--                  ></v-checkbox>-->
        <!--                </v-col>-->
        <!--                <v-col cols="2" class="text-center">雨量警報</v-col>-->
        <!--                <v-col class="pa-2" v-if="rainfallDangerVisible">-->
        <!--                  <v-text-field-->
        <!--                    v-model="rainfallDangerLimit"-->
        <!--                    ref="rainfallTotalLimit"-->
        <!--                    type="number"-->
        <!--                    :disabled="!rainfallDangerUpdateMode"-->
        <!--                    :rules="[rules.required, rules.limit]"-->
        <!--                    suffix="mm / 10分"-->
        <!--                  >-->
        <!--                  </v-text-field>-->
        <!--                </v-col>-->
        <!--                <v-col-->
        <!--                  cols="2"-->
        <!--                  class="text-center"-->
        <!--                  v-if="rainfallDangerVisible"-->
        <!--                >-->
        <!--                  <v-btn-->
        <!--                    v-if="rainfallDangerUpdateMode"-->
        <!--                    tile-->
        <!--                    color="success"-->
        <!--                    @click="onClickDangerLimitUpdate"-->
        <!--                  >-->
        <!--                    確定-->
        <!--                  </v-btn>-->
        <!--                  <v-btn-->
        <!--                    v-else-->
        <!--                    tile-->
        <!--                    color="primary"-->
        <!--                    @click="rainfallDangerUpdateMode = true"-->
        <!--                  >-->
        <!--                    変更-->
        <!--                  </v-btn>-->
        <!--                </v-col>-->
        <!--              </v-row>-->
        <!--            </v-col>-->
        <!--          </v-row>-->
        <!--        </v-card>-->
        <div class="mt-4">
          印刷画面・アラート配信対象観測所を設定します。最大20地点の登録が可能です。
        </div>
        <v-card>
          <v-row no-gutters justify="center" align="stretch">
            <v-col>
              <div style="height: 100%; min-height: 442px">
                <l-map ref="rainfallMap" :zoom="zoom" :center="center">
                  <l-tile-layer
                    :url="url"
                    :center="center"
                    :zoom="zoom"
                    :attribution="attribution"
                  ></l-tile-layer>
                  <template v-for="o in rainfallObservatories">
                    <l-marker
                      :lat-lng="o.latlng"
                      @click="onClickRainfallMarker(o)"
                    >
                      <l-icon :icon-size="[16, 16]" :icon-anchor="[8, 16]">
                        <v-icon :color="o.link ? 'blue' : 'black'"
                          >mdi-circle</v-icon
                        >
                      </l-icon>
                      <l-tooltip :options="{ direction: 'top' }">
                        {{ o.name }}
                      </l-tooltip>
                    </l-marker>
                  </template>
                </l-map>
              </div>
            </v-col>
            <v-col>
              <v-card outlined>
                <v-card-title>
                  雨量観測所
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="rainfallSearch"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    class="ml-2"
                  ></v-text-field>
                </v-card-title>
                <v-row no-gutters justify="end" class="pr-4 my-2">
                  <v-checkbox
                    v-model="rainfallOnlyLink"
                    dense
                    hide-details
                    :label="'リンクのみ'"
                    @change="onClickRainfallOnlyLink"
                  >
                  </v-checkbox>
                </v-row>
                <v-data-table
                  dense
                  :headers="rainfallHeaders"
                  :items="rainfallObservatories"
                  :search="rainfallSearch"
                  :page.sync="rainfallPage"
                  @click:row="onClickRainfallRow"
                >
                  <template v-slot:item.link="{ item }">
                    <v-row no-gutters justify="center">
                      <v-checkbox
                        dense
                        hide-details
                        v-model="item.link"
                        :disabled="!item.link && !rainfallCheckBoxVisible"
                        @change="onChangeRainfallLinkCheckbox"
                      ></v-checkbox>
                    </v-row>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon, LTooltip } from "vue2-leaflet";
import axios from "axios";
import conf from "../../config";
import moment from "moment";
import L from "leaflet";
import _ from "lodash";
import { rootActions, rootGetters } from "../../store/store-functions";

export default {
  name: "Settings",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LTooltip
  },
  data() {
    return {
      rainfallWarningVisible: true,
      rainfallDangerVisible: true,
      rainfallWarningLimit: 0,
      rainfallDangerLimit: 0,
      rainfallWarningUpdateMode: false,
      rainfallDangerUpdateMode: false,

      rules: {
        required: value => !!value || "入力してください。",
        limit: value =>
          this.rainfallWarningLimit < this.rainfallDangerLimit ||
          "雨量注意報の基準値＜雨量警報の基準値　としてください。"
      },
      url: "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
      attribution:
          '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
      zoom: 10,
      center: [35.693825, 139.703356],
      rivers: [],
      riverLevelHeaders: [
        {
          text: "観測所",
          align: "left",
          sortable: true,
          value: "name"
        },
        {
          text: "川",
          align: "left",
          sortable: true,
          value: "river",
          width: "20%"
        },
        {
          text: "住所",
          align: "left",
          sortable: true,
          value: "address",
          width: "35%"
        },
        {
          text: "リンク",
          align: "center",
          sortable: true,
          value: "link",
          width: "15%",
          filter: value => {
            if (!this.riverLevelOnlyLink) return true;
            return value === true;
          }
        }
      ],
      riverLevelObservatories: [],
      riverLevelObservatories: [],
      riverLevelSearch: "",
      riverLevelOnlyLink: false,
      riverLevelPage: 0,
      riverLevelCheckBoxVisible: false,
      mainObservatoryId: null,
      rainfallHeaders: [
        {
          text: "観測所",
          align: "left",
          sortable: true,
          value: "name"
        },
        {
          text: "住所",
          align: "left",
          sortable: true,
          value: "address",
          width: "35%"
        },
        {
          text: "リンク",
          align: "center",
          sortable: true,
          value: "link",
          width: "15%",
          filter: value => {
            if (!this.rainfallOnlyLink) return true;
            return value === true;
          }
        }
      ],
      rainfallObservatories: [],
      rainfallSearch: "",
      rainfallOnlyLink: false,
      rainfallPage: 0,
      rainfallCheckBoxVisible: false
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters[rootGetters.USER_INFO];
    }
  },
  created() {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });

    this.loadRivers().then(() => {
      this.loadObservatories();
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.rainfallWarningVisible = this.userInfo.rainfallWarningVisible;
      this.rainfallDangerVisible = this.userInfo.rainfallDangerVisible;
      this.rainfallWarningLimit = this.userInfo.rainfallWarningLimit;
      this.rainfallDangerLimit = this.userInfo.rainfallDangerLimit;
    });
  },
  methods: {
    to() {
      this.$nextTick(() => {
        this.$router.push({
          path: "dashboard"
        });
      });
    },
    loadUserInfo() {
      this.$store.dispatch(rootActions.LOAD_USER_INFO);
    },
    loadRivers() {
      return axios
        .create({
          responseType: "json",
          baseURL: conf.apiServer.url
        })
        .get("/api/rivers", {})
        .then(response => {
          this.rivers = response.data;
        })
        .catch(err => [err]);
    },
    loadObservatories() {
      axios
        .create({
          responseType: "json",
          baseURL: conf.apiServer.url
        })
        .get("/api/observatories", {
          params: {
            date: moment.utc().format("YYYY/MM/DD HH:mm")
          }
        })
        .then(response => {
          this.riverLevelObservatories = _.filter(response.data, o => {
            return o.type === "水位";
          });
          this.rainfallObservatories = _.filter(response.data, o => {
            return o.type === "雨量";
          });

          this.setRiverLevelObservatories();
          this.setRainfallObservatories();

          this.setRiverLevelCheckBoxVisible();
          this.setRainfallCheckBoxVisible();

          this.$nextTick(() => {
            this.$refs.riverLevelMap.mapObject.invalidateSize();
            this.$refs.rainfallMap.mapObject.invalidateSize();
          });
        })
        .catch(err => [err]);
    },
    updateAlertsSettings() {
      axios
        .create({
          responseType: "json",
          baseURL: conf.apiServer.url
        })
        .post("/api/observatoryLink/set", {
          userInfo: {
            rain10WarningUseing: this.rainfallWarningVisible,
            rain10AlarmUseing: this.rainfallDangerVisible,
            rain10Warning: this.rainfallWarningLimit,
            rain10Alarm: this.rainfallDangerLimit
          }
        })
        .then(response => {
          this.loadUserInfo();
        })
        .catch(err => [err]);
    },
    updateObservatoriesSettings() {
      const linkedRiverLevelObservatories = _.filter(
        this.riverLevelObservatories,
        o => {
          return o.link === true;
        }
      );
      const linkedRiverLevelIds = _.map(linkedRiverLevelObservatories, o => {
        return o.observatoryId;
      });
      const linkedRainfallObservatories = _.filter(this.rainfallObservatories, o => {
        return o.link === true;
      });
      const linkedRainfallIds = _.map(linkedRainfallObservatories, o => {
        return o.observatoryId;
      });

      axios
        .create({
          responseType: "json",
          baseURL: conf.apiServer.url
        })
        .post("/api/observatoryLink/set", {
          userInfo: {
            waterCenterId: this.mainObservatoryId
          },
          waterList: linkedRiverLevelIds,
          rainList: linkedRainfallIds
        })
        .then(response => {
          this.loadUserInfo();
        })
        .catch(err => [err]);
    },
    setRiverLevelObservatories() {
      const observatories = [];
      _.forEach(this.riverLevelObservatories, (observatory, index) => {
        const river = _.find(this.rivers, river => {
          return observatory.riverAreaId === river._id;
        });
        const linked = _.findIndex(
          this.userInfo.riverLevelObservatories,
          linkedObservatory => {
            return linkedObservatory === observatory._id;
          }
        );

        const row = {
          index: index,
          name: observatory.name,
          river: river.name,
          address: observatory.address,
          link: linked !== -1,
          // link: false,
          observatoryId: observatory._id,
          latlng: [observatory.lat, observatory.lng]
        };
        observatories.push(row);
      });
      this.riverLevelObservatories = observatories;
    },
    onClickRiverLevelRow(observatory) {
      this.$refs.riverLevelMap.mapObject.panTo(observatory.latlng);
    },
    onClickRiverLevelOnlyLink() {
      this.$nextTick(() => {
        this.riverLevelPage = 0;
      });
    },
    onClickRiverLevelMarker(observatory) {
      if (this.userInfo.mainObservatoryId === observatory.observatoryId) {
        return;
      }
      const linkedRiverLevelObservatories = _.filter(
        this.riverLevelObservatories,
        o => {
          return o.link === true;
        }
      );

      if(!observatory.link) {
        if (linkedRiverLevelObservatories && linkedRiverLevelObservatories.length < 20) {
          observatory.link = !observatory.link;
          this.updateObservatoriesSettings();
        }
      } else {
        observatory.link = !observatory.link;
        this.updateObservatoriesSettings();
      }

      this.setRiverLevelCheckBoxVisible();
    },
    onChangeRiverLevelLinkCheckbox() {
      this.updateObservatoriesSettings();
      this.setRiverLevelCheckBoxVisible();
    },
    onClickMainObservatory(observatory) {
      this.mainObservatoryId = observatory.observatoryId;
      this.updateObservatoriesSettings();
    },
    setRainfallObservatories() {
      const observatories = [];
      _.forEach(this.rainfallObservatories, observatory => {
        const linked = _.findIndex(
          this.userInfo.rainfallObservatories,
          linkedObservatory => {
            return linkedObservatory === observatory._id;
          }
        );

        const row = {
          name: observatory.name,
          address: observatory.address,
          link: linked !== -1,
          observatoryId: observatory._id,
          latlng: [observatory.lat, observatory.lng]
        };
        observatories.push(row);
      });
      this.rainfallObservatories = observatories;
    },
    onClickRainfallRow(observatory) {
      this.$refs.rainfallMap.mapObject.panTo(observatory.latlng);
    },
    onClickRainfallOnlyLink() {
      this.$nextTick(() => {
        this.rainfallPage = 0;
      });
    },
    onClickRainfallMarker(observatory) {
      const linkedRainfallObservatories = _.filter(
        this.rainfallObservatories,
        o => {
          return o.link === true;
        }
      );
      if(!observatory.link) {
        if (linkedRainfallObservatories && linkedRainfallObservatories.length < 20) {
          observatory.link = !observatory.link;
          this.updateObservatoriesSettings();
        }
      } else {
        observatory.link = !observatory.link;
        this.updateObservatoriesSettings();
      }

      this.setRainfallCheckBoxVisible();
    },
    onChangeRainfallLinkCheckbox() {
      this.updateObservatoriesSettings();
      this.setRainfallCheckBoxVisible();
    },
    onClickWarningLimitUpdate() {
      if (this.rules.required(this.rainfallWarningLimit) !== true) {
        this.$refs.rainfallWarningLimit.validate(true);
        return;
      }
      this.rainfallWarningUpdateMode = false;
      this.updateAlertsSettings();
    },
    onClickDangerLimitUpdate() {
      if (this.rules.required(this.rainfallDangerLimit) !== true) {
        this.$refs.rainfallDangerLimit.validate(true);
        return;
      }
      this.rainfallDangerUpdateMode = false;
      this.updateAlertsSettings();
    },
    onClickDialogCloseButton() {
      this.$emit("close-dialog");
    },
    setRiverLevelCheckBoxVisible()  {
      const linkedRiverLevelObservatories = _.filter(
        this.riverLevelObservatories,
        o => {
          return o.link === true;
        }
      );

      if (linkedRiverLevelObservatories && linkedRiverLevelObservatories.length < 20) {
        this.riverLevelCheckBoxVisible = true;
      } else {
        this.riverLevelCheckBoxVisible = false;
      }
    },
    setRainfallCheckBoxVisible()  {
      const linkedRainfallObservatories = _.filter(
        this.rainfallObservatories,
        o => {
          return o.link === true;
        }
      );

      if (linkedRainfallObservatories && linkedRainfallObservatories.length < 20) {
        this.rainfallCheckBoxVisible = true;
      } else {
        this.rainfallCheckBoxVisible = false;
      }
    }
  }
};
</script>
<style lang="scss">
.settings {
  .v-data-footer__select {
    display: none;
  }

  .v-data-table table {
    width: 98%;
  }
}
</style>
<style lang="scss" scoped>
.settings-header {
  z-index: 1500;
  width: 100%;
  background-color: #0d47a1;
}
.settings {
  .v-card__subtitle,
  .v-card__text,
  .v-card__title {
    padding-bottom: 0;
  }
  .v-input--selection-controls {
    margin-top: 0;
  }
}

.v-application--is-ltr .v-data-footer__select {
  display: none;
}
</style>
