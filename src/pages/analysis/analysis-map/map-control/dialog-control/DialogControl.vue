<template>
  <v-card>
    <v-toolbar dense flat color="primary">
      <v-btn dark icon @click="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn dark icon @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <div class="contents-area">
      <template v-if="contents === 'observatory-list'">
        <observatory-list></observatory-list>
      </template>
      <template v-else-if="contents === 'river-level-detail'">
        <river-level-detail></river-level-detail>
      </template>
      <template v-else-if="contents === 'rainfall-detail'">
        <rainfall-detail></rainfall-detail>
      </template>
      <template v-else-if="contents === 'camera-detail'">
        <camera-detail></camera-detail>
      </template>
      <template v-else-if="contents === 'retarding-basin-detail'">
        <retarding-basin-detail></retarding-basin-detail>
      </template>
      <template v-else-if="contents === 'water-gate-detail'">
        <water-gate-detail></water-gate-detail>
      </template>
      <template v-else-if="contents === 'dike-break-point-list'">
        <dike-break-point-list></dike-break-point-list>
      </template>
    </div>
  </v-card>
</template>

<script>
import {
  rootMutations,
  rootGetters
} from "../../../../../store/store-functions";
import ObservatoryList from "./observatory-dialogs/observatory-list/ObservatoryList";
import RiverLevelDetail from "./observatory-dialogs/river-level-detail/RiverLevelDetail";
import RainfallDetail from "./observatory-dialogs/rainfall-detail/RainfallDetail";
import DikeBreakPointList from "./DikeBreakPointList";
import CameraDetail from "./observatory-dialogs/camera-detail/CameraDetail";
import RetardingBasinDetail
  from "@/pages/analysis/analysis-map/map-control/dialog-control/observatory-dialogs/retarding-basin-detail/RetardingBasinDetail";
import WaterGateDetail
  from "@/pages/analysis/analysis-map/map-control/dialog-control/observatory-dialogs/water-gate-detail/WaterGateDetail";

export default {
  name: "DialogControl",
  components: {
    WaterGateDetail,
    RetardingBasinDetail,
    CameraDetail,
    DikeBreakPointList,
    RainfallDetail,
    ObservatoryList,
    RiverLevelDetail
  },
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      previousContents: null
    };
  },
  computed: {
    title() {
      return this.$store.getters[rootGetters.DIALOG](
        this.analysisMapData.storeId
      ).title;
    },
    contents() {
      return this.$store.getters[rootGetters.DIALOG](
        this.analysisMapData.storeId
      ).contents;
    }
  },
  watch: {
    contents(after, before) {
      this.previousContents = before;
    }
  },
  methods: {
    closeDialog() {
      const storeId = this.analysisMapData.storeId;
      const dialog = {
        isShowing: false
      };
      this.$store.commit(rootMutations.UPDATE_DIALOG, { storeId, dialog });
    },
    back() {
      if (this.previousContents === null) {
        return;
      }
      const storeId = this.analysisMapData.storeId;
      const dialog = {
        contents: this.previousContents
      };
      this.$store.commit(rootMutations.UPDATE_DIALOG, { storeId, dialog });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card {
  height: 100%;
  background-color: #f2f3f8;
  .v-toolbar__title {
    color: white;
  }
}
.contents-area {
  height: calc(100% - 48px);
}
</style>
