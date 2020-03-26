<template>
    <div class="template_20">
        <div class="template_wrap">
            <scroll-view scroll-x="true" class="scroll_wrap">
                <div class="template_ul" :style="{width:itemWidth + 'rpx'}">
                    <div class="template_li"
                    v-for="(item,index) in product_content_list"
                    :key="index"
                    @click="funcGoToProduct(item)">
                        <div class="template_li_item">
                            <img :src="item.url" class="template_li_img">
                        </div>
                        <div class="template_li_title">{{item.name}}</div>
                        <div class="template_li_price">￥{{item.price}}</div>
                    </div>
                    <template v-if="vdata.href_more">
                        <div class="template_more" @click="funcGoToH5">
                            <span class="template_more_txt">查看更多</span>
                            <span>
                                <img class="template_more_img" src="../../../static/images/index_goods_more.png">
                            </span>
                        </div> 
                    </template>
                </div>
            </scroll-view>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    computed: {
        itemWidth(){
            return this.vdata.product_content_list.length * 192 + 100
        },
        product_content_list(){
            let arr = [];
            this.vdata.product_content_list.forEach((item,index) => {
                let splice = item.price.split('.');
                if( splice.length == 1 ){
                    splice.push('00')
                }
                if(splice.length == 2 ){
                    if(splice[1].length ==1){
                        splice[1] = splice[1] + '0'
                    }
                }
                item.price = splice.join('.')
                arr.push(item)
            })
            return arr;
        }
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
        },
        funcGoToH5(){
            let link = this.vdata.href_more;
            if( link != ''){
                wx.setStorageSync('urlH5',link);
                wx.navigateTo({
                    url:'/pages/transferH5/main'
                })
            }
        }
    }
}
</script>

<style scoped>
.template_20 .template_wrap {
    height: 314px;
    padding: 20px 0 0 20px;
    box-sizing: border-box;
    overflow: hidden;
    background: #ffffff;
    /* border-radius: 16px; */
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
}
.template_20 .scroll_wrap {
    width: 100%;
    height: 330px;
}
.template_20 .template_li {
    width: 180px;
    float: left;
    margin-right: 12px;
}
.template_20 .template_li_img {
    width: 100%;
    height: 180px;
    display: block;
}
.template_20 .template_li_title {
    margin: 9px 10px 11px;
    font-size: 22px;
    color: #333333;
    line-height: 26px;
    height: 52px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.template_20 .template_li_price {
    padding: 0 0 10px 10px;
    font-size: 24px;
    color: #FF3C3C;
}
.template_20 .template_more {
    width: 100px;
    padding: 68px 40px 0;
    box-sizing: border-box;
    height: 275px;
    display: flex;
    flex-direction: column;
}
.template_more_txt {
    writing-mode: vertical-lr;
    font-size: 22px;
    line-height: 26px;
    color: #666666;
}
.template_20 .template_more_img {
    width: 24px;
    height: 24px;
    margin-top: 20px;
    display: block;
}
</style>