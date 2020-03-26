<template>
    <div class="template_25">
        <div class="swiper_wrap">
            <swiper 
            class="template_wrap" 
            autoplay="true" 
            interval="5000" 
            duration="1000" 
            @change="funcSwiperChange">
                <block>
                    <swiper-item 
                    v-for="(item,index) in vdata.banner_content_list" 
                    :key="index"
                    @click="funcGoToLink(item)">
                        <image :src="item.image.url" class="template_wrap_img" mode="scaleToFill"></image>
                    </swiper-item>
                </block>
            </swiper>
            <div class="swiper_dots"> 
                <block v-for="(item,i) in vdata.banner_content_list" :key="i"> 
                    <span class="dot" :class="{'active':i == swiperCurrent}"></span> 
                </block> 
            </div>
        </div>
        <div class="template_nav">
            <!-- start -->
            <div class="template_li"
            v-for="(item,i) in vdata.img_content_list"
            :key="i"
            @click="funcGoToLink(item)">
                <div class="template_icon">
                    <img :src="item.image.url" class="template_icon_img">
                </div>
                <div class="template_icon_txt">{{item.name}}</div>
            </div>
            <!-- End -->
            
            <div class="template_tips">
                <div class="template_label">
                    <img class="template_label_icon" src="../../../static/images/product_icon_show01.png" />
                    <span class="template_label_txt">专业母婴18年</span>
                </div>
                <div class="template_label">
                    <img class="template_label_icon" src="../../../static/images/product_icon_show01.png" />
                    <span class="template_label_txt">600+门店自提</span>
                </div>
                <div class="template_label">
                    <img class="template_label_icon" src="../../../static/images/product_icon_show01.png" />
                    <span class="template_label_txt">官方正品统一配送</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            swiperCurrent: 0
        }
    },
    props: {
        vdata:{
            type: Object,
            default: {}
        }
    },
    methods: {
        funcSwiperChange(e) {
            let current = e.mp.detail.current;
            this.swiperCurrent = current;
        },
        funcGoToLink(item){
            let { link } = item.image;
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
</script>

<style scoped>
.template_25 {
    overflow: hidden;
    margin-bottom: 20px;
}
.template_25 .template_wrap {
    height: 304px;
}
.template_25 .template_wrap_img {
    width: 100%;
    height: 100%;
    display: block;
}
.template_25 .template_nav {
    padding: 20px 0 28px;
    display: flex;
    flex-wrap: wrap;
    background: #ffffff;
    border-radius: 16px;
    margin: -40px 20px 0;
    position: relative;
    z-index: 15;
}
.template_25 .template_li {
    width: 20%;
    text-align: center;
}
.template_25 .template_icon_img {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    display: block;
    margin: 0 auto;
}
.template_25 .template_wrap_img {
    width: 100%;
    display: block;
}
.template_25 .template_icon_txt {
    padding: 6px 0 0px;
    font-size: 22px;
    line-height: 26px;
    color: #333333;
    text-align: center;
}
.template_25 .template_tips {
    width: 100%;
    padding-top: 28px;
    display: flex;
    justify-content: space-around;
}
.template_25 .template_tips .template_label {
    display: flex;
    align-items: center;
}
.template_25 .template_tips .template_label_icon {
    width: 26px;
    height: 26px;
    display: block;
    margin-right: 8px;
}
.template_25 .template_label_txt {
    font-size: 22px;
    line-height: 26px;
    color: #FF5000;
}
.template_25 .swiper_wrap {
    position: relative;
}
.template_25 .swiper_dots{
    width: 100%;
    position: absolute; 
    left: 0; 
    right: 0; 
    bottom: 50px; 
    display: flex; 
    justify-content: center;
    z-index: 12;
} 
.template_25 .swiper_dots .dot{ 
  margin: 0 8px; 
  width: 18px; 
  height: 9px; 
  background: #fff; 
  border-radius: 5px; 
  transition: all .6s; 
} 
.template_25 .swiper_dots .dot.active{ 
  width: 40px; 
  background: #FF5000; 
}
</style>