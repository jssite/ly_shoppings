<template>
  <div style="background:#f2f3f5;min-height:1500rpx;width:100%">
    <div class="top_remind">
      <img class="top_remind_icon" src alt>
      <div class="top_remind_main_title">亲爱的小乐粉，以下商品暂时无法结算</div>
      <div class="top_remind_sub_title">您可以试试减少购买数量，或者先结算其他商品</div>
    </div>
    <div style="padding-bottom:136rpx">
    <div class="pro_bg" v-for="(item , index) in pro_list" :key="index">
      <img class="pro_icon" src alt>
      <div class="pro_right">
        <div class="pro_name">
          <span class="pro_name_remind">缺货</span>
          歌瑞家内衣A 类女童混色花纱印花圆领长袖T恤衫圆领长袖T恤衫
        </div>

        <div class="pro_style_price_bg">
          <span>颜色：粉色 尺码：90</span>
          <span>✖️1</span>
        </div>
        <div class="pro_stock_remind" v-if="is_show_stock">限购10件</div>
      </div>
    </div>
    </div>

    <div class="button_bg">
      <button class="submit_giftcard">返回购物车</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      is_show_stock: false,
      pro_list: [1, 1, 1, 1, 1, 1, 1, 1, 1]
    };
  },

  computed: {
    BASE_IMG_URL() {
      return this.$store.state.BASE_APP_INFO["download_le_image"];
    }
  },
  created() {
    //this.funcQuery()
  },

  onLoad() {},

  methods: {}
};
</script>

<style scoped>
.top_bg_view {
  background: #fff;
  height: 80rpx;
  width: 100%;
  display: flex;
  align-items: center;
}

.top_remind {
  display: flex;
  align-items : center;
  flex-direction: column;
  margin-top: 40rpx;
  margin-left: 20rpx;
  width: 750rpx;
  height: 259rpx;
}

.top_remind_icon {
  width: 80rpx;
  height: 80rpx;
  margin-top: 12rpx;
  background: #ff5000;
}

.top_remind_main_title {
  margin-top: 24rpx;
  height: 42rpx;
  line-height: 42rpx;
  color: #000;
  font-size: 30rpx;
}

.top_remind_sub_title {
  margin-top: 8rpx;
  height: 33rpx;
  line-height: 33rpx;
  color: #999;
  font-size: 24rpx;
}

.pro_bg {
  display: flex;
  padding: 20rpx;
  /* height: 100rpx; */
  /* align-items: center; */
}

.pro_icon {
  width: 120rpx;
  height: 120rpx;
  background: #ff5000;
}

.pro_right {
  margin-left: 12rpx;
  font-size: 30rpx;
  color: #333;
}

.pro_name {
  font-size: 24rpx;
  color: #333;
  width: 578rpx;
  height: 60rpx;
}

.pro_name_remind {
  background: #666;
  color: #fff;
  font-size: 20rpx;
}

.pro_style_price_bg {
  display: flex;
  justify-content: space-between;
  font-size: 20rpx;
  color: #999;
  margin-top: 20rpx;
  height: 24rpx;
  align-items: center;
}

.pro_stock_remind {
  font-size: 20rpx;
  color: #ff5000;
  margin-top: 20rpx;
  height: 24rpx;
}

.button_bg {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  height: 136rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  background: #fff;
  /* background: rebeccapurple; */
}

.submit_giftcard {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff5000;
  border-radius: 50rpx;
  height: 80rpx;
  box-sizing: border-box;
  background: #fff;
  width: 400rpx;
  /* margin-top: 60rpx; */
  /* margin-left: 40rpx; */
  font-size: 30rpx;
  border: 1px solid #ff5222;
}

</style>