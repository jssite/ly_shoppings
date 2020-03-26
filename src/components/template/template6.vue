<template>
    <div class="template_6">
        <div class="template_wrap" 
        v-for="(item,index) in vdata.img_content_list" 
        :key="index" @click="funcGoToLink(item)">
            <img class="template_wrap_img" :src="item.image.url">
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
.template_6 {
    width: 100%;
    /* border-radius: 16px; */
    overflow: hidden;
}
.template_6 .template_wrap {
    width: 50%;
    height: 210px;
    float: left;
}
.template_6 .template_wrap:nth-child(2){
    clear: both;
}
.template_6 .template_wrap:last-child {
    margin-left: 50%;
    height: 420px;
    float: none;
}
.template_6 .template_wrap_img {
    width: 100%;
    display: block;
}
</style>