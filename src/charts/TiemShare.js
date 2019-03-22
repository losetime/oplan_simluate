import BaseChart from "./baseChart";
export default class Kline extends BaseChart {
  constructor() {
    super();
    this.realityKline = "rgba(245, 126, 81, 1)";
    this.simulateKline = "rgba(97, 210, 196, 1)";
    this.lineData1 = [];
    this.lineData2 = [];
    this.lineData3 = [];
    this.lineData4 = [];
  }
  initChart(data) {
    this.lineData1 = [];
    this.lineData2 = [];
    this.lineData3 = [];
    this.lineData4 = [];
    let flag = 0;
    data.data.map(item => {
      if (item[2] == 1) {
        this.lineData1.push(item[0]);
        this.lineData2.push("-");
        this.lineData3.push(item[1]);
        this.lineData4.push("-");
      } else {
        this.lineData2.push(item[0]);
        this.lineData4.push(item[1]);
        this.lineData3.push("-");
        if (flag == 0) {
          this.lineData1.push(item[0]);
          flag = 1;
        } else {
          this.lineData1.push("-");
        }
      }
    });
    this.option = {
      color: [this.realityKline, this.simulateKline],
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          snap: false
        },
        backgroundColor: "rgba(245, 245, 245, 0.8)",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        textStyle: {
          color: "#000"
        },
        formatter: params => {
          // trigger: "axis"返回的是数组，trigger: "item"返回的是对象,
          this.dataIndex = params[0].dataIndex;
        }
      },
      axisPointer: {
        link: { xAxisIndex: "all" },
        snap: false,
        label: {
          backgroundColor: "#777"
        }
      },
      legend: {
        textStyle: {
          color: "#000000"
        },
        top: "3",
        right: "50",
        data: ["实际分时", "模拟分时", "实际电量", "模拟电量"],
        selected: {}
      },
      grid: [
        {
          top: "7%",
          bottom: "40%",
          left: 88,
          right: 58,
          height: "50%"
        },
        {
          top: "65%",
          bottom: 0,
          left: 88,
          right: 58,
          height: "32%"
        }
      ],
      xAxis: [
        {
          type: "category",
          data: data.data.map((item, index) => {
            return item[3];
          }),
          boundaryGap: true,
          axisLine: { onZero: false },
          splitLine: { show: false },
          axisTick: {
            alignWithLabel: true
          },
          axisPointer: {
            z: 100,
            label: {
              show: false
            }
          }
        },
        {
          type: "category",
          gridIndex: 1,
          data: data.data.map((item, index) => {
            return item[4];
          }),
          boundaryGap: true,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false }
        }
      ],
      yAxis: [
        {
          name: "负荷（MW）",
          scale: true,
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          nameLocation: "center",
          nameGap: 50,
          axisLabel: {
            formatter: function(params) {
              if (params < 1000 && params > 0) {
                return params;
              } else if (params == 0) {
                return;
              } else {
                return params / 1000 + "k";
              }
            }
          }
        },
        {
          name: "电量（MW·h）",
          gridIndex: 1,
          nameLocation: "center",
          nameGap: 50,
          axisLabel: {
            formatter: function(params) {
              if (params < 1000 && params > 0) {
                return params;
              } else if (params == 0) {
                return;
              } else {
                return params / 1000 + "k";
              }
            }
          },
          axisLine: { show: true },
          axisTick: { show: false },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: [0, 1],
          start: 0,
          end: 100
        },
        {
          xAxisIndex: [0, 1],
          type: "inside",
          bottom: 10,
          start: 0,
          end: 100
        }
      ],
      series: [
        {
          name: "实际分时",
          type: "line",
          xAxisIndex: 0,
          yAxisIndex: 0,
          // smooth: "none",
          symbol: "none",
          lineStyle: {
            color: this.realityKline
          },
          data: this.lineData1
        },
        {
          name: "模拟分时",
          type: "line",
          xAxisIndex: 0,
          yAxisIndex: 0,
          // smooth: "none",
          symbol: "none",
          lineStyle: {
            color: this.simulateKline
          },
          data: this.lineData2
        },
        {
          name: "实际电量",
          type: "bar",
          xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            color: this.realityKline
          },
          data: this.lineData3
        },
        {
          name: "模拟电量",
          type: "bar",
          xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            color: this.simulateKline
          },
          data: this.lineData4
        }
      ]
    };
    this.chart.setOption(this.option, true, true);
  }
}
