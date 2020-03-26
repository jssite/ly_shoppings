<template>
    <div class="shop">
        <div class="shop_top">
            <span><img class="images" style="width: 30rpx; height:30rpx;" src="../../../../../static/images/search/nearstore_icon_screen.png" alt=""></span>
            <span class="shop_top_txt" @click="funcDialog">{{init_txt}}</span>
            <span><img class="images" style="width:16rpx; height:8rpx;" src="../../../../../static/images/search/nearstore_icon_down.png" alt=""></span>
        </div>
        <div class="shop_wrap">
            <div class="shop_item_ul" v-for="(item,index) in shop_list" :key="index" >
                <div class="shop_item_li" 
                @click="funcGetShopId(item)">
                    <div class="shop_item_img">
                        <img class="shop_item_src" :src="'https://www.leyou.com.cn/special/mall/' + item.url" alt="">
                    </div>
                    <div class="shop_item_info">
                        <div class="shop_item_info_title">
                            <span class="shop_item_title_left">{{item.shop_name}}</span>
                            <span class="shop_item_distance">{{item.distance}}km</span>
                        </div>
                        <div class="shop_item_info_address">
                            <div class="shop_item_info_address_left">{{item.address}}</div>
                            <div class="shop_item_info_go" v-if="initSource != 'search'">
                                <img class="shop_go_arrow_img" src="../../images/public_arrow_right.png" alt="">
                            </div>
                        </div>
                        <div class="shop_item_tel">{{item.phone}}</div>
                    </div>
                </div>
                <div class="sjop_item_init">
                    <span>
                        <template v-if="item.is_default">
                            <img class="images" style="width: 36rpx; height: 36rpx;" src="../../../../../static/images/public/publicCircle-checkOn.png" alt="">
                        </template>
                        <template v-else>
                            <img class="images" style="width: 36rpx; height: 36rpx;" src="../../../../../static/images/public/publicCircle-checkOff.png" alt="">
                        </template>
                    </span>
                    <span class="" style="padding-left: 12px;" @click="funcSetOffetShop(item)">设为常购</span>
                </div>
            </div>
        </div>
        <div class="weui-loadmore" v-if="!shop_list.length">
            <div class="weui-loading"></div>
            <div class="weui-loadmore__tips">正在加载...</div>
        </div>
        <!-- 省市 -->
        <div class="shop_dialog" v-if="hidden">
            <div class="shop_header" @click="funcGetLocationShops">
                <span>离我最近的门店</span>
                <span class="shop_arrow">
                    <img class="shop_arrow_img" src="../../../../../static/images/public_arrow_right.png" alt="">
                </span>
            </div>
            <div class="shop_content">
                <scroll-view scroll-y="true" class="shop_province">
                    <div 
                    class="shop_province_item" 
                    :class="{'active':index == curr_active}" 
                    v-for="(item,index) in province" 
                    :key="item.cityid"
                    @click="funcGetProvince(index,item)">
                        {{item.city}}
                    </div>
                </scroll-view>
                <div class="shop_citys">
                    <span 
                    class="shop_citys_text" 
                    v-for="item in citys" 
                    :key="item.areaid"
                    @click="funcCityShop(item)">
                        {{item.area}}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { getLocationShops,getLevelAddressTwo,updateOftenShop,getAdderssShops } from '@/api';
