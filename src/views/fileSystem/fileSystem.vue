<template>
  <div id="fileSystem" class="fileSystem-wrap" @click="watchGlobal">
    <div class="t-wrap">
      <fileheader></fileheader>
    </div>
    <router-view />
  </div>
</template>
<script>
import { changeTheme } from "../../assets/js/common/theme.js";
import fileheader from "../../components/fileSystem/fileheader";
export default {
  data() {
    return {
      username: null,
      password: null,
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
      styles.setProperty("--WrapH", val - 1 + "px");
      styles.setProperty("--DomH", val - 50 + "px");
    },
    watchGlobal() {
      this.$store.commit("set_globalFlag", 0);
    }
  },
  mounted() {
    // console.log(this.$route)
    let _this = this;
    this.getwh(this);
    changeTheme(this.theme);
    window.onresize = function() {
      _this.getwh(_this);
    };
    this.changeHeight(this.$store.state.module_global.htmlHeight);
  },
  components: {
    fileheader
  }
};
</script>
<style scoped lang="scss">
@import "../../assets/css/reset.css";
@import "../../assets/css/global";
@media screen and (max-width: 1151px) {
  .fileSystem-wrap {
    width: 1152px;
  }
}
@media screen and (min-width: 1152px) {
  .fileSystem-wrap {
    width: 100%;
  }
}
.fileSystem-wrap {
  height: var(--WrapH);
  font-family: "SourceHanSansSC-Normal";
  .t-wrap {
    height: 50px;
  }
  .module {
    width: 100%;
    height: 100%;
  }
}
</style>
