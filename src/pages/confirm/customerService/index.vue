<template>
  <div class="behind">
    <template v-if="cancelList.length>0">
      <!-- <div class="public behindTop">
                <span class="font22">遇到问题，联系客服MM解决</span>
                <span class="font26 custom">联系客服</span>
      </div>-->
      <div class="content" v-for="(item,index) in cancelList" :key="index">
        <div class="public contentNum">
          <div>
            <span class="font26">服务单号：</span>
            <span class="font26">{{item.refund_id}}</span>
          </div>
          <!-- application_status -->
          <span class="font26 colorFF">{{item.application_status_description}}</span>
        </div>
        <!-- 商品内容 -->
        <div
          class="public Boughtgoods"
          @click.stop="cancelgoodsDel(item.refund_id)"
          v-for="(msg,ind) in item.products"
          :key="ind"
        >
          <span>
            <img class="goodsImg" :src="msg.url">
          </span>
          <div class="goodsInfo">
            <span class="goodsName">{{msg.prod_title}}</span>
            <div class="priceNum">
              <!-- <span class="goodsSize">颜色：粉色  尺码：90</span> -->
              <span class="goodsSize"></span>
              <span>x{{msg.quantity}}</span>
            </div>
          </div>
        </div>
        <!-- 退款金额 -->
        <div class="cancelmoney">
          <div style="padding-bottom:18rpx">
            <span class="font22">退款金额：</span>
            <span class="font30">{{item.refund_price}}</span>
          </div>
          <!-- 1,待审核 6审核不通过 -->
          <!-- <div class="canceAndadd" v-if='item.application_status==1'> -->
          <div class="canceAndadd">
            <div v-for="(op_item, op_index) in item.operation" :key="op_index">
              <span
                v-if="op_item == '03'"
                class="dellist"
                @click="removerOrder(item.refund_id)"
              >撤销申请</span>
              <span
                v-else-if="op_item == '02'"
                class="dellist write"
                @click="funcRefundLogistics(item)"
              >填写快递信息</span>
            </div>
          </div>
        </div>
      </div>
      <div class="weui-loadmore">
        <div v-if="!bottom" class="weui-loading"></div>
        <div class="weui-loadmore__tips">{{bottom?"已经全部加载完毕":"正在加载..."}}</div>
      </div>
    </template>
    <template v-if="is_no_data">
      <div>
        <div class="placeholder">
          <img src="/static/images/public/public_empty_pic.png" alt>
          <text>您没有申请过退货</text>
          <navigator class="nav" url="/pages/index/main" open-type="switchTab">去逛逛</navigator>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { getRefundtion, getRemoveCancel } from "@/api";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      bottom: false,
      page_index: 0, //页数
      page_size: 10, //数量
      cancelList: [], //退货列表
      is_no_data: false
    };
  },
  onLoad() {
    this.sa_page(this,false,'售后申请','');
    this.page_index = 0;
    console.log(1233);
    this.fungetRefundtion();
  },
  methods: {
    funcRefundLogistics(item) {
      this.$store.commit("serviceLogisticsMutations", item);
      wx.navigateTo({ url: "/pages/userCenter/returnGoodsLogistics/main" });
    },
    fungetRefundtion() {
      let params = {
        page_index: this.page_index,
        page_size: this.page_size
      };
      getRefundtion(params).then(res => {
        if (res.is_end) {
          this.bottom = true;
        }
        if (this.page_index == 0) {
          this.cancelList = [];
        }
        this.cancelList.map(item => {
          let operation_list = [];
          if (item.operation) {
            item.operation.map(iitems => {
              if (iitems != "01") {
                operation_list.push(iitems);
              }
            });
          }
          item.operation = operation_list;
        });
        this.cancelList = this.cancelList.concat(res.refund_application_info);
        this.page_index += 1;
        if (!this.cancelList.length) {
          this.is_no_data = true;
        }
      });
    },
    cancelgoodsDel(refund_id) {
      //退货商品详情
      wx.navigateTo({
        url: "/pages/confirm/cancelgoods/main?refund_id=" + refund_id
      });
    },
    removerOrder(refund_id) {
      // 撤销申请
      let that = this;
      wx.showModal({
        title: "提示",
        content: "您确定要撤销申请？",
        success(res) {
          if (res.confirm) {
            getRemoveCancel({ refund_id: refund_id }).then(res => {
              wx.showToast({ title: "撤销成功", mask: true });
              that.fungetRefundtion();
            });
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  },
  onPullDownRefresh() {
    console.log(123);
  },
  onReachBottom() {
    if (this.cancelList.is_end) {
      //加载完毕
      this.bottom = true;
    } else {
      this.fungetRefundtion();
    }
    console.log(123465);
  }
};
</script>
<style scoped>
.behind {
  min-height: 100vh;
  padding-top: 20px;
  box-sizing: border-box;
}
/* 公共 */
.public {
  display: flex;
  align-items: center;
}
.font22 {
  font-size: 22rpx;
  color: #333333;
}
.font26 {
  font-size: 26px;
  color: #333333;
}
.font30 {
  font-size: 30px;
  color: #333333;
}
.colorFF {
  color: #ff5000;
}
/* 顶部 */
.behindTop {
  height: 68rpx;
  padding: 0 20rpx;
  width: 710rpx;
  justify-content: space-between;
  background: #ffffff;
}
.custom {
  height: 48rpx;
  width: 140rpx;
  background: #ff5000;
  border-radius: 40rpx;
  color: #ffffff;
  text-align: center;
  line-height: 48rpx;
}
/* 内容 */
.behind .content {
  /* height: 400rpx; */
  padding: 20rpx 20rpx 0rpx 20rpx;
  /* width: 710rpx; */
  background: #ffffff;
  border-radius: 16px;
  margin: 0 20px 20px;
}
.contentNum {
  justify-content: space-between;
  margin-left: 20rpx;
}
.Boughtgoods .goodsImg {
  width: 120rpx;
  height: 120rpx;
  margin: 20rpx;
}
.goodsInfo {
  flex-direction: column;
  display: flex;
  margin-left: 20rpx;
}
.Boughtgoods {
  margin-top: 28rpx;
  align-items: flex-start;
}
.Boughtgoods .goodsName {
  width: 490rpx;
}
.goodsSize {
  font-size: 22px;
  color: #999999;
  margin-top: 8rpx;
}
.priceNum {
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 490rpx;
}
/* 退款金额 */
.cancelmoney {
  /* width: 710rpx; */
  text-align: right;
  /* margin-top: 24rpx; */
}
.canceAndadd {
  display: flex;
  justify-content: flex-end;
  margin-top: 18rpx;
  padding-bottom: 20rpx;
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
  height: 100%;
}
.placeholder {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.placeholder image {
  width: 250rpx;
  height: 210rpx;
  margin-top: 240rpx;
}
.placeholder text {
  font-family: PingFangSC-Regular;
  font-size: 26px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
  margin: 40rpx 0rpx 60rpx 0rpx;
}
.nav {
  background: #ff5000;
  border: 1px solid #ff5000;
  border-radius: 40px;
  height: 72rpx;
  width: 240rpx;
  line-height: 72rpx;
  font-size: 30px;
  color: #ffffff;
  text-align: center;
}
</style>
