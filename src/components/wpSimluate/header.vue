<template>
  <div class="header">
    <el-tooltip class="item" effect="dark" content="返回" placement="bottom">
      <div class="l-icon-wrap" @click="skipFileSystem">
        <img src="/oraitStatic/img/wpSimluate/风电模拟.svg" />
      </div>
    </el-tooltip>
    <div class="r-icon-wrap">
      <div class="l-list">
        <ul>
          <el-tooltip
            class="item"
            effect="dark"
            content="新建"
            placement="bottom"
          >
            <li class="iconfont icon-xinjian icon" @click="openWindow">
              <i class="line"></i>
            </li>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="导入"
            placement="bottom"
          >
            <li class="iconfont icon-daoru2 icon" @click="openFile">
              <i class="line"></i>
            </li>
          </el-tooltip>
          <input
            type="file"
            class="importFile"
            accept=".xls,.xlsx,.csv,.et"
            @change="filesIn($event, 'inputData')"
            ref="inputData"
          />
          <el-tooltip
            class="item"
            effect="dark"
            content="导出"
            placement="bottom"
          >
            <li class="iconfont icon-daochu2 icon" @click="outputFile">
              <i class="line"></i>
            </li>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="下载模板"
            placement="bottom"
          >
            <li class="iconfont icon-xiazai1 icon" @click="downLoadTemp">
              <i class="line"></i>
            </li>
          </el-tooltip>
        </ul>
      </div>
      <!-- 标题 -->
      <div class="title" v-show="title != null">
        <el-tooltip
          class="item"
          effect="dark"
          content="双击编辑"
          placement="bottom"
        >
          <p @dblclick="editTitle" class="text">{{ title | filterName }}</p>
        </el-tooltip>
        <input
          type="text"
          v-focus="true"
          class="title-input"
          v-model="titleInput"
          v-if="showInput"
          @keyup.enter="set_title"
          @blur="showInput = false"
        />
      </div>
      <div class="r-list">
        <div class="user-info">
          <transition name="information-fade">
            <div v-show="globalFlag == 1" class="userInfo">
              <information :userInfo="userInfo"></information>
            </div>
          </transition>
          <img
            src="/oraitStatic/img/wpSimluate/男头.png"
            class="icon-nantou"
            @click.stop="information"
          />
        </div>
        <i class="line"></i>
        <div class="apply" @click.stop="fmoduleFn">
          <transition name="fmodule-fade">
            <fmodule v-show="globalFlag == 2" class="fmodule"></fmodule>
          </transition>
          <i class="iconfont icon-yingyong"></i>
        </div>
      </div>
    </div>
    <dialogBox
      v-if="dialogVisible"
      content="现有数据将被覆盖，是否重新导入"
      @close="dialogVisible = false"
    >
      <span slot="footer">
        <div class="cancel" @click="dialogVisible = false">取消</div>
        <div class="dom" @click="dialogSure">确认</div>
      </span>
    </dialogBox>
  </div>
