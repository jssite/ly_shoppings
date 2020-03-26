<template>
  <div class="item_product" @click="productClick(0)">
    <div class="item_product_img">
      <img :src="BASE_IMG_URL" style="width:372rpx;height:372rpx">
    </div>
    <h1 class="item_product_title">{{type.marketing_title}}</h1>
    <div class="item_product_price">
      <span class="item_product_price_sale">
        <span class="item_product_price_sign">￥</span>
        <span>{{type.sale_price}}</span>
      </span>
      <span class="item_product_tags" @click.stop="productClick(1)">找相似</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  computed: {
    BASE_IMG_URL() {
      return (
        this.$store.state.BASE_APP_INFO["download_le_image"] +
        this.type.le_image
      );
    }
  },
  props: {
    type: Object,
    products: {
      type: Object,
      default: []
    }
  },

  methods: {
      
    productClick(index) {

      if (index == 0) {
         wx.navigateTo({
              url:`/pages/goodsdetailed/main?sku=`+this.type.sku
          });
      } else {
        wx.navigateTo({
              url:`/pages/shop/likeShop/main?data=`+JSON.stringify(this.type)
          });
      }
    }
  }
};
</script>

<style scoped>
.item_product {
  width: 372px;
  margin-bottom: 6px;
  padding-bottom: 13px;
  background: #fff;
  border-radius: 30px;
}
.item_product_img {
  width: 372px;
  height: 372px;
  overflow: hidden;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
}
.item_product_title {
  height: 64px;
  padding: 10px 16px 11px;
  font-size: 26px;
  color: #333333;
  line-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item_product_footer_number {
  font-size: 20px;
  color: #999999;
  line-height: 24px;
}
.item_product_price {
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