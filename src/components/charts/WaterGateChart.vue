<script>
import { Bar } from "vue-chartjs";
import _ from "lodash";
import moment from "moment";
export default {
  name: "WaterGateChart",
  extends: Bar,
  props: {
    miniMode: {
      default: false,
      type: Boolean
    },
    initInnerLevels: {
      type: Array,
      required: true
    },
    initOuterLevels: {
      type: Array,
      required: true
    },
    observatoryId: {
      type: String,
      required: true
    },
    initTimes: {
      type: Array,
      required: true
    },
    baseDate: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      innerLevels: [],
      outerLevels: [],
      times: [],
      warningInfos: [
        {
          color: "#FD7400",
          label: "高潮氾濫危険水位(北区・板橋区・足立区・葛飾区) A.P.",
          value: 4.3
        },
        {
          color: "#004358",
          label: "高潮氾濫危険水位(墨田区・江東区・江戸川区) A.P.",
          value: 3.9
        },
        {
          color: "#68920c",
          label: "高潮氾濫危険水位(千代田区・中央区・港区・品川区・大田区) A.P.",
          value: 3.6
        },
      ],
      datacollection: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "内水位",
            unit: "A.P.m",
            pointBackgroundColor: "white",
            fill: false,
            yAxisID: "riverLevel",
            borderWidth: 3,
            borderColor: "#6a030f",
            backgroundColor: "#6a030f",
            pointBorderColor: "#6a030f",
            pointRadius: 0,
            pointHitRadius: 0,
            lineTension: 0,
            data: [],
            spanGaps: false
          },
          {
            type: "line",
            label: "外水位",
            unit: "A.P.m",
            pointBackgroundColor: "white",
            fill: false,
            yAxisID: "riverLevel",
            borderWidth: 3,
            borderColor: "#3734dc",
            backgroundColor: "#3734dc",
            pointBorderColor: "#3734dc",
            pointRadius: 0,
            pointHitRadius: 0,
            lineTension: 0,
            data: [],
            spanGaps: false
          }
        ]
      },
      //Chart.js options that controls the appearance of the chart
      options: {
        layout: {
          padding: {
            right: 0
          }
        },
        scales: {
          yAxes: [
            {
              id: "riverLevel",
              gridLines: {
                display: false
              },
              ticks: {
                max: 6.0,
                min: -1.0,
                callback: (label, index, labels) => {
                  return parseFloat(label).toFixed(1);
                }
              }
            }
          ],
          xAxes: [
            {
              id: "data",
              gridLines: {
                display: false
              },
              ticks: {
                display: false
              },
              categoryPercentage: 1.0,
              barPercentage: 1.0
            }
          ]
        },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            filter: function(item) {
              return !item.text.includes("Data");
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: false,
          mode: "index",
          intersect: false,
          filter: function(tooltipItem) {
            return (
              tooltipItem.datasetIndex === 0 || tooltipItem.datasetIndex === 1
            );
          },
          callbacks: {
            labelColor: function(tooltipItem, chart) {
              const dataset =
                chart.config.data.datasets[tooltipItem.datasetIndex];
              return {
                backgroundColor: dataset.backgroundColor
              };
            },
            label: function(tooltipItem, data) {
              const label = data.datasets[tooltipItem.datasetIndex].label;
              const unit = data.datasets[tooltipItem.datasetIndex].unit;
              return (
                label +
                " : " +
                data.datasets[tooltipItem.datasetIndex].data[
                  tooltipItem.index
                ] +
                " " +
                unit
              );
            }
          }
        },
        hover: {
          mode: "index",
          intersect: false
        },
        annotation: {
          events: ["click", "dblclick", "mouseover", "mouseout"],
          annotations: [
          ]
        }
      }
    };
  },
  created() {
    this.innerLevels = _.cloneDeep(this.initInnerLevels);
    this.outerLevels = _.cloneDeep(this.initOuterLevels);
    this.times = _.cloneDeep(this.initTimes);
  },
  mounted() {
    this.setLabelData();
    this.setRiverLevelData();
    this.setMiniModeOptions();
    if (this.observatoryId === "99999-4R01") {
      this.setWarningLevelStrokeData();
    }

    //renderChart function renders the chart with the datacollection and options object.
    this.renderChart(this.datacollection, this.options);
  },
  methods: {
    setLabelData() {
      let labels = _.map(this.times, time => {
        return moment
          .utc(time, "YYYY/MM/DD HH:mm")
          .local()
          .format("HH:mm");
      });

      this.datacollection.labels = labels;
    },
    setRiverLevelData() {
      this.datacollection.datasets[0].data = this.innerLevels;
      this.datacollection.datasets[1].data = this.outerLevels;
    },
    setMiniModeOptions() {
      this.options.layout.padding.right = this.miniMode ? 10 : 0;
      this.options.scales.yAxes[0].gridLines.display = !this.miniMode;
      this.options.scales.xAxes[0].gridLines.display = !this.miniMode;
      this.options.scales.xAxes[0].ticks.display = !this.miniMode;
      this.options.tooltips.enabled = !this.miniMode;

      if (!this.miniMode) {
        this.options.layout.padding.left = -30;

        this.options.scales.yAxes[0].ticks.callback = (
          label,
          index,
          labels
        ) => {
          return ("　　　　　" + parseFloat(label).toFixed(1)).slice(-6);
        };
      }
    },
    setWarningLevelStrokeData() {
      _.forEach(this.warningInfos, warningInfo => {
        if (!warningInfo.value || warningInfo.value === -1) {
          return;
        }
        this.options.annotation.annotations.push(
            this.getAnnotationObject(warningInfo)
        );
      });
    },
    getAnnotationObject(warningInfo) {
      return {
        type: "line",
        mode: "horizontal",
        scaleID: "riverLevel",
        value: warningInfo.value,
        borderColor: warningInfo.color,
        borderWidth: 0.8,
        label: {
          backgroundColor: "rgba(0,0,0,0)",
          yAdjust: -6,
          fontSize: 10,
          fontColor: "black",
          position: "right",
          content: this.miniMode? "":`${warningInfo.label} ${warningInfo.value}m`,
          enabled: true
        }
      };
    }
  }
};
</script>
