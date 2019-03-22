<template>
  <div class="slider-wrap" id="slider-wrap">
    <div
      class="slider"
      ref="sliderPoint"
      @mousedown="rightDrag('slider-wrap')"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    slideTop: {
      type: String
    }
  },
  data() {
    return {
      slideData: 0, //point距离起点的比率
      styles: null,
      sliderLength: 0 //point距离起点的实际距离
    };
  },
  watch: {
    slideTop(val) {
      // console.log(val)
      this.styles.setProperty("--pointLocation", val); //point的位置
    }
  },
  methods: {
    rightDrag(parentNode) {
      let _this = this;
      let ev = ev || event;
      //阻止冒泡事件
      ev.stopPropagation ? ev.stopPropagation() : (ev.cancelBubble = true);
      //获取父元素的宽高
      let parent = document.getElementById(parentNode);
      let pWidth = parent.offsetWidth;
      let pHeight = parent.offsetHeight;
      //获取移动点的宽高
      let obj = this.$refs.sliderPoint;
      // let disX = ev.clientX - obj.offsetLeft;
      let disY = ev.clientY - obj.offsetTop;
      let oWidth = ev.target.offsetWidth;
      let oHeight = ev.target.offsetHeight;

      document.onmousemove = function(ev) {
        // var ev = ev || event;
        _this.styles.setProperty("--pointLocation", ev.clientY - disY + "px");
        // _this.sliderLength=ev.clientY - disY;
        _this.slideData = ((ev.clientY - disY) / pHeight).toFixed(2);
        //左侧
        if (obj.offsetLeft < 0) {
          obj.style.left = "0px";
        }
        //右侧
        if (obj.offsetLeft >= pWidth - oWidth) {
          obj.style.left = "0px";
        }
        // 上面
        if (obj.offsetTop <= 0) {
          _this.styles.setProperty("--pointLocation", "0px");
          // _this.sliderLength=0;
          _this.slideData = 0;
        }
        // 下面
        if (obj.offsetTop >= pHeight - oHeight) {
          _this.styles.setProperty("--pointLocation", pHeight - oHeight + "px");
          // _this.sliderLength=(pWidth-oWidth)/pWidth;
          _this.slideData = ((pHeight - oHeight) / pHeight).toFixed(2);
        }
      };
      document.onmouseup = function() {
        document.onmousemove = document.onmouseup = null;
        _this.$emit("get-slideNum", parseFloat(_this.slideData) - 0.08);
      };
    }
  },
  mounted() {
    this.styles = this.$el.style;
    this.styles.setProperty("--pointLocation", this.slideTop); //point的位置
  }
};
</script>

<style lang="scss" scoped>
.slider-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
.slider {
  cursor: pointer;
  width: 100%;
  height: 10%;
  position: absolute;
  top: var(--pointLocation);
  left: 0;
  background: var(--systemColor);
  border-radius: 25px;
}
</style>
