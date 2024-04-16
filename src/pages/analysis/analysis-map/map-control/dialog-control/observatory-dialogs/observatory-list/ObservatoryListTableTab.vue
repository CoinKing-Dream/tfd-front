<template>
  <div class="observatory-list-table-tab pa-4">
    <v-card class="pa-3 mb-4" v-if="selectedObservatory.type === '水位'">
      <v-data-table
        dense
        :headers="masterTable.headers"
        :items="masterTable.observatories"
        :items-per-page="masterTable.observatories.length"
        :hide-default-header="false"
        :hide-default-footer="true"
      ></v-data-table>
    </v-card>
    <v-card class="pa-3">
      <v-data-table
        dense
        :headers="observationTable.headers"
        :items="observationTable.observatories"
        :items-per-page="observationTable.observatories.length"
        :hide-default-footer="true"
      ></v-data-table>
    </v-card>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import { rootGetters } from "../../../../../../../store/store-functions";
export default {
  name: "TablePanel",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      baseTileUrl: "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
      mapObject: null,
      minZoom: 4,
      maxZoom: 14,
      zoom: 10,
      center: [35.53946390543636, 139.77046966552737],
      masterTable: {
        headers: [
          {
            text: "",
            align: "left",
            sortable: false,
            value: "name",
            width: 150
          },
          { text: "新川下之一色", value: "新川下之一色", align: "right" },
          { text: "勝川", value: "勝川", align: "right" },
          { text: "平子", value: "平子", align: "right" },
          { text: "長栄八反", value: "長栄八反", align: "right" },
          { text: "猪子石", value: "猪子石", align: "right" }
        ],
        observatories: []
      },
      observationTable: {
        headers: [
          {
            text: "月/日 時:分",
            align: "left",
            sortable: false,
            value: "月/日 時:分",
            width: 150
          },
          { text: "水位 TPm", value: "新川下之一色", align: "right" },
          { text: "水位 m", value: "勝川", align: "right" },
          { text: "水位 m", value: "平子", align: "right" },
          { text: "水位 m", value: "長栄八反", align: "right" },
          { text: "水位 m", value: "猪子石", align: "right" }
        ],
        observatories: []
      }
    };
  },
  mounted() {
    this.updateMasterHeader();
    this.updateObservationData();
  },
  watch: {
    selectedObservatories() {
      this.updateMasterHeader();
      this.updateObservationData();
    }
  },
  computed: {
    selectedObservatory() {
      return this.$store.getters[rootGetters.SELECTED_OBSERVATORY](
        this.analysisMapData.storeId
      );
    },
    selectedObservatories() {
      return this.$store.getters[rootGetters.SELECTED_OBSERVATORIES](
        this.analysisMapData.storeId
      );
    }
  },
  methods: {
    updateObservationData() {
      this.observationTable.headers = [
        {
          text: "月/日 時:分",
          align: "left",
          sortable: false,
          value: "label",
          width: 150
        }
      ];

      _.forEach(this.selectedObservatories, observatory => {
        const unit = (type => {
          switch (type) {
            case "水位":
              return "m";
            case "雨量":
              return "mm";
            case "調節池":
              return "m³";
            case "水門":
              return "A.P.m";
          }
        })(observatory.type);

        this.observationTable.headers.push({
          text: `${observatory.name} [${unit}]`,
          value: observatory._id,
          align: "right"
        });
      });

      const observatories = [];
      _.forEach(this.selectedObservatories[0].times, (time, key) => {
        const temp = {};
        _.forEach(this.selectedObservatories, observatory => {
          temp.label = moment
            .utc(time, "YYYY/MM/DD HH:mm")
            .local()
            .format("MM/DD HH:mm");

          let dataKey;
          switch (observatory.type) {
            case "水位":
              dataKey = "riverLevels";
              break;
            case "雨量":
              dataKey = "rains";
              break;
            case "調節池":
              dataKey = "volumes";
              break;
            case "水門":
              dataKey = "innerLevels";
              break;
          }

          if (observatory[dataKey][key]) {
            temp[observatory._id] = _.floor(observatory[dataKey][key], 2);
          } else {
            temp[observatory._id] = "・";
          }
        });
        observatories.push(temp);
      });

      this.observationTable.observatories = observatories;
    },
    updateMasterHeader() {
      this.masterTable.headers = [
        {
          text: "",
          align: "left",
          sortable: false,
          value: "label",
          width: 150
        }
      ];

      _.forEach(this.selectedObservatories, observatory => {
        this.masterTable.headers.push({
          text: observatory.name,
          value: observatory._id,
          align: "right"
        });
      });

      const observatories = [];
      const standby = { label: "水防団待機水位 [m]" };
      _.forEach(this.selectedObservatories, observatory => {
        standby[observatory._id] = observatory.standbyLevel
          ? observatory.standbyLevel
          : "・";
      });
      const warning = { label: "氾濫注意水位 [m]" };
      _.forEach(this.selectedObservatories, observatory => {
        warning[observatory._id] = observatory.warningLevel
          ? observatory.warningLevel
          : "・";
      });
      const evacuation = { label: "避難判断水位 [m]" };
      _.forEach(this.selectedObservatories, observatory => {
        evacuation[observatory._id] = observatory.evacuationLevel
          ? observatory.evacuationLevel
          : "・";
      });
      const dangerous = { label: "氾濫危険水位 [m]" };
      _.forEach(this.selectedObservatories, observatory => {
        dangerous[observatory._id] = observatory.dangerousLevel
          ? observatory.dangerousLevel
          : "・";
      });
      const outbreak = { label: "氾濫発生水位 [m]" };
      _.forEach(this.selectedObservatories, observatory => {
        outbreak[observatory._id] = observatory.outbreakLevel
          ? observatory.outbreakLevel
          : "・";
      });
      observatories.push(standby);
      observatories.push(warning);
      observatories.push(evacuation);
      observatories.push(dangerous);
      observatories.push(outbreak);

      this.masterTable.observatories = observatories;
    }
  }
};
</script>
<style lang="scss">
.observatory-list-table-tab .theme--light.v-data-table thead tr th {
  background-color: #2c7be5;
  color: white;
  font-size: 10px;
}
.observatory-list-table-tab .v-data-table td {
  font-size: 12px;
}
</style>
<style lang="scss" scoped>
.observatory-list-table-tab {
  width: 100%;
  height: calc(100% - 302px);
  background-color: #f2f3f8;
  overflow-y: scroll;
}
</style>
