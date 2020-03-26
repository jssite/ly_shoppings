<template>
    <div class="contaniner">
        <!-- 标题 -->
        <dl class="commentTab">
            <dd class="commentText" @click.stop="clickTab($event,index,item.level_id)" :class="[{gray:item.level_id==3},{'active': curIdx==index}]"  v-for="(item,index) in goodsDynamicData.levels" :key="index">{{item.level_name}} {{item.level_num}}</dd>
        </dl>
        <div class="line"></div>
        <!-- 内容 -->
        <template v-if="goodscommentList.length>0">
            <div class="goodscomment">
            <div class="content">
                <!-- 评论 -->
                <div class="goods_comment_lists" v-for="(item,index) in goodscommentList || goodsListDATA" :key='index'>
                    <div class="userbox">
                        <img class="img" :src="item.header_imge_url || '/static/goodsdetail/default_pic_user.png'" alt="" >
                        <div class="goodsuser">
                            <span class="span" style="vertical-align: top;">{{item.member_name}}</span>
                            <img src='/static/goodsdetail/product_comment_vip_v.png' class="vipimg" v-if="item.user_tags==1">
                            <img src='/static/goodsdetail/product_comment_vip_le.png'  class="vipimg" v-if="item.user_tags==2">
                            <div class="star">
                                <block v-for="(ite,ind) in 5 - item.score" :key="ind" >
                                    <image class="starimg" src='/static/goodsdetail/fullstar.png' ></image>
                                </block>
                                <block v-for="(ite,ind) in item.score" :key="ind">
                                    <image class="starimg" src='/static/goodsdetail/emptystar.png'></image>
                                </block>
                                <!-- <img class="starimg" src="/static/goodsdetail/product_comment_star.png" alt="" > -->
                            </div>
                        </div>
                        <span class="span" style="vertical-align: top;">{{item.review_date_time}}</span>
                    </div>
                    <div class="span discuss">{{item.review_desc}}</div>
                    <div class="span" v-if="item.color" style="margin-bottom:28rpx;">颜色:{{item.color}}/尺码:{{item.size}}</div>
                    <!-- <div class="span" style="margin-bottom:28rpx;">颜色:粉色/尺码:90</div> -->
                    <div class="commentImg" v-if="item.imgs" >
                        <img class="cimg" :src="items" @click.stop="previewImage(item.imgs, indexs)" alt="" v-for="(items,indexs) in item.imgs"  :key='indexs' >
                    </div>
                </div>
                <!-- End -->
                </div>
            </div>
            <div class="weui-loadmore">
                <div v-if="!bottom" class="weui-loading"></div>
                <div class="weui-loadmore__tips">{{bottom?"已经到底啦":"正在加载..."}}</div>
            </div>
        </template>
        
        <template v-if="goodscommentShow">
            <div>
                <div class="placeholder">
                    <img src="/static/images/public/public_empty_pic.png" alt="">
                    <text>暂无相应评价，看看别的吧</text>
                </div>
            </div>
        </template>
        
    </div>
</template>
<script>
import { getGoodsCommentList } from '@/api/'
export default {
    data(){
        return{
            goodscommentShow:false,
            bottom:false,      //加载更多
            commentNot: false,  //是否有数据
            prod_id:null,         //商品id
            page_index:1,         //默认初始第一页
            curIdx:0,              //初始化，选择第一个
            goodsDynamicData:{},    //商品评论列表
            goodscommentList:[],
            goodsListDATA:[]   //数租
        }
    },
    onLoad(options){
        this.sa_page(this,false,'小伙伴们说','');
        this.goodscommentShow = false;
        this.bottom=false
        this.commentNot=false
        this.prod_id=null
        this.page_index=1
        this.curIdx=0
        this.goodsDynamicData={}
        this.goodscommentList=[]
        this.goodsListDATA=[]
        wx.showLoading({title:'正在加载中',mask:true})
        this.prod_id=options.prod_id;
        this.page_index=1;
        this.getGoodsList();
    },
    methods:{
        //图片预览
        previewImage(imgs=[], curIdx=0){
            wx.previewImage({current: imgs[curIdx], urls: imgs})
        },
        //获取商品列表
        getGoodsList(){
            let params ={
            level_id:this.curIdx,
            productId:this.prod_id,
            page_index: this.page_index,
            page_size:10
            }
            getGoodsCommentList(params).then((result) => {
                this.count=result.count
                this.bottom = result.count.length>10?false:true
                this.goodsDynamicData = result;
                wx.hideLoading();
                if(result.review_list){
                    result.review_list.map(res=>{
                        res.header_imge_url = res.header_imge_url.indexOf('gif')>-1?false: res.header_imge_url!=''? res.header_imge_url : '/static/goodsdetail/default_pic_user.png'
                        res.score = parseInt(res.score) == 1?0:2
                        console.log(res.score)
                    })
                    this.goodscommentShow = false;
                    this.goodscommentList = this.goodscommentList.concat(result.review_list)
                    this.page_index += 1;
                }else{
                    this.goodscommentShow = true;
                    this.goodscommentList =[];
                }
            })
        },
        //获取对应的评论
        clickTab(e,index,num){
            console.log(num)
            this.curIdx = num;
            this.page_index = 1;
            this.goodscommentList=[];
            this.getGoodsList()
        },
    },
    onPullDownRefresh(){
    },
    onReachBottom(){
        if(this.count<=this.goodscommentList.length){
            this.bottom = true;
        	return false
        }
        this.getGoodsList();
        // wx.hideNavigationBarLoading()//完成停止加载
        // wx.stopPullDownRefresh();
    }

}
</script>

