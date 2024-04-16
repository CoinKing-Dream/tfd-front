<script>
import { Bar } from "vue-chartjs";
import _ from "lodash";
import moment from "moment";
export default {
  name: "RiverLevelChart",
  extends: Bar,
  props: {
    miniMode: {
      default: false,
      type: Boolean
    },
    initRiverLevels: {
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
    standbyLevel: {
      type: Number,
      required: false,
      default: -1
    },
    warningLevel: {
      type: Number,
      required: false,
      default: -1
    },
    evacuationLevel: {
      type: Number,
      required: false,
      default: -1
    },
    dangerousLevel: {
      type: Number,
      required: false,
      default: -1
    },
    outbreakLevel: {
      type: Number,
      required: false,
      default: -1
    },
    landform: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      riverLevels: [],
      times: [],
      warningInfos: {
        standby: {
          color: "#008000",
          label: "水防団待機水位",
          value: this.standbyLevel
        },
        warning: {
          color: "#FFA500",
          label: "氾濫注意水位",
          value: this.warningLevel
        },
        evacuation: {
          color: "#000000",
          label: "避難判断水位",
          value: this.evacuationLevel
        },
        dangerous: {
          color: "#AD02AD",
          label: "氾濫危険水位",
          value: this.dangerousLevel
        },
        outbreak: {
          color: "#FF0000",
          label: "氾濫発生水位",
          value: this.outbreakLevel
        }
      },
      datacollection: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "水位",
            unit: "m",
            pointBackgroundColor: "white",
            fill: false,
            yAxisID: "riverLevel",
            borderWidth: 3,
            borderColor: "#01163F",
            backgroundColor: "#01163F",
            pointBorderColor: "#01163F",
            pointRadius: 0,
            pointHitRadius: 0,
            lineTension: 0,
            data: [],
            spanGaps: false
          },
          {
            type: "line",
            label: "水位",
            unit: "m",
            pointBackgroundColor: "white",
            fill: false,
            yAxisID: "riverLevel",
            borderWidth: 3,
            borderColor: "#3734dc",
            backgroundColor: "#3734dc",
            pointBorderColor: "#3734dc",
            borderDash: [10, 5],
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
                max: 8,
                min: 0,
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
        groundDataset: [],
        annotation: {
          events: ["click", "dblclick", "mouseover", "mouseout"],
          annotations: [
            {
              type: "box",
              drawTime: "beforeDatasetsDraw",
              yScaleID: "riverLevel",
              borderColor: "rgba(0,0,0,0)",
              yMin: 0,
              yMax: 0,
              backgroundColor: "#3D8AFF"
            },
            {
              type: "line",
              mode: "vertical",
              scaleID: "data",
              value: "06:10",
              borderColor: "#FF0000",
              borderWidth: 1.5,
              label: {
                content: "現在",
                position: "top",
                enabled: true
              }
            }
          ]
        }
      }
    };
  },
  created() {
    this.riverLevels = _.cloneDeep(this.initRiverLevels);
    this.times = _.cloneDeep(this.initTimes);
  },
  mounted() {
    this.setLabelData();
    this.setRiverLevelData();
    this.setYAxesLimitData();
    this.isSpanGap();
    this.setLandformData();
    this.setWarningLevelStrokeData();
    this.setNowStrokeData();
    this.setWaterBoxData();
    this.setMiniModeOptions();

    this.addPlugin({
      id: "horizontalLine",
      beforeDatasetsDraw: chart => {
        const groundDataset = chart.config.options.groundDataset;
        if (groundDataset.length > 0) {
          const ctxPlugin = chart.chart.ctx;
          const xAxe = chart.scales[chart.config.options.scales.xAxes[0].id];
          const yAxe = chart.scales[chart.config.options.scales.yAxes[0].id];

          const minGround = _.minBy(groundDataset, o => {
            return o[0];
          });
          const maxGround = _.maxBy(groundDataset, o => {
            return o[0];
          });

          ctxPlugin.strokeStyle = "red";
          ctxPlugin.beginPath();
          ctxPlugin.moveTo(xAxe.left, yAxe.bottom);
          for (let i = 0; i < groundDataset.length; i++) {
            let x = groundDataset[i][0] - minGround[0];
            x = (x / (maxGround[0] - minGround[0])) * xAxe.width + xAxe.left;

            let y = yAxe.max - (groundDataset[i][1] - yAxe.min);
            y = (y / yAxe.max) * yAxe.height + yAxe.top;

            ctxPlugin.lineTo(x, y);
          }
          ctxPlugin.lineTo(xAxe.right, yAxe.bottom);
          ctxPlugin.lineTo(xAxe.left, yAxe.bottom);
          ctxPlugin.closePath();
          ctxPlugin.fillStyle = "#f1eeea";
          ctxPlugin.fill();
        }
      }
    });

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
      const baseDateIndex = _.findIndex(this.times, o => {
        return this.baseDate.isSame(moment.utc(o, "YYYY/MM/DD HH:mm"));
      });

      let pastData = _.fill(
        _.cloneDeep(this.riverLevels),
        null,
        baseDateIndex + 1,
        this.riverLevels.length
      );

      const futureData = _.fill(
        _.cloneDeep(this.riverLevels),
        null,
        0,
        baseDateIndex
      );

      this.datacollection.datasets[0].data = pastData;
      this.datacollection.datasets[1].data = futureData;
    },
    setNowStrokeData() {
      this.options.annotation.annotations[1].value = this.baseDate
        .local()
        .format("HH:mm");
      this.options.annotation.annotations[1].label.content = this.miniMode
        ? ""
        : "現在";
    },
    setWaterBoxData() {
      const baseDateIndex = _.findIndex(this.times, o => {
        return this.baseDate.isSame(moment.utc(o, "YYYY/MM/DD HH:mm"));
      });

      const pastData = this.riverLevels.slice(0, baseDateIndex);
      const blueAreaY = _.findLast(pastData, level => {
        return level !== null;
      });
      const blueAreaYMax = blueAreaY
        ? blueAreaY
        : this.options.scales.yAxes[0].ticks.min;
      this.options.annotation.annotations[0].yMax = blueAreaYMax;

      if (blueAreaYMax) {
        this.options.annotation.annotations[0].yMin = this.options.scales.yAxes[0].ticks.min;
      }
    },
    setLandformData() {
      if (this.landform.length > 0) {
        this.options.groundDataset = this.landform;
      }
    },
    setYAxesLimitData() {
      if (this.landform.length > 0) {
        const landformYMin = _.minBy(this.landform, o => {
          return o[1];
        });
        const landformYMax = _.maxBy(this.landform, o => {
          return o[1];
        });

        if (landformYMin) {
          this.options.scales.yAxes[0].ticks.min = landformYMin[1] - 0.5;
          this.options.annotation.annotations[0].yMin = landformYMin[1] - 0.5;
        }

        if (landformYMax) {
          this.options.scales.yAxes[0].ticks.max = landformYMax[1] + 1;
        }
      } else {
        const riverLevelMin = _.min(this.riverLevels);
        const riverLevelMax = _.max(this.riverLevels);

        this.options.scales.yAxes[0].ticks.min = parseFloat(riverLevelMin) - 1;
        this.options.scales.yAxes[0].ticks.max = parseFloat(riverLevelMax) + 5;
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
    setMiniModeOptions() {
      this.datacollection.datasets[1].borderDash = this.miniMode
        ? [5, 1]
        : [10, 5];
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
          content: `${warningInfo.label} ${warningInfo.value}m`,
          enabled: true
        }
      };
    },
    delete5minuteData(array) {
      const indexes = [];
      _.forEach(this.times, (time, index) => {
        const minute = moment.utc(time, "YYYY/MM/DD HH:mm").minutes();
        if (minute % 10 !== 0) {
          indexes.push(index);
        }
      });

      _.remove(array, (o, i) => {
        return _.includes(indexes, i);
      });

      return array;
    },
    isSpanGap() {
      const baseDateIndex = _.findIndex(this.times, o => {
        return this.baseDate.isSame(moment.utc(o, "YYYY/MM/DD HH:mm"));
      });

      let pastData = _.fill(
          _.cloneDeep(this.riverLevels),
          null,
          baseDateIndex + 1,
          this.riverLevels.length - 1
      );

      const missing = _.filter(pastData, (v) => {
        return v === -999;
      });

      this.datacollection.datasets[0].spanGaps = missing.length <= 6;
    }
  }
};
</script>
