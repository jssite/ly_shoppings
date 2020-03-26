<template>
    <div class="addressBox">
        <!-- 顶部search -->
        <div class="alike header">
            <span class="span" @click="funcSelectCity">{{location_city}}</span>
            <img class="sign_rimg" src="/static/images/public_arrow_down.png" >
            <div class="search">
                <em class="search_icon">
                    <img src="/static/images/navbar_search.png" class="search__img">
                </em>
                <input type="text" v-model="value_input"  class="search_value" placeholder="请输入收货地址">
            </div>
        </div>
        <!-- 当前定位 -->
        <div v-if="options.detailedadd" class="beforeplace">
            <div class="alike fixed">
                <div class="span fixed_txt" @click.stop='gotodetaild'>
                    <span>当前位置：</span>
                    <span class="wrap_text_align">{{location.street_number}}</span>
                </div>
                <div class="fixed_again" @click="funcRelocation">重新定位</div>
            </div>
        </div>
        <div class="address_ul">
            <div class="address_li" 
            v-for="(item,index) in addresslist" 
            :key="index"
            @click="funcShopId(item)">
                <div class="address_title">{{item.name}}</div>
                <div class="address_info">{{item.address}}</div>
            </div>
        </div>
        <!-- <template v-else>
            <div class="Norecord">
                <img class="Nrimg" src="/static/images/public/public_empty_pic.png" alt>
                <span class="span NrSpan">暂无地址信息</span>
            </div>
        </template> -->
    </div>
