<template>
  <div class="map-wrap">
    <div class="control-bar-wrap">
      <control-bar></control-bar>
    </div>
    <div class="subarea-menu-wrap">
      <p class="subarea-menu-title" @click="clearNetWork">分区</p>
      <div class="area-wrap">
        <el-select
          v-model="selectValue1"
          size="small"
          placeholder="请选择省"
          class="select"
          @change="setProvince"
        >
          <el-option
            v-for="item in selectlist1"
            :key="item.adcode"
            :label="item.name"
            :value="item.adcode"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="selectValue2"
          size="small"
          placeholder="请选择市"
          class="select"
          @change="setCity"
        >
          <el-option
            v-for="item in selectlist2"
            :key="item.adcode"
            :label="item.name"
            :value="item.adcode"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="selectValue3"
          size="small"
          placeholder="请选择区"
          class="select"
          @change="setDistrict"
        >
          <el-option
            v-for="item in selectlist3"
            :key="item.adcode"
            :label="item.name"
            :value="item.adcode"
          >
          </el-option>
        </el-select>
      </div>
      <p class="subarea-menu-title">分层</p>
      <div class="area-wrap">
        <Legend
          :legendLineArr="legendLineArr"
          :legendPointArr="legendPointArr"
          @setLineLevel="setLineLevel"
          @setPointLevel="setPointLevel"
        ></Legend>
      </div>
      <p class="subarea-menu-title">详细信息</p>
      <div class="area-wrap info-wrap">
        <div>220KV XXX线路</div>
        <div>数值等级：<span>213KV</span></div>
        <div>数值信息：<span>183KV</span></div>
      </div>
    </div>
    <div id="container"></div>
  </div>
