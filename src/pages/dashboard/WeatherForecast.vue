<template>
  <v-row no-gutters class="px-2">
    <v-col v-for="o in forecasts" class="pa-1">
      <v-card
        dark
        class="text-center py-2 px-1"
        :color="'rgba(255,255,255,0.1)'"
        @click="openJma"
      >
        <div class="font-weight-bold">
          {{ o.date }}
        </div>
        <div class="mt-1">
          <v-icon large :color="getIconColor(o.weather.main)">{{
            o.weather.main
          }}</v-icon>
          <span v-if="o.weather.arrow && o.weather.arrow !== 'small'" class="arrow">
            {{ o.weather.arrow }}
          </span>
          <v-icon
            :large="o.weather.arrow !== 'small'"
            :small="o.weather.arrow === 'small'"
            v-if="o.weather.sub"
            :color="getIconColor(o.weather.sub)"
            >{{ o.weather.sub }}</v-icon
          >
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import conf from "../../config";
import { Weathers } from "../../enums/Weather";
import _ from "lodash";
import moment from "moment";

export default {
  name: "WeatherForecast",
  props: {
    baseDate: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      forecasts: null
    };
  },
  created() {
    this.loadForecasts();
  },
  watch: {
    baseDate() {
      this.loadForecasts();
    }
  },
  methods: {
    loadForecasts() {
      const paramDate = this.round(
          this.baseDate,
          moment.duration(5, "minutes"),
          "floor"
      );
      return axios
        .get(`${conf.apiServer.url}/api/weather-forecast`, {
          params: {
            date: paramDate
              .clone()
              .utc()
              .format("YYYY/MM/DD HH:mm")
          }
        })
        .then(response => {
          const forecasts = [];
          _.forEach(response.data.data, forecast => {
            forecasts.push({
              weather: this.getWeatherInfo(forecast.mark),
              date: moment
                .utc(forecast.date, "YYYY/MM/DD HH:mm")
                .local()
                .format("MM/DD")
            });
          });
          this.forecasts = forecasts;
        });
    },
    getWeatherInfo(key) {
      return _.find(Weathers, weather => {
        return weather.key === key;
      });
    },
    getIconColor(mark) {
      switch (mark) {
        case "mdi-weather-sunny":
          return "#FFC02F";
        case "mdi-cloud":
          return "#999898";
        case "mdi-weather-hurricane":
          return "#999898";
        case "mdi-umbrella":
          return "#478bcc";
        case "mdi-snowflake":
          return "#ffffff";
      }
    },
    openJma() {
      window.open("https://www.jma.go.jp/jp/yoho/319.html", "_blank");
    },
    round(date, duration, method) {
      return moment(Math[method](+date / +duration) * +duration);
    },
  }
};
</script>

<style scoped>
.arrow {
  font-size: 12px;
}
</style>
