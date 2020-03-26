<template>
    <div class="template_17">
        <div class="template_wrap">
            <!-- start -->
            <div class="template_li"
            v-for="(item,index) in vdata.img_content_list"
            :key="index"
            @click="funcGoToLink(item)">
                <div class="template_icon">
                    <img :src="item.image.url" class="template_icon_img">
                </div>
                <div class="template_icon_txt">{{item.name}}</div>
            </div>
            <!-- End -->
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
        funcGoToLink(item){
            let token = wx.getStorageSync('token')
            let { link } = item.image;
            if( item.name == '领券中心' ){
                if(!token){
                    wx.navigateTo({
                        url:'/pages/userCenter/login/wxLogin/main'
                    });
                    return false;
                }
            }
            if( item.name == '乐享返现' ){
                if(!token){
                    wx.navigateTo({
                        url:'/pages/userCenter/login/wxLogin/main'
                    });
                    return false;
                }
            }
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
.template_17 {
    padding: 20px 0 0;
    background: #ffffff;
    border-radius: 16px;
}
.template_17 .template_wrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    
}
.template_17 .template_li {
    width: 20%;
    text-align: center;
}
.template_17 .template_icon_img {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    display: block;
    margin: 0 auto;
}
.template_17 .template_wrap_img {
    width: 100%;
    display: block;
}
.template_17 .template_icon_txt {
    padding: 6px 0 0;
    font-size: 22px;
    line-height: 26px;
    color: #333333;
    text-align: center;
}
.template_17 .template_tips {
    display: flex;
    justify-content: space-around;
}
.template_17 .template_tips .template_label {
    display: flex;
    align-items: center;
}
.template_17 .template_tips .template_label_icon {
    width: 26px;
    height: 26px;
    display: block;
    margin-right: 8px;
}
.template_label_txt {
    font-size: 22px;
    line-height: 26px;
    color: #FF5000;
}
</style>