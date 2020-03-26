<template>
    <div class="template_22">
        <div class="template_warp">
            <div class="baby_header">
                <span class="baby_photo">
                    <template v-if="userInfo.avatar">
                        <img class="baby_photo_img" :src="userInfo.avatar" alt="">
                    </template>
                    <template v-else>
                        <img class="baby_photo_img" src="/static/goodsdetail/default_pic_user.png" alt="">
                    </template>
                </span>
                <div class="baby_txt">
                    <swiper class="swiper_container" vertical="true" autoplay="true" circular="true" interval="2000">
                        <block v-for="(item,index) in bodyText" :key="index">
                            <swiper-item @click="funcGoToH5(item)">
                                <wxParse :content="item.name"></wxParse>
                            </swiper-item>
                        </block>
                    </swiper>
                </div>
            </div>
            <!-- 01 -->
            <div class="baby_content_info" v-if="token && bobyInfo.baby_name">
                <div class="header_body">
                    <div class="body_name_wrap">
                        <img class="body_sex_img" :src="bobyInfo.baby_sex == 'm'?'/static/images/index/index_baby_girl.png':'/static/images/index/index_baby_boy.png'">
                        <span class="space">{{bobyInfo.baby_name}}</span>
                        <span>{{bobyInfo.baby_age}}</span>
                    </div>
                    <div class="body_goto_page" @click="funcGoToBodyH5">
                        <span>进入宝宝专属空间</span>
                        <img class="body_arrow_img" src="/static/images/public_arrow_right.png">
                    </div>
                </div>
                <div class="body_text">
                    <div class="body_about">{{bobyInfo.baby_content}}</div>
                </div>
            </div>
            <!-- 02 -->
            <div class="baby_content" v-if="!bobyInfo.baby_name">
                <div class="baby_left">
                    <div class="baby_h1">开启个性化推荐</div>
                    <div class="baby_h2">告别淘淘淘，多留点时间陪宝宝</div>
                </div>
                <div class="baby_right" @click="funcGoToBodyH5">
                    <div class="baby_right_txt">去开启</div>
                    <span class="baby_right_icon">
                        <img class="baby_arrow" src="../../../static/images/public_arrow_right.png" alt="">
                    </span>
                </div>
            </div>
            <!-- 03 -->
            <!-- <div class="baby_content" v-if="token && !bobyInfo.baby_name">
                <div class="baby_left">
                    <div class="baby_h1_none"></div>
                    <div class="baby_h2_none"></div>
                </div>
                <div class="baby_right">
                    <span class="baby_reload active" @click="funcGetBabyInfo">重新加载</span>
                </div>
                <div class="body_loading" v-if="loading">
                    <span><img class="baby_loading_img" src="../../../static/images/public/public_city_lose.png"></span>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import { getBabyInfo } from '@/api'
