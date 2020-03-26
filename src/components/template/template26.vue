<template>
    <div class="template_26">
        <div class="template_left_wrap" @click="funcGoToSkill">
            <div class="template_spike_tit">
                <img src="../../../static/images/index/seckill_index_title.png" class="spike_img" alt="">
            </div>
            <div class="template_spike_date">
                <span class="spike_date_txt">{{desc}}</span>
                <span class="spike_date_hours" :class="{'active': !is_time }">{{hours}}</span>
                <span class="time_space" :class="{'active': !is_time }">:</span>
                <span class="spike_date_minutes" :class="{'active': !is_time }">{{minutes}}</span>
                <span class="time_space" :class="{'active': !is_time }">:</span>
                <span class="spike_date_seconds" :class="{'active': !is_time }">{{seconds}}</span>
            </div>
            <div class="template_product">
                <img class="product_img" :src="product.url">
                <div class="product_title">{{product.name}}</div>
                <div class="product_price">
                    <div><span class="price_symbol">￥</span><span class="price_int">{{product.price}}</span></div>
                    <div class="price_del"><span>￥</span><span class="price_ini">{{product.list_price}}</span></div>
                </div>
            </div>
        </div>
        <div class="template_right_wrap">
            <div class="template_right_ul">
                <div class="template_right_li"
                v-for="(item,index) in vdata.img_content_list"
                :key="index"
                @click="funcGoToLink(item)">
                    <img class="template_right_img" :src="item.image.url">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getSeckillInfo } from '@/api'
import { countDown } from '@/utils';
import { setInterval } from 'timers';
export default {
    data() {
        return {
            desc: '',
            product: {},
            desc: '',
            hours: '',
            minutes: '',
            seconds: '',
            timer: null,
            is_time: true,
            link: ''

        }
    },
    props: {
        vdata:{
            type: Object,
            default: {}
        }
    },
    created(){
        this.funcGetSeckillInfo();
    },
    methods: {
        //秒杀数据
        funcGetSeckillInfo(){
            getSeckillInfo().then( res => {
                let { body, header } = res;
                if( header.res_code == 0 ){
                    let len =  body.schedule_list[0].product_list.length;
                    let randow = parseInt(Math.random()*len,10);
                    this.link = body.link;
                    this.desc = body.seckill_desc;
                    this.product = body.schedule_list[0].product_list[randow];
                    this.funcDownTime(body.schedule_list[0].start_time,body.schedule_list[0].end_time,header.time_stamp);
                } else {
                    wx.showToast({
                        title:header.message,
                        icon:'none'
                    });
                }
            });
        },
        funcDownTime(startTime,endTime,currTime){
            let nowtime;
            let _this = this;
            let timemap = currTime;
            if( startTime >= timemap ){
                nowtime = startTime - timemap;
                _this.is_time = true;
            } else {
                nowtime = endTime - timemap;
                _this.is_time = false;
            }
            _this.timer = setInterval(function(){
                nowtime -= 1000;
                if ( nowtime >= 0 ) {
                    _this.hours = _this.funcPrefixInteger(Math.floor( nowtime / 1000 / 60 / 60 % 24));
                    _this.minutes = _this.funcPrefixInteger(Math.floor( nowtime / 1000 / 60 % 60));
                    _this.seconds = _this.funcPrefixInteger(Math.floor( nowtime / 1000 % 60));
                } else {
                    _this.hours = '00';
                    _this.minutes = '00';
                    _this.seconds = '00';
                    clearInterval(_this.timer);
                }
            },1000)
        },
        funcGoToSkill(){
            if( this.link != '0' && this.link){
                if( this.link.indexOf('http') >= 0 ){
                    wx.setStorageSync('urlH5',this.link);
                    wx.navigateTo({
                        url:'/pages/transferH5/main'
                    })
                } else {
                    wx.navigateTo({
                        url: this.link
                    })
                }
            }
        },
        funcPrefixInteger(num){
            let val = ''
            if( num < 10 ){
                val = '0' + num;
            } else {
                val = num;
            }
            return val;
        },
        funcGoToLink(item){
            let link = item.image.link;
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
.template_26 {
    display: flex;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
}
.template_26 .template_left_wrap {
    width: 250px;
}
.template_26 .spike_img {
    width: 117px;
    height: 29px;
    display: block;
}
.template_26 .template_spike_tit {
    padding: 25px 0 0 25px;
}
.template_26 .template_spike_date {
    display: flex;
    height: 28px;
    margin: 12px 0 0 25px;
    align-items: center;
    line-height: 28px;
    font-size: 24px;
}
.template_26 .spike_date_txt {
    color: #333333;
    padding-right: 3px;
    white-space: nowrap;
}
.template_26 .spike_date_hours,
.template_26 .spike_date_minutes,
.template_26 .spike_date_seconds {
    width: 36px;
    height: 28px;
    margin: 0 7px;
    text-align: center;
    border-radius: 4px;
    background: #FF5000;
    color: #ffffff;
    font-size: 20px;
}
.template_26 .time_space {
    color: #FF5000
}
.template_26 .time_space.active {
    color: #FF5000
}
.template_26 .spike_date_hours.active,
.template_26 .spike_date_minutes.active,
.template_26 .spike_date_seconds.active{
    background: #FF5000;
} 
.template_26 .template_product {
    padding-left: 25px;
}
.template_26 .product_price {
    display: flex;
}
.template_26 .price_symbol {
    font-size: 25px;
}
.template_26 .price_del {
    padding-left: 5px;
    color: #3F3F3F;
    text-decoration:line-through;
}
.template_26 .product_img {
    width: 180px;
    height: 180px;
    display: block;
    margin: 20px 0 8px;
}
.template_26 .product_title {
    padding-right: 20px;
    font-size: 22px;
    color: #333333;
    height: 26px;
    line-height: 26px;
    text-overflow:ellipsis;
    white-space: nowrap;
    /* display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; */
    overflow: hidden;
}
.template_26 .product_price {
    padding-top: 12px;
    color: #FF5000;
    font-size: 26px;
    line-height: 28px;
}
.template_26 .template_right_wrap {
    flex: 1;
}
.template_26 .template_right_ul {
    display: flex;
    flex-wrap: wrap;
}
.template_26 .template_right_li {
    width: 230px;
    border-left: #f3f5f7 1px solid;
    border-bottom: #f3f5f7 1px solid;
    box-sizing: border-box; 
    box-sizing: border-box;
}
.template_right_li:nth-child(1),.template_right_li:nth-child(3){
    padding-right: 5px;
}
.template_right_li:nth-child(3),.template_right_li:nth-child(4){
    border-bottom: 0;
}
.template_26 .template_right_img {
    width: 228px;
    height: 197px;
    display: block;
}
</style>