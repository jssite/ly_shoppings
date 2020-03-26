<template>
  <div class="classify">
    <!-- 搜索栏 -->
    <div class="homeTopSelect">
      <div class="input" @click.stop="gotoSelectPage">{{placeholder}}</div>
      <img class="position selectImg" src="/static/images/navbar_search.png" />
      <img class="position sweepImg" @click="funcScan" src="/static/images/index/syis.png" />
      <!-- <img class="position barCodeImg" src="/static/images/index/tiaoxing.png"> -->
    </div>
    <!-- 分类栏 active-->
    <dl class="ci_tab">
      <dd
        class="ci_tabtitle"
        @click.stop="clickTab(idx)"
        v-for="(item,idx) in arrlist"
        :class="{'active': curIdx==idx}"
        :key="idx"
      >{{item}}</dd>
    </dl>
    <!-- :style="{'height':screenHeight+'px'}" -->
    <!-- <div style="height:555rpx"> -->
    <swiper
      :current="curIdx"
      class="swiperTBox"
      :style="{'height':windowHeight+'px'}"
      duration="300"
      @change="bindchange"
    >
      <swiper-item item-id="t1">
        <div class="swperT2">
          <scroll-view scroll-y style="height:100%; background: #ffffff;">
            <div class="swperT2_r">
              <span
                @click.stop="clickTabAgecolumn(idx)"
                :class="[{mainacitve:ageCurIdx==idx},'swperT2_r_txt','swperT1late']"
                v-for="(item,idx) in goodsAgeList "
                :key="idx"
              >{{item.c_name}}</span>
            </div>
          </scroll-view>
          <scroll-view scroll-y style="height:100%">
            <div class="swperT2_l">
              <div class="contentBox" v-for="(item,num) in goodsAgeSmallList" :key="num">
                <h3 class="contentBox_Title">{{item.c_name}}</h3>
                <div class="contentBox_smallBox">
                  <div
                    class="contentBox_smallBox_con"
                    @click="gotoSelect(items.c_name)"
                    v-for="(items,index) in item.sub_list"
                    :key="index"
                  >
                    <span class="img_wrap">
                      <img class="img" mode="aspectFit" :src="items.sub_category_image" alt />
                    </span>
                    <span class="text">{{items.c_name}}</span>
                  </div>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
      </swiper-item>
      <swiper-item item-id="t2">
        <div class="swperT2">
          <scroll-view scroll-y style="height:100%">
            <div class="swperT2_r">
              <span
                @click.stop="clickTabcolumn(idx)"
                :class="[{mainacitve:MainCurIdx==idx},'swperT2_r_txt']"
                v-for="(item,idx) in goodsMainList "
                :key="idx"
              >{{item.c_name}}</span>
            </div>
          </scroll-view>
          <scroll-view scroll-y style="height:100%">
            <div class="swperT2_l">
              <div class="contentBox">
                <!-- <img class="swperT2_Topimg"  src="http://leyoutest1.oss-cn-beijing.aliyuncs.com/2019/03/05/1551781930485223.jpg"> -->
                <swiper
                  class="advertisement"
                  autoplay
                  indicator-dots
                  duration="1000"
                  circular
                  indicator-active-color="#ff5500"
                >
                  <block v-for="(data,i) in advertisement" :key="i">
                    <swiper-item style="border-radius:16rpx;">
                      <image
                        :src="data.url"
                        class="swperT2_Topimg"
                        mode="widthFix"
                        @click.stop="gotoH5pageAdver(data)"
                      />
                    </swiper-item>
                  </block>
                </swiper>
                <h3 class="contentBox_Title" style="margin-top:20rpx">热门品类</h3>
                <div class="contentBox_smallBox">
                  <div
                    @click.stop="gotoSelect(item.c_name)"
                    class="contentBox_smallBox_con"
                    v-for="(item,index) in goodssmall"
                    :key="index"
                  >
                    <span class="img_wrap">
                      <img class="img" mode="aspectFit" :src="item.sub_category_image" alt />
                    </span>
                    <span class="text">{{item.c_name}}</span>
                  </div>
                </div>
                <h3 class="contentBox_Title">热门品牌</h3>
                <div class="contentBox_smallBox">
                  <div
                    @click.stop="gotoSelect(item.name)"
                    class="contentBox_smallBox_con"
                    v-for="(item,index) in bnardList"
                    :key="index"
                  >
                    <span class="img_wrap">
                      <img class="img" mode="aspectFit" :src="item.url" alt />
                    </span>

                    <span class="text">{{item.name}}</span>
                  </div>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
      </swiper-item>
      <swiper-item item-id="t3">
        <scroll-view scroll-y style="height:100%; background: #ffffff;">
          <div class="swperT3">
            <div class="swperT3_content">
              <img
                @click.stop="gotoH5page(item)"
                v-for="(item,index) in goodsSceneList"
                :key="index"
                :class="[{bigImg:item.bigImg},'swperT3_con_img']"
                :src="item.scene_main_image"
                alt
              />
            </div>
          </div>
        </scroll-view>
      </swiper-item>
    </swiper>
    <!-- </div> -->
  </div>
