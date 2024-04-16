<script>
import { Bar } from "vue-chartjs";
import _ from "lodash";
import moment from "moment";
export default {
  name: "RetardingBasinChart",
  extends: Bar,
  props: {
    miniMode: {
      default: false,
      type: Boolean
    },
    initVolumes: {
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
    maxStorage: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      volumes: [],
      times: [],
      datacollection: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "貯留量",
            unit: "m³",
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
                  label = label.toString();
                  label = label.split(/(?=(?:...)*$)/);
                  label = label.join(",");
                  return label;
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
              let value =
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              value = parseInt(value);
              value = value.toString();
              value = value.split(/(?=(?:...)*$)/);
              value = value.join(",");

              const unit = data.datasets[tooltipItem.datasetIndex].unit;
              return label + " : " + value + " " + unit;
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
    this.volumes = _.cloneDeep(this.initVolumes);
    this.times = _.cloneDeep(this.initTimes);
  },
  mounted() {
    this.setLabelData();
    this.setVolumeData();
    this.setYAxesLimitData();
    this.setWarningLevelStrokeData();
    this.setNowStrokeData();
    this.setWaterBoxData();
    this.setMiniModeOptions();

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
    setVolumeData() {
      const baseDateIndex = _.findIndex(this.times, o => {
        return this.baseDate.isSame(moment.utc(o, "YYYY/MM/DD HH:mm"));
      });

      let pastData = _.fill(
        _.cloneDeep(this.volumes),
        null,
        baseDateIndex + 1,
        this.volumes.length - 1
      );

      this.datacollection.datasets[0].data = pastData;
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

      const pastData = this.volumes.slice(0, baseDateIndex);
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
    setYAxesLimitData() {
      let max = parseInt(this.maxStorage);
      let num = max.toString().length;

      this.options.scales.yAxes[0].ticks.stepSize = Math.pow(10, num - 2);
      this.options.scales.yAxes[0].ticks.max = parseInt(this.maxStorage) * 1.2;
    },
    setWarningLevelStrokeData() {
      const maxStorage = {
        color: "#ff0000",
        label: "最大貯留量",
        value: this.maxStorage
      };
      this.options.annotation.annotations.push(
        this.getAnnotationObject(maxStorage)
      );

      const baseDateIndex = _.findIndex(this.times, o => {
        return this.baseDate.isSame(moment.utc(o, "YYYY/MM/DD HH:mm"));
      });

      const currentVolume = this.volumes[baseDateIndex];
      const currentStatus = {
        color: "#ff0000",
        label: currentVolume
          ? "貯留率" + Math.floor((currentVolume / this.maxStorage) * 100) + "%"
          : "欠測",
        value: 0,
        fontSize: this.miniMode ? 15 : 20
      };

      this.options.annotation.annotations.push(
        this.getAnnotationObject(currentStatus)
      );
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
          label = parseInt(label);
          label = label.toString();
          label = label.split(/(?=(?:...)*$)/);
          label = label.join(",");
          return ("　　　　　　　" + label).slice(-8);
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
          yAdjust: warningInfo.fontSize ? -12 : -6,
          fontSize: warningInfo.fontSize || 10,
          fontColor: "black",
          position: "right",
          content: `${warningInfo.label}`,
          enabled: true
        }
      };
    }
  }
};
</script>
