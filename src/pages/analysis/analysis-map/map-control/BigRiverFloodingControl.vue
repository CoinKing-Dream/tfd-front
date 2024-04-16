<template>
  <v-row
    v-if="
      selectedDikeBreakPoint &&
        selectedDikeBreakPoint.breakInfo &&
        displayDataType === '時系列'
    "
    no-gutters
    align="center"
  >
    <v-col cols="auto" class="buttons-area pa-2">
      <v-row no-gutters class="text-center">
        <v-col>
          <v-btn fab icon color="black" @click="previous">
            <v-icon large>mdi-skip-previous</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-btn fab icon color="black" @click="play">
            <v-icon x-large>{{
              playIntervalId ? "mdi-pause" : "mdi-play"
            }}</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-btn fab icon color="black" @click="next">
            <v-icon large>mdi-skip-next</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col class="mr-5">
      <div class="big-river-flooding-slider">
        <v-slider
          v-model="position"
          ref="slider"
          class="main-slider"
          :max="selectedDikeBreakPoint.breakInfo.data.length - 1"
          :step="step"
          :tick-labels="tick.labels"
          :ticks="tick.displayOption"
          :tick-size="tick.size"
          :hide-details="hideDetails"
          :thumb-label="'always'"
          :thumb-size="50"
        >
          <template v-slot:thumb-label="props">
            + {{ selectedDikeBreakPoint.breakInfo.data[position].time }}分
          </template>
        </v-slider>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import _ from "lodash";
import { rootGetters, rootMutations } from "../../../../store/store-functions";
import { Risk } from "../../../../enums/Risk";

export default {
  name: "BigRiverFloodingControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      Risk: Risk,
      step: 1,
      hideDetails: true,
      tick: {
        size: 4,
        labels: [],
        displayOption: "always"
      },
      thumb: {
        size: 40,
        displayOption: "always"
      },
      position: 0,
      playIntervalId: null
    };
  },
  watch: {
    position() {
      const storeId = this.analysisMapData.storeId;
      const selectedIndex = this.position;
      const bigRiverFloodingOptions = {
        selectedIndex
      };
      this.$store.commit(rootMutations.UPDATE_BIG_RIVER_FLOODING_OPTIONS, {
        storeId,
        bigRiverFloodingOptions
      });
    },
    selectedDikeBreakPoint() {
      // todo: this.selectedDikeBreakPoint.breakInfo チェックいる？
      if (
        this.selectedDikeBreakPoint &&
        this.selectedDikeBreakPoint.breakInfo
      ) {
        this.tick.labels = _.map(
          this.selectedDikeBreakPoint.breakInfo.data,
          (o, index) => {
            if (index % 5 === 0) {
              return `+${o.time}分`;
            } else {
              return "";
            }
          }
        );
      }
    }
  },
  computed: {
    selectedDikeBreakPoint() {
      return this.$store.getters[rootGetters.SELECTED_DIKE_BREAK_POINT](
        this.analysisMapData.storeId
      );
    },
    displayDataType() {
      return this.$store.getters[rootGetters.BIG_RIVER_FLOODING_OPTIONS](
        this.analysisMapData.storeId
      ).displayDataType;
    }
  },
  methods: {
    play: function() {
      if (this.playIntervalId) {
        clearInterval(this.playIntervalId);
        this.playIntervalId = null;
      } else {
        this.playIntervalId = setInterval(() => {
          if (
            this.selectedDikeBreakPoint.breakInfo.data.length - 1 <=
            this.position
          ) {
            clearInterval(this.playIntervalId);
          } else {
            this.position++;
          }
        }, 1000);
      }
    },
    next: function() {
      if (
        this.position + 1 <
        this.selectedDikeBreakPoint.breakInfo.data.length
      ) {
        this.position++;
      }
    },
    previous: function() {
      if (this.position - 1 >= 0) {
        this.position--;
      }
    }
  }
};
</script>
<style lang="scss">
@import "../../../../common";
.big-river-flooding-slider {
  .v-slider--horizontal .v-slider__thumb-label.primary {
    cursor: ew-resize;
    background-color: $base-color-1 !important;
    -webkit-box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    color: $point-color-3;
    border-radius: 10px;
    transition: none;
    transform: translateY(50%) translateY(-46px) translateX(-50%) !important;
    width: 100px !important;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }

  .main-slider .v-slider--horizontal .v-slider__thumb-label.primary {
    background-color: $point-color-4 !important;
  }

  .v-slider--horizontal .v-slider__thumb-label.primary > * {
    -webkit-transform: rotate(0deg) !important;
    transform: rotate(0deg) !important;
  }

  .v-slider--horizontal .v-slider__tick .v-slider__tick-label {
    top: 15px;
  }

  .v-slider__tick--filled {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .v-input {
    font-size: 12px;
    font-weight: bold;
  }

  .v-slider--horizontal .v-slider__thumb-label.primary:after {
    content: "";
    position: absolute;
    bottom: -18px;
    left: 50%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: $point-color-4;
    margin-left: -10px;
    margin-top: -10px;
  }

  .v-slider--horizontal .v-slider__ticks-container {
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
<style lang="scss" scoped>
.buttons-area {
  width: 184px;
}
.slider {
  width: 100%;
}
</style>
