<template>
    <div class="template_21">
        <div class="template_wrap">
            <div class="template_li"
            v-for="(item,index) in vdata.product_content_list"
            :key="index"
            @click="funcGoToProduct(item)">
                <div class="template_li_item">
                    <img :src="item.url" class="template_li_img">
                </div>
                <div class="template_li_title">{{item.name}}</div>
                <div class="template_li_price">￥{{item.price}}</div>
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
.template_21 .template_wrap {
    display: flex;
}
.template_21 .template_li {
    width: 173px;
    margin-right: 6px;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
}
.template_21 .template_li:last-child{
    margin-right: 0;
}
.template_21 .template_li_img {
    width: 100%;
    height: 173px;
    display: block;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}
.template_21 .template_li_title {
    padding: 8px 10px 8px;
    font-size: 22px;
    color: #333333;
    line-height: 26px;
}
.template_21 .template_li_price {
    padding: 0 0 10px 10px;
    font-size: 24px;
    line-height: 30px;
    color: #FF3C3C;
}
</style>