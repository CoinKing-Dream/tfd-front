<template>
  <div style="width: 250px;">
    <div v-if="colorLegend && !isArray(colorLegend)">
      <div class="unit" v-if="colorLegend.title">{{ colorLegend.title }}</div>
      <div class="legend">
        <div
          v-for="(o, index) in colorLegend.colors"
          :key="index"
          class="color"
          :style="{ backgroundColor: o.color }"
        >
          {{ o.value }}
        </div>
      </div>
    </div>
    <v-row v-else no-gutters justify="end">
      <v-col
        cols="auto"
        v-for="(item, index) in colorLegend"
        :key="index"
        class="color-legend ml-2"
      >
        <div class="unit" v-if="item.title">{{ item.title }}</div>
        <div class="legend">
          <div
            v-for="(o, colorIndex) in item.colors"
            :key="colorIndex"
            class="color"
            :style="{ backgroundColor: o.color }"
          >
            {{ o.value }}
          </div>
          <div class="text" v-if="item.text">{{item.text}}</div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { rootGetters } from "../../../../store/store-functions";

export default {
  name: "ColorLegend",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  computed: {
    colorLegend() {
      return this.$store.getters[rootGetters.COLOR_LEGEND](
        this.analysisMapData.storeId
      );
    }
  },
  methods: {
    isArray(o) {
      return Array.isArray(o);
    }
  }
};
</script>

<style scoped>
.color-legend {
  clear: both;
}
.legend {
  width: fit-content;
  text-align: right;
  float: right;
}
.unit {
  font-size: 15px;
  font-weight: bold;
  white-space: pre;
}
.color {
  color: #ffffff;
  text-shadow: 1px 1px 0 #000000, -1px 1px 0 #000000, 1px -1px 0 #000000,
    -1px -1px 0 #000000;
  font-weight: bold;
  font-size: 15px;
  min-width: 15px;
  text-align: center;
  line-height: 1;
  padding: 2px 10px;
}
.text {
  font-size: 12px;
}
</style>
