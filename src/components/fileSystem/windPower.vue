<template>
  <div class="windPower" id="windPower" @click="globalFlagFn">
    <loadStart v-show="loadingShow == true"></loadStart>
    <div class="m-wrap">
      <download></download>
    </div>
    <div class="b-wrap">
      <!-- <vue-scroll> -->
      <div class="recentOpen-wrap">
        <recentOpen></recentOpen>
      </div>
      <!-- </vue-scroll> -->
    </div>
    <i
      class="iconfont icon-fankuisss"
      @click.stop="change_globalFlag(8, -8)"
    ></i>
    <feedback class="feedback" v-show="globalFlag == 8"></feedback>
  </div>
</template>

<script>
import { changeTheme } from "../../assets/js/common/theme.js";
import loadStart from "../../globalComponents/loading"; //加载动画
import download from "../../components/fileSystem/download";
import recentOpen from "../../components/fileSystem/recentOpen";
import feedback from "../../components/wpSimluate/sideBar/feedback";
export default {
  data() {
    return {};
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
      styles.setProperty("--DomH", val - 300 + "px");
      styles.setProperty("--tableScrollH", val - 390 + "px");
    },
    change_globalFlag(show, hide) {
      if (this.globalFlag == show) {
        this.$store.commit("set_globalFlag", hide);
      } else {
        this.$store.commit("set_globalFlag", show);
      }
    }
  },
  mounted: function() {
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
    loadStart,
    download,
    recentOpen,
    feedback
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/reset.css";
@import "../../assets/css/global";
#windPower {
  position: relative;
  width: 100%;
  height: var(--WrapH);
  overflow: hidden;
  .m-wrap {
    height: 210px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
  }
  .b-wrap {
    width: 100%;
    height: var(--DomH);
    overflow: auto;
    .recentOpen-wrap {
      width: 100%;
      margin: 30px auto 0;
      // padding: 0 10%;
      // box-sizing: border-box;
    }
  }
  i {
    position: absolute;
    bottom: 42px;
    right: 26px;
    font: var(--FtSize_icon_second) "SourceHanSansSC-Normal";
    cursor: pointer;
    color: #f57e51;
  }
  .feedback {
    position: absolute;
    right: 0px;
    bottom: 0px;
  }
}
</style>
