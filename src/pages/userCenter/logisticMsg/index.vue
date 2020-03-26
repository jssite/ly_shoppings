<template>
  <div>
    <!-- 有物流信息 -->
    <div v-if="ship_id">
      <template v-if="goodsLocation.ship_id">
        <div class="top space">
          <p class="top_txet">运单号：{{goodsLocation.ship_id}}</p>
          <p class="top_txet">快递公司：{{goodsLocation.deliver_staff_name}}</p>
        </div>
        <div class="list-content">
          <div class="list-box" v-for="(item,index) in goodsLocation.expresstraces" :key="index">
            <span class="dot"></span>
            <div class="list-text">
              <p class="list-msg">{{item.ope_remark}}</p>
              <p class="list-time">{{item.ope_time}}</p>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="Notinfo">
          <img class="Notinfo_img" src="../image/cart.png" alt>
          <span class="Notinfo_txt">您的快递正向你飞奔驶来，请耐心等待</span>
        </div>
      </template>
    </div>

    <!-- 没有物流信息 -->
    <div v-if="shipNot">
      <div class="list-content">
        <div class="list-box" v-for="(item,index) in goodsLocation.express_info" :key="index">
          <span class="dot"></span>
          <div class="list-text">
            <p class="list-msg">{{(item.desc || item.ope_remark) || item.track_description}}</p>
            <p class="list-time">{{(item.time || item.ope_time) || item.update_time}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户中心过来的地址 -->
    <div v-if="usercenterShow">
      <template v-if="usercenterList.express_traces.length>0">
        <div class="top" v-if="usercenterList.ship_id">
          <p v-if="usercenterList.ship_id" class="top_txet">运单号：{{usercenterList.ship_id}}</p>
          <p
            v-if="usercenterList.express_company_name"
            class="top_txet"
          >快递公司：{{usercenterList.express_company_name}}</p>
        </div>
        <div class="list-content">
          <div class="list-box" v-for="(item,index) in usercenterList.express_traces" :key="index">
            <span class="dot"></span>
            <div class="list-text">
              <p class="list-msg">{{item.ope_remark}}</p>
              <p class="list-time">{{item.ope_time}}</p>
            </div>
          </div>
        </div>
      </template>
      <template v-if="usercenterList.express_traces.length==0">
        <div class="Notinfo">
          <img class="Notinfo_img" src="../image/cart.png" alt>
          <span class="Notinfo_txt">您的快递正向你飞奔驶来，请耐心等待</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ship_id: false, //有物流信息的
      shipNot: false, //没有物流信息的
      usercenterShow: false, //用过中心过来的物流信息
      usercenterList: {}, //用户中心过来的数据
      goodsLocation: {
        express_info: []
      }
    };
  },
  onLoad(options) {
    this.sa_page(this,false,'订单追踪','');
    (this.ship_id = false), //有物流信息的
      (this.shipNot = false), //没有物流信息的
      (this.usercenterShow = false), //用过中心过来的物流信息
      (this.usercenterList = {}), //用户中心过来的数据
      (this.goodsLocation.express_info = []);

    let goodsLocation = wx.getStorageSync("goodsLocation"); //从详情订单进入
    let usercenterLocation = wx.getStorageSync("usercenterLocation"); //用户中心过来的物流信息

    console.log("我是从物流中心，进入", usercenterLocation);
    console.log(goodsLocation, "我是从详情订单进入");

    if (usercenterLocation && options.usercenter) {
      wx.setNavigationBarTitle({
        title: "订单跟踪"
      });
      this.usercenterList = usercenterLocation;
      this.usercenterShow = true;
      wx.removeStorageSync("usercenterLocation");
    } else {
      if (goodsLocation.ship_id) {
        wx.setNavigationBarTitle({
          title: "订单跟踪"
        });
        //有物流编号
        this.ship_id = true;
        this.goodsLocation = goodsLocation;
      } else if (goodsLocation.expresstraces) {
        wx.setNavigationBarTitle({
          title: "订单跟踪"
        });
        //没有物流编号
        this.shipNot = true;
        this.goodsLocation.express_info = goodsLocation.expresstraces;
      } else if (goodsLocation.express_info) {
        wx.setNavigationBarTitle({
          title: "订单跟踪"
        });
        //没有物流编号
        this.goodsLocation = goodsLocation;
        this.shipNot = true;
      } else {
        if (options.return == "1") {
          wx.setNavigationBarTitle({
            title: "退货跟踪"
          });
          this.shipNot = true;
          this.goodsLocation.express_info = goodsLocation;
        } else {
          wx.setNavigationBarTitle({
            title: "订单跟踪"
          });
        }
      }
    }
  },
  onHide() {
    console.log(1);
    // wx.removeStorageSync('usercenterLocation');
  },
  onUnload() {
    console.log(2);
    // wx.removeStorageSync('usercenterLocation');
  }
};
</script>

<style scoped>
/* 站务数据 */
.Notinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.Notinfo_img {
  margin-top: 370rpx;
  width: 260rpx;
  height: 125rpx;
}
.Notinfo_txt {
  font-family: PingFangSC-Regular;
  font-size: 30rpx;
  color: #372832;
  margin-top: 65rpx;
}
.top {
  height: 132rpx;
  background: #fff;
  margin-bottom: 20rpx;
}
.top.space{
    margin-bottom: 0;
    border-bottom: 20px solid #f3f6f7;
}
.dot {
  height: 12rpx;
  width: 12rpx;
  background: #eee;
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  left: -9rpx;
  top: 20rpx;
}
.list-box:first-child .dot {
  border: 7rpx solid #ffdccc;
  height: 22rpx;
  left: -19rpx;
  width: 22rpx;
  top: 10rpx;
  background: #ff5000;
}
.list-content {
  background: #fff;
  padding: 20rpx 0;
  padding-right: 20rpx;
}
.list-msg {
  padding-top: 20rpx;
  font-size: 26px;
  color: #333333;
}
.list-text {
  border-bottom: 1px solid #eee;
}
.list-time {
  font-size: 22rpx;
  color: #999;
  padding: 20rpx 0;
}
.list-box {
  position: relative;
  margin-left: 36rpx;
  padding-left: 60rpx;
  border-left: 4px solid #eee;
}
.top_txet {
  font-size: 26rpx;
  line-height: 66rpx;
  padding-left: 20rpx;
}
</style>
