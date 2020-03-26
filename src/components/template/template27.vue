<template>
    <div class="template_27">
        <div class="template_wrap"
        v-for="(item,index) in vdata.img_content_list"
        :key="index">
            <div class="template_content_title" :style="{color: item.m_color?item.m_color:'#333333'}">{{item.title}}</div>
            <div class="template_content_txt">{{item.content}}</div>
            <div class="template_ul">
                <div class="template_li"
                v-for="(ele,idx) in item.image_list"
                :key="idx"
                @click="funcGoToLink(item)">
                <img :src="ele.url" class="template_conter_img">
                </div>
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
        funcGoToLink(item){
            if( item.type == '2') {
                wx.navigateTo({
                    url:'/pages/index/privategoods/main'
                })
            }
            if( item.type == '1') {
                wx.navigateTo({
                    url:'/pages/index/goodsortList/main'
                })
            }
        }
    }
}
</script>

<style scoped>
.template_27 {
    display: flex;
    background: #ffffff;
    border-radius: 16px;
    
}
.template_27 .template_wrap{
    width: 50%;
    
}
.template_27 .template_content_title {
    padding: 16px 0 8px 20px;
    font-size: 32px;
    line-height: 36px;
}
.template_27 .template_content_txt {
    padding: 0 0 18px 20px;
    font-size: 24px;
    color: #777777;
    line-height: 26px;
}
.template_27 .template_ul {
    display: flex;
    padding-left: 20px;
}
.template_27 .template_li {
    margin-right: 20px;
}
.template_27 .template_conter_img {
    width: 140px;
    height: 140px;
    display: block;
}
</style>