import { clearTimeout } from 'timers';
export default {
    data() {
        return {
            shop_list: [],
            init_txt: '附近门店',
            locationInfo: wx.getStorageSync('locationInfo'),
            get_level_address:[],
            province: [],
            curr_active: 0,
            citys: [],
            hidden: false,
            address_text: '',
            initSource: '',
            locationAllShop: [],
            filter_province_shop:[],
            init_city_name:''
        }
    },
    onLoad(opts){
        this.sa_page(this,false,'身边门店','');
        let that = this;
        wx.getSetting({
            success(res) {
                if( !res.authSetting['scope.userLocation'] ){
                    wx.showModal({
                        title: '提示',
                        content: '检测到您未授权获取当前地理位置，请允许获取！',
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    success(res) {
                                        if (res.authSetting['scope.userLocation']) {
                                            that.funcUserLocation();
                                        } else {
                                            that.funcInitGetDataAll();
                                        }
                                    }
                                });
                            } else if (res.cancel) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        }
                    });
                } else {
                    that.funcInitGetDataAll();
                }
            }
        })
        this.initSource = opts.source;
    },
    methods: {
        funcInitGetDataAll(){
            this.shop_list = [];
            if( !this.shop_list.length ){
                this.funcGetLocationShops();
            }
            this.funcGetLevelAddressTwo();
            this.funcGetAdderssShops();
        },
        funcUserLocation(){
            let that = this;
            wx.getLocation({
                type: "wgs84",
                success: function(res) {
                    wx.setStorageSync("locationInfo", {
                        latitude: res.latitude,
                        longitude: res.longitude
                    });
                    that.locationInfo = res;
                    that.funcInitGetDataAll();
                }
            });
        },
        //显示隐藏城市列表
        funcDialog(){
            this.hidden = !this.hidden;
            this.locationAllShop.forEach((item,index) => {
                if(item.city == this.init_city_name){
                    this.filter_province_shop = item.districts;
                    return false;
                }
            });
        },
        //设为常购
        funcSetOffetShop(item){
            let token = wx.getStorageSync('token');
            let query = {
                shop_id: item.shop_id.toString(),
                is_default:item.is_default?0:1
            }
            if(token) {
                updateOftenShop(query).then( res => {
                    this.shop_list.forEach((pro,index) => {
                        pro.is_default = false;
                    });
                    item.is_default = !item.is_default;
                })
            } else {
                wx.navigateTo({
                    url: '/pages/userCenter/login/wxLogin/main'
                })
            }
        },
        //获取省市联动
        funcGetProvince(n,i){
            this.curr_active = n;
            this.citys = this.get_level_address[n].areas;
            this.locationAllShop.forEach( (item,index) => {
                if(item.city == i.city){
                    this.filter_province_shop = item.districts;
                    return false;
                }
            });
        },
        funcCityShop(item){
            this.init_txt = `${this.province[this.curr_active].city} ${item.area}`;
            this.hidden = !this.hidden;
            this.shop_list = [];
            this.filter_province_shop.forEach((element,index) => {
                if( item.area == element.district ){
                    this.shop_list = element.shops;
                    return false;
                }
            });
            console.log(this.shop_list)
        },
        //获取身边门店
        funcGetLocationShops(){
            let query = {
                xcoordinate: this.locationInfo.longitude,
                ycoordinate: this.locationInfo.latitude
            }
            this.init_txt = '附近门店';
            getLocationShops(query).then( res => {
                let { shops } = res[0].districts[0];
                this.shop_list = shops;
                this.hidden = false;
            })
        },
        //附近门店
        funcGetAdderssShops(){
            let query = {
                xcoordinate: this.locationInfo.longitude,
                ycoordinate: this.locationInfo.latitude
            }
            getAdderssShops(query).then(res => {
                this.locationAllShop = res;
            })
        },
        //三级省市联动
        funcGetLevelAddressTwo(){
            this.province = [];
            getLevelAddressTwo().then( res => {
                this.get_level_address = res;
                this.citys = res[this.curr_active].areas;
                this.init_city_name = res[this.curr_active].city;
                res.forEach((element,index) => {
                    let json = {
                        "city": element.city,
                        "cityid": element.cityid
                    };
                    this.province.push(json)
                });
            })
        },
        //回退不同的页面
        funcGetShopId(item){
            let info = {
                shopId: item.shop_id,
                name: item.shop_name
            }
            if( this.initSource == 'search' ){
                this.$store.commit('shopLocationMutations', info);
                wx.navigateBack({
                    delta: 1
                });
            } else {
                this.$store.commit('shopgetStoreStaffsMutations',item);
                wx.navigateTo({
                    url: '/pages/search/shop/shopDetail/main'
                });
            }
        }
    }
}
</script>

<style scoped>
.shop_top {
    width: 100%;
    display: flex;
    padding-left: 28px;
    align-items: center;
    line-height: 64px;
    border-bottom: #DDDDDD 1px solid;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    background: #ffffff;
}
.shop_dialog{
    width: 100%;
    height: 100%;
    padding-top: 65px;
    margin: auto;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 8;
    background: #f3f5f7;
}
.shop_content {
    height: 100vh;
    display: flex;
}
.shop_province {
    width: 190px;
    height: 88vh;
    background: #ffffff;
}
.shop_wrap {
    margin-top: 65px;
}
.shop_top_txt {
    padding: 0 12px 0 28px;
    font-size: 30px;
    color: #FF5000;
}
.shop_item_ul {
    margin: 0 20px 20px 20px;
    padding: 20px 0;
    border-bottom: #EEEEEE 1px solid;
    
}
.shop_item_li {
    display: flex;
}
.shop_item_ul:last-child {
    border-bottom: 0;
}
.shop_item_img {
    width: 200px;
    height: 160px;
}
.shop_item_src {
    width: 200px;
    height: 160px;
    display: block;
}
.shop_item_info {
    padding-left: 20px;
    flex: 1;
}
.shop_item_info_title {
    display: flex;
    justify-content: space-between;
}
.shop_item_title_left {
    font-size: 30px;
    color: #333333;
    line-height: 42px;
}
.shop_item_distance {
    color: #999999;
    font-size: 24px;
}
.shop_item_tel {
    color: #666666;
    font-size: 24px;
    line-height: 30px;
}
.shop_item_info_address {
    padding: 12px 0 13px;
    display: flex;
    justify-content: space-between;
}
.shop_item_info_address_left {
    width: 420px;
    min-height: 60px;
    overflow: hidden;
    line-height: 30px;
    color: #666666;
    font-size: 24px;
}
.sjop_item_init {
    padding-top: 7px;
    font-size: 24px;
    color: #333333;
    line-height: 33px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.images {
    display: block;
}

.shop_province_item {
    width: 148px;
    height: 48px;
    border-radius: 24px;
    margin: 26px auto 40px;
    line-height: 48px;
    font-size: 26px;
    color: #151515;
    text-align: center;
}
.shop_province_item.active{
    background: #FF5000;
    color: #ffffff;
}
.shop_citys {
    flex: 1;
    padding-top: 28px;
}
.shop_citys_text {
    width: 166px;
    display: block;
    float: left;
    margin: 0 12px;
    line-height: 100px;
    text-align: center;
    font-size: 26px;
    color: #333333;
}
.shop_header {
    width: 100%;
    height: 88px;
    padding: 0 30px 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 88px;
    font-size: 26px;
    color: #333333;
    background: #ffffff;
}
.shop_arrow {
    width: 22px;
    height: 22px;
}
.shop_arrow_img {
    width: 12.2px;
    height: 22.3px;
    display: block;
}
.shop_go_arrow_img {
    margin-top: 20px;
    width: 12.2px;
    height: 22.3px;
    display: block;
}
</style>