</template>
<script>
import {
  goodsage_detail,
  goodscategoryFacet,
  goodsscenede_tail,
  getAdverInfo,
  goodsbrand
} from "@/api";
import { mapState, mapMutations } from "vuex";
var app =  getApp();
export default {
  data() {
    return {
      placeholder: "",
      bnardList: [], //品牌数组表
      advertisement: [], //存放广告
      ageCurIdx: 0, //年龄第一个
      MainCurIdx: 0, //初始第一个
      windowHeight: 555,
      goodsAgeList: [], //年龄 初始
      goodsAgeSmallList: [], //年龄二级目录
      goodsMainList: [], //主类 初始
      goodssmall: [], //主类，二级目录
      goodsSceneList: [], //场景分类
      curIdx: 1, //初始默认的
      fromTag:'',
      arrlist: ["年龄", "分类", "场景"]
    };
  },
  computed: mapState(["init_placeholder",'fromTag','fromSubTag']),
  onLoad() {
    this.advertisement = [];
    this.sa_page(this,false,'分类','');
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res);
        that.windowHeight = res.windowHeight - 76;
      }
    });
    wx.showLoading({ title: "正在加载中", mask: true });
    getAdverInfo().then(res => {
      res.ad_list.map(r => {
        // console.log(r.type)
        if (parseInt(r.type) == 10011005) {
          this.advertisement.push(r);
          // console.log(this.advertisement)
        }
      });
      // console.log(this.advertisement)
      this.advertisement = this.advertisement.slice(2, 5);
    });
    goodsage_detail().then(res => {
      //年龄分类
      // console.log(res,'我是年龄');
      this.goodsAgeList = res.age_detail;
      this.goodsAgeSmallList = res.age_detail[0].catelist;
    });
    goodscategoryFacet().then(res => {
      //商品主类
      // console.log(res,'我是分类');
      this.goodsMainList = res.categorys;
      this.goodssmall = res.categorys[0].sub_list;
      goodsbrand().then(item => {
        //品牌
        this.barandData = item.brand_list;
        this.bnardList = item.brand_list[res.categorys[0].category_id];
        wx.hideLoading();
      });
    });
    goodsscenede_tail().then(res => {
      //场景分类
      res.scene_detail.map(r => {
        r.bigImg = parseInt(r.scene_style) == 1 ? true : false;
      });
      this.goodsSceneList = res.scene_detail;
    });
  },
  onShow() {
    this.placeholder = this.init_placeholder.search_display;
    this.fromTag = '';
  },
  onTabItemTap(e) {
    app.sensors.track("clickTab", {
      tabName: "分类"
    });
    console.log(e, "分类");
  },
  methods: {
    funcSwiper(item) {
      console.log(item);
    },
    bindchange(e) {
      this.curIdx = e.target.current;
    },
    clickTab(i) {
      if (this.curIdx === i) return;
      this.curIdx = i;
    },
    // 主类 切换
    clickTabcolumn(i) {
      if (this.MainCurIdx === i) return;
      this.goodssmall = this.goodsMainList[i].sub_list;
      this.MainCurIdx = i;
      this.bnardList = this.barandData[this.goodsMainList[i].category_id];
    },
    clickTabAgecolumn(i) {
      if (this.ageCurIdx == i) return;
      this.ageCurIdx = i;
      this.goodsAgeSmallList = this.goodsAgeList[i].catelist;
    },
    gotoSelect(c_name) {
      //跳搜索页
      this.sa_searchInfo(c_name);
      let url = "/pages/search/index/main?c_name=" + c_name;
      wx.navigateTo({ url: url });
    },
    gotoSelectPage() {
      //跳转搜索
      wx.navigateTo({ url: "/pages/search/index/main?channel=classify" });
    },
    gotoH5page(item) {
      //跳转到中转页面
      if (item.content) {
        wx.setStorageSync("urlH5", item.content);
        wx.navigateTo({
          url: "/pages/transferH5/main"
        });
      }
    },
    gotoH5pageAdver(item) {
      //跳转到中转页面
      if (item.link) {
        wx.setStorageSync("urlH5", item.link);
        wx.navigateTo({
          url: "/pages/transferH5/main"
        });
      }
    },

    sa_searchInfo(subTag) {
      let fromSubTag = subTag;
      let fromTag = ''
      if (this.curIdx == 0) {
        fromTag = this.goodsAgeList[this.ageCurIdx].c_name
      }
      else if (this.curIdx == 1) {
       fromTag = this.goodsMainList[this.MainCurIdx].c_name;
      }
      console.log(fromTag, fromSubTag);
      this.$store.commit('fromTagMutations',fromTag)
      this.$store.commit('fromSubTagMutations',fromSubTag)
    },

    funcScan() {
      wx.scanCode({
        scanType: ["barCode", "qrCode", "datamatrix", "pdf417"],
        success(res) {
          let { result, errMsg } = res;
          if (errMsg == "scanCode:ok") {
            wx.navigateTo({
              url: "/pages/search/index/main?c_name=" + result
            });
          }
        }
      });
    }
  }
};
</script>
<style scoped>
/* .swiperTBox{
        height: 100%;
        padding-bottom: 50rpx;
    } */
