<template>
  <div class="index_wrap">

    <!-- 搜索 -->
    <div class="homeTopSelect">
      <img v-if="is_show_stock" src="/static/images/index/index_nav_tip.png" class="mini_stock" @click.stop="funcClickStock">
      <img class="position selectImg" src="/static/images/navbar_search.png" />
      <span class="position sweepImg" @click="funcScan">
        <img class="sweepImg_img" src="/static/images/index/search_icon_sao.png" />
      </span>

      <navigator url="/pages/search/index/main?channel=index" hover-class="none">
        <div class="input">{{placeholder}}</div>
      </navigator>
      <img
        class="position barCodeImg"
        @click="funcGoToVipCode"
        src="/static/images/userCenter/uservip.png"
      />
    </div>
    <!-- End -->
    <!-- 摸版信息 -->
    <div class="index_template_wrap">
      <div v-for="(module,idx) in module_list" :key="idx">
        <template v-if="module.content_type == 1">
          <div class="template_wrap">
            <template1 :vdata="module.content_obj"></template1>
          </div>
        </template>
        <template v-if="module.content_type == 2">
          <div class="template_wrap">
            <template2 :vdata="module.content_obj"></template2>
          </div>
        </template>
        <template v-if="module.content_type == 3">
          <div class="template_wrap">
            <template3 :vdata="module.content_obj"></template3>
          </div>
        </template>
        <template v-if="module.content_type == 4">
          <div class="template_wrap">
            <template4 :vdata="module.content_obj"></template4>
          </div>
        </template>
        <template v-if="module.content_type == 5">
          <div class="template_wrap">
            <template5 :vdata="module.content_obj"></template5>
          </div>
        </template>
        <template v-if="module.content_type == 6">
          <div class="template_wrap">
            <template6 :vdata="module.content_obj"></template6>
          </div>
        </template>
        <template v-if="module.content_type == 7">
          <template7 :vdata="module.content_obj"></template7>
        </template>
        <template v-if="module.content_type == 16">
          <div style="padding: 0 20rpx;">
            <template16 :vdata="module.content_obj"></template16>
          </div>
        </template>
        <template v-if="module.content_type == 17">
          <div class="template_wrap">
            <template17 :vdata="module.content_obj"></template17>
          </div>
        </template>
        <template v-if="module.content_type == 18">
          <div class="template_wrap">
            <template18 :vdata="module.content_obj"></template18>
          </div>
        </template>
        <template v-if="module.content_type == 20">
          <div class="template_wrap">
            <template20 :vdata="module.content_obj"></template20>
          </div>
        </template>
        <template v-if="module.content_type == 21">
          <div class="template_wrap">
            <template21 :vdata="module.content_obj"></template21>
          </div>
        </template>
        <template v-if="module.content_type == 22">
          <template22 :vdata="module.content_obj"></template22>
        </template>
        <template v-if="module.content_type == 24">
          <div class="template_wrap">
            <template24 :vdata="module.content_obj"></template24>
          </div>
        </template>
        <template v-if="module.content_type == 25">
          <template25 :vdata="module.content_obj"></template25>
        </template>
        <template v-if="module.content_type == 26">
          <div class="template_wrap">
            <template26 :vdata="module.content_obj"></template26>
          </div>
        </template>
        <template v-if="module.content_type == 27">
          <div class="template_wrap">
            <template27 :vdata="module.content_obj"></template27>
          </div>
        </template>
      </div>
    </div>
    <!-- End -->
    <div id="brand"></div>
    <!-- 猜你喜欢 -->
    <div class="module_recommend">
      <!-- <div class="module_recommend_title">
        <img
          class="module_recommend_title_img"
          src="../../../static/images/index/index_pic_recomtitle.png"
          alt
        >
      </div>-->
      <div :class="{'brand_fixed':is_fixed}">
        <div class="module_brand_wrap">
          <scroll-view scroll-x="true" class="module_brand_scroll">
            <div class="module_brank_ul">
              <span
                class="module_brand_label"
                :class="{'active':curr_index == 0}"
                @click="funcGoToSearch(0,indexItem)"
              >精选</span>
              <span
                class="module_brand_label"
                v-for="(item,brand) in brand_list"
                :key="brand"
                :class="{'active':curr_index == brand+1}"
                @click="funcGoToSearch(brand+1,item)"
              >{{item.name}}</span>
            </div>
          </scroll-view>
        </div>
      </div>
      <div class="module_recommend_ul">
        <!-- <likeGood :mainData="item" v-for="(item,idx) in product_list" :key="idx"></likegood> -->
        <div class="item_product" v-for="(item,idx) in product_list" :key="idx">
          <div class="item_product_img">
            <img class="images" :src="item.image" @click="goToGoods(item.sku)" />
          </div>
          <h1 class="item_product_title">{{item.prod_title}}</h1>
          <div class="item_product_price">
            <div class="item_product_price_sale">
              <span class="item_product_price_sign">￥</span>
              <span class="price_init">{{item.prices[0]}}</span>
              <span class="price_float">.{{item.prices[1]}}</span>
            </div>
            <!-- <span class="item_product_tags" @click.stop="productClick(item)">找相似</span> -->
          </div>
        </div>
      </div>
      <div class="weui-loadmore">
        <div v-if="!is_end" class="weui-loading"></div>
        <div class="weui-loadmore__tips">{{is_end?"已经全部加载完毕":"正在加载..."}}</div>
      </div>
    </div>
    <!-- End -->
    <!-- ad -->
    <div class="ad_wrap" v-if="ad_flag && ad_info.length">
      <div class="ad_center" v-for="(item,i) in ad_info" :key="i" @click="funGoToLink(item)">
        <img
          :src="item.url"
          class="ad_wrap_img"
          alt
          :style="{'width':item.width+'rpx','height':item.high+'rpx'}"
        />
      </div>
      <div class="ad_close" @click="funcAdClose">
        <img class="ad_close_img" src="../../../static/images/index_adv_close.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBabyInfo,
  getUserinfo,
  getIndex,
  getLikeInfo,
  getSeckillInfo,
  getAdverInfo,
  apiScanCode,
  getMiniProductList,
  daGuanLikeRecomment
} from "@/api";
import { mapState, mapMutations } from "vuex";
import template1 from "@/components/template/template1";
import template2 from "@/components/template/template2";
import template3 from "@/components/template/template3";
import template4 from "@/components/template/template4";
import template5 from "@/components/template/template5";
import template6 from "@/components/template/template6";
import template7 from "@/components/template/template7";
import template16 from "@/components/template/template16";
import template17 from "@/components/template/template17";
import template18 from "@/components/template/template18";
import template20 from "@/components/template/template20";
import template21 from "@/components/template/template21";
import template22 from "@/components/template/template22";
import template24 from "@/components/template/template24";
import template25 from "@/components/template/template25";
import template26 from "@/components/template/template26";
import template27 from "@/components/template/template27";
import likeGood from "@/components/public/likeGood";
// import {saPageInfo} from '@/utils'
var app = getApp();