import wxParse from 'mpvue-wxparse'
import { mapState, mapMutations } from "vuex";
export default {
    data(){
        return {
            // info: {},
            // textList: [],
            loading: false,
        }
    },
    components: {
        wxParse
    },
    computed:mapState(['bobyInfo','bodyText','token','userInfo']),
    props: {
        info: {
            type: Object
        },
        textList: {
            type: Array
        }
    },
    created(){
        // this.funcGetBabyInfo();
    },
    mounted(){
        console.log(this.userInfo);
    },
    methods: {
        funcGetBabyInfo(){
            this.loading = true;
            getBabyInfo().then( res => {
                var arr = []
                res.baby_info.baby_msgs.forEach((item,index) => {
                    let json = {
                        name: item.name.replace('<html><body>','').replace('</body></html>',''),
                        link: item.link
                    };
                    arr.push(json)
                });
                this.loading = false;
                this.$store.commit('bodyTextMutations',arr)
                this.$store.commit('bobyInfoMutations',res.baby_info)
            })
        },
        funcGoToH5(item){
            let link = item.link;
            wx.setStorageSync('urlH5',link);
            wx.navigateTo({
                url:'/pages/transferH5/main'
            });
        },
        funcGoToBodyH5(){
            let token = wx.getStorageSync('token');
            let link = this.bobyInfo.link;
            if( !token ){
                wx.navigateTo({
                    url: '/pages/userCenter/login/wxLogin/main'
                });
            } else {
                if( link != '0' && link != ''){
                    if( link.indexOf('http') >= 0 ){
                        wx.setStorageSync('urlH5',link);
                        wx.navigateTo({
                            url:'/pages/transferH5/main'
                        })
                    } else {
                        wx.navigateTo({
                            url: link
                        })
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
.template_22 {
    padding: 52px 20px 20px;
}
.template_22 .baby_header {
    height: 80px;
    position: relative;
    background: #FF5580;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    font-size: 26px;
    color: #ffffff;
    line-height: 80px;
}
.template_22 .baby_content {
    height: 140px;
    padding: 33px 0 0 48px;
    background: #ffffff;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    display: flex;
    justify-content: space-between;
    position: relative;
}
.template_22 .baby_content_info {
    height: 230px;
    background: #ffffff;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
}
.template_22 .space {
    padding: 0 20px;
}
.template_22 .header_body {
    padding: 0 20px;
    display: flex;
    height: 85px;
    align-items: center;
    justify-content: space-between;
    font-size: 24px;
    color: #333333;
}
.template_22 .body_name_wrap {
    display: flex;
    align-items: center;   
}
.template_22 .body_text {
    height: 115px;
    margin: 0 20px;
    padding: 25px;
    border-radius: 16px;
    box-sizing: border-box;
    background: #fff5f8;
}
.template_22 .body_arrow_img {
    margin: 2px 0 0 10px;
    width: 13px;
    height: 24px;
    display: block;
}
.template_22 .body_about {
    height: 65px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 32px;
    font-size: 26px;
    color: #666666;
    text-align: justify;
}
.template_22 .body_goto_page {
    display: flex;
    align-items: center;
}
.template_22 .body_sex_img{
    width: 30px;
    height: 30px;
    display: block;
}
.template_22 .baby_h1 {
    margin: 0 0 20px;
    height: 36px;
    font-size: 30px;
    color: #333333;
    line-height: 36px;
}
.template_22 .baby_h1_none {
    margin-bottom: 16px;
    width: 260px;
    height: 36px;
    background: #F5F5F5;
}
.template_22 .baby_h2{
    height: 36px;
    color: #999999;
    font-size: 24px;
    line-height: 36px;
}
.template_22 .baby_h2_none {
    width: 400px;
    height: 36px;
    background: #F5F5F5;
}
.template_22 .baby_reload {
    width: 140px;
    height: 52px;
    text-align: center;
    border-radius: 26px;
    line-height: 52px;
    font-size: 26px;
    color: #333333;
    border: 1px solid #666666;
}
.template_22 .baby_reload.active {
    border: 1px solid #CACACA;
    color: #CACACA;
}
.template_22 .body_loading{
    width: 42px;
    height: 42px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -21px 0 0 -21px;
    animation: animations 2s linear infinite;
}
@-webkit-keyframes animations{
	0%{
        transform: rotate(0deg);
    }
	100%{
        transform: rotate(360deg)
        }
}
.template_22 .baby_loading_img {
    width: 42px;
    height: 42px;
    display: block;
    opacity: 0.5;
}
.template_22 .baby_right {
    height: 24px;
    line-height: 24px;
    padding: 24px 27px 0 0;
    display: flex;
    align-content: center;
}
.template_22 .baby_right_txt {
    font-size: 26px;
    color: #333333;
    padding-right: 10px;
}
.template_22 .baby_arrow {
    width: 14px;
    height: 24px;
    display: block;
}
.template_22 .baby_photo {
    width: 100px;
    height: 100px;
    border: #FF5580 4px solid;
    box-sizing: border-box;
    position: absolute;
    left: 20px;
    top: -32px;
    border-radius: 50%;
    overflow: hidden;
    z-index: 9;
}
.template_22 .baby_photo_img {
    width: 100%;
    height: 100%;
    display: block;
}
.template_22 .baby_txt {
    padding-left: 140px;
}
.template_22 .swiper_container {
    height: 80px;
}
</style>