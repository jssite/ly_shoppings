<template>
    <div class="template_3">
        <div class="template_wrap" 
        v-for="(item,index) in vdata.img_content_list" 
        :key="index" @click="funcGoToLink(item)">
            <img class="template_wrap_img" mode="widthFix" :src="item.image.url">
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
.template_3 {
    display: flex;
    /* border-radius: 16px; */
    overflow: hidden;
}
.template_3 .template_wrap {
    flex: 1;
}
.template_3 .template_wrap_img {
    width: 100%;
    display: block;
}
</style>