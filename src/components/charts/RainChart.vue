<script>
import { Bar } from "vue-chartjs";

import _ from "lodash";
import moment from "moment";

export default {
  name: "RainChart",
  extends: Bar,
  props: {
    reverse: {
      type: Boolean,
      required: false,
      default: false
    },
    miniMode: {
      default: false,
      type: Boolean
    },
    rains: {
      type: Array,
      required: true
    },
    totalRains: {
      type: Array,
      default: () => [],
      required: false
    },
    times: {
      type: Array,
      required: true
    },
    baseDate: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      datacollection: {
        //Data to be represented on x-axis
        labels: [],
        datasets: [
          {
            type: "line",
            label: "累計雨量",
            yAxisID: "totalRain",
            xAxisID: "data",
            unit: "mm",
            pointBackgroundColor: "white",
            borderWidth: 3,
            backgroundColor: "#91C46C",
            tooltipLabelColor: "#91C46C",
            borderColor: "#91C46C",
            pointRadius: 0,
            pointHitRadius: 0,
            fill: false,
            data: this.totalRains
          },
          {
            type: "bar",
            label: "雨量強度",
            yAxisID: "rain",
            xAxisID: "data",
            unit: "mm/h",
            backgroundColor: "#1C344C",
            tooltipLabelColor: "#1C344C",
            borderColor: "#1C344C",
            pointBackgroundColor: "white",
            borderWidth: 0.5,
            //Data to be represented on y-axis
            data: this.rains,
            barPercentage: 1.0,
            categoryPercentage: 1.0
          }
        ]
      },
      //Chart.js options that controls the appearance of the chart
      options: {
        layout: {
          padding: {
            right: 0,
            left: -30
          }
        },
        tooltips: {
          enabled: !this.miniMode,
          mode: "index",
          intersect: false,
          callbacks: {
            labelColor: function(tooltipItem, chart) {
              const dataset =
                chart.config.data.datasets[tooltipItem.datasetIndex];
              return {
                backgroundColor: dataset.tooltipLabelColor
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
        scales: {
          yAxes: [
            {
              id: "rain",
              ticks: {
                reverse: this.reverse,
                min: 0,
                max: 5,
                stepSize: 1,
                beginAtZero: true,
                callback: (label, index, labels) => {
                  return ("　　　　　" + parseFloat(label).toFixed(1)).slice(
                    -6
                  );
                }
              },
              gridLines: {
                display: !this.miniMode
              }
            }
          ],
          xAxes: [
            {
              position: "bottom",
              id: "data",
              ticks: {
                fontColor: "rgba(0,0,0,0)",
                display: !this.miniMode,
                beginAtZero: true
              },
              gridLines: {
                display: !this.miniMode
              }
            }
          ]
        },
        annotation: {
          annotations: [
            {
              type: "line",
              mode: "vertical",
              scaleID: "data",
              value: "06:10",
              borderColor: "#FF0000",
              borderWidth: 1.5
            }
          ]
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.setYAxesLimitData();
    this.setLabelData();
    if (!this.reverse) {
      this.datacollection.datasets[1].label = "10分雨量";
      this.datacollection.datasets[1].unit = "mm";
      this.options.scales.xAxes[0].ticks.fontColor = "#9a9a9a";
      this.options.scales.yAxes.push({
        id: "totalRain",
        position: "right",
        type: "linear",
        ticks: {
          reverse: this.reverse,
          max: 300,
          min: 0,
          stepSize: 100,
          beginAtZero: true
        },
        gridLines: {
          display: !this.miniMode
        }
      });
      this.options.layout.padding.right = 0;
      this.options.layout.padding.left = -20;
    }

    this.options.annotation.annotations[0].value = this.baseDate.local().format(
      "HH:mm"
    );

    this.addPlugin({
      beforeUpdate: chart => {
        if (!chart.config.data.datasets[1]) {
          return;
        }
        const backgroundColor = chart.config.data.datasets[1].backgroundColor;
        const backgroundColorList = [];
        const borderColorList = [];

        // For every data we have ...
        for (let i = 0; i < chart.config.data.datasets[1].data.length; i++) {
          if (i < 37) {
            backgroundColorList.push(backgroundColor);
          } else {
            backgroundColorList.push("rgba(0,0,0,0)");
          }

          borderColorList.push(backgroundColor);
        }

        // We update the chart bars color properties
        chart.config.data.datasets[1].backgroundColor = backgroundColorList;
        chart.config.data.datasets[1].borderColor = borderColorList;
      }
    });
    //renderChart function renders the chart with the datacollection and options object.
    this.renderChart(this.datacollection, this.options);
  },
  methods: {
    setLabelData() {
      this.datacollection.labels = _.map(this.times, time => {
        return moment
          .utc(time, "YYYY/MM/DD HH:mm")
          .local()
          .format("HH:mm");
      });
    },
    setYAxesLimitData() {
      const rainMax = _.maxBy(this.rains, (value) => {
        return parseFloat(value)
      });
      const defaultMax = 5;

      this.options.scales.yAxes[0].ticks.max =
        rainMax > defaultMax ? parseFloat(rainMax) + 1 : defaultMax;
    }
  }
};
</script>
