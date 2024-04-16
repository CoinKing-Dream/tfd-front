<template>
  <div class="flooding-history-sub-control">
    <div v-if="!areaSelectMode">
      <v-btn
        block
        color="success"
        @click="onClickStartButton"
        :disabled="mapObject && mapObject.getZoom() < minZoom"
        >追加開始</v-btn
      >
      <div
        v-if="message"
        class="message mt-2"
        :style="{ color: message.color }"
      >
        {{ message.text }}
      </div>
    </div>
    <div v-else>
      <div v-if="message" class="message" :style="{ color: message.color }">
        {{ message.text }}
      </div>
      <div v-else-if="!message && !editAreaInfo" class="message">
        地図上で登録するエリアをマウスで指定した後、登録ボタンを押してください
      </div>
      <div class="mt-2">
        <h5>内外水</h5>
        <v-radio-group
          v-model="inout"
          hide-details
          :mandatory="false"
          class="mb-2"
        >
          <v-radio label="内水" value="内水"></v-radio>
          <v-radio label="外水" value="外水"></v-radio>
          <v-radio v-if="editAreaInfo" label="不明" value="不明"></v-radio>
        </v-radio-group>
        <h5>原因 <span class="red--text">※入力必須</span></h5>
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="reason"
              dense
              hide-details
              placeholder="原因"
              outlined
              class="text-field"
            ></v-text-field
          ></v-col>
          <v-col cols="12">
            <h5>出典</h5>
            <v-text-field
              v-model="source"
              dense
              hide-details
              placeholder="出典"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <h5>備考</h5>
            <v-text-field
              v-model="remark"
              dense
              hide-details
              placeholder="備考"
              outlined
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            class="mt-2 pa-1"
            style="background-color: #eeeeee; border-radius: 5px"
          >
            <h5>エリア</h5>
            <v-row no-gutters>
              <v-col class="pr-1">
                <v-btn
                  small
                  depressed
                  block
                  color="white"
                  @click="onClickClearAreaButton"
                  >クリア</v-btn
                >
              </v-col>
              <v-col class="pl-1">
                <v-btn
                  small
                  depressed
                  block
                  color="white"
                  @click="onClickBackAreaButton"
                  >戻す</v-btn
                >
              </v-col>
            </v-row>
            <v-col class="py-1 px-0" v-if="editAreaInfo">
              <v-btn
                small
                depressed
                block
                color="white"
                @click="onClickResetAreaButton"
                >最初に戻す</v-btn
              >
            </v-col>
          </v-col>
        </v-row>
      </div>
      <div
        class="mt-2"
        style="margin: -10px; padding: 10px; background-color: lightgrey"
      >
        <v-row no-gutters>
          <v-col class="pr-1">
            <v-btn small block color="error" @click="onClickCancelButton"
              >取り消し</v-btn
            >
          </v-col>
          <v-col class="pl-1">
            <v-btn
              v-if="editAreaInfo"
              small
              block
              color="success"
              @click="onClickEditButton"
              >修正</v-btn
            >
            <v-btn v-else small block color="success" @click="onClickAddButton"
              >登録</v-btn
            >
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import {
  rootActions,
  rootGetters,
  rootMutations
} from "../../../../../store/store-functions";
import _ from "lodash";