export default {
  data() {
    return {
      toFixed: 0,
      is_fixed: false,
      category_id: "",
      curr_page: 1,
      page_size: 20,
      placeholder: "",
      is_end: false,
      module_list: [],
      product_list: [],
      brand_list: [],
      ad_info: [],
      ad_flag: false,
      is_ad_show: false,
      curr_index: 0,
      da_category_id: "",
      openGid: "",
      is_show_stock:false,
      indexItem: {
        category_id: ""
      }
    };
  },
  computed: mapState(["BASE_APP_INFO"]),
  onReachBottom() {
    if (this.is_end) {
      return false;
    }
    this.curr_page++;
    this.funcDaGuanLikeRecomment("init");
  },
  onLoad() {
    this.sa_page(this, false, "首页", "");
    this.funcShowStock();
  },
  onShow() {
    wx.removeStorageSync("leshonghome");
    var token = wx.getStorageSync("token");
    this.funcInitSearchKeys();
    this.funcGetIndexInfo();
    // this.funcIndexGetikeInfo();
    this.funcGetAdverInfo();
    this.funcCurrentDay();
    this.funcGetMiniProductList();
    this.funcDaGuanLikeRecomment("init");
    if (token) {
      this.funcGetUserInfo();
      this.$store.commit("tokenMutations", token);
    }
    this.funcGetBabyInfo();
  },
  components: {
    likeGood,
    template1,
    template2,
    template3,
    template4,
    template5,
    template6,
    template7,
    template16,
    template17,
    template18,
    template20,
    template21,
    template22,
    template24,
    template25,
    template26,
    template27
  },
  onPageScroll: function(e) {
    let that = this;
    const query = wx.createSelectorQuery();
    query.select("#brand").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      that.toFixed = res[0].top + res[1].scrollTop;
      let top = res[0].top - 70;
      if (top <= 0) {
        that.is_fixed = true;
      } else {
        that.is_fixed = false;
      }
    });
  },
  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
    //   console.log(res.target);
    }
    return {
      title: "乐友商城 母婴好货一站购",
      imageUrl: "/static/images/index/WechatIMG205.jpeg",
      path: "/pages/index/main"
    };
  },
  mounted() {
    this.funcInitSearchKeys();
  },
  onTabItemTap(e) {
    app.sensors.track("clickTab", {
      tabName: "我的"
    });
    // console.log(e, "首页tabbar点击");
  },
  methods: {

    funcClickStock() {
      this.is_show_stock = false;
      wx.setStorageSync('is_show_stock', '1');
    },

    funcShowStock() {
      let show = wx.getStorageSync('is_show_stock');
      if (!show || show == '') {
        this.is_show_stock = true;
        let _this = this;
        setTimeout(() => {
        if (_this.is_show_stock) {
          _this.is_show_stock = false;
          wx.setStorageSync('is_show_stock', '1');
        }
      }, 5000);
      }

    },


    gotoScan() {

      let url = "/pages/confirm/scancode/manage/main";
      wx.navigateTo({
        url: url
      });
    },
    gotoShare(){
        let url = "/pages/sharingEarnings/sharingIndex/main";//"/pages/sharingEarnings/search/main?channel=share";
      wx.navigateTo({
        url: url
      });
    },
    gotoMy() {
      wx.navigateTo({
        url: "/pages/cutprice/myCutPage/main"
      });
    },
    gotoList() {
      wx.navigateTo({
        url: "/pages/cutprice/cutList/main"
      });
    },
    funcGetUserInfo() {
      getUserinfo().then(res => {
        res.avatar =
          res.avatar == ""
            ? "/static/goodsdetail/default_pic_user.png"
            : res.avatar.indexOf("gif") > -1
              ? "/static/goodsdetail/default_pic_user.png"
              : res.avatar;
        this.$store.commit("userInfoMutations", res);
      });
    }, //宝宝信息
    funcGetBabyInfo() {
      getBabyInfo().then(res => {
        var arr = [];
        if (res.baby_info && res.baby_info.baby_msgs) {
          res.baby_info.baby_msgs.forEach((item, index) => {
            let json = {
              name: item.name
                .replace("<html><body>", "")
                .replace("</body></html>", ""),
              link: item.link
            };
            arr.push(json);
          });
        }
        this.$store.commit("bodyTextMutations", arr);
        this.$store.commit("bobyInfoMutations", res.baby_info);
      });
    },
    //获取分类导航
    funcGetMiniProductList() {
      getMiniProductList().then(res => {
        this.brand_list = res.mini_product_list;
      });
    },
    funcDaGuanLikeRecomment(state) {
      let query = {
        page_index: this.curr_page,
        scene_type: "xcx_index_DibuTuijian",
        scene_category_id: this.da_category_id
      };
      daGuanLikeRecomment(query).then(res => {
        // this.product_list = [...this.product_list, ...res.product_list];
        if (state != "init") {
          this.product_list = [];
        }
        res.product_list.forEach((item, index) => {
          let arr = item.sale_price.split(".");
          if (arr.length.length < 2) {
            arr.push("00");
          } else {
            if (arr[1].length < 2) {
              arr[1] = arr[1].toString() + "0";
            }
          }
          item.prices = arr;
          this.product_list.push(item);
        });
        this.is_end = res.is_end;
      });
    },
    //默认搜索词
    funcInitSearchKeys() {
      let info = this.BASE_APP_INFO;
      if (info.hot_search) {
        let random = parseInt(info.hot_search.length * Math.random());
        let randomNum = Math.round(random);
        let hotSearch = info.hot_search[randomNum];
        this.$store.commit("placeholderMutations", hotSearch);
        if (hotSearch && hotSearch.search_display) {
          this.placeholder = hotSearch.search_display;
        }
      } else {
        this.placeholder = "乐友搜索";
      }
    },
    //判断是否在同一天
    funcCurrentDay() {
      //   let adFlag = wx.getStorageSync("adFlag");
      let endTime = wx.getStorageSync("endTime");
      let currTime = +new Date();
      if (currTime > endTime) {
        this.ad_flag = true;
        // wx.removeStorageSync("adFlag");
        wx.removeStorageSync("endTime");
      }
    },
    //全局广告
    funcGetAdverInfo() {
      let token = wx.getStorageSync("token");
      getAdverInfo().then(res => {
        res.ad_list.forEach((item, index) => {
          if (token) {
            if (item.type == "10011008") {
              this.ad_info = [item];
            }
          } else {
            if (item.type == "10011007") {
              this.ad_info = [item];
            }
          }
        });
      });
    },
    //首页摸版数据
    funcGetIndexInfo() {
      let query = {
        category_id: this.category_id,
        test_ab: "leyou",
        banner_test_ab: "daguan"
      };
      getIndex(query).then(res => {
        let { module_list } = res;
        this.module_list = module_list;
      });
    },
    //猜你喜欢
    funcIndexGetikeInfo() {
      let query = {
        page_index: this.curr_page,
        page_size: 10,
        is_daguan_data: 1
      };
      getLikeInfo(query).then(res => {
        this.product_list = [...this.product_list, ...res.product_list];
        if (res.brand_list) {
          this.brand_list = res.brand_list;
        }
        this.is_end = res.is_end;
      });
    },
    //跳转商品详情
    funcGoToProduct(item) {
      wx.navigateTo({
        url: "/pages/goodsdetailed/main?sku=" + item.sku
      });
    },
    //分类数据
    funcGoToSearch(index, item) {
      let that = this;
      this.curr_index = index;
      this.curr_page = 0;
      this.da_category_id = "";
      if (item.category_id) {
        this.da_category_id = item.category_id;
      }
      if (that.is_fixed) {
        wx.pageScrollTo({
          scrollTop: that.toFixed - 25,
          duration: 100
        });
      }

      this.funcDaGuanLikeRecomment("tab");
    },
    //关闭广告
    funcAdClose() {
      let endTime = new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
      ).getTime();
      this.ad_flag = false;
      //   wx.setStorageSync("adFlag", "true");
      wx.setStorageSync("endTime", endTime);
    },
    funGoToLink(item) {
      let link = item.link;
      if (link != "0" && link != "") {
        if (link.indexOf("http") >= 0) {
          wx.setStorageSync("urlH5", link);
          wx.navigateTo({
            url: "/pages/transferH5/main"
          });
        } else {
          wx.navigateTo({
            url: link
          });
        }
        this.funcAdClose();
      }
    },
    funcScan() {
      let url = '/pages/confirm/scancode/manage/main';
      wx.navigateTo({
        url: url
      });
      // wx.scanCode({
      //   scanType: ["barCode", "qrCode", "datamatrix", "pdf417"],
      //   success(res) {
      //     let { result, errMsg } = res;
      //     if (errMsg == "scanCode:ok") {
      //       let cart_id = wx.getStorageSync("cart_id");
      //       let params = {
      //         code_str: result,
      //         cart_id: cart_id
      //       };
      //       wx.showLoading({ title: "加载中...", mask: true });
      //       apiScanCode(params).then(res => {
      //         wx.hideLoading();
      //         let link = res.action_char;
      //         if (link.indexOf("url=") != -1) {
      //           let h5url = link.split("url=");
      //           wx.setStorageSync("urlH5", h5url[1]);
      //           wx.navigateTo({ url: "/pages/transferH5/main" });
      //         } else if (link.indexOf("shop/shoppingCart/main") != -1) {
      //           let token = wx.getStorageSync("token");
      //           if (token == "" || !token) {
      //             if (!cart_id) {
      //               let card_id_server = link.split("cart_id=");
      //               wx.setStorageSync("cart_id", card_id_server[1]);
      //             }
      //           }
      //           wx.switchTab({
      //             url: "/pages/shop/shoppingCart/main"
      //           });
      //         } else {
      //           wx.navigateTo({
      //             url: link
      //           });
      //         }
      //       });
      //     }
      //   }
      // });
    },
    goToGoods(data) {
      wx.navigateTo({
        url: `/pages/goodsdetailed/main?sku=` + data
      });
    },
    productClick(data) {
      wx.navigateTo({
        url: `/pages/shop/likeShop/main?data=` + JSON.stringify(data)
      });
    },
    //会员吗
    funcGoToVipCode() {
      let token = wx.getStorageSync("token");
      if (token) {
        wx.navigateTo({
          url: `/pages/userCenter/barcode/main`
        });
      } else {
        wx.navigateTo({
          url: `/pages/userCenter/login/wxLogin/main`
        });
      }
    }
  }
};
</script>

