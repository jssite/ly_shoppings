<template>
    <div class="scan_content">
        <navigator url="/pages/scanShop/search/main" hover-class="none">
            <div class="search_val">
                <div class="search_icon"><img src="/static/images/navbar_search.png" class="search_icon" alt=""></div>
                <div>请输入门店名称、地址或商圈</div>
            </div>
        </navigator>
        <div class="curr_location">
            <div class="curr_location_tit">当前定位</div>
            <div class="curr_location_info">
                <div class="location_address">
                    <img class="curr_icon" src="/static/images/twohr_icon_location.png" alt="">
                    <div class="location_address_txt">
                        <template v-if="location">
                            {{location}}
                        </template>
                        <template v-else>
                            无法获取定位地址，请开启定位
                        </template>
                    </div>
                </div>
                <template v-if="location">
                    <div class="location_reload_btn" @click="funcRelocation">重新定位</div>
                </template>
                <template v-else>
                    <div class="location_reload_btn" @click="funcRelocation">开启定位</div>
                </template>
                
            </div>
        </div>
        <template v-if="is_location">
            <div class="location_open">
                <img class="location_map" src="/static/images/public_location_pic.png" alt="">
                <div class="location_open_txt">开启定位，我们将会给您提供更好的服务</div>
                <div class="location_open_btn" @click="funcRelocation">去开启</div>
            </div>
        </template>
        <template v-else>
            <template v-if="is_data">
                <div class="location_result">
                    <img class="shop_no_img" src="/static/images/public/public_empty_pic.png" alt="">
                    <div class="shop_no_data">请输入您所在门店的地址信息搜索</div>
                </div>
            </template>
            <template v-else>
                <div class="location_shop_list" v-if="bought_shop">
                    <div class="location_shop_title">{{bought_shop.name}}</div>
                    <div class="location_shop_content" @click="funcSaveLocation(product)" v-for="(product,m) in bought_shop.shop_list" :key="m">
                        <div class="location_shop_info">
                            <div class="location_shop_name">
                                {{product.shop_name}}
                            </div>
                            <div class="location_shop_address">
                                {{product.address}}
                            </div>
                            <div class="location_shop_time" v-if="product.work_time">可提货时间：{{product.work_time}}</div>
                        </div>
                        <div class="location_shop_range">
                            <div class="location_range_icon">
                                <img class="location_icon" src="/static/images/shop_store_location.png" alt="">
                            </div>
                            <div class="location_range_number">{{product.distance_str}}</div>
                        </div>
                    </div>
                </div>
                <div class="location_shop_list" v-if="ne_address_shop">
                    <div class="location_shop_title">{{ne_address_shop.name}}</div>
                    <div class="location_shop_content" @click="funcSaveLocation(product)" v-for="(product,m) in ne_address_shop.shop_list" :key="m">
                        <div class="location_shop_info">
                            <div class="location_shop_name">
                                {{product.shop_name}}
                            </div>
                            <div class="location_shop_address">
                                {{product.address}}
                            </div>
                            <div class="location_shop_time" v-if="product.work_time">可提货时间：{{product.work_time}}</div>
                        </div>
                        <div class="location_shop_range">
                            <div class="location_range_icon">
                                <img class="location_icon" src="/static/images/shop_store_location.png" alt="">
                            </div>
                            <div class="location_range_number">{{product.distance_str}}</div>
                        </div>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import BMapWX from '@/utils/bmap-wx.min.js';