</template>
<script>
import information from "./header/information"; //用户信息
import fmodule from "./header/fmodule.vue"; //产品介绍
import { find_user } from "../../assets/service/userInfoService.js";
import {
  get_title,
  set_title,
  exportFile
} from "../../assets/service/wpSimluateService.js";
import dialogBox from "../../globalComponents/dialogBox";
import { uploadFile } from "../../assets/service/wpSimluateService.js";
export default {
  data() {
    return {
      inform: false,
      userInfo: null,
      title: null,
      titleInput: null,
      //导入组件
      showInput: false, //输入框
      dialogVisible: false
    };
  },
  directives: {
    focus: {
      inserted: function(el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  },
  computed: {
    globalFlag() {
      return this.$store.state.module_global.globalFlag;
    },
    windSiteInfo() {
      return this.$store.state.module_global.windSiteInfo;
    }
  },
  watch: {
    windSiteInfo() {
      this.get_title();
    }
  },
  filters: {
    filterName: function(value) {
      if (value == "") {
        return "未命名";
      } else {
        return value;
      }
    }
  },
  methods: {
    information() {
      if (this.globalFlag == 1) {
        this.$store.commit("set_globalFlag", 0);
      } else {
        find_user().then(res => {
          this.userInfo = res.data.body_data;
          this.$store.commit("set_globalFlag", 1);
        });
      }
    },
    fmoduleFn() {
      if (this.globalFlag == 2) {
        this.$store.commit("set_globalFlag", 0);
      } else {
        this.$store.commit("set_globalFlag", 2);
      }
    },
    //新建
    openWindow() {
      localStorage.removeItem("SID");
      window.location.reload();
    },
    //导入前判断
    openFile() {
      if (this.$store.state.module_global.sidFlag) {
        this.dialogVisible = true;
        this.showBoard = true;
      } else {
        //第一次，直接点击input
        this.$refs.inputData.click();
      }
    },
    dialogSure() {
      this.dialogVisible = false;
      this.$refs.inputData.click();
    },
    /**
     * 文件导入
     * @param {Object} obj 参数$event
     * @param {Object} arg input Dom节点
     */
    filesIn(obj, arg) {
      var files = obj.target.files;
      let type = files[0].name.split(".")[1];
      if (type != "xls" && type != "xlsx" && type != "csv" && type != "et") {
        //置空value值，否则下次相同文件名不会触发change事件
        this.$refs[arg].value = null;
        //提示信息显示
        this.$message({
          type: "error",
          message: "模板格式不正确，请重新导入"
        });
      } else {
        // 实例化FormData 对象
        this.formdata = new FormData();
        //这里的file需要跟后台接收参数保持一致
        this.formdata.append("file", files[0]);
        //置空value值，否则下次相同文件名不会触发change事件
        this.$refs[arg].value = null;
        this.uploadFileFn(this.formdata);
      }
    },
    //上传请求
    uploadFileFn(val) {
      this.$store.commit("set_loading", true);
      uploadFile(val)
        .then(res => {
          if (res.err_code == 0) {
            //在localStorage存储新获得的SID，防止刷新后消失
            localStorage.setItem("SID", res.sid);
            //sid传给vuex被监听，图表和表格watch这个值，如果更新则重新请求
            this.$store.commit("set_sidFlag", res.sid);
            //动画结束
            this.$store.commit("set_loading", false);
            this.showBoard = false;
            this.showFileUp = false;
          } else if (res.err_code == 3002) {
            //动画结束
            this.$store.commit("set_loading", false);
            this.$message({
              type: "error",
              message: "导入文件不符合模板要求，请重新导入"
            });
          }
        })
        .catch(() => {
          this.$store.commit("set_loading", false);
          //提示
          this.$message({
            type: "error",
            message: "导入文件不符合模板要求，请重新导入"
          });
        });
    },
    //导出
    outputFile() {
      exportFile().then(res => {
        if (res.err_code == 0) {
          window.location.href = `${
            process.env.VUE_APP_wpSimluateURL
          }/file?file=${res.data}`;
        }
      });
    },
    //下载模板
    downLoadTemp() {
      window.location.href = `${
        process.env.VUE_APP_wpSimluateURL
      }/file?file=template/ORAIT风电模板(15分钟).xlsx`;
    },
    //关闭对话框
    closeDialogBox(val) {
      window.href = "";
      this.showBoard = val;
    },
    //关闭上传对话框
    closeFileUp(val) {
      this.showFileUp = val;
    },
    // 获取标题
    get_title() {
      get_title().then(res => {
        if (res.err_code == 0) {
          this.title = res.data;
        }
      });
    },
    //打开标题编辑
    editTitle() {
      this.showInput = !this.showInput;
      this.titleInput = this.title;
    },
    //设置标题
    set_title() {
      set_title(this.titleInput).then(res => {
        if (res.err_code == 0) {
          // this.title = result.data;
          this.get_title();
          this.showInput = false;
        }
      });
    },
    developHint() {
      alert("功能开发中！");
    },
    //跳转文件系统
    skipFileSystem() {
      window.location.href = "/fileSystem.html#/windPower";
    }
  },
  mounted() {
    this.$store.commit("set_sidFlag", localStorage.getItem("SID"));
  },
  components: {
    information,
    fmodule,
    dialogBox
  }
};
</script>
<style lang="scss" scoped>
.header {
  height: 100%;
  width: 100%;
  background-image: url("/oraitStatic/img/wpSimluate/header.png");
  background-size: cover;
  display: flex;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  .l-icon-wrap {
    width: 150px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img {
      width: 34px;
      height: 41px;
    }
  }
  .r-icon-wrap {
    flex: 1;
    width: 690px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    .l-list {
      height: 100%;
      li {
        float: left;
        text-align: center;
        line-height: 50px;
        width: 68px;
        height: 100%;
        cursor: pointer;
        position: relative;
        &:hover {
          i.line {
            display: block;
            width: 60px;
            height: 2px;
            background-color: #61d2c4;
            position: absolute;
            bottom: 0px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        &:nth-of-type(1):hover {
          ul {
            height: 40px;
            li {
              &:hover {
                color: #f57e51;
              }
            }
          }
        }
        &:nth-of-type(2):hover {
          ul {
            height: 80px;
            li {
              &:hover {
                color: #f57e51;
              }
            }
          }
        }
        &:nth-of-type(3):hover {
          ul {
            width: 120px;
            height: 120px;
            margin-left: -26px;
            li {
              width: 100%;
            }
          }
        }
        ul {
          height: 0px;
          position: absolute;
          z-index: 100;
          transition: height 0.2s;
          overflow: hidden;
          background-color: #fff;
          box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.16);
          li {
            height: 40px;
            line-height: 40px;
            font-size: var(--FtSize_three);
            color: #554843;
          }
        }
        &:first-of-type {
          ul {
            li {
              &:hover {
                color: #f57e51;
              }
            }
          }
        }
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
          ul {
            height: 90px;
          }
        }
      }
      .importFile {
        width: 1px;
        opacity: 0;
      }
      .icon {
        font-size: 25px;
        &:nth-child(5) {
          font-size: 30px;
        }
      }
    }
    .title {
      display: flex;
      align-items: center;
      margin-right: 14%;
      position: relative;
      font-size: var(--FtSize_four);
      p {
        width: 350px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: text;
        &:hover {
          border: 1px dotted #ffffff;
        }
      }
      .title-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 350px;
        height: 30px;
        text-align: center;
        outline: none;
        font-size: var(--FtSize_three);
      }
    }
    .r-list {
      display: flex;
      justify-content: space-between;
      margin-right: 20px;
      align-items: center;
      width: 150px;
      height: 100%;
      box-sizing: border-box;
      .line {
        display: block;
        width: 1px;
        height: 18px;
        background-color: #fff;
      }
      .user-info,
      .apply,
      .service {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          cursor: pointer;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
        }
        i {
          font-size: var(--FtSize_icon_second);
        }
        .icon-nantou {
          width: 30px;
          height: 30px;
          color: #fff;
        }
        .icon-yingyong,
        .icon-shezhi1 {
          color: #fff;
        }
      }
      .user-info {
        position: relative;
        .userInfo {
          width: 315px;
          height: 290px;
          display: flex;
          justify-content: center;
          overflow: hidden;
          position: absolute;
          top: 39px;
          right: -32px;
          z-index: 100;
        }
        .information-fade-enter-active {
          transition: all 0.3s ease;
        }
        .information-fade-leave-active {
          transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
        }
        .information-fade-enter,
        .information-fade-leave-to {
          height: 0;
        }
      }
      .apply {
        position: relative;
        .fmodule {
          position: absolute;
          top: 44px;
          right: -20px;
          z-index: 100;
          cursor: auto;
        }
        .fmodule-fade-enter-active {
          transition: all 0.3s ease;
        }
        .fmodule-fade-leave-active {
          transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
        }
        .fmodule-fade-enter,
        .fmodule-fade-leave-to {
          height: 0;
        }
      }
    }
  }
  .fileUp {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
  }
}
</style>