<style scoped>

  .mini_stock {
    position: absolute;
    right: 20rpx;
    top: 0;
    height: 68rpx;
    width: 340rpx;
    z-index:20;
  }



  .gotoMy{
    position: fixed;
    padding: 20rpx;
    z-index: 999;
    background: #fff;
    font-size: 26rpx;
    top: 150rpx;
    left: 50tpx;
  }
  .gotoList{
    padding: 20rpx;
    position: fixed;
    z-index: 999;
    background: #fff;
    font-size: 26rpx;
    top: 50rpx;
    left: 50tpx;
  }
  .mykanjia{
    position: fixed;
    top: 230rpx;
    left: 100rpx;
    background: red;
    padding: 20rpx;
    z-index: 9999;
  }.index_wrap {
  background: #f3f5f7;
}
.module_recommend {
  padding: 0 14px;
}
.module_brand_scroll {
  width: 100%;
  height: 90px;
}
.module_brank_ul {
  display: flex;
  padding: 22px 0;
}
.module_brand_label {
  padding: 0 28px 0 0;
  font-size: 26px;
  color: #333333;
  line-height: 37px;
  white-space: nowrap;
  border-right: #f3f5f7 1px solid;
}
.module_brand_label.active {
  color: #ff5000;
}
.module_brand_label:last-child {
  padding-right: 0;
  border-right: 0;
}
.module_brand_wrap {
  margin: 0 6px 12px;
  padding: 0 28px;
  height: 80px;
  overflow: hidden;
  background: #ffffff;
  border-radius: 16px;
}
.brand_fixed {
  width: 100%;
  padding: 0 14px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 777;
  background: #ffffff;
}
.module_recommend_title {
  padding: 40px 0;
}
.module_recommend_title_img {
  width: 285px;
  height: 40px;
  margin: auto;
  display: block;
}
.module_recommend_ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.module_recommend_li {
  width: 349px;
  margin: 0 6px 8px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}
