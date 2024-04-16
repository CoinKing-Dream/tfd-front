<template>
  <div class="hydrant-sub-control">
    <v-row v-for="(o, index) in hydrants" :key="index" no-gutters align="center">
      <v-col>
        <v-checkbox
            hide-details
            dense
            v-model="enabledTypes"
            :label="o.label"
            :value="o.type"
            @change="onChangeTypes"
        ></v-checkbox>
      </v-col>
      <v-col cols="auto">
        <img
            :src="o.url"
            height="20"
            width="20"
            alt="icon"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {rootMutations} from "@/store/store-functions";
import _ from "lodash";

export default {
  name: "HydrantSubControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data: () => ({
    hydrants: [
      {
        type: 0,
        label:"消火栓",
        url: require("../../../../../assets/images/markers/hydrant01.svg")
      },
      {
        type: 1,
        label:"防火水槽",
        url: require("../../../../../assets/images/markers/hydrant02.svg")
      },
      {
        type: 2,
        label:"地中ばり水槽",
        url: require("../../../../../assets/images/markers/hydrant03.svg")
      },
    ],
    enabledTypes: [],
  }),
  methods: {
    onChangeTypes() {
      this.$store.commit(rootMutations.UPDATE_HYDRANT_OPTIONS, {
        storeId: this.analysisMapData.storeId,
        hydrantOptions: {
          enabledTypes: this.enabledTypes
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.hydrant-sub-control {
  width: 150px;

.v-input--selection-controls {
  margin-top: 0;
}

.select-box {
  z-index: 1500;
}
}

.histories {
  padding: 0 0 5px 0;
}
.sub-title {
  color: dimgray;
  font-size: 12px;
}
.active {
  color: rgba(0, 0, 0, 0.87) !important;
}
</style>