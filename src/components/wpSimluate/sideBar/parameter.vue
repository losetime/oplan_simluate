<template>
  <div class="parameter-content" @click.stop>
    <div class="message">
      <div class="start-time">
        模拟开始时间
        <DatePicker
          class="DatePicker-wrapper"
          :parentTime="startDate"
          :disabled="startDisabled"
        ></DatePicker>
      </div>
      <div class="stop-time">
        模拟结束时间
        <DatePicker
          class="DatePicker-wrapper"
          :parentTime="startDate"
          @getDateResult="getDateResult"
        ></DatePicker>
      </div>
      <!-- <div class="features" @click="diurnalDay">
        <div :class="light == false ? 'bigBox' : 'bigBox active'">
          <div class="smallBox"></div>
        </div>
        <span>考虑日特性</span>
      </div> -->
      <transition name="parameter-fade1">
        <div class="start" @click="startSimulate" v-show="showStart">
          开始模拟
        </div>
      </transition>
      <transition name="parameter-fade2">
        <pmgressbar
          :pmgressbarShow="pmgressbarShow"
          successColor="#13ce66"
          strokeColor="#FE6737"
          :radius="30"
          :strokeWidth="2"
        ></pmgressbar>
      </transition>
      <i class="iconfont icon-guanbi" @click="closeParameter"></i>
    </div>
  </div>
</template>

<script>
import { start_parameter } from "../../../assets/service/wpSimluateService.js";
import DatePicker from "../../../globalComponents/datePicker.vue";
import pmgressbar from "../../../globalComponents/pmgressbar.vue";
export default {
  data() {
    return {
      startDate: null,
      endDate: null,
      light: false,
      showStart: true,
      startDisabled: true,
      pmgressbarShow: false
    };
  },
  computed: {
    windSiteInfo() {
      return this.$store.state.module_global.windSiteInfo;
    }
  },
  watch: {
    windSiteInfo(val) {
      this.startDate = new Date(val.simulationStart);
      this.endDate = val.simulationStart;
    }
  },
  methods: {
    zIndex() {
      let ele = document.getElementsByClassName("el-picker-panel")[0];
      ele.style.zIndex = 10000;
    },
    closeParameter() {
      this.$store.commit("set_globalFlag", 0);
    },
    diurnalDay() {
      if (this.light == false) {
        this.light = true;
      } else {
        this.light = false;
      }
    },
    //监听的DatePicker的值
    getDateResult(val) {
      this.endDate = val;
    },
    //开始模拟按钮事件
    startSimulate() {
      this.pmgressbarShow = true;
      this.showStart = false;
      start_parameter(this.endDate).then(res => {
        if (res.err_code == 0) {
          //会返回一个simulationStart
          this.$store.commit("set_simulationStart", res.data.simulationStart);
          this.pmgressbarShow = false; //进度条
          this.showStart = true;
          //401在图表界面监听
          this.$store.commit("set_globalFlag", 401);
        } else {
          this.pmgressbarShow = false;
          this.showStart = true;
          this.$store.commit("set_globalFlag", 0);
          this.$message({
            type: "error",
            message: "模拟失败，请稍后重试"
          });
        }
      });
    }
  },
  components: {
    pmgressbar,
    DatePicker
  }
};
</script>
<style scoped lang="scss">
.parameter-content {
  background: url("/oraitStatic/img/wpSimluate/实际数据.png") no-repeat;
  width: 240px;
  height: 360px;
  background-color: #f3f3f2;
  color: #554843;
  font-size: var(--FtSize_three);
  font-family: "SourceHanSansSC-Normal";
  overflow: hidden;
  .message {
    margin-top: 64px;
    height: 252px;
    font-size: var(--FtSize_three);
    .parameter-fade1-enter-active {
      transition: all 0s ease;
    }
    .parameter-fade1-leave-active {
      transition: all 0s ease;
    }
    .parameter-fade1-enter,
    .parameter-fade1-leave-to {
      opacity: 0;
    }
    .parameter-fade2-enter-active {
      transition: all 0s ease;
    }
    .parameter-fade2-leave-active {
      transition: all 0s ease;
    }
    .parameter-fade2-enter,
    .parameter-fade2-leave-to {
      opacity: 0;
    }
    i {
      position: absolute;
      top: 7px;
      right: 8px;
      cursor: pointer;
      color: #fff;
    }
    .start-time,
    .stop-time {
      padding-left: 30px;
      .el-date-editor {
        width: 180px;
        margin-top: 8px;
      }
      .DatePicker-wrapper {
        margin-top: 10px;
        width: 180px;
        height: 25px;
      }
    }
    .start-time {
      margin-bottom: 15px;
    }
    .stop-time {
      margin-bottom: 22px;
    }
    .features {
      width: 107px;
      height: 16px;
      margin-left: 66px;
      margin-bottom: 23px;
      cursor: pointer;
      .bigBox {
        width: 14px;
        height: 14px;
        background-color: #fff;
        border-radius: 50%;
        float: left;
        margin-right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        .smallBox {
          width: 4px;
          height: 4px;
          background-color: #fff;
          border-radius: 50%;
        }
      }
      .bigBox.active {
        background-color: #fe6737;
        border-color: #fe6737;
      }
      &:hover .bigBox {
        border-color: #fe6737;
      }
      span {
        line-height: 16px;
      }
    }
    .start {
      width: 100px;
      height: 36px;
      border-radius: 18px;
      border: 1px solid #ff773e;
      position: absolute;
      top: 262px;
      left: 70px;
      text-align: center;
      line-height: 36px;
      color: #ff773e;
      cursor: pointer;
      &:hover {
        background-color: #fdece5;
      }
      &:active {
        color: #fff;
        background-color: #ff773e;
      }
    }
    // .el-progress {
    //   position: absolute;
    //   left: 50%;
    //   top: 256px;
    //   transform: translateX(-50%);
    // }
    #pmgressbar {
      position: absolute;
      left: 50%;
      top: 256px;
      transform: translateX(-50%);
    }
  }
}
</style>
