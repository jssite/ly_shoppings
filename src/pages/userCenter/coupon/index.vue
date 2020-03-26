<!--<template>-->
    <!--<div class="user_center_coupon">-->
        <!--&lt;!&ndash; tabs &ndash;&gt;-->
        <!--<div class="user_coupon_tabs">-->
            <!--<span class="user_coupon_tab active">未使用(5)</span>-->
            <!--<span class="user_coupon_tab">未使用(5)</span>-->
            <!--<span class="user_coupon_tab">已过期(5)</span>-->
        <!--</div>-->
        <!--&lt;!&ndash; End &ndash;&gt;-->
        <!--&lt;!&ndash; Input &ndash;&gt;-->

        <!--&lt;!&ndash; End &ndash;&gt;-->
        <!--&lt;!&ndash; lists &ndash;&gt;-->

        <!--&lt;!&ndash; End &ndash;&gt;-->
    <!--</div>-->
<!--</template>-->

<!--<script>-->
    <!--export default {-->
        <!---->
    <!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
<template>
  <div class="classify" v-if="is_show_data">
    <!-- 搜索栏 -->

    <!-- 分类栏 active-->
    <dl class="ci_tab">
      <dd
        class="ci_tabtitle"
        @click.stop="clickTab(idx)"
        v-for="(item,idx) in arrlist"
        :class="{'active': curIdx==idx}"
        :key="idx"
      >{{item.label}}({{item.num}})</dd>
    </dl>
    <div class="user_coupon_input">
      <input type="text" class="user_coupon_value" placeholder="请输入优惠券码" v-model="num" />
      <span @click="toDuih()" :class="num?'user_coupon_button act':'user_coupon_button'">兑换</span>
    </div>
    <!-- :style="{'height':screenHeight+'px'}" -->
    <swiper
      :current="curIdx"
      class="swiperTBox"
      :style="{'min-height':windowHeight+'px'}"
      duration="300"
      @change="bindchange"
    >
      <swiper-item v-for="(n,index) in coupons_details" :key="index">
        <scroll-view scroll-y="true" class="user_coupon_lists">
          <div v-if="dataArr.length" v-for="(item,m) in n.arr" :key="m">
            <div class="user_coupon_item">
              <div
                :class="index==0?(item.coupon_type?'user_coupon_wrap yellow':'user_coupon_wrap red'):'user_coupon_wrap gray'"
              >
                <img
                  v-if="index==0&&item.coupon_type"
                  class="top_img"
                  mode="widthFix"
                  src="../image/order_coupon_bg02.png"
                  alt
                />
                <img
                  v-if="index==0&&!item.coupon_type"
                  class="top_img"
                  mode="widthFix"
                  src="../image/order_coupon_bg01.png"
                  alt
                />
                <img
                  v-if="index!=0"
                  class="top_img"
                  mode="widthFix"
                  src="../image/order_coupon_bg03.png"
                  alt
                />
                <div class="user_coupon_content">
                  <div class="user_coupon_tags">
                    <div class="user_coupon_tags_1">
                      <span v-if="item.coupon_type" :class="index!=0?'has-no':''">{{item.amount}}</span>
                      <span :class="index!=0?'has-no money':'money'" v-if="!item.coupon_type">
                        <moneySpan
                          v-if="item.coupon_value_type != 2"
                          :money="item.amount"
                          :iSize="52"
                          :fSize="40"
                        ></moneySpan>
                        <span v-else>
                          <span style="font-size:66rpx">{{item.value_format[0]}}</span>
                          <span style="font-size:40rpx">{{item.value_format[1]}}</span>
                          <span style="font-size:36rpx">{{item.value_format[2]}}</span>
                        </span>
                      </span>
                    </div>
                  </div>
                  <div :class="index!=0?'has-no user_coupon_txt':'user_coupon_txt'">{{item.info}}</div>
                </div>
                <div class="user_coupon_footer">
                  <span
                    :class="index!=0?'has-no user_coupon_time':'user_coupon_time'"
                  >{{item.start_date_time}}-{{item.end_date_time}}</span>
                  <span
                    v-if="index==0"
                    class="user_coupon_use"
                    :class="{activity:item.coupon_type==2 ||item.coupon_type==1 }"
                    @click.stop="funcCouponUse(item)"
                  >立即使用</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="n.arr&&!n.arr.length">
            <div class="zanwei">
              <img class="zanwei-img" src="/static/images/public/public_empty_pic.png" alt />
              <!-- <p class="zanwei-tip">没有{{arrlist[curIdx]}}优惠券</p> -->
              <p class="zanwei-tip">没有优惠券</p>
            </div>
          </div>
        </scroll-view>
      </swiper-item>
    </swiper>
    <div class="goBox">
      <!-- <div class="goTolj" @click="gotoLJ()"> </div> -->
      <img class="goTolj" @click="gotoLJ()" src="../image/order_coupon_button.png" />
    </div>
  </div>
</template>
<script>
import { getCouponsDetails, putCouponsByCodeNum } from "@/api";
import moneySpan from "@/components/public/moneyNo.vue";
import { couponSaleFormat } from "@/utils";
export default {
  components: {
    moneySpan
  },
  data() {
    return {
      ageCurIdx: 0, //年龄第一个
      MainCurIdx: 0, //初始第一个
      windowHeight: 555,
      is_show_data: false,
      coupons_details: [],
      dataArr: [],
      page_index: 1,
      business_type: 0,
      page_size: 10,
      num: "",
      curIdx: 0, //初始默认的
      arrlist: [
        {
          label: "未使用",
          num: 0
        },
        {
          label: "已使用",
          num: 0
        },
        {
          label: "已过期",
          num: 0
        }
      ]
    };
  },
  onReachBottom() {
    this.getMore();
  },
  onLoad() {
    this.sa_page(this, false, "我的优惠券", "");
    this.is_show_data = false;
    let that = this;
    this.curIdx = 0;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight);
        that.windowHeight = res.windowHeight - 146;
      }
    });
  },
  onShow() {
    this.coupons_details[0] = {};
    this.coupons_details[1] = {};
    this.coupons_details[2] = {};
    getCouponsDetails({
      business_type: 0,
      page_index: 1,
      page_size: 100
    }).then(res => {
      this.is_show_data = true;
      res.coupons_details.map(coupon => {
        if (coupon.coupon_type == 0 && coupon.coupon_value_type == 2) {
          coupon.value_format = couponSaleFormat(coupon.amount);
        }
      });
      this.coupons_details[0].arr = res.coupons_details;
      this.dataArr = res.coupons_details;
      this.arrlist[0].num = res.count;
      this.arrlist[0].num = res.coupons_details.length;
      console.log(this.coupons_details[0].arr);
    });
    getCouponsDetails({
      business_type: 1,
      page_index: 1,
      page_size: 100
    }).then(res => {
      res.coupons_details.map(coupon => {
        if (coupon.coupon_type == 0 && coupon.coupon_value_type == 2) {
          coupon.value_format = couponSaleFormat(coupon.amount);
        }
      });
      this.coupons_details[1].arr = res.coupons_details;
      this.arrlist[1].num = res.count;
      this.arrlist[1].num = res.coupons_details.length;
    });
    getCouponsDetails({
      business_type: 2,
      page_index: 1,
      page_size: 100
    }).then(res => {
      res.coupons_details.map(coupon => {
        if (coupon.coupon_type == 0 && coupon.coupon_value_type == 2) {
          coupon.value_format = couponSaleFormat(coupon.amount);
        }
      });
      this.coupons_details[2].arr = res.coupons_details;
      this.arrlist[2].num = res.count;
      this.arrlist[2].num = res.coupons_details.length;
    });
    this.page_index++;
    // this.screenHeight = wx.getStorageSync('screenHeight') ;  //获取屏幕高度
    // this.windowHeight = wx.getStorageSync('windowHeight') - 76-70;
    console.log(this.coupons_details);
  },
  methods: {
    gotoLJ() {
      wx.navigateTo({
        url: "/pages/userCenter/couponCenter/main"
      });
    },
    toDuih() {
      if (!this.num) {
        return;
      } else {
        putCouponsByCodeNum({ code_num: this.num }).then(res => {
          wx.showToast({
            title: "激活优惠券成功",
            icon: "none",
            duration: 2000
          });
          this.num = "";
        });
      }
    },
    getMore() {
      getCouponsDetails({
        business_type: this.curIdx,
        page_index: this.page_index,
        page_size: 10
      }).then(res => {
        this.coupons_details[this.curIdx].arr = this.coupons_details[
          this.curIdx
        ].arr.concat(res.coupons_details);
      });
    },
    bindchange(e) {
      this.curIdx = e.target.current;
      this.dataArr = this.coupons_details[this.curIdx].arr;
    },
    clickTab(i) {
      if (this.curIdx === i) return;
      this.curIdx = i;
      this.dataArr = this.coupons_details[i].arr;
    },
    // 主类 切换
    clickTabcolumn(i) {
      if (this.MainCurIdx === i) return;
      this.goodssmall = this.goodsMainList[i].sub_list;
      this.MainCurIdx = i;
    },
    clickTabAgecolumn(i) {
      if (this.ageCurIdx == i) return;
      this.ageCurIdx = i;
      this.goodsAgeSmallList = this.goodsAgeList[i].catelist;
    },

    funcCouponUse(coupon_info) {
      // console.log(coupon_info,'这个是什么')
      if (coupon_info.coupon_type == 2) {
        let couponInfo = JSON.stringify(coupon_info);
        let url =
          "/pages/userCenter/coupon/couponChange/main?couponInfo=" + couponInfo;
        wx.navigateTo({
          url: url
        });
      } else if (coupon_info.coupon_type == 0) {
        //跳转商品页
        let url =
          "/pages/search/salesPromotion/main?content=" +
          coupon_info.info +
          "&promotion_id=" +
          coupon_info.promotion_id +
          "&title=" +
          coupon_info.title;
        wx.navigateTo({ url: url });
      } else {
        wx.switchTab({
          url: "/pages/shop/shoppingCart/main"
        });
      }
    }
  }
};
</script>
<style scoped>
.goBox {
  position: fixed;
  bottom: 0;
  width: 100%;
  /* text-align: center; */
  padding: 28rpx 0;
  background: #fff;
  display: flex;
  justify-content: center;
}
.goTolj {
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  width: 316rpx;
  height: 88rpx;
  /* width: 300rpx; */
  /* height: 72rpx; */
  /* padding:10rpx 20rpx; */
  /* font-size: 30rpx; */
  /* color: #fff; */
  /* background: #ff5000; */
  /* border: 1px solid #FF5000; */
  /* box-shadow: inset 0 1px 0 0 #DDDDDD; */
  /* border-radius: 36px; */
  /* position: relative; */
}

