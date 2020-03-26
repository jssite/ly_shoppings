<template>
    <div class="item_product">
        <div class="item_product_img">
            <img class="images" :src="mainData.image" @click="goToGoods(mainData.sku)">
        </div>
        <h1 class="item_product_title">{{mainData.prod_title}}</h1>
        <div class="item_product_price">
      <span class="item_product_price_sale">
          <moneySpan :money="mainData.sale_price" :iSize="34" :fSize="26"></moneySpan>
        <!--<span class="item_product_price_sign">￥</span>-->
        <!--<span>{{mainData.sale_price}}</span>-->
      </span>
            <span class="item_product_tags" v-for="item in mainData.promotion_tag" :key="index">{{item}}</span>
    </div>
    </div>
</template>
<script>
    import moneySpan from '@/components/public/money.vue';


    export default {
        components:{
            moneySpan
        },
        props: {
            mainData: '',
        },
        onLoad(){
            console.log(this.mainData)
        },
        methods: {
            goToGoods(data){
                wx.navigateTo({
                    url:`/pages/goodsdetailed/main?sku=`+data
                });
            },
            productClick(data) {
                wx.navigateTo({
                    url:`/pages/shop/likeShop/main?sku=`+data
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
        width:363rpx;
        height:363rpx;

    }
    .item_product {
        width: 363px;
        margin-bottom: 8px;
        padding-bottom: 13px;
        background: #fff;
        border-radius: 16px;
        margin-left: 8px;
    }
    .item_product_img {
        width: 363px;
        height: 363px;
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
        /* justify-content: space-between; */
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
        height: 48px;
        padding: 0 20rpx;
        /* margin-right: 16px; */
        margin-left: 15px;
        border-radius: 24px;
        box-sizing: border-box;
        color: #fff;
        font-size: 22px;
        background: #ff5000;
        line-height: 45px;
        text-align: center;
        border: 1px solid #dddddd;
    }
</style>
