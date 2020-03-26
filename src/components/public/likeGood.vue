<template>
  <div class="item_product" >
    <div class="item_product_img">
      <img class="images" :src="mainData.url?mainData.url:mainData.image" @click="goToGoods(mainData.sku)">
    </div>
    <h1 class="item_product_title">{{mainData.name}}</h1>
    <div class="item_product_price">
      <span class="item_product_price_sale">
        <!--<span class="item_product_price_sign">￥</span>-->
        <!--<span>{{mainData.price}}</span>-->
        <moneySpan :money="mainData.price" :iSize="34" :fSize="26"></moneySpan>
      </span>
      <span class="item_product_tags" @click.stop="productClick(mainData)">找相似</span>
    </div>
  </div>
</template>
<script>
    import moneySpan from '@/components/public/money.vue'


export default {

	  props: {
	    mainData: '',
	  },
    components:{
        moneySpan
    },
	onLoad(){
            // console.log(this.mainData)
       },
  methods: {
      goToGoods(data){
          wx.navigateTo({
              url:`/pages/goodsdetailed/main?sku=`+data
          });
      },
      productClick(data) {
          // var a =JSON.stringify(data)
          // console.log(a)
          wx.navigateTo({
              url:`/pages/shop/likeShop/main?data=`+JSON.stringify(data)
          });
  //      let sender = {
  //          key:index,
  //          value:this.type,
  //      }
  //    this.$emit("productViewClick", sender);
      }
  }
};
</script>

<style scoped>
.images{
    width:366rpx;
    height:366rpx;
}
.item_product {
  width: 366px;
  margin-bottom: 6px;
  padding-bottom: 13px;
  background: #fff;
  border-radius: 16px;
}
.item_product:nth-child(2n){
    margin-right: 6px;
}
.item_product:nth-child(2n+1){
    margin-left: 6px;
}
.item_product_img {
  width: 366px;
  height: 366px;
  overflow: hidden;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.item_product_title {
  height: 55px;
  padding: 10px 16px 11px;
  font-size: 26px;
  color: #333333;
  line-height: 32px;
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
