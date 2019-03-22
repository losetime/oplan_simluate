<template>
  <div class="wpSimluate" id="wpSimluate" @click="globalFlagFn">
    <loadStart v-show="loadingShow == true"></loadStart>
    <div class="header-wrap">
      <Header></Header>
    </div>
    <div class="b-wrap">
      <div class="l-content">
        <router-view />
        <transition name="baddata-fade">
          <baddata class="baddata" v-show="globalFlag == 5"></baddata>
        </transition>
        <transition name="feedback-fade">
          <feedback v-show="globalFlag == 8"></feedback>
        </transition>
        <transition name="parameter-fade">
          <parameter
            class="parameter-wrap"
            v-show="globalFlag == 4"
          ></parameter>
        </transition>
        <transition name="actualData-fade">
          <actualData
            class="actualData-wrap"
            v-show="globalFlag == 6"
          ></actualData>
        </transition>
      </div>
      <div class="r-content">
        <el-tooltip
          class="item"
          effect="dark"
          content="模拟数据"
          placement="left"
          :hide-after="3000"
        >
          <i class="iconfont icon-moni" @click.stop="change_globalFlag(4, -4)">
            <i class="line"></i>
          </i>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="修复数据"
          placement="left"
          :hide-after="3000"
        >
          <i
            class="iconfont icon-biaoge"
            @click.stop="change_globalFlag(5, -5)"
          >
            <i class="line"></i>
          </i>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="详情信息"
          placement="left"
          :hide-after="3000"
        >
          <i
            class="iconfont icon-jizuxinxi"
            @click.stop="change_globalFlag(6, -6)"
          >
            <i class="line"></i>
          </i>
        </el-tooltip>
        <!-- <i class="iconfont icon-tuopu"></i> -->
        <el-tooltip
          class="item"
          effect="dark"
          content="反馈"
          placement="top"
          :hide-after="3000"
        >
          <i
            class="iconfont icon-xiaoxi"
            @click.stop="change_globalFlag(8, -8)"
          ></i>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { changeTheme } from "../../assets/js/common/theme.js";
