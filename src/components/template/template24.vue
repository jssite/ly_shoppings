<template>
    <div class="template_24" v-if="is_show && vdata.img_content_list.length">
        <div class="template_wrap">
            <div class="time_num" @click="funcClose">{{time}}s跳过</div>
            <div class="img_position" @click="funcGoToLink">
                <div v-for="(item,index) in vdata.img_content_list" :key="index">
                    <img 
                    :src="item.image.url" 
                    :style="{'width': item.image.width+'rpx','height':item.image.high+'rpx'}">
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            time: 5,
            is_show: true,
            timer: null
        }
    },
    props: {
        vdata:{
            type: Object,
            default: {}
        }
    },
    mounted(){
        this.funcDownTime();
    },
    methods: {
        funcGoToLink(){
            let link = this.vdata.img_content_list[0].image.link;
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
        },
        funcClose(){
            let _this = this;
            clearInterval(_this.timer);
            this.time = 5;
            this.is_show = false;
        },
        funcDownTime(){
            let _this = this;
            if( _this.is_show ) {
                _this.timer = setInterval(function(){
                    _this.time--;
                    if( _this.time <= 0){
                        clearInterval(_this.timer);
                        _this.time = 5;
                        _this.is_show = false;
                    }
                },1000)
            }
        }

    }
}
</script>

<style scoped>

.template_24 .template_wrap {
    position: relative;
}
.template_24 .time_num {
    width: 160px;
    height: 80px;
    border-radius: 40px;
    text-align: center;
    background: rgba(255, 255, 255, .7);
    color: #333333;
    font-size: 24px;
    line-height: 80px;
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 98;
}
</style>