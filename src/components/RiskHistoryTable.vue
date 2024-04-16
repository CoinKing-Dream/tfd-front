<template>
  <v-dialog v-model="dialog">
    <v-card class="pa-2">
      <v-simple-table class="risk-history-table">
        <thead>
          <tr>
            <th>NO</th>
            <th>日時</th>
            <th>事象</th>
            <th>気象要因</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history in riskHistories" :key="history.no">
            <td>{{ history.no }}</td>
            <td>
              <template v-for="(d, i) in history.date">
                <div :key="d" @click="onClickHistoryDate(d)">
                  <span v-if="history.isDummy">【仮想の日時】 </span>
                  <span :class="{ 'history-date': i === 0 }">{{ d }}</span
                  ><span v-if="i === 0">～</span>
                </div>
              </template>
            </td>
            <td>{{ history.event }}</td>
            <td>{{ history.factor }}</td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-card-actions style="background-color: whitesmoke; text-align: right">
        <v-spacer></v-spacer>
        <v-btn
          right
          text
          color="primary"
          @click="close"
          style="font-weight: bold; font-size: 20px"
          >閉じる</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import riskHistories from "@/assets/json/riskHistories.json";
import moment from "moment";
const RISK_HISTORY_DATE_FORMAT = "YYYY年MM月DD年 HH:mm";

export default {
  name: "RiskHistoryTable",
  props: {
    dialog: {
      require: true,
      type: Boolean
    }
  },
  data() {
    return {
      riskHistories: riskHistories
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    onClickHistoryDate(date) {
      this.$emit(
        "setDate",
        moment(date, RISK_HISTORY_DATE_FORMAT).format("YYYY/MM/DD HH:mm")
      );
    }
  }
};
</script>

<style scoped></style>
