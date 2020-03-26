<template>
    <div class="like-content">
        <div class="shop-l">
            <img class="shop-l-img" :src="options.url" alt="">
            <p class="shop-l-p">{{options.name}}</p>
            <p class="shop-l-p money"><moneySpan :money="options.price" :iSize="34" :fSize="26"></moneySpan></p>
        </div>
        <div class="products_small_wrap" v-if=" shopdata.length">
            <likeGoodMain v-for="item in shopdata"  :mainData="item"  :key="index"></likeGoodMain>
        </div>
        <div class="zanwei"  v-if="!shopdata.length">
            <img class="zanwei-img" src="/static/images/public/public_empty_pic.png" alt="" />
            <p class="zanwei-tip">暂无相似商品</p>
            <p><span class="goLook" @click="goLook()">去逛逛</span></p>
        </div>
    </div>
</template>

<script>
    import likeGoodMain from '@/components/public/likeGoodMain';
    import moneySpan from '@/components/public/money.vue';
    import {daGuanRelateRecomment} from '@/api'

    export default {
        components:{
            likeGoodMain,
            moneySpan
        },
        name: "index",

        onLoad(options){
            console.log(options)
            this.sa_page(this,false,'相似商品','');
            this.options=''
            this.options=JSON.parse(options.data)
            this.shopdata=[]
            this.page_index=1
            this.pages_size=20
            this.getData(this.options)
        },
        onReachBottom(){
            if(!this.end){
                this.getData()

            }
        },
        data(){
            return{
                options:'',
                page_index:1,
                pages_size:20,
                shopdata:[],
                end:false
                    }
        },
        methods:{
            goLook(){
                wx.switchTab({
                    url:`/pages/classifyList/classify/main`
                })
            },
            getData(data){
                // scene_type	是	string	推荐类型
                // page_index	是	string	页码
                // page_size	是	string	20
                // sku	是	string	商品sku
                // is_promotion
                var rqData={
                    scene_type:'',
                    page_index:this.page_index,
                    page_size:this.pages_size,
                    sku:data.sku,
                    is_promotion:1
                }
                daGuanRelateRecomment(rqData).then(res=>{

                    let product_list_info = res.product_list;

                    product_list_info.map( pro_info => {
                        let tag_array = pro_info.promotion_tag;
                        if (tag_array && tag_array.length) {
                            let tag_temp_array = [];
                            tag_array.map( (tag_info,index) => {
                                if (index < 2) {
                                    tag_temp_array.push(tag_info);
                                }
                            })
                            pro_info.promotion_tag = tag_temp_array;
                        }
                    });        
                    this.shopdata=this.shopdata.concat(product_list_info),
                    this.end=res.is_end
                    this.page_index+=1
                })
            }

        }    }
</script>

<style scoped>
    .like-content{
        background: #f3f5f7;
        min-height: 100vh;
    }
    .zanwei-tip{
        font-size: 30rpx;
        padding-bottom:40rpx;
    }
    .goLook{
        font-size: 26rpx;
        padding:10rpx 40rpx;
        background: #FF5000;
        color: #fff;
        border-radius: 26rpx;
    }
    .zanwei-img{
        width: 266rpx;
        height: 222rpx;
        display: inline-block;
        padding: 40rpx;
    }
    .zanwei{
        text-align: center;
    }
    .shop-l{
        height: 200rpx;
        background: #fff;
        margin: 10rpx;
        border-radius: 16rpx;
        position: relative;
    }
    .shop-l-img{
        height: 160rpx;
        width: 160rpx;
        margin: 15rpx;
        border-radius: 15rpx;
        float: left;
    }
    .shop-l .money{
        position: absolute;
        bottom: 20rpx;
        color: #ff5000;
        font-size: 26rpx;
    }
    .money{
        font-weight: bold;
    }
    .shop-l-p{
        padding-left: 200rpx;
        font-size: 24rpx;
        padding-top: 20rpx;
    }
    .products_small_wrap {
        /* padding: 0 8px; */
        background: #f3f5f7;
        padding-top: 8px;
        display: flex;
        flex-wrap: wrap;
        /* justify-content: space-between; */
    }

</style>
