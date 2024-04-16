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
          <div class="text" v-if="item.text">{{ item.text }}</div>
        </div>
      </v-col>
    </v-row>
    <template v-if="selectedRisk.type === Risk.RAIN">
      <div class="rain-legend mt-2">
        <div class="pa-2" style="background-color: rgba(255,255,255,0.7);">
          <p>
            大雨災害発生の危険度が<br/>急激に高まっている<br/>線状降水帯の雨域
          </p>
          <v-row no-gutters>
            <v-col cols="3">
              <svg width="24" height="24">
                <ellipse
                  cx="12"
                  cy="12"
                  rx="10"
                  ry="5"
                  style="fill:rgba(0,0,0,0);stroke:red;stroke-width:3"
                />
              </svg>
            </v-col>
            <v-col>
              現在時刻の解析
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="3">
              <svg width="24" height="24">
                <ellipse
                  cx="12"
                  cy="12"
                  rx="10"
                  ry="5"
                  style="fill:rgba(0,0,0,0);stroke:red;stroke-width:3"
                  stroke-dasharray="4 2"
                />
              </svg>
            </v-col>
            <v-col>
              10~30分先の解析
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { rootGetters } from "../../../../store/store-functions";
import { Risk } from "@/enums/Risk";

export default {
  name: "ColorLegend",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      Risk: Risk
    };
  },
  computed: {
    colorLegend() {
      return this.$store.getters[rootGetters.COLOR_LEGEND](
        this.analysisMapData.storeId
      );
    },
    selectedRisk() {
      return this.$store.getters[rootGetters.SELECTED_RISK](
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
.rain-legend {
  clear:both;
  font-size: 12px;
  text-align: left;
  width: fit-content;
  float: right;
  p {
    font-weight: bold;
  }
}
</style>
