<template>
  <div id="messageBox">
    <div class="success" v-show="messageShow.type == 'success'">
      <i class="success iconfont icon-yunpingtaidenglu-zhengque"></i>
      <span>{{ messageShow.txt }}</span>
    </div>
    <div class="error" v-show="messageShow.type == 'error'">
      <i class="error iconfont icon-yunpingtaidenglu-cuowu"></i>
      <span>{{ messageShow.txt }}</span>
    </div>
    <div class="warning" v-show="messageShow.type == 'warning'">
      <i class="warning iconfont icon-yunpingtaidenglu-jinggao"></i>
      <span>{{ messageShow.txt }}</span>
    </div>
    <div class="prompt" v-show="messageShow.type == 'prompt'">
      <i class="prompt iconfont icon-yunpingtaidenglu-tishi"></i>
      <span>{{ messageShow.txt }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["messageShow", "list"],
  data() {
    return {};
  }
  // watch: {
  //   list: {
  //     handler: function(val, oldVal) {
  //       console.log(val.length);
  //       let timeID = setTimeout(() => {
  //         val.splice(0, val.length);
  //       }, 1);
  //     },
  //     deep: true
  //   }
  // }
};
</script>
<style lang="scss" scoped>
#messageBox {
  height: 40px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.16);
  border-radius: 2px;
  background-color: #fff;
  display: inline-block;
  animation: animate 3s linear forwards;
  z-index: 200;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  .success,
  .error,
  .warning,
  .prompt {
    height: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: "Source Han Sans CN";
    font-weight: 400;
    i {
      margin-right: 8px;
      padding: 0;
      font-size: 18px;
    }
    i.success {
      color: #61d2c4;
    }
    i.error {
      color: #f57e51;
    }
    i.warning {
      color: #ffe437;
    }
    i.prompt {
      color: #ff773e;
    }
  }
}

@keyframes animate {
  0% {
    opacity: 0;
  }
  9% {
    opacity: 1;
    top: 66px;
  }
  80% {
    opacity: 1;
    top: 66px;
  }
  100% {
    opacity: 0;
    top: -20px;
    display: none;
  }
}
</style>
