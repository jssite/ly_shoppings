<template>
  <div class="product">
    <div class="icon_bg">
      <img class="product_icon" :src="pro_info.image">
      <span class="icon_desc" v-if="pro_info.stock == 0">缺货</span>
    </div>
    <!-- <div class="product_stock" v-if="pro_info.product_type == 1">赠品</div> -->
    <!-- </img> -->
    <div class="product_content">
      <div class="product_name">{{pro_info.marketing_title}}</div>
      <div class="product_style" v-if="pro_style">{{pro_style}}</div>
      <div class="product_bottom">
        <div class="productPrice" style="font-size:24rpx" v-if="pro_info.product_type == 1">赠品</div>
        <div class="productPrice" v-else-if="pro_info.sale_price">¥{{pro_info.sale_price}}</div>
        <span v-else></span>
        <!-- <div class="productPriBg"> -->
        <!-- <icon v-if="is_le_vip" class="productVipIcon"></icon> -->
        <div class="productCount">剩余{{pro_info.stock}}件</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pro_info: {
      type: Object,
      default: {}
    }
  },

  computed: {
    pro_style() {
      let style = "";
      if (this.pro_info.specifications) {
        style = "款式：" + this.pro_info.specifications + " ";
      }
      if (this.pro_info.color) {
        style = "颜色：" + this.pro_info.color;
      }
      return style;
    }
  },

  data() {
    return {
      is_stock: false,
      is_le_vip: false
    };
  }
};
</script>

<style scoped>
.product {
  height: 160rpx;
  /* width: 100%; */
  padding: 20rpx;
  display: flex;
  background: #fafafa;
  align-items: center;
  box-sizing: border-box;
}

.product_icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 120rpx;
  height: 120rpx;
}

.icon_bg {
  position: relative;
  width: 120rpx;
  height: 120rpx;
}

.icon_desc {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 28rpx;
  background: #000;
  color: #fff;
  font-size: 22rpx;
  line-height: 28rpx;
  width: 100%;
  text-align: center;
  opacity: 0.5;
}

.product_stock {
  width: 100%;
  text-align: center;
  height: 28rpx;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  line-height: 28rpx;
  position: absolute;
  bottom: 0;
  left: 0;
}

.product_content {
  margin-left: 20rpx;
  width: 450rpx;
  /* flex: 1; */
  /* width: 570rpx; */
  /* height: 120rpx; */
}

.product_name {
  font-size: 26rpx;
  color: #333;
  line-height: 30rpx;
  width: 100%;
  height: 30rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.product_style {
  margin-top: 18rpx;
  color: #999;
  line-height: 24rpx;
  font-size: 24rpx;
}
.product_bottom {
  margin-top: 20rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 25rpx;
}

.productPriBg {
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
}
.productPrice {
  color: #ff5000;
  font-size: 30rpx;
}
.productVipIcon {
  width: 40rpx;
  height: 24rpx;
  margin-left: 8rpx;
  background: #000;
}
.productCount {
  color: #333;
  font-size: 24rpx;
}

</style>