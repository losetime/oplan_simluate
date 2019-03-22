<template>
  <div class="wind" id="wind">
    <div class="content_body">
      <div class="content_body_top" v-show="show_fullChart" ref="topWrap">
        <outputChart ref="outputChart"></outputChart>
      </div>
      <div class="lengend" v-show="show_fullTable">
        <div class="error_data">
          <span></span>
          <p>坏数据</p>
        </div>
        <div class="anomaly_data">
          <span></span>
          <p>异常数据</p>
        </div>
      </div>
      <div class="content_body_bottom" v-show="show_fullTable" ref="bottomWrap">
        <div class="table-wrap">
          <oraitTable
            v-on:getdetailData="getdetailData"
            ref="oraitTable"
            :visibleHeight="visibleHeight"
          ></oraitTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import outputChart from "./wind_simulate/outputChart";
import oraitTable from "./wind_simulate/oraitTable";
export default {
  data() {
    return {
      styles: null,
      show_fullChart: true,
      show_fullTable: true,
      fullScreen_flag: true,
      top_DomWH: null,
      bottom_DomWH: null,
      visibleHeight: 0
    };
  },
  computed: {
    globalFlag() {
      return this.$store.state.module_global.globalFlag;
    }
  },
  watch: {
    globalFlag(val) {
      if (val == 201) {
        this.fullScreen_chart();
        this.$store.commit("set_globalFlag", 0);
      } else if (val == 202) {
        this.fullScreen_table();
        this.$store.commit("set_globalFlag", 0);
      }
    }
  },
  methods: {
    //表格点击后触发
    getdetailData() {
      // console.log(val);
    },
    //监听dom宽高变化
    watchDom() {
      let _this = this;
      Object.defineProperty(this, "top_DomWH", {
        set: function() {
          if (_this.$refs.outputChart.kline) {
            _this.$refs.outputChart.kline.chart.resize();
          } else {
            _this.$refs.outputChart.tiemShare.chart.resize();
          }
        }
      });
    },
    //图表全屏
    fullScreen_chart() {
      if (this.show_fullTable) {
        this.show_fullTable = false;
        this.styles.setProperty("--topWrap", "100%");
      } else {
        this.show_fullTable = true;
        this.styles.setProperty("--topWrap", "57%");
      }
      this.top_DomWH = this.$refs.topWrap.offsetWidth;
      this.top_DomWH = this.$refs.topWrap.offsetHeight;
    },
    //表格全屏
    fullScreen_table() {
      if (this.show_fullChart) {
        this.show_fullChart = false;
        this.styles.setProperty("--bottomWrap", "98%");
      } else {
        this.show_fullChart = true;
        this.styles.setProperty("--bottomWrap", "41%");
      }
      this.visibleHeight = this.$refs.bottomWrap.offsetHeight;
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.styles = this.$el.style;
      this.styles.setProperty("--topWrap", "57%");
      this.styles.setProperty("--bottomWrap", "41%");
      this.styles.setProperty("--upBorderColor", "rgba(244, 244, 244, 1)");
      this.styles.setProperty("--downBorderColor", "rgba(244, 244, 244, 1)");
      this.watchDom();
    });
  },
  components: {
    outputChart,
    oraitTable
  }
};
</script>

<style scoped lang="scss">
.wind {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  .content_body {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 1);
    display: flex;
    flex-direction: column;
    .content_body_top {
      width: 100%;
      height: var(--topWrap);
      // box-shadow: 0px 0px 4px 0px rgba(172, 172, 172, 1);
    }
    .lengend {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;
      color: var(--fontColor);
      .error_data,
      .anomaly_data {
        display: flex;
        align-items: center;
        margin-right: 10px;
        span {
          margin-right: 2px;
          display: inline-block;
          width: 10px;
          height: 10px;
          background: rgba(239, 120, 134, 1);
        }
      }
      .anomaly_data {
        span {
          background: rgba(84, 187, 231, 1);
        }
      }
    }
    .content_body_bottom {
      width: 100%;
      height: var(--bottomWrap);
      position: relative;
      // box-shadow: 0px 0px 4px 0px rgba(172, 172, 172, 1);
      //表格栏
      .table-wrap {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    }
  }
}
</style>
