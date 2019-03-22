<template>
  <div class="map-wrap">
    <div class="operation-menu-wrap">
      <div class="edit-wrap">
        <div>负荷编辑</div>
        <div>电源编辑</div>
        <div>线路编辑</div>
        <div @click="goBrowse">网架浏览</div>
        <div @click="goEdit">网架操作</div>
      </div>
    </div>
    <router-view class="router-wrap" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      transitionName: ""
    };
  },
  methods: {
    goBrowse() {
      this.$router.push("/chartMap/networkBrowse");
    },
    goEdit() {
      this.$router.push("/chartMap/networkEdit");
    }
  }
};
</script>
<style lang="scss" scoped>
.map-wrap {
  height: var(--DomH);
  color: #5a5a5a;
  display: flex;
}
.operation-menu-wrap {
  width: 150px;
  height: 100%;
  border-right: 1px solid #2d3031;
  font-size: 14px;
  .edit-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 200px;
    div {
      padding: 5px 10px;
      border: 1px solid #707070;
      border-radius: 25px;
      cursor: pointer;
    }
  }
}
.router-wrap {
  width: 100%;
  height: var(--DomH);
}
</style>
