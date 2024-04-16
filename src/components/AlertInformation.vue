<template>
  <v-card
    tile
    class="alert-card"
    @click="showAlert()"
    :color="listening && !isRead(info.time) ? 'rgba(13,71,161,0.6)': 'rgba(255,255,255,0.1)'"
  >
    <v-card-text>
      <v-row
        no-gutters
        v-if="!info.category || (info.category && info.category !== 'release')"
      >
        <v-col>
          <v-chip x-small dark :color="info.color" v-if="!info.alert_levels">
            {{ info.level }}
          </v-chip>
          <template v-for="(item, index) in info.alert_levels">
            <v-chip x-small dark :key="index" :color="colors[item - 1]">
              {{ names[item - 1] }}
            </v-chip>
          </template>
        </v-col>
        <v-col v-if="info.read === 'true'" cols="auto">
          <v-icon color="red">mdi-new-box</v-icon>
        </v-col>
      </v-row>
      <div class="mt-1 alert-title">
        {{ info.title }}
      </div>
      <div class="alert-contents overline" v-if="info.area">
        {{ info.area }}
      </div>
      <div style="text-align: right">
        <span class="time overline">
          {{ info.time }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { rootGetters } from "../store/store-functions";
import moment from "moment"

export default {
  name: "AlertInformation",
  props: ["info"],
  data() {
    return {
      show: false,
      items: [],
      colors: ["red", "warning", "pink"],
      names: ["警報", "注意報", "特別警報"]
    };
  },
  computed: {
    alertCheckDate() {
      return this.$store.getters[rootGetters.ALERT_CHECK_DATE];
    },
    listening() {
      return this.$store.getters[rootGetters.ALERT_LISTENING];
    },
  },
  methods: {
    showAlert() {
      this.$root.$emit("showAlertDialog", { alert_info: this.$props.info });
    },
    isRead(time) {
      if (!this.alertCheckDate) {
        return false;
      }

      return this.alertCheckDate.diff(moment(time, "YYYY/MM/DD HH:mm")) >= 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.alert-card {
  width: 100%;
  margin: 2px 0;
  * {
    color: white;
  }

  .alert-title {
    font-size: 1.2rem;
    font-weight: 500;
  }
  .alert-contents {
    color: rgba(255, 255, 255, 0.7);
  }

  .time {
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
