<template></template>

<script>
import io from "socket.io-client";
import conf from "../config";
import axios from "axios";
import { rootGetters, rootMutations } from "../store/store-functions";
import moment from "moment";

export default {
  name: "AlertProcess",
  data() {
    return {
      socket: null,
      selected: [],
      items: [],
      dialogItem: {}
    };
  },
  watch: {
    listening() {
      if (this.listening) {
        this.startListening();
      } else {
        this.stopListening();
      }
    },
    baseDate(after, before) {
      if (after.format("YYYY/MM/DD HH:mm") === before.format("YYYY/MM/DD HH:mm")) {
        return
      }
      this.loadAlerts();
    }
  },
  computed: {
    listening() {
      return this.$store.getters[rootGetters.ALERT_LISTENING];
    },
    baseDate() {
      return this.$store.getters[rootGetters.ALERT_BASE_DATE];
    },
    alertCheckDate() {
      return this.$store.getters[rootGetters.ALERT_CHECK_DATE];
    }
  },
  created() {
    this.socket = io(conf.apiServer.url, {
      query: {
        "access_token": this.$cookies.get("access_token")
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            'Accept': 'application/json'
          }
        }
      }
    });

    const alertLastCheckDate =
      localStorage.getItem("alertLastCheckDate") ||
      moment().format("YYYY/MM/DD HH:mm");
    this.updateAlertCheckDate(moment(alertLastCheckDate, "YYYY/MM/DD HH:mm"));

    this.loadAlerts().then(() => {
      this.startListening();
    });
  },
  beforeDestroy() {
    this.stopListening();
  },
  methods: {
    loadAlerts() {
      const paramDate = this.round(
          this.baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );
      return axios
        .get(`${conf.apiServer.url}/api/delivered-alerts`, {
          params: {
            date: paramDate
              .clone()
              .utc()
              .format("YYYY/MM/DD HH:mm")
          }
        })
        .then(response => {
          const alerts = response.data.alerts;
          if (!alerts) {
            return;
          }
          const temp = [];
          alerts.forEach(info => {
            if (
              info.title === "東京都気象警報・注意報" ||
              info.title === "土砂災害警戒情報"
            ) {
              // VPWW54
              temp.push(this.localizationAlertAnnounceData(info));
            } else {
              temp.push(this.localizationAlertChangeData(info));
            }
          });

          this.items = temp;
          this.updateAlerts(this.items);
        });
    },
    startListening() {
      // socket event listener
      this.socket.on("alertChange", data => {
        const addData = [];

        data.forEach(info => {
          info._id = info.time;
          addData.push(this.localizationAlertChangeData(info));
        });

        this.items = addData.concat(this.items);
        this.updateAlerts(this.items);
      });

      this.socket.on("alertAnnounce", data => {
        const addData = [];
        const announcement = data.announcement;
        // const release = data.release;

        announcement.forEach(info => {
          info._id = data.time;
          info.text = data.text;
          addData.push(this.localizationAlertAnnounceData(info));
        });

        this.items = addData.concat(this.items);
        this.updateAlerts(this.items);
      });
    },
    stopListening() {
      this.socket.removeAllListeners();
    },
    updateAlerts(alerts) {
      this.$store.commit(rootMutations.UPDATE_ALERTS, alerts);
    },
    localizationAlertAnnounceData(info) {
      return {
        time: moment.utc(info._id, "YYYY/MM/DD HH:mm").local().format("YYYY/MM/DD HH:mm"),
        alert_levels: info.alert_levels.filter((x, i, self) => {
          return self.indexOf(x) === i;
        }),
        title: info.alert_names.join(","),
        area: info.area_names.join(","),
        text: info.text,
        read: false,
        category: info.category,
      };
    },
    localizationAlertChangeData(info) {
      return {
        title: info.title,
        type: info.type,
        level: info.level,
        text: info.text,
        comment: info.comment,
        time: moment.utc(info._id, "YYYY/MM/DD HH:mm").local().format("YYYY/MM/DD HH:mm"),
        read: false,
      };
    },
    updateAlertCheckDate(date) {
      this.$store.commit(rootMutations.UPDATE_ALERT_CHECK_DATE, date);
    },
    round(date, duration, method) {
      return moment(Math[method](+date / +duration) * +duration);
    },
  }
};
</script>

<style scoped></style>