</template>
<script>
import BMapWX from '@/utils/bmap-wx.min.js';
import { mapak } from '@/utils';
import { getUserLocation } from '@/api'
export default {
    data() {
        return {
            location:{
                street_number: '定位失败'
            },
            value_input: '',
            location_city: '定位失败',
            addresslist:[],
            options:{},
            gotodetaildadress:''
        }
    },
    watch: {
        'value_input':function(n,o){
            let that = this;
            let BMap = new bmap.BMapWX({ 
                ak: mapak
            }); 
            let fail = function(data) {}; 
            let success = function(data) { 
                data.result.forEach((item,index) => {
                    let info = '';
                    if(item.location){
                        BMap.regeocoding({
                            location: `${item.location.lat},${item.location.lng}`,
                            fail: res => {}, 
                            success: res => {
                                info = res.wxMarkerData[0].address + res.wxMarkerData[0].desc
                                that.$set(item,'address',info);
                            }
                        });
                    } else {
                        that.$set(item,'address','暂无地址');
                    }
                });
                that.addresslist = data.result;
            } 
            BMap.suggestion({ 
                query: n, 
                region: that.location_city=='定位失败'?'北京':this.location_city, 
                city_limit: true, 
                scope: '2',
                page_size: '20',
                fail: fail, 
                success: success 
            });
        }
    },
    onLoad(options){
        this.options = options;
        this.sa_page(this,false,'选择收货地址','');
        if(this.options.detailedadd){
            wx.setNavigationBarTitle({title: '闪送至'})
        }
    },
    onShow() {
        let location = wx.getStorageSync("locationInfo");
        let currCity = wx.getStorageSync("currCity");
        let latitude = location.latitude;
        let longitude = location.longitude;
        this.addresslist = [];
        this.value_input = '';
        if(currCity){
            this.location_city = currCity
        }
        if( location.latitude ){
            this.funcSetLocaton(latitude, longitude);
        }
    },
    methods:{
        funcRelocation() {
            let that = this;
            that.is_reload = true;
            that.init_laction = '定位中...'
            wx.getSetting({
                success(res) {
                    if( res.authSetting['scope.userLocation'] ){
                        that.funcUserLocation();
                    } else {
                        wx.openSetting({
                            success(res) {
                                if (res.authSetting['scope.userLocation']) {
                                    that.funcUserLocation();
                                } else {
                                    that.init_laction = '定位失败'
                                }
                            }
                        });
                    }
                }
            })
        },
        funcUserLocation(){
            let that = this;
            wx.getLocation({
                type: "gcj02",
                success: function(res) {
                    wx.setStorageSync("locationInfo", {
                        latitude: res.latitude,
                        longitude: res.longitude
                    });
                    that.is_reload = false;
                    that.funcSetLocaton(res.latitude, res.longitude);
                }
            });
        },
        //获取当前定位
        funcSetLocaton(x, y) {
            let _this = this;
            var BMap = new BMapWX({ 
                ak: mapak
            });
            BMap.regeocoding({
                location: `${x},${y}`,
                fail: res => {}, 
                success: res => {
                    console.log(res,'ddd');
                    let currCity= wx.getStorageSync("currCity");
                    _this.gotodetaildadress = res.originalData.result.formatted_address;
                    // _this.location.street_number = res.originalData.result.addressComponent.street + res.originalData.result.addressComponent.street_number||'定位失败';
                    _this.location.street_number = res.originalData.result.sematic_description||'定位失败';
                    if(!currCity){
                        _this.location_city = res.originalData.result.addressComponent.city;
                        wx.setStorageSync("currCity",_this.location_city);
                    }
                }
            });
        },
        gotodetaild(){ //有地址跳转到商品详情页
            if(this.location.street_number !='定位失败'){
                // let currCity= wx.getStorageSync("currCity");
                wx.redirectTo({url:'/pages/goodsdetailed/main?poi_address='+this.gotodetaildadress+'&poi_name='+this.location.street_number})
            }
            // poi_name poi_address
        },
        //城市列表
        funcSelectCity(){
            let that = this;
            wx.navigateTo({
                url:'/pages/search/citySelect/main?city=' + that.location_city
            })
        },
        //获取shopId
        funcShopId(item) {
            let that = this;
            if( !item.location ){
                wx.showToast({
                    title: '改地址不在配送范围内',
                    icon: 'none'
                })
                return false;
            }
            let params = {
                location_info: {
                    poi_address: item.address,
                    poi_name: item.title,
                    latitude: item.location.lat,
                    longitude: item.location.lng
                }
            };
            getUserLocation(params).then(res => {
                let { shop_id } = res;
                if( shop_id ) {
                    if(that.options.detailedadd){
                        // "poi_address" : "北京市东城区东直门内大街152号",
                        // "poi_name" : "哈哈镜超市(东直门店)",
                        // "latitude" : "39.946960",
                        // "longitude" : "116.431192",
                        // "city_id" : "420100",
                        // "sku" : "P960374483"
                        // console.log(item)
                        let url = `&poi_address=${item.address}&poi_name=${item.name}
                        &latitude=${item.location.lat}&longitude=${item.location.lng}`
                        wx.redirectTo({url:'../../goodsdetailed/main?'+url})
                    }else{
                        let url = `&poi_address=${item.address}&poi_name=${item.name}
                        &latitude=${item.location.lat}&longitude=${item.location.lng}`
                        wx.redirectTo({url:'/pages/leDelivery/index/main?'+url})
                    }
                   
                } else {
                    wx.showToast({
                        title: '改地址不在配送范围内',
                        icon: 'none'
                    })
                }
            });
        }
    }
}
</script>
<style scoped>
.addressBox{
    background: #f3f5f7;
}
.address_ul {
    padding-left: 20px;
    background: #ffffff;
}
.address_li {
    border-bottom: #EEEEEE 1px solid;
}
.address_title {
    padding: 24px 0 12px;
    font-size: 30px;
    color: #151515;
    line-height: 32px;
}
.address_info {
    padding-bottom: 24px;
    line-height: 28px;
    font-size: 26px;
    color: #999999;
}
.alike {
    display: flex;
    align-items: center;
    height: 88rpx;
    /* width: 100%; */
    background: #ffffff;
    box-shadow: 0 1rpx 0 0 #dddddd;
}
.span {
    font-family: PingFangSC-Regular;
    font-size: 30px;
    color: #333333;
    letter-spacing: 0;
    margin-left: 20rpx;
}
/* 顶部导航 */
.header{
    border-bottom: 1rpx solid #f3f5f7;
}
.header .search {
    position: relative;
    background: #f2f2f2;
    border-radius: 40rpx;
    height: 56rpx;
    width: 560rpx;
    margin-left: 20rpx;
}
.header .sign_rimg {
    width: 20rpx;
    height: 10rpx;
    margin-left: 8rpx;
}
.header .search_icon {
    width: 30.3rpx;
    height: 29.5rpx;
    overflow: hidden;
    position: absolute;
    left: 20rpx;
    top: 15rpx;
    z-index: 99;
}
.header .search__img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    border: none;
}
.header .search_value {
    padding-left: 63rpx;
    width: 572rpx;
    height: 56rpx;
    border-radius: 30rpx;
    box-sizing: border-box;
    background: #f2f2f2;
    font-size: 26rpx;
    color: #333333;
}
.header .search_value:placeholder {
    color: #cacaca;
}
.Norecord{
    display: flex;
    flex-direction:column;
    align-items:center;
    /* text-align: center; */
    width: 400rpx;
    margin: 0 auto;
    margin-top: 172rpx;
}
.Norecord .Nrimg{
    width: 260rpx;
    height: 218rpx;
}
.NrSpan{
    margin-top: 40rpx;
    margin-left: 0;
    line-height: 40px;
    margin-bottom: 618rpx;
}
.beforeplace .place {
    font-family: PingFangSC-Regular;
    padding: 20rpx 0 28rpx 28rpx;
    color: #999999;
    background: #ffffff;
    line-height: 32rpx;
    font-size: 26rpx;
}
.beforeplace .fixed {
    height: 56rpx;
    padding: 10px 10px 10px 0;
    justify-content: space-between;
}
.beforeplace .fixed .fixed_img {
    height: 28rpx;
    width: 28rpx;
    margin-left: 32rpx;
}
.beforeplace .fixed .fixed_txt {
    line-height: 36px;
    margin-left: 12rpx;
    width: 490rpx;
    display: flex;
    /* overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; */
}
.wrap_text_align {
    height: 36px;
    width: 300px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
}
.beforeplace .fixed .fixed_again {
    margin-left: 12rpx;
    margin-right: 10px;
    font-size: 26rpx;
    border: 1px solid #ff5000;
    border-radius: 26px;
    height: 48rpx;
    width: 160rpx;
    text-align: center;
    line-height: 48rpx;
    color: #ff5000;
}
</style>



