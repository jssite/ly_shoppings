<template>
  <div class="cancel" v-if="is_show_data">
    <!-- 顶部信息 -->
    <div class="canceltop">
      <span class="font34">{{cancelData.application_status_description}}</span>
      <text class="font24 news">{{cancelData.application_status_info}}</text>
    </div>

    <!-- 收货地址 -->
    <!-- <div class="addressBox public">
            <img class="headerimg addressimg" src="../images/location.png">
            <div>
                <div class="usreInfo">
                    <span>收件人：乐友售后组</span>
                    <span style="padding-left:60rpx">010-66668888</span>
                </div>
                <div class="arrdessinfo">退货地址：天津市朝阳区慈云寺住邦2000商务中心1号楼西区四层乐友前台</div>
            </div>
    </div>-->

    <div class="addressBox public" v-if="cancelData.refund_address">
      <img class="addressimg" style="margin-right:24rpx" src="../images/location.png" />
      <span style="width:650rpx;">{{cancelData.refund_address}}</span>
    </div>

    <!-- 尽快联系 -->
    <div class="deliverBox public" @click="gotodelwuliu()">
      <img class="headerimg" style="margin-right:24rpx;" src="../images/return.png" />
      <div class="public deliverinfo">
        <span class="deliverinfoTxt">{{logisticsInfo.track_description}}</span>
        <span class="deliverTime">{{logisticsInfo.update_time}}</span>
      </div>
      <img class="deliverTriangle" src="/static/goodsdetail/lecard_arrow_right.png" alt />
    </div>

    <!-- 订单内容 -->
    <div class="cancelBox">
      <div class="cancelInfo">
        <span class="font26">原订单编号：</span>
        <span class="font26 color">{{cancelData.order_id}}</span>
      </div>
      <div class="cancelInfo">
        <span class="font26">退款金额：</span>
        <span class="font26 color">{{cancelData.refund_price}}</span>
      </div>
      <div class="cancelInfo">
        <span class="font26">退货类型：</span>
        <span class="font26 color">{{cancelData.refund_type_description}}</span>
      </div>
      <div class="cancelInfo">
        <span class="font26">退货原因：</span>
        <span class="font26 color">{{cancelData.refund_reason_description}}</span>
      </div>
      <!-- <div class="cancelInfo">
        <span class="font26">运费：</span>
        <span class="font26 color">顾客承担运费</span>
      </div>-->
      <div class="cancelInfo" v-if="cancelData.goods_returned_note.express_company">
        <span class="font26">退货物流：</span>
        <span
          class="font26 color"
        >{{cancelData.goods_returned_note.express_company}}({{cancelData.goods_returned_note.express_number}})</span>
      </div>
      <div class="cancelAddress" v-if="cancelData.refund_address">
        <span class="font26 cancelTex">退货地址：</span>
        <span class="font26 cancelARR">{{cancelData.refund_address}}</span>
      </div>
      <div class="cancelInfo">
        <span class="font26">申请时间：</span>
        <span class="font26 color">{{cancelData.create_time}}</span>
      </div>
      <div class="cancelInfo">
        <span class="font26">服务单号：</span>
        <span class="font26 color">{{cancelData.refund_id}}</span>
      </div>
      <div
        class="bottomCancelImg"
        v-if="cancelData.refund_application_images && cancelData.refund_application_images.length"
      >
        <img
          class="cancelImg"
          mode="aspectFill"
          v-for="(items, index) in cancelData.refund_application_images"
          :src="items.url"
          :key="index"
        />
      </div>
    </div>

    <div class="canceAndadd" v-if="cancelData.operation && cancelData.operation.length">
      <div v-for="(op_item, op_index) in cancelData.operation" :key="op_index">
        <span
          v-if="op_item == '03'"
          class="dellist gray_bg"
          @click="removerOrder(cancelData.refund_id)"
        >撤销申请</span>
        <span
          v-else-if="op_item == '02'"
          class="dellist write"
          @click="funcRefundLogistics(cancelData)"
        >填写快递信息</span>
      </div>
    </div>

    <!-- v-if='cancelData.application_status==1 || cancelData.application_status==6'  -->
    <!-- <div class="canceAndadd" >
            <span class="dellist" @click='removerOrder(cancelData.refund_id)'>撤销申请</span>
            <span class="dellist write">填写快递信息</span>
    </div>-->
  </div>