/* 搜索栏 */
.homeTopSelect {
  height: 76rpx;
  width: 750rpx;
  position: relative;
  background: #ffffff;
}
.homeTopSelect .input {
  height: 63rpx;
  width: 710rpx;
  margin-left: 20rpx;
  box-sizing: border-box;
  background: #f2f2f2;
  border-radius: 40px;
  padding-left: 71rpx;
  font-size: 26rpx;
  line-height: 63px;
  color: #cacaca;
}
.position {
  position: absolute;
}
.homeTopSelect .selectImg {
  width: 30rpx;
  height: 30rpx;
  left: 51rpx;
  top: 16rpx;
}
.homeTopSelect .sweepImg {
  width: 42rpx;
  height: 42rpx;
  right: 56rpx;
  top: 11rpx;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
  display: none;
}
.classify {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #f3f5f7;
  /* box-sizing: border-box; */
}
/* 顶部 */
.active {
  color: #ff5000 !important;
  border-bottom: 6rpx solid #ff5000;
}
.mainacitve {
  background: #ff5000 !important;
  color: #ffffff !important;
}
.ci_tab {
  height: 64rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: PingFangSC-Regular;
  font-size: 30px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
  background: #ffffff;
  box-sizing: border-box;
  overflow: hidden;
  border-bottom: 1px solid #dddddd;
}
.ci_tabtitle {
  width: 150rpx;
  height: 64rpx;
  line-height: 64rpx;
  box-sizing: border-box;
}
.swperT1late:last-child {
  font-size: 26rpx !important;
}

/* 分类 */
.swperT2 {
  display: flex;
  font-family: PingFangSC-Regular;
  font-size: 26px;
  height: 100%;
}
.swperT2_r {
  background: #ffffff;
  box-shadow: inset -1px 0 0 0 #eeeeee;
  width: 180rpx;
  /* height: 100%; */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.swperT2_r_txt {
  margin-top: 25rpx;
  margin-bottom: 35rpx;
  border-radius: 30px;
  width: 148rpx;
  height: 48rpx;
  font-family: PingFangSC-Regular;
  font-size: 26px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
  line-height: 48px;
  background: #ffffff;
}
.swperT2_r_txt:last-child {
  font-size: 21rpx;
}
.swperT2_l {
  width: 660rpx;
  margin-left: 20rpx;
}
.swperT2_l .topImg {
  width: 530rpx;
  height: 160rpx;
}
.swperT2_Topimg {
  /* height: 160rpx; */
  width: 530rpx;
  border-radius: 16rpx;
}
.contentBox {
  margin-top: 20rpx;
}
.contentBox .contentBox_Title {
  color: #333333;
  letter-spacing: 0;
  line-height: 32px;
  height: 32rpx;
  width: 530rpx;
  margin-top: 40rpx;
}
.contentBox_smallBox {
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  border-radius: 16px;
  padding-bottom: 40rpx;
  margin-top: 24rpx;
  box-sizing: border-box;
  width: 530rpx;
  /* padding-top: 20rpx; */
}
.contentBox .contentBox_smallBox .contentBox_smallBox_con {
  width: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666666;
  margin: 38rpx 0rpx 0rpx 38rpx;
  justify-content: space-between;
}

.text {
  text-align: center;
  height: 70rpx;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.img {
  width: 120px;
  height: 120px;
}
.img_wrap {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 22rpx;
}
/* 内容场景 */
/* .swiper-box{
        height: 100%;
    } */
.swperT3 {
  /* overflow: auto; */
  height: 100%;
}
.swperT3_content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  box-sizing: border-box;
}
.swperT3_con_img {
  margin-top: 20rpx;
  width: 345rpx;
  height: 180rpx;
  border-radius: 16px;
  box-sizing: border-box;
}
.bigImg {
  width: 710rpx;
  height: 80rpx;
  box-sizing: border-box;
}
.advertisement {
  width: 530rpx;
  /* height: 160rpx; */
  height: 116rpx;
  border-radius: 16rpx;
}
</style>

