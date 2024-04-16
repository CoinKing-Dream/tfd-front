<template>
  <div class="print">
    <div class="print-header">
      <v-row no-gutters align="center" justify="end">
        <v-col>
          <v-btn x-small class="ma-2" text @click="close" color="white">
            <v-icon left>mdi-chevron-left</v-icon> ダッシュボード
          </v-btn>
        </v-col>
        <v-col></v-col>
        <v-col cols="auto" class="mx-2">
          <datetime
            v-model="baseDateString"
            input-class="datetime-picker"
            type="datetime"
            :max-datetime="currentDate.toISOString()"
          >
            <template slot="button-cancel">
              <v-btn text color="error">
                キャンセル
              </v-btn>
            </template>
            <template slot="button-confirm" 　slot-scope="scope">
              <span v-if="scope.step === 'date'">
                <v-btn icon color="indigo">
                  <v-icon>mdi-clock</v-icon>
                </v-btn>
              </span>
              <span v-else>
                <v-btn text color="success">
                  確定
                </v-btn>
              </span>
            </template>
          </datetime>
        </v-col>
        <v-col cols="auto" class="mr-2">
          <v-btn tile small color="success" @click="print()">
            Print
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="page">
      <div class="sub-page">
        <div class="page-header text-center mb-4">
          {{ baseDate.local().format("MM月DD日 HH時mm分") }}時点 UMBRELAシステム帳票​
        </div>
        <div class="contents">
          <div class="contents-header">
            1. 観測所
          </div>
          <observatory-contents :baseDate="baseDate"></observatory-contents>
        </div>
        <div class="contents">
          <div class="contents-header">
            2. 予測降雨
          </div>
          <v-row no-gutters>
            <v-col class="pr-1">
              <dynamic-contents
                :store-id="3"
                :risk="Risk.RAIN"
                :baseDate="baseDate"
              ></dynamic-contents>
              <div class="unit text-center">
                < 現在 >
              </div>
            </v-col>
            <v-col class="pl-1">
              <dynamic-contents
                :store-id="4"
                :risk="Risk.RAIN"
                :baseDate="baseDate"
                :add-hour="1"
              ></dynamic-contents>
              <div class="unit text-center">
                < 1時間後 >
              </div>
            </v-col>
          </v-row>
        </div>
        <div class="contents">
          <div class="contents-header">
            3. 中小河川氾濫
          </div>
          <dynamic-contents
            :store-id="5"
            :risk="Risk.SMALL_RIVER_FLOODING"
            :baseDate="baseDate"
          ></dynamic-contents>
        </div>
      </div>
    </div>
    <div
      v-if="dynamicContents.length !== 0"
      v-for="(page, pageIndex) in dynamicPages"
      :key="pageIndex"
      class="page"
    >
      <div class="sub-page">
        <div v-for="(contents, contentsIndex) in page" class="contents">
          <div class="contents-header">
            {{ (pageIndex + 1) * 4 + contentsIndex }}.
            {{ contents.risk.string }}
          </div>
          <dynamic-contents
            :store-id="contents.storeId"
            :risk="contents.risk"
            :baseDate="baseDate"
          >
          </dynamic-contents>
          <div class="remove-button-area pa-2">
            <v-btn small fab color="red" dark @click="removeRisk(contents)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="risk-manager pa-2">
      <v-row no-gutters>
        <v-col>
          <v-select
            solo
            dense
            hide-details
            v-model="selectedAddRisk"
            :items="timeRisks"
            item-text="label"
            item-value="value"
          >
          </v-select>
        </v-col>
        <v-col class="text-right">
          <v-btn tile color="success" @click="addRiskToPage">
            追加
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import BaseMap from "../../components/base-map/BaseMap";
import { Datetime } from "vue-datetime";
import { Settings } from "luxon";
import ObservatoryContents from "./contents/ObservatoryContents";
import _ from "lodash";
import { Risk } from "../../enums/Risk";
import { rootGetters, rootMutations } from "../../store/store-functions";
import DynamicContents from "./contents/DynamicContents";
Settings.defaultLocale = "ja";

export default {
  name: "Print",
  components: {
    DynamicContents,
    ObservatoryContents,
    BaseMap,
    Datetime
  },
  data() {
    return {
      Risk: Risk,
      currentDate: moment(),
      timeRisks: [],
      dynamicPages: [[]],
      dynamicContents: [],
      selectedAddRisk: Risk.X_RAIN,
      baseDate: moment(),
      baseDateString: null
    };
  },
  watch: {
    baseDateString() {
      this.baseDate = moment(this.baseDateString);
    }
  },
  created() {
    this.baseDateString = this.baseDate.toISOString();

    _.forEach(Risk, risk => {
      if (typeof risk === "object") {
        const riskInfo = this.getRiskInfo(risk);
        if (riskInfo.slider) {
          this.timeRisks.push({
            label: risk.string,
            value: risk
          });
        }
      }
    });
  },
  methods: {
    to() {
      this.resetRiskData();
      this.$nextTick(() => {
        this.$router.push({
          path: "dashboard"
        });
      });
    },
    close() {
      window.close();
    },
    print() {
      window.print();
    },
    getRiskInfo(risk) {
      return this.$store.getters[rootGetters.FIND_RISK](risk);
    },
    addRiskToPage() {
      const item = {
        storeId: this.dynamicContents.length + 99,
        risk: this.selectedAddRisk
      };
      this.dynamicContents.push(item);
      this.dynamicPages = _.chunk(this.dynamicContents, 4);
    },
    removeRisk(item) {
      _.remove(this.dynamicContents, risk => {
        return risk.storeId === item.storeId;
      });

      this.dynamicPages = _.chunk(this.dynamicContents, 4);
    },
    resetRiskData() {
      this.$store.commit(rootMutations.RESET_ALL_RISK_DATA);
    }
  }
};
</script>

<style lang="scss">
html,
body {
  overflow-y: auto;
}
.print {
  width: 100vw;
  margin: 0 auto;
  background-color: #e0e0e0;
  .print-header {
    position: fixed;
    z-index: 1500;
    width: 100%;
    top: 0;
    left: 0;
    background-color: #0d47a1;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 15mm;
    margin: 2cm auto 1cm auto;
    border: 1px #d3d3d3 solid;
    background: white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    .page-header {
      font-size: 20px;
      font-weight: bold;
    }
    .sub-page {
      height: 257mm;
    }
    .contents {
      margin-bottom: 10px;
      position: relative;
      .contents-header {
        font-weight: bold;
      }
      .unit {
        font-size: 10px;
      }
      .map-area {
        height: 200px;
      }
      .remove-button-area {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 1300;
      }
    }
  }
}

.risk-manager {
  position: fixed;
  z-index: 1500;
  width: 210mm;
  margin: 0 auto;
  bottom: 0;
  background-color: #0d47a1;
  left: 50%;
  transform: translateX(-50%);
}

@page {
  size: A4;
  margin: 0;
}
@media print {
  html,
  body,
  .print {
    width: 210mm;
    height: 297mm;
    background-color: rgba(0, 0, 0, 0);
  }
  .print {
    .print-header {
      display: none;
    }
    .risk-manager {
      display: none;
    }
    .remove-button-area {
      display: none;
    }
    .page {
      margin: 0;
      border: initial;
      border-radius: initial;
      width: initial;
      min-height: initial;
      box-shadow: initial;
      background: initial;
      page-break-after: always;
    }
  }
}
</style>
