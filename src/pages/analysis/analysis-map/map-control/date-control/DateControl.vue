<template>
  <div class="date-control">
    <v-row no-gutters align="center">
      <v-col cols="auto" class="pa-2 play-control-area">
        <v-row v-if="selectedRisk.slider" no-gutters class="text-center">
          <v-col>
            <v-btn fab icon color="black" @click="previous">
              <v-icon large>mdi-skip-previous</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn v-if="playing" fab icon color="black" @click="pause">
              <v-icon x-large>mdi-pause</v-icon>
            </v-btn>
            <v-btn v-else fab icon color="black" @click="play">
              <v-icon x-large>mdi-play</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn fab icon color="black" @click="next">
              <v-icon large>mdi-skip-next</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="mr-12">
        <slider ref="slider" v-if="selectedRisk.slider"></slider>
      </v-col>
      <v-col
        v-if="selectedRisk.timeAxis"
        class="date-time-select-area"
        cols="auto"
      >
        <v-row no-gutters class="option-buttons" justify="end">
          <v-col cols="auto" class="mr-2">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  x-small
                  :color="trainingMode ? '#631d21' : 'primary'"
                  dark
                  @click="dialog = true"
                  v-bind="attrs"
                  v-on="on"
                  ><v-icon>mdi-table-clock</v-icon>
                </v-btn>
              </template>
              <div>
                【訓練時モード】
              </div>
              <span>訓練リストを表示します</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <datetime
          v-model="baseDate"
          :input-class="
            trainingMode ? 'datetime-picker training' : 'datetime-picker'
          "
          type="datetime"
          :max-datetime="currentDate"
        >
          <template slot="button-cancel">
            <v-btn text color="error">
              キャンセル
            </v-btn>
          </template>
          <template slot="button-confirm" slot-scope="scope">
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
        <div class="date-control-buttons">
          <v-row no-gutters align="center" justify="center">
            <v-col class="text-right">
              <v-btn
                icon
                color="rgba(55, 55, 55, 0.72)"
                @click="updateBaseDatePrevious10Minutes"
              >
                <v-icon>mdi-arrow-left-drop-circle</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    fab
                    color="warning"
                    class="mb-2"
                    @click="updateLatest()"
                  >
                    <v-icon style="width: 100%" large>mdi-update</v-icon>
                  </v-btn>
                </template>
                <div>【平常時モード】</div>
                <span>現時刻に移動し、平常時に変更します</span>
              </v-tooltip>
            </v-col>
            <v-col class="text-left">
              <v-btn
                icon
                color="rgba(55, 55, 55, 0.72)"
                @click="updateBaseDateNext10Minutes"
              >
                <v-icon>mdi-arrow-right-drop-circle</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <risk-history-table
      :dialog="dialog"
      @close="dialog = false"
      @setDate="updateRiskDate"
    ></risk-history-table>
  </div>
</template>

<script>
import moment from "moment";
import { Datetime } from "vue-datetime";

import {
  rootGetters,
  rootMutations
} from "../../../../../store/store-functions";

import Slider from "./Slider";
import { Settings } from "luxon";
import RiskHistoryTable from "@/components/RiskHistoryTable";
Settings.defaultLocale = "ja";

export default {
  name: "DateControl",
  components: {
    RiskHistoryTable,
    Slider,
    Datetime
  },
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      playing: false,
      hasInitialize: false,
      currentDate: moment().toISOString(),
      dialog: false
    };
  },
  computed: {
    baseDate: {
      get() {
        return this.$store.getters[rootGetters.BASE_DATE](
          this.analysisMapData.storeId
        ).toISOString();
      },
      set(date) {
        const storeId = this.analysisMapData.storeId;
        this.$store.commit(rootMutations.UPDATE_BASE_DATE, {
          storeId,
          baseDate: moment(date)
        });

        if (this.hasInitialize) {
          this.$store.commit(rootMutations.UPDATE_HAS_CHANGE_DATE, true);
          return;
        }
        this.hasInitialize = true;
      }
    },
    trainingMode: {
      get() {
        return this.$store.getters[rootGetters.TRAINING_MODE];
      },
      set(data) {
        this.$store.commit(rootMutations.UPDATE_TRAINING_MODE, data);
      }
    },
    selectedRisk() {
      return this.$store.getters[rootGetters.SELECTED_RISK](
        this.analysisMapData.storeId
      );
    }
  },
  watch: {
    baseDate() {
      this.currentDate = moment().toISOString();
    }
  },
  methods: {
    updateBaseDate(date) {
      const storeId = this.analysisMapData.storeId;
      this.$store.commit(rootMutations.UPDATE_BASE_DATE, {
        storeId,
        baseDate: date
      });
      this.$store.commit(rootMutations.UPDATE_HAS_CHANGE_DATE, true);
    },
    updateBaseDatePrevious10Minutes() {
      this.updateBaseDate(
        moment(this.baseDate)
          .clone()
          .subtract(10, "minutes")
      );
    },
    updateBaseDateNext10Minutes() {
      this.updateBaseDate(
        moment(this.baseDate)
          .clone()
          .add(10, "minutes")
      );
    },
    play() {
      this.$refs.slider.play();
      this.playing = true;
    },
    pause() {
      this.$refs.slider.pause();
      this.playing = false;
    },
    previous() {
      this.$refs.slider.previous();
    },
    next() {
      this.$refs.slider.next();
    },
    updateLatest() {
      this.hasInitialize = false;
      this.trainingMode = false;
      const date = moment();
      const storeId = this.analysisMapData.storeId;
      this.$store.commit(rootMutations.UPDATE_BASE_DATE, {
        storeId,
        baseDate: date
      });
      this.$store.commit(rootMutations.UPDATE_HAS_CHANGE_DATE, false);
    },
    updateRiskDate(date) {
      this.updateBaseDate(moment(date, "YYYY/MM/DD HH:mm"));
      this.trainingMode = true;
      this.dialog = false;
    }
  }
};
</script>
<style lang="scss">
@import "../../../../../common";

.datetime-picker {
  cursor: pointer;
  border: 0;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: bold;
  background-color: $point-color-1;
  color: $base-color-1;
  -webkit-box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 01 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 20px;
  min-height: 30px;
  height: 30px;
  width: 180px;
  text-align: center;
}
.training {
  background-color: #631d21 !important;
}
</style>
<style lang="scss" scoped>
.play-control-area {
  width: 184px;
}
.date-control {
  padding: 0 10px;
  height: 100%;
  > .row {
    height: 100%;
  }
}

.date-time-select-area {
  position: relative;
  .date-control-buttons {
    position: absolute;
    bottom: 100%;
    text-align: center;
    width: 100%;
  }
  .option-buttons {
    position: absolute;
    bottom: 0;
    right: 100%;
    text-align: center;
    width: 100%;
  }
}
</style>
