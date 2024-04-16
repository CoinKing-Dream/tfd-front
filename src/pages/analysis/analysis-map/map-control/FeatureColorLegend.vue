<template>
  <v-row no-gutters>
    <template v-for="(item, index) in legends">
      <v-col
        cols="auto"
        :key="index"
        v-if="selectedFeatures && selectedFeatures.includes(item.type)"
        class="color-legend ml-1"
      >
        <div class="unit">{{ item.title }}</div>
        <div v-if="item.colorLegends" class="legend">
          <div
            v-for="(colorLegend, colorLegendIndex) in item.colorLegends"
            :key="colorLegendIndex"
            class="mb-1"
          >
            <div class="unit">{{ colorLegend.title }}</div>
            <div
              v-for="(o, colorIndex) in colorLegend.colors"
              :key="colorIndex"
              class="color"
              :style="{ backgroundColor: o.color }"
            >
              {{ o.value }}
            </div>
          </div>
        </div>
        <template v-else-if="item.colors">
          <div class="legend">
            <div
              v-for="(o, colorIndex) in item.colors"
              :key="colorIndex"
              class="color"
              :style="{ backgroundColor: o.color }"
            >
              {{ o.value }}
            </div>
          </div>
        </template>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import { Feature } from "../../../../enums/Feature";
import { rootGetters } from "../../../../store/store-functions";

export default {
  name: "FeatureColorLegend",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      legends: [
        {
          type: Feature.SUIBOU,
          title: Feature.SUIBOU.string,
          colorLegends: [
            {
              title: "東京都区間",
              colors: [
                { color: "rgb(230,0,18)", value: "洪水(m)" },
                { color: "rgb(240,131,0)", value: "高潮(m) " },
                { color: "rgb(67,177,73)", value: "堤防・護岸の強さ(m)" },
                { color: "rgb(89,195,225)", value: "陸閘(m)" },
                { color: "rgb(34,24,21)", value: "工事施工箇所延長(m)" }
              ]
            },
            {
              title: "直轄区間",
              colors: [
                {
                  color: "rgb(228,0,127)",
                  value: "水防上最も重要な区間(A)(工作物)"
                },
                {
                  color: "rgb(243,151,0)",
                  value: "水防上最も重要な区間(B)(工作物) "
                },
                { color: "rgb(0,129,204)", value: "要注意区間(工作物)" },
                { color: "rgb(0,167,59)", value: "重点区間" }
              ]
            }
          ]
        },
        {
          type: Feature.SAND_DANGER_AREA,
          title: Feature.SAND_DANGER_AREA.string,
          colors: [
            { color: "rgb(253,229,218)", value: "地すべり危険箇所" },
            { color: "rgb(217,217,252)", value: "急傾斜地崩壊危険箇所" },
            { color: "rgb(242,135,83)", value: "土石流危険渓流" }
          ]
        },
        {
          type: Feature.SAND_WARNING_AREA,
          title: Feature.SAND_WARNING_AREA.string,
          colorLegends: [
            {
              title: "特別警戒区域",
              colors: [
                { color: "rgb(203,76,147)", value: "地滑り" },
                { color: "rgb(193,76,98)", value: "土石流" },
                { color: "rgb(252,104,77)", value: "急傾斜地の崩壊" }
              ]
            },
            {
              title: "警戒区域",
              colors: [
                { color: "rgb(255,183,84)", value: "地滑り" },
                { color: "rgb(238,216,118)", value: "土石流" },
                { color: "rgb(255,237,90)", value: "急傾斜地の崩壊" }
              ]
            }
          ]
        },
        {
          type: Feature.DEPTH,
          title: Feature.DEPTH.string,
          colors: [
            { color: "rgb(222,119,202)", value: "5.0m～" },
            { color: "rgb(0,119,251)", value: "3.0～5.0m" },
            { color: "rgb(46,204,220)", value: "2.0～3.0m" },
            { color: "rgb(117,255,222)", value: "1.0～2.0m" },
            { color: "rgb(82,238,51)", value: "0.5～1.0m" },
            { color: "rgb(255,255,56)", value: "0.1～0.5m" }
          ]
        },
      ]
    };
  },
  computed: {
    selectedFeatures() {
      return this.$store.getters[rootGetters.SELECTED_FEATURES](
        this.analysisMapData.storeId
      );
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
</style>
