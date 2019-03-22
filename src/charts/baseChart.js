import echarts from "echarts";
import { chartTheme } from "../assets/js/common/theme";
export default class BaseChart {
  constructor() {
    this.chart = null;
    this.option = {};
    this.dataIndex = 0;
  }
  initDiv(config) {
    this.chart = echarts.init(document.getElementById(config.id));
    this.initChart(config.data);
  }
  resize() {
    this.chart.resize();
  }
  themeFn(theme) {
    this.option.textStyle.color = theme;
    this.option.legend.textStyle.color = theme;
    this.option.xAxis.forEach(val => {
      val.axisLine.lineStyle.color = theme;
      val.nameTextStyle.color = theme;
    });
    this.option.yAxis.forEach(val => {
      val.axisLine.lineStyle.color = theme;
      val.nameTextStyle.color = theme;
    });
  }
  changeTheme(theme) {
    let light = chartTheme.axisColor[0];
    let dark = chartTheme.axisColor[1];
    if (theme === "dark") {
      this.themeFn(dark);
    } else if (theme === "light") {
      this.themeFn(light);
    }
    this.chart.setOption(this.option);
  }
}
