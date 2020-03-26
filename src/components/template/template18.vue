<template>
    <div class="template_18">
        <div class="template_wrap">
            <div class="template_ul"
            v-for="(item,index) in vdata.product_content_list"
                :key="index"
                @click="funcGoToProduct(item)">>
                <div class="template_li">
                    <div class="template_li_item">
                        <img :src="item.url" class="template_li_img">
                    </div>
                    <div class="template_li_title">{{item.name}}</div>
                    <div class="template_li_price">{{item.price}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    props: {
        vdata:{
            type: Object,
            default: {}
        }
    },
    methods: {
        funcGoToProduct(item){
             wx.navigateTo({url:'/pages/goodsdetailed/main?sku='+item.sku})
        }
    }
}
</script>

<style scoped>
.template_18 .template_wrap {
    display: flex;
    flex-wrap: wrap;
}
.template_18 .template_ul{
    width: 50%;
    padding-top: 8px;
    box-sizing: border-box;
}
.template_18 .template_ul.even{
    background: #ffffff;
    border-radius: 16px;
}
.template_18 .template_ul:nth-child(2n){
    padding-left: 6px;
}
.template_18 .template_ul:nth-child(2n+1){
    padding-right: 6px;
}
.template_18 .template_li {
    background: #ffffff;
    border-radius: 16px;
}
.template_18 .template_li_img {
    width: 100%;
    height: 349px;
    display: block;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}
.template_18 .template_li_title {
    padding: 12px 20px 16px;
    font-size: 26px;
    color: #333333;
    line-height: 30px;
    height: 30px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.template_18 .template_li_price {
    padding: 0 0 20px 20px;
    font-size: 30px;
    color: #FF3C3C;
    font-weight: 700;
}
</style>