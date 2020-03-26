<template>
    <div class="template_7">
        <div class="swiper_wrap">
            <swiper 
                class="template_wrap" 
                autoplay="true" 
                interval="5000" 
                duration="1000" 
                circular="true"
                @change="funcSwiperChange">
                <block>
                    <swiper-item v-for="(item,index) in vdata.img_content_list" :key="index" @click="funcGoToLink(item)">
                        <image :src="item.image.url" class="template_wrap_img" mode="scaleToFill"></image>
                    </swiper-item>
                </block>
            </swiper>
            <div class="swiper_dots"> 
                <block v-for="(item,i) in vdata.img_content_list" :key="i"> 
                    <span class="dot" :class="{'active':i == swiperCurrent}"></span> 
                </block> 
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
.template_7 {
    overflow: hidden;
    /* margin-bottom: 20px; */
}
.template_7 .template_wrap {
    height: 268px;
}
.template_7 .template_wrap_img {
    width: 100%;
    height: 100%;
    display: block;
}

.template_7 .swiper_wrap {
    position: relative;
}
.template_7 .swiper_dots{
    width: 100%;
    position: absolute; 
    left: 0; 
    right: 0; 
    bottom: 20px; 
    display: flex; 
    justify-content: center;
    z-index: 12;
} 
.template_7 .swiper_dots .dot{ 
  margin: 0 8px; 
  width: 18px; 
  height: 9px; 
  background: #fff; 
  border-radius: 5px; 
  /* transition: all .6s;  */
} 
.template_7 .swiper_dots .dot.active{ 
  width: 40px; 
  background: #FF5000; 
}
</style>