import header from "../../components/wpSimluate/header";
//反馈
import feedback from "../../components/wpSimluate/sideBar/feedback";
//开始模拟
import parameter from "../../components/wpSimluate/sideBar/parameter";
//修复数据
import baddata from "../../components/wpSimluate/sideBar/baddata.vue";
//风场信息
import actualData from "../../components/wpSimluate/sideBar/actualData";
import loadStart from "../../globalComponents/loading";
export default {
  data() {
    return {
      username: null,
      password: null,
      showMenu: false,
      rememberCode: false,
      showModule: 1
    };
  },
  computed: {
    theme() {
      return this.$store.state.module_global.theme;
    },
    htmlHeight() {
      return this.$store.state.module_global.htmlHeight;
    },
    globalFlag() {
      return this.$store.state.module_global.globalFlag;
    },
    loadingShow() {
      return this.$store.state.module_global.loadingShow;
    },
    messageShow() {
      return this.$store.state.module_global.messageShow;
    }
  },
  watch: {
    theme(val) {
      changeTheme(val);
    },
    htmlHeight(val) {
      this.changeHeight(val);
    }
  },
  methods: {
    globalFlagFn() {
      this.$store.commit("set_globalFlag", 0);
    },
    //用于监听根页面的宽度和高度
    getwh(that) {
      let htmlDom = document.getElementsByTagName("html")[0];
      let htmlWidth =
        document.documentElement.clientWidth || document.body.clientWidth;
      let htmlHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      htmlDom.style.fontSize = htmlWidth / 100 + "px";
      that.$store.commit("gethtmlWidth", htmlWidth);
      that.$store.commit("gethtmlHeight", htmlHeight);
    },
    changeHeight(val) {
      let styles = this.$el.style;
      styles.setProperty("--WrapH", val - 50 + "px");
      styles.setProperty("--DomH", val + "px");
    },
    //控制菜单的隐藏显示
    change_globalFlag(show, hide) {
      if (this.globalFlag == show) {
        this.$store.commit("set_globalFlag", hide);
      } else {
        this.$store.commit("set_globalFlag", show);
      }
    }
  },
  mounted() {
    //监听根页面宽度和高度
    let _this = this;
    this.getwh(this);
    window.onresize = function() {
      _this.getwh(_this);
    };
    this.userInfo = localStorage.getItem("userInfo");
    this.changeHeight(this.$store.state.module_global.htmlHeight);
    // this.$router.replace("/login");
    changeTheme(this.theme);
  },
  components: {
    Header: header,
    feedback: feedback,
    parameter: parameter,
    baddata: baddata,
    loadStart: loadStart,
    actualData: actualData
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/reset.css";
@import "../../assets/css/global"; //引用这个文件后，可以指定自定义字体
@media screen and (max-width: 1499px) {
  .b-wrap {
    .l-content {
      width: 96%;
    }
  }
}
@media screen and (min-width: 1500px) {
  .b-wrap {
    .l-content {
      width: 97%;
    }
  }
}
@media screen and (max-width: 1151px) {
  .wpSimluate {
    width: 1152px;
  }
}
@media screen and (min-width: 1152px) {
  .wpSimluate {
    width: 100%;
  }
}

@media screen and (max-height: 863px) {
  .wpSimluate {
    .b-wrap {
      height: 864px;
    }
  }
}
@media screen and (min-height: 864px) {
  .wpSimluate {
    .b-wrap {
      height: var(--WrapH);
    }
  }
}

.wpSimluate {
  height: 100%;
  overflow: hidden;
  font-family: "SourceHanSansSC-Normal";
  .header-wrap {
    width: 100%;
    height: 50px;
  }
  .b-wrap {
    position: relative;
    width: 100%;
    background-color: #f5f5f5;
    display: flex;
    position: relative;
    .l-content {
      height: 100%;
      background-color: rgba(189, 196, 203, 1);
      position: relative;
      .parameter-fade-enter-active {
        transition: all 0.3s ease;
      }
      .parameter-fade-leave-active {
        transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
      }
      .parameter-fade-enter,
      .parameter-fade-leave-to {
        width: 0;
      }
      .feedback-fade-enter-active {
        transition: all 0.3s ease;
      }
      .feedback-fade-leave-active {
        transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
      }
      .feedback-fade-enter,
      .feedback-fade-leave-to {
        width: 0;
      }
      .baddata-fade-enter-active {
        transition: all 0.3s ease;
      }
      .baddata-fade-leave-active {
        transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
      }
      .baddata-fade-enter,
      .baddata-fade-leave-to {
        width: 0;
      }

      .actualData-fade-enter-active {
        transition: all 0.3s ease;
      }
      .actualData-fade-leave-active {
        transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
      }
      .actualData-fade-enter,
      .actualData-fade-leave-to {
        width: 0;
      }
      .baddata {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 10000;
      }
      .parameter-content {
        position: absolute;
        right: 5px;
        top: 5px;
        background-color: #f3f3f2;
        // box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.16);
        z-index: 10000;
      }
      .actualData-wrap {
        position: absolute;
        right: 5px;
        top: 5px;
        // box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.16);
        z-index: 10000;
      }
      .box {
        position: absolute;
        right: 5px;
        bottom: 5px;
        z-index: 10000;
      }
    }
    .r-content {
      height: 100%;
      width: 60px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      border-left: 1px solid rgba(172, 172, 172, 0.2);
      i {
        display: block;
        font-size: var(--FtSize_icon_second);
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        i.line {
          width: 40px;
          height: 1px;
          display: block;
          background-color: #a49691;
          position: absolute;
          bottom: 0;
        }
        &:hover {
          background-color: #f5f5f5;
          color: var(--systemColor);
        }
        &:last-of-type {
          //反馈位置,待改动位置
          position: absolute;
          bottom: 40px;
          color: var(--systemColor);
        }
      }
    }
  }
}
</style>