export default {
  name: "FloodingHistorySubControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      message: null,
      timeout: null,
      inout: "内水",
      reason: "",
      source: "",
      remark: "",
      minZoom: 14,
    };
  },
  computed: {
    areaSelectMode: {
      get() {
        return this.$store.getters[rootGetters.FLOODING_HISTORY_OPTIONS](
          this.analysisMapData.storeId
        ).areaSelectMode;
      },
      set(areaSelectMode) {
        this.$store.commit(rootMutations.UPDATE_FLOODING_HISTORY_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          floodingHistoryOptions: {
            areaSelectMode: areaSelectMode
          }
        });
      }
    },
    newArea: {
      get() {
        return this.$store.getters[rootGetters.FLOODING_HISTORY_OPTIONS](
          this.analysisMapData.storeId
        ).newArea;
      },
      set(newArea) {
        this.$store.commit(rootMutations.UPDATE_FLOODING_HISTORY_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          floodingHistoryOptions: {
            newArea: newArea
          }
        });
      }
    },
    editAreaInfo: {
      get() {
        return this.$store.getters[rootGetters.FLOODING_HISTORY_OPTIONS](
          this.analysisMapData.storeId
        ).editAreaInfo;
      },
      set(editAreaInfo) {
        this.$store.commit(rootMutations.UPDATE_FLOODING_HISTORY_OPTIONS, {
          storeId: this.analysisMapData.storeId,
          floodingHistoryOptions: {
            editAreaInfo: editAreaInfo
          }
        });
      }
    },
    mapObject() {
      return this.$store.getters[rootGetters.MAP_OBJECT](
        this.analysisMapData.storeId
      );
    }
  },
  watch: {
    editAreaInfo() {
      if (this.editAreaInfo) {
        this.inout = _.clone(this.editAreaInfo.type.value);
        this.reason = _.clone(this.editAreaInfo.cause.value);
        this.source = _.clone(this.editAreaInfo.from.value);
        this.remark = _.clone(this.editAreaInfo.remarks.value);
      }
    }
  },
  methods: {
    onClickStartButton() {
      this.newArea = null;
      this.areaSelectMode = true;
    },
    onClickCancelButton() {
      this.areaSelectMode = false;
      this.newArea = null;
      this.editAreaInfo = null;

      this.clearForm();
    },
    onClickAddButton() {
      if (!this.validation()) {
        return;
      }
      this.$store
        .dispatch(rootActions.PUSH_FLOODING_HISTORY, {
          coordinates: this.newArea,
          inout: this.inout,
          reason: this.reason,
          source: this.source,
          remark: this.remark
        })
        .then(({ err, response }) => {
          this.areaSelectMode = false;
          this.newArea = null;
          this.clearForm();
          if (err) {
            this.setMessage("登録失敗", "#ff0000");
            throw new Error("load failed : /flood_history/regist");
          } else {
            this.setMessage("登録成功");
          }
        });
    },
    onClickEditButton() {
      if (!this.validation()) {
        return;
      }

      this.$store
        .dispatch(rootActions.UPDATE_FLOODING_HISTORY, {
          _id: this.editAreaInfo._id,
          coordinates: this.newArea,
          inout: this.inout,
          reason: this.reason,
          source: this.source,
          remark: this.remark
        })
        .then(({ err, response }) => {
          if (!err) {
            this.editAreaInfo = null;
            this.areaSelectMode = false;
            this.newArea = null;
            this.clearForm();
            this.setMessage("修正成功");
            this.$store.dispatch(
              rootActions.LOAD_FLOODING_HISTORY,
              this.mapObject.getBounds()
            );
          } else {
            this.setMessage("修正失敗", "#ff0000");
          }
        });
    },
    validation() {
      let pass = true;
      if (!this.inout || this.inout.length === 0) {
        pass = false;
      }
      if (!this.reason || this.reason.length === 0) {
        pass = false;
      }
      if (!pass) {
        this.setMessage("入力に不定があります。", "#ff0000");
      }

      if (!this.newArea) {
        pass = false;
        this.setMessage("エリアを2点以上指定してください。", "#ff0000");
      }
      if (this.newArea && this.newArea.length <= 1) {
        pass = false;
        this.setMessage("エリアを2点以上指定してください。", "#ff0000");
      }

      return pass;
    },
    onClickClearAreaButton() {
      this.newArea = null;
    },
    onClickBackAreaButton() {
      if (this.newArea && Array.isArray(this.newArea)) {
        this.newArea.pop();
      }
    },
    onClickResetAreaButton() {
      this.newArea = _.clone(this.editAreaInfo.coordinates);
    },
    setMessage(text, color = "#00b0ff") {
      this.message = {
        text: text,
        color: color
      };
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.message = null;
      }, 4000);
    },
    clearForm() {
      this.inout = "内水";
      this.reason = "";
      this.source = "";
      this.remark = "";
    }
  }
};
</script>

<style scoped>
.message {
  color: #2c7be5;
  font-size: 12px;
}
.v-input--selection-controls {
  margin-top: 0;
}
</style>