<style scoped>
    .line{
        height: 1rpx;
        width: 750rpx;
        background: #f3f5f7;
        /* margin:28rpx 0; */
    }
    .contaniner .active{
    background: #FF5000 !important;
    color: #FFFFFF;
    }
    .contaniner .gray{
     background: #F4F4F4;
    }
    /* 表头 */
    .commentTab{
        /* height: 122rpx;
        margin-top: 28rpx; */
        width: 100%;
        display: flex;
        align-items: center;
        flex-wrap:wrap;
        box-sizing:border-box;
        font-family: PingFangSC-Regular;
        font-size: 26px;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
        background: #fff;
        padding:25rpx 0rpx;
    }
    .commentText{
        margin-bottom: 26rpx;
        background: #FFF7D5;
        border-radius: 30px;
        height: 48rpx;
        line-height: 48rpx;
        margin-left: 20rpx;
        min-width: 110rpx;
        text-align: center;
        padding: 0 20rpx;
    }
    .commentText:last-child{
        margin-bottom: 0rpx;
    }
    /* 内容 */
    .span{
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #999999;
        letter-spacing: 0;
        margin-left: 20rpx; 
    }
    .goods_comment_lists {
        border-bottom: #eeeeee 1px solid;
    }
    .goods_comment_lists:last-child {
        border-bottom: none;
    }
    .goodscomment{
        background: #fff;
    }
    .goodscomment .content .img{
        height: 80rpx;
        width: 80rpx;
        margin-right: 0rpx;
        margin-left: 20rpx;
        border-radius: 50%;
    }
    .goodscomment .content .goodsuser{
        vertical-align: top;
        width:350rpx;
    }
    .goodscomment .content .goodsuser .vipimg{
        vertical-align: top;
        margin-left: 20rpx;
        width: 40rpx;
        height: 28rpx;
    }
    .goodscomment .content .userbox{
        padding-top: 20rpx;
        align-items: flex-start ;
        display: flex;
        height: 88rpx;
        background: #ffffff;
    }
    .goodscomment .content .star{
        margin-left: 20rpx;
    }
    .goodscomment .content .star .starimg{
        width: 20rpx;
        height: 20rpx;
        margin-right: 4rpx;
        vertical-align: top;
    }
    .goodscomment .content .discuss{
        padding: 20rpx 20rpx;
        color: #333333;
        background: #fff;
        margin-left: 0rpx;
    }
    .goodscomment .content .commentImg{
        margin-left: 20rpx;
    }
    .goodscomment .content .commentImg .cimg{
        width: 164rpx;
        height: 164rpx;
        margin-right: 10rpx;
        margin-bottom: 20rpx;
    }


    .placeholder{
    display: flex;
    align-items: center;
    flex-direction: column;
}
.placeholder image{
    width: 250rpx;
    height: 210rpx;
    margin-top:240rpx;

}
.placeholder text{
    font-family: PingFangSC-Regular;
    font-size: 26px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    margin:40rpx 0rpx 60rpx 0rpx;
}

</style>