import { mapak } from '@/utils';
import { getLocationShopsList } from "@/api";
export default {
    data() {
        return {
            search_val: '',
            location: '',
            is_location: true,
            is_data: false,
            shop_lists: null,
            ne_address_shop: null,
            bought_shop: null
        }
    },
    onShow(){
        this.funcGetLocation();
        this.funcGetLocationShopsList();
    },
    methods: {
        /* 获取门店列表 */
        funcGetLocationShopsList(){
            let storage = wx.getStorageSync('locationInfo')
            let params = {
                longitude: storage.longitude,
                latitude: storage.latitude
            }
            getLocationShopsList(params).then( res => {
                let { header, body: { shop_map } } = res;
                if( header.res_code == 0 ){
                    this.ne_address_shop = shop_map.ne_address_shop;
                    this.bought_shop = shop_map.bought_shop;
                    if( shop_map.ne_address_shop || shop_map.bought_shop ){
                        this.is_data = false;
                    } else {
                        this.is_data = true;
                    }
                }
            })
        },
        /* 获取地址 */
        funcGetLocation(){
            let _this = this;
            let storage = wx.getStorageSync('locationInfo');
            let address = '';
            let BMap = new BMapWX({ 
                ak: mapak
            });
            if( !storage ) return false;
            _this.location = '定位中...';
            BMap.regeocoding({
                location: `${storage.latitude},${storage.longitude}`,
                fail: res => {}, 
                success: res => {
                    _this.location = ''
                    _this.is_location = false;
                    _this.location = res.originalData.result.sematic_description;
                }
            });
        },
        /* 重新定位 */
        funcRelocation() {
            let that = this;
            that.location = '定位中...'
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
                                    that.location = ''
                                }
                            }
                        });
                    }
                }
            })
        },
        /* 定位 */
        funcUserLocation(){
            let that = this;
            wx.getLocation({
                type: "gcj02",
                success: function(res) {
                    wx.setStorageSync("locationInfo", {
                        latitude: res.latitude,
                        longitude: res.longitude
                    });
                    that.funcGetLocation();
                    that.funcGetLocationShopsList();
                }
            });
        },
        /* 缓存信息 */
        funcSaveLocation(item){
            // wx.setStorageSync('scan_location',JSON.stringify(item))
            wx.setStorageSync('shop_name',item.shop_name)
            wx.setStorageSync('shop_id',item.shop_id)
            wx.navigateBack({
                delta: 1
            });
            // wx.redirectTo({
            //     url: '/pages/confirm/scancode/manage/main'
            // });
        }
    }
}
</script>

<style scoped>
.search_val {
    display: block;
    margin: 0 20px 13px;
    height: 52px;
    line-height: 52px;
    padding-left: 20px;
    box-sizing: border-box;
    border-radius: 26px;
    background: #F2F2F2;
    color: #CACACA;
    font-size: 30px;
    display: flex;
    align-items: center;
}
.curr_location {
    padding-bottom: 28px;
}
.curr_location_tit {
    border-top: #f3f5f7 1px solid;
    padding: 20px 0 20px 20px;
    color: #999999;
    font-size: 26px;
    line-height: 32px; 
}
.location_address {
    display: flex;
    align-items: center;
}
.curr_location_info {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    font-size: 30px;
    line-height: 48px;
    align-items: center;
    color: #333333;
}
.location_reload_btn {
    width: 160px;
    height: 48px;
    border-radius: 24px;
    text-align: center;
    border: #FF5000 1px solid;
    color: #FF5000;
}
.location_shop_title {
    padding: 34px 28px 22px;
    background: #f3f5f7;
    color: #999999;
    font-size: 26px;
    line-height: 32px;
}
.location_shop_content {
    padding: 0 20px 28px;
    font-size: 26px;
    color: #666666;
    line-height: 37px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: #f3f5f7 1px solid;
}
.location_shop_name {
    font-weight: 600;
    padding: 28px 0;
    font-size: 30px;
    color: #333333;
    line-height: 32px;
}
.location_shop_info {
    width: 560px;
}
.location_shop_address {
    padding-bottom: 8px;
    line-height: 30px;
}
.location_shop_time {
    line-height: 37px;
}
.location_shop_range {
    /* width: 160px; */
    width: 120rpx;
    text-align: center;
    padding-top: 28rpx;
}
.location_address_txt {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 440px;
}
.location_icon {
    width: 28px;
    height: 34px;
    margin-bottom: 12px;
}
.curr_icon {
    width: 22px;
    height: 28px;
    margin-right: 12px;
}
.location_open {
    background: #f3f5f7;
    min-height: 84vh;
    text-align: center;
}
.location_map {
    width: 270px;
    height: 240px;
    margin-top: 205px;
}
.location_open_txt {
    padding: 40px 0 60px;
    font-size: 30px;
    color: #333333;
}
.location_open_btn {
    width: 240px;
    height: 72px;
    margin: auto;
    border-radius: 36px;
    color: #ffffff;
    background: #FF5000;
    font-size: 30px;
    line-height: 72px;
    text-align: center;
}
.shop_no_img {
    width: 266px;
    height: 222px;
    margin: 220px 0 40px;
}
.location_result {
    height: 84vh;
    background: #f3f5f7;
    text-align: center;
    font-size: 30px;
    color: #333333;
}
.search_icon {
    width: 30px;
    height: 31px;
    margin-right: 13px;
    display: block;
    vertical-align: top;
}
</style>