.module_recommend_img {
  width: 349px;
  height: 349px;
  display: block;
}
.module_recommend_product {
  margin: 12px 20px 16px;
  font-size: 26px;
  color: #333333;
  line-height: 30px;
  height: 60px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.module_recommend_price {
  color: #ff3c3c;
  font-size: 30px;
  line-height: 32px;
  padding: 0 0 20px 20px;
}
.price_float {
  font-size: 24px;
  /* padding-top: 7px; */
  line-height: 28px;
}
.price_init {
  font-size: 34px;
  line-height: 34px;
}
/* 搜索栏 */
.homeTopSelect {
  height: 76rpx;
  width: 750rpx;
  position: relative;
  background: #ffffff;
}
.homeTopSelect .input {
  height: 63rpx;
  width: 550rpx;
  margin-left: 100rpx;
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
  left: 117rpx;
  top: 16rpx;
}
.homeTopSelect .sweepImg {
  /* padding: 10px;
  right: 120rpx;
  top: 5rpx; */
  height: 68rpx;
  width: 56rpx;
  top: 0rpx;
  left: 30rpx;
}
.sweepImg_img {
  width: 56rpx;
  height: 68rpx;
  display: block;
}
.homeTopSelect .barCodeImg {
  height: 68rpx;
  width: 56rpx;
  top: 0rpx;
  right: 30rpx;
}
.ad_wrap {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}
.ad_wrap_img {
  margin: auto;
  display: block;
}
.ad_close_img {
  width: 88px;
  height: 88px;
  display: block;
  margin: auto;
}
.template_wrap {
  padding: 0 20px;
}

.images {
  width: 352rpx;
  height: 352rpx;
}
.item_product {
  width: 352px;
  margin-bottom: 12px;
  padding-bottom: 13px;
  background: #fff;
  border-radius: 16px;
}
.item_product:nth-child(2n) {
  margin-right: 6px;
}
.item_product:nth-child(2n + 1) {
  margin-left: 6px;
}
.item_product_img {
  width: 352px;
  height: 352px;
  overflow: hidden;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.item_product_title {
  height: 60px;
  margin: 10px 20px 16px;
  font-size: 26px;
  color: #333333;
  line-height: 30px;
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item_product_footer_number {
  font-size: 20px;
  color: #999999;
  line-height: 24px;
}
.item_product_price {
  padding-bottom: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item_product_price_sale {
  display: flex;
  align-items: flex-end;
  padding: 0 0 0 16px;
  font-size: 34px;
  line-height: 28px;
  color: #ff5000;
  font-weight: 700;
}
.item_product_price_sign {
  padding-top: 10px;
  font-size: 20px;
  padding-right: 2px;
  line-height: 28px;
}
.item_product_tags {
  width: 114px;
  height: 48px;
  margin-right: 16px;
  border-radius: 24px;
  box-sizing: border-box;
  color: #666666;
  font-size: 24px;

  line-height: 48px;
  text-align: center;
  border: 1px solid #dddddd;
}
</style>
