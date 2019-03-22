<template>
  <div id="login" class="login-wrap">
    <div class="module"><router-view /></div>
  </div>
</template>
<script>
import { changeTheme } from "../../assets/js/common/theme.js";
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
      styles.setProperty("--WrapH", val - 0.5 + "px");
      styles.setProperty("--DomH", val + "px");
    }
  },
  mounted() {
    let _this = this;
    this.getwh(this);
    changeTheme(this.theme);
    window.onresize = function() {
      _this.getwh(_this);
    };
    this.changeHeight(this.$store.state.module_global.htmlHeight);
  }
};
</script>
<style scoped lang="scss">
@import "../../assets/css/reset.css";
@import "../../assets/css/global";
@media screen and (max-width: 1280px) {
  .login-wrap {
    width: 1152px;
  }
}
@media screen and (min-width: 1280px) {
  .login-wrap {
    width: 100%;
  }
}
.login-wrap {
  height: var(--WrapH);
  font-family: "SourceHanSansSC-Normal";
  .module {
    width: 100%;
    height: 100%;
  }
}
</style>