</template>
<script>
import { getcancelDetailed, getRemoveCancel } from "@/api";
export default {
  data() {
    return {
      is_show_data: false,
      cancelData: {}, //退款数据内容
      logisticsInfo: {} //物流信息
    };
  },
  onLoad(options) {
    this.sa_page(this, false, "退货详情", "");
    this.is_show_data = false;
    this.cancelData = {};
    this.logisticsInfo = {};
    console.log(options.refund_id);
    this.fungetDetailed(parseInt(options.refund_id));
  },
  methods: {
    fungetDetailed(refund_id) {
      //获取详情列表
      getcancelDetailed({ refund_id: refund_id }).then(res => {
        this.is_show_data = true;
        console.log(res);
        this.logisticsInfo = res.goods_returned_track[0];
        this.cancelData = res;
      });
    },
    removerOrder(refund_id) {
      // 撤销申请
      console.log(refund_id);
      let that = this;
      wx.showModal({
        title: "提示",
        content: "您确定要撤销申请？",
        success(res) {
          if (res.confirm) {
            getRemoveCancel({ refund_id: refund_id }).then(res => {
              wx.showToast({ title: "撤销成功", mask: true });
              //   that.fungetRefundtion();
              wx.navigateBack({
                delta: 1
              });
            });
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    funcRefundLogistics(item) {
      console.log(item);
      this.$store.commit("serviceLogisticsMutations", item);
      wx.navigateTo({ url: "/pages/userCenter/returnGoodsLogistics/main" });
    },
    gotodelwuliu() {
      //到物流页
      console.log(this.cancelData.goods_returned_track);
      wx.setStorageSync("goodsLocation", this.cancelData.goods_returned_track);
      wx.navigateTo({ url: "/pages/userCenter/logisticMsg/main?return=1" });
    }
  }
};
</script>
<style scoped>
/* 顶部 */
.canceltop {
  background: #ff5000;
  min-height: 164rpx;
  text-align: center;
  width: 750rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 20rpx;
  box-sizing: border-box;
}
.news {
  /* width: 552rpx; */
  padding: 0 20rpx;
  margin-top: 19rpx;
}
.font34 {
  font-size: 34rpx;
  color: #ffffff;
  display: block;
  margin-top: 27rpx;
}
.font24 {
  font-size: 24rpx;
  color: #ffffff;
}
.font26 {
  font-size: 26px;
  color: #333333;
}
.color {
  color: #2a2a2a;
}
.cancel {
  font-family: PingFangSC-Regular;
  font-size: 26px;
  color: #333333;
  background: #f3f5f7;
  min-height: 1500rpx;
}

/* 收货地址 */
.headerimg {
  height: 48rpx;
  width: 48rpx;
  margin-right: 36rpx;
  margin-left: 20rpx;
  vertical-align: middle;
}
.public {
  display: flex;
  align-items: center;
}

/* 地址信息 */
.addressBox {
  /* height: 88rpx; */
  padding: 30rpx 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  border-bottom: 2rpx solid #eeeeee;
}
.addressimg {
  width: 46rpx;
  height: 46rpx;
  margin-left: 20rpx;
}
.addressBox .usreInfo {
  margin-top: 10rpx;
  margin-bottom: 20rpx;
}
.addressBox .arrdessinfo {
  width: 630rpx;
  color: #666666;
  line-height: 36px;
}

/* 尽快联系 */
.deliverBox {
  background: #ffffff;
  height: 172rpx;
  border-bottom: 1rpx solid #f3f5f7;
}
.deliverBox .deliverinfo {
  flex-direction: column;
  align-items: flex-start;
  width: 560rpx;
}
.deliverBox .deliverinfo .deliverinfoTxt {
  color: #333333;
  line-height: 36px;
}
.deliverBox .deliverinfo .deliverTime {
  color: #999999;
  margin-top: 20rpx;
}
.deliverTriangle {
  margin-left: 58rpx;
  height: 22rpx;
  width: 12rpx;
}

/* 退货详情 */
.cancelBox {
  margin: 20rpx 0rpx;
}
.cancelInfo {
  min-height: 88rpx;
  line-height: 88rpx;
  width: 710rpx;
  padding: 0rpx 20rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #f3f5f7;
}
.cancelAddress {
  display: flex;
  padding: 20rpx 20rpx;
  background: #ffffff;
}
.cancelTex {
  width: 130rpx;
}
.cancelARR {
  width: 567rpx;
}
.bottomCancelImg {
  padding: 20rpx 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  /* align-items: center; */
  /* justify-content:space-around; */
  background: #ffffff;
}
.bottomCancelImg .cancelImg {
  height: 160rpx;
  width: 160rpx;
  margin-right: 20rpx;

  border: 2rpx solid #f3f5f7;
}

/* 最下面 */
/* .canceAndadd{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 28rpx;
    background: #FFFFFF;
    box-shadow: 0 -1px 0 0 #DDDDDD;
    height: 98rpx;
    width: 750rpx;
    /* position: fixed; */
/* } */

/*
.dellist{
    border: 1px solid #FF5000;
    border-radius: 30px;
    height: 52rpx;
    line-height: 52rpx;
    width: 140rpx;
    text-align: center;
    color: #FF5000;
    margin-right: 20rpx;
}
.write {
    width: 200rpx;
} */

.cancelmoney {
  /* width: 710rpx; */
  text-align: right;
  /* margin-top: 24rpx; */
}
.canceAndadd {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* margin-top: 18rpx; */
  /* padding-bottom: 20rpx; */
  bottom: 0;
  height: 98rpx;
  padding-right: 20rpx;
  position: fixed;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
}

.dellist {
  border: 1px solid #ff5000;
  border-radius: 30px;
  height: 52rpx;
  line-height: 52rpx;
  width: 140rpx;
  text-align: center;
  color: #ff5000;
  margin-left: 20rpx;
  font-size: 26rpx;
  padding: 8rpx 18rpx;
}
.write {
  width: 168rpx;
}

.behind {
  font-family: PingFangSC-Regular;
  font-size: 26px;
  color: #333333;
  background: #f3f5f7;
}

.gray_bg {
  border: 1px solid rgba(102, 102, 102, 0.66);
  /* opacity: 0.66; */
  color: #333;
}
</style>