</template>
<script>
import controlBar from "../common/controlBar";
import Legend from "../common/legend";
import District from "../../assets/js/common/districtExplorer.js";
import { getNetWork, getRegion } from "../../assets/service/fileSystem.js";
export default {
  data() {
    return {
      selectlist1: [],
      selectlist2: [],
      selectlist3: [],
      selectValue1: null,
      selectValue2: null,
      selectValue3: null,
      districtSearch: null, //边界查询对象
      districtExplorer: null,
      polygons: [],
      pathSimplifierIns: [], //网架线路数组对象
      pathSimplifier: null, //巡航器加载图片对象
      legendLineArr: [], //线路类型
      legendPointArr: [], //发电站类型
      networkData: [], //网架总数据
      TransformerSub: [], //变电站数组对象
      arrPoint: [], //网架线路数据
      powerStationPoint: [] //发电站数据[风 火 水 光 抽]
    };
  },
  methods: {
    //获取省的数据
    getProvince(value) {
      getRegion(value).then(res => {
        if (res != null && res.err_code === 0) {
          this.selectlist1 = res.data;
        }
      });
    },
    //设置省的时候去获取市的信息
    setProvince(value) {
      this.districtExplorer.switch2AreaNode(value);
      this.getNetWork();
      getRegion(value).then(res => {
        if (res != null && res.err_code === 0) {
          this.selectlist2 = res.data;
          this.selectValue2 = "";
          this.selectValue3 = "";
        }
      });
    },
    //设置市的时候去获取区的信息
    setCity(value) {
      this.districtExplorer.switch2AreaNode(value);
      getRegion(value).then(res => {
        if (res != null && res.err_code === 0) {
          this.selectlist3 = res.data;
          this.selectValue3 = "";
        }
      });
    },
    //设置区
    setDistrict(value) {
      // this.drawBoder(value, "district");
    },
    /**
     * 选择区联动
     */
    setLinkage(istrue) {
      this.districtExplorer = new District(this.map);
      this.districtExplorer.init(istrue);
      Object.defineProperty(this.districtExplorer, "adcode", {
        set: () => {
          let feature = this.districtExplorer.feature;
          if (feature) {
            switch (feature.level) {
              case "province":
                this.selectValue1 = feature.adcode;
                getRegion(this.selectValue1).then(res => {
                  if (res != null && res.err_code === 0) {
                    this.selectlist2 = res.data;
                    this.selectValue2 = "";
                    this.selectValue3 = "";
                  }
                });
                this.clearNetWork();
                break;
              case "city":
                this.selectValue2 = feature.adcode;
                getRegion(this.selectValue2).then(res => {
                  if (res != null && res.err_code === 0) {
                    this.selectlist3 = res.data;
                    this.selectValue3 = "";
                  }
                });
                this.clearNetWork();
                break;
            }
          } else {
            this.selectValue1 = "";
            this.selectValue2 = "";
            this.selectValue3 = "";
            this.clearNetWork();
          }
        }
      });
    },
    //控制线路的显示
    setLineLevel(index, isTrue) {
      if (isTrue) {
        this.TransformerSub[index].show();
        this.pathSimplifierIns[index].show();
      } else {
        this.TransformerSub[index].hide();
        this.pathSimplifierIns[index].hide();
      }
    },
    //控制发电场的显示
    setPointLevel(index, isTrue) {
      if (isTrue) {
        this.powerStationPoint[index].forEach(item => {
          item.show();
        });
      } else {
        this.powerStationPoint[index].forEach(item => {
          item.hide();
        });
      }
    },
    //销毁潮流图的所有对象
    clearNetWork() {
      // 清除所有点
      this.powerStationPoint.forEach(parentItem => {
        parentItem.forEach(item => {
          item.setMap(null);
        });
      });
      this.powerStationPoint = [];
      // 清除所有巡航器
      this.pathSimplifierIns.forEach(item => {
        // item.hide(); //todo 这块还没找到清除线的方法

        item.clearPathNavigators();
        this.map.remove(item);
      });
      this.pathSimplifierIns = [];
      //清除所有变电站
      this.TransformerSub.forEach(item => {
        item.clear();
      });
      this.TransformerSub = [];

      this.map.clearMap();
    },
    // 获取数据潮流数据
    getNetWork() {
      // 设置网架图之前清理所有对象
      this.clearNetWork();
      getNetWork().then(res => {
        if (res != null && res.err_code === 0) {
          this.networkData = res.data;

          //整理发电站数据
          this.networkData.powerStationData.forEach(item => {
            if (!this.legendPointArr.includes(item.type)) {
              this.legendPointArr.push(item.type);
            }
          });
          // 获取类型
          this.networkData.lineData.forEach(item => {
            if (!this.legendLineArr.includes(item.typeName)) {
              this.legendLineArr.push(item.typeName);
            }
          });
          this.initPathSimplifier(this.legendLineArr);
          this.setPowerStationPoint();
        }
      });
    },
    /**
     * 设置潮流网架(会被多次调用)
     */
    setNetWork(typeName, pathSimpIndex) {
      let arrline = [];
      let arrPoint = [];
      let imgSrc1 = "/oraitStatic/img/common/变电站.png";
      //根据typeName过滤数据
      this.networkData.lineData.map((item, index) => {
        if (item.typeName === typeName) {
          item.coords.extend.forEach(ele => {
            arrline.push({
              name: "路线" + index,
              path: [ele.start, ele.end],
              status: item.status
            });
          });
          //根据type获取这一类型变电站点
          arrPoint.push({
            lnglat: item.coords.center.start,
            name: item.fromName,
            id: index
          });
        }
      });
      //设置线路
      this.pathSimplifierIns[pathSimpIndex].setData(arrline);
      //调用设置巡航器方法
      arrline.forEach((item, index) => {
        switch (item.status) {
          case "空载":
            this.setPathNavigator(
              pathSimpIndex,
              index,
              "./oraitStatic/img/common/空载.png",
              "rgba(255, 247, 230, 0.2)"
            );
            break;
          case "轻载":
            this.setPathNavigator(
              pathSimpIndex,
              index,
              "./oraitStatic/img/common/轻载.png",
              "rgba(82, 196, 26, 0.2)"
            );
            break;
          case "重载":
            this.setPathNavigator(
              pathSimpIndex,
              index,
              "./oraitStatic/img/common/重载.png",
              "rgba(8, 151, 156, 0.2)"
            );
            break;
          case "满载":
            this.setPathNavigator(
              pathSimpIndex,
              index,
              "./oraitStatic/img/common/满载.png",
              "rgba(245, 34, 45, 0.2)"
            );
            break;
          case "过载":
            this.setPathNavigator(
              pathSimpIndex,
              index,
              "./oraitStatic/img/common/过载.png",
              "rgba(82, 3, 57, 0.2)"
            );
            break;
          case "停供":
            this.setPathNavigator(
              pathSimpIndex,
              index,
              "./oraitStatic/img/common/停供.png",
              "rgba(232, 232, 232, 0.2)"
            );
            break;
        }
      });
      //变电站调用
      switch (typeName) {
        case "220KV线路":
          this.setTransformerSubPoint(arrPoint, pathSimpIndex, {
            url: imgSrc1,
            anchor: new window.AMap.Pixel(6, 6),
            size: new window.AMap.Size(12, 12)
          });
          break;
        case "500KV线路":
          this.setTransformerSubPoint(arrPoint, pathSimpIndex, {
            url: imgSrc1,
            anchor: new window.AMap.Pixel(8, 8),
            size: new window.AMap.Size(16, 16)
          });
          break;
        case "800KV直流":
          this.setTransformerSubPoint(arrPoint, pathSimpIndex, {
            url: imgSrc1,
            anchor: new window.AMap.Pixel(6, 6),
            size: new window.AMap.Size(1, 1)
          });
          break;
      }
    },
    /**
     * 设置巡航器
     * @pathSimpIndex {Number} this.pathSimplifierIns对象索引
     * @index {Number} this.pathSimplifierIns对象路线索引
     * @imgSrc {String} 图片地址
     */
    setPathNavigator(pathSimpIndex, index, imgSrc, pathColor) {
      this.pathSimplifierIns[pathSimpIndex]
        .createPathNavigator(index, {
          loop: true, //循环播放
          speed: 40000, //巡航速度，单位千米/小时
          pathNavigatorStyle: {
            autoRotate: true,
            initRotateDegree: 90,
            width: 12,
            height: 3,
            //使用图片
            content: this.pathSimplifier.Render.Canvas.getImageContent(
              imgSrc,
              onload,
              onerror
            ),
            pathLinePassedStyle: {
              strokeStyle: pathColor
            }, //禁止巡航器后面有线
            strokeStyle: null,
            fillStyle: null
          }
        })
        .start();
    },
    /**
     * 设置变电站点
     */
    setTransformerSubPoint(arrPoint, pathSimpIndex, styleObj) {
      this.TransformerSub[pathSimpIndex] = new window.AMap.MassMarks(arrPoint, {
        opacity: 1,
        cursor: "pointer",
        style: styleObj,
        bubble: true
      });
      this.TransformerSub[pathSimpIndex].setMap(this.map);
    },
    /**
     * 设置发电站点
     */
    setPowerStationPoint() {
      this.legendPointArr.forEach((itemType, indexType) => {
        this.powerStationPoint[indexType] = [];
        this.networkData.powerStationData.forEach(itemData => {
          let itemObj = new window.AMap.Marker({
            icon: `/oraitStatic/img/common/${itemType}.png`,
            position: new window.AMap.LngLat(
              itemData.coords[0],
              itemData.coords[1]
            ),
            offset: new window.AMap.Pixel(-13, -30),
            zIndex: 300,
            bubble: true
          });
          if (itemData.type == itemType) {
            this.powerStationPoint[indexType].push(itemObj);
          }
        });
        this.map.add(this.powerStationPoint[indexType]);
      });
    },
    /**
     * 初始化地图
     */
    initMap() {
      //创建地图
      let that = this;
      var map = new window.AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 4,
        // mapStyle: "amap://styles/e25d1b435096a86a01fe3f51bf7f0250"
        mapStyle: "amap://styles/b0f5b8ee3d3473aca18fcaff1df0bce9"
      });
      map.on("zoomend", this.getMapZoom);
      //创建自定义切片图层，指定 getTileUrl 属性
      // var googleLayer = new AMap.TileLayer({
      //   getTileUrl:
      //     "http://mt{1,2,3,0}.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil",
      //   zIndex: 2
      // });
      // googleLayer.setMap(map);
      this.map = map;
      // 同时引入工具条插件，比例尺插件和鹰眼插件
      window.AMap.plugin(
        ["AMap.ToolBar", "AMap.MapType", "AMap.DistrictSearch"],
        function() {
          // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          map.addControl(new window.AMap.ToolBar());
          // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
          // map.addControl(new AMap.MapType());
          //行政区查询
          that.districtSearch = new window.AMap.DistrictSearch({
            // 关键字对应的行政区级别，country表示国家
            level: "country",
            //  显示下级行政区级数，1表示返回下一级行政区
            subdistrict: 0,
            extensions: "all"
          });
        }
      );
    },
    /**
     * 初始化巡航器对象,并调用设置潮流函数
     */
    initPathSimplifier(typeName) {
      window.AMapUI.load(
        ["ui/misc/PathSimplifier", "lib/$"],
        PathSimplifier => {
          if (!PathSimplifier.supportCanvas) {
            alert("当前环境不支持 Canvas！");
            return;
          }
          this.pathSimplifier = PathSimplifier;
          typeName.forEach((item, index) => {
            let lineWidth = this.chooseStyle(item);
            this.pathSimplifierIns[index] = new PathSimplifier({
              autoSetFitView: false,
              map: this.map, //所属的地图实例
              zIndex: 0,
              getPath: function(pathData) {
                return pathData.path;
              },
              getHoverTitle: function(pathData, pathIndex, pointIndex) {
                if (pointIndex >= 0) {
                  //point
                  return (
                    pathData.name +
                    "，点：" +
                    pointIndex +
                    "/" +
                    pathData.path.length
                  );
                }
                return pathData.name + "，变电站数量" + pathData.path.length;
              },
              //线样式
              renderOptions: {
                pathLineStyle: {
                  // strokeStyle: "#FFF7E6",
                  strokeStyle: "#373737",
                  borderStyle: "#373737",
                  dirArrowStyle: false,
                  lineWidth: lineWidth
                },
                pathLineHoverStyle: {
                  lineWidth: 0,
                  borderStyle: "#ffffff",
                  borderWidth: 0
                },
                startPointStyle: {
                  lineWidth: 0,
                  radius: 0
                },
                endPointStyle: {
                  lineWidth: 0,
                  radius: 0
                }
              }
            });
            this.setNetWork(item, index);
          });
        }
      );
    },
    /**
     * 样式选择
     */
    chooseStyle(type) {
      switch (type) {
        case "220KV线路":
          return 2;
        case "330KV线路":
          return 2.5;
        case "500KV线路":
          return 3;
        case "660KV线路":
          return 3.5;
        case "750KV线路":
          return 4;
        case "800KV直流":
          return 5.5;
        case "1000KV直流":
          return 6;
      }
    },
    /**
     * 获取地图层级
     */
    getMapZoom() {
      var zoom = this.map.getZoom(); //获取当前地图级别
      if (zoom <= 5) {
        this.TransformerSub.forEach((item, index) => {
          this.setLineLevel(index, false);
        });
        this.powerStationPoint.forEach((item, index) => {
          this.setPointLevel(index, false);
        });
      } else {
        this.TransformerSub.forEach((item, index) => {
          this.setLineLevel(index, true);
        });
        this.powerStationPoint.forEach((item, index) => {
          this.setPointLevel(index, true);
        });
      }
    }
  },
  mounted() {
    this.initMap();
    this.getProvince(100000);
    this.setLinkage(true);
  },
  components: {
    Legend,
    controlBar
  }
};
</script>
<style lang="scss" scoped>
.control-bar-wrap {
  position: absolute;
  top: 60px;
  right: 20px;
  z-index: 200;
  width: 70%;
  height: 50px;
}
.map-wrap {
  height: var(--DomH);
  color: #5a5a5a;
  display: flex;
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
      height: 150px;
      div {
        border: 1px solid #707070;
        border-radius: 25px;
        padding: 5px 10px;
      }
    }
    .map-operation {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 200px;
    }
  }
  .subarea-menu-wrap {
    width: 275px;
    height: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    background: #ffffff;
    .subarea-menu-title {
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      margin-top: 30px;
      padding-left: 20px;
    }
    .area-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      min-height: 150px;
      .select {
        width: 60%;
      }
    }
    .info-wrap {
      margin: 10px 0 50px 40px;
      min-height: 96px;
      width: 70%;
      font-size: 12px;
      background: #f57e51;
      color: #ffffff;
    }
  }
  #container {
    float: right;
    width: 86%;
    height: 100%;
    margin: 0px;
  }
}
</style>