/* .gotoLjbg {
        position: absolute;
        top: 0;
        left: 0;
        width: 316rpx;
        height: 88rpx;

    } */

.act {
  background: #ff5000 !important;
  color: #fff !important;
}

.money {
  color: #ff5000;
}
swiper-item {
}
.user_coupon_lists {
  position: relative;
  height: 100%;
}
.top_img {
  height: 50rpx;
  position: absolute;
  z-index: -1;
  width: 710rpx;
}
.active {
  color: #ff5000 !important;
  border-bottom: 6rpx solid #ff5000;
}
.zanwei-tip {
  font-size: 30rpx;
  padding-bottom: 40rpx;
}

.zanwei-img {
  width: 266rpx;
  height: 222rpx;
  display: inline-block;
  padding: 40rpx;
}
.zanwei {
  text-align: center;
}

.user_coupon_input {
  padding: 10px 20px;
  display: flex;
  background: #fff;
  justify-content: space-between;
}
.user_coupon_value {
  width: 550px;
  height: 66px;
  padding-left: 20px;
  box-sizing: border-box;
  border: 1px solid #eeeeee;
  border-radius: 16px;
  font-size: 26px;
  line-height: 66px;
  color: #333333;
}
.user_coupon_value::placeholder {
  color: #999999;
  line-height: 66px;
}
.user_coupon_button {
  width: 140px;
  height: 66px;
  padding: 0;
  margin: 0;
  text-align: center;
  font-size: 26rpx;
  line-height: 64px;
  background: #cacaca;
  border-radius: 16px;
  color: #fff;
}
.user_coupon_item {
  height: 220rpx;
  padding: 20rpx 20px 0;
  position: relative;
}
.user_coupon_wrap {
  border-radius: 16rpx;
  padding-bottom: 20rpx;
  overflow: hidden;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.user_coupon_content {
  display: flex;
}
.user_coupon_tags {
  flex: 1;
}
.user_coupon_tags_1 {
  height: 84px;
  padding-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fab400;
  font-size: 52px;
  font-weight: 700;
}
.user_coupon_txt {
  width: 470px;
  padding: 30px 19px 0 0;
  font-size: 24px;
  color: #333333;
  line-height: 28px;
}
.user_coupon_footer {
  position: absolute;
  padding: 15rpx;
  bottom: 10rpx;
  width: 680rpx;
  justify-content: space-between;
}
.user_coupon_time {
  font-size: 22px;
  color: #999999;
  line-height: 24px;
}
.user_coupon_use {
  width: 112px;
  height: 44px;
  padding: 0;
  margin: 0;
  float: right;
  box-sizing: border-box;
  border-radius: 22px;
  border: #ff5000 1px solid;
  text-align: center;
  font-size: 20px;
  color: #ff5000;
  line-height: 42px;
  background: #fff;
}

.user_coupon_use.activity {
  border: #fab400 1px solid;
  color: #fab400;
}
/**object
    <div class="user_coupon_wrap">
        <div class="user_coupon_top_img"></div>
        <div class="user_coupon_content">
            <div class="user_coupon_tags">
                <div class="user_coupon_tags_1">包邮</div>
            </div>
            <div class="user_coupon_txt">
                美赞臣、美赞臣蓝臻-一件可使用50元美赞臣代金券，与其它活动同享，一段奶粉及特价品除外
            </div>
        </div>
        <div class="user_coupon_footer">
            <span class="user_coupon_time"></span>
            <soan class="user_coupon_use"></soan>
        </div>
    */
/* 搜索栏 */

.homeTopSelect .input {
  height: 63rpx;
  width: 710rpx;
  margin-left: 20rpx;
  box-sizing: border-box;
  background: #f2f2f2;
  border-radius: 40px;
  padding-left: 71rpx;
  font-size: 26rpx;
}
.has-no {
  color: #cacaca !important;
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
  width: 100%;
  height: 100%;
  background: #f3f5f7;
  /* box-sizing: border-box; */
}
/* 顶部 */

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
  border-bottom: 1rpx solid #f3f5f7;
}
.ci_tabtitle {
  width: 150rpx;
  margin: 0 20rpx;
  height: 64rpx;
  line-height: 64rpx;
  box-sizing: border-box;
}
/* 分类 */

.swperT2_l .topImg {
  width: 530rpx;
  height: 160rpx;
}

.contentBox .contentBox_Title {
  color: #333333;
  letter-spacing: 0;
  line-height: 32px;
  height: 32rpx;
  width: 530rpx;
  margin-top: 20rpx;
}

.contentBox .contentBox_smallBox .contentBox_smallBox_con {
  width: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666666;
  margin: 38rpx 0rpx 0rpx 38rpx;
}
.contentBox .contentBox_smallBox .contentBox_smallBox_con .img {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 22rpx;
}

/* 内容场景 */
/* .swiper-box{
        height: 100%;
    } */
</style>

