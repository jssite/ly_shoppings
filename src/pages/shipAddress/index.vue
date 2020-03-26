<template>
    <div class="addressBox">
        <!-- 顶部search -->
        <div class="alike header">
            <span class="span" @click="funcSelectCity">{{location.city}}</span>
            <img class="sign_rimg" src="/static/images/public_arrow_down.png">
            <div class="search">
                <em class="search_icon">
                    <img src="/static/images/navbar_search.png" class="search__img">
                </em>
                <input type="text" v-model="keys" class="search_value" placeholder="请输入收货地址" disabled @click="searchaddress">
            </div>
        </div>
        <!-- 当前定位 -->
        <div v-if="true" class="beforeplace">
            <div class="place">当前位置</div>
            <div class="alike fixed">
                <template v-if="is_reload">
                    <img class="fixed_img" src="/static/images/twohr_icon_location.png">
                    <div class="span fixed_txt">
                        <span class="wrap_text_align">{{init_laction}}</span>
                    </div>
                </template>
                <template v-else>
                    <img class="fixed_img" src="/static/images/twohr_icon_location.png" @click='gotoLedelivery'>
                    <div class="span fixed_txt" @click='gotoLedelivery'>
                        <span class="wrap_text_align">{{location.street_number}}</span>
                    </div>
                </template>
                <div class="fixed_again" @click="funcRelocation">重新定位</div>
            </div>
        </div>
        <!-- 地址提示 -->
        <div v-if="true" class="addresswarn">为了更准确的为您提供服务，请选择配送地址</div>
        <template v-if="token" >
            <!-- 地址显示 -->
            <div class="shipadd" v-if="!is_address">
                <div style="padding-bottom:180rpx;">
                    <v-shipaddress :addresslist="addresslist"></v-shipaddress>
                </div>
                <!-- <div class="ADDaddress" @click="ADDaddress">添加新地址</div> -->
                <div class=" addresss_add_m" :class="{iPhone:phonestyleShow}">
                <navigator style="width:710rpx" class="ADDaddress" url="/pages/shipAddress/changeAddress/main" hover-class="none">添加新地址</navigator>
                </div>
            </div>
            <!-- 无数据 -->
            <div v-else class="Norecord">
                <img class="Nrimg" src="/static/images/public/public_empty_pic.png" alt>
                <span class="span NrSpan">暂无地址信息</span>
                <navigator class="ADDaddress" url="/pages/shipAddress/changeAddress/main" hover-class="none">添加新地址</navigator>
            </div>
        </template>
        <template v-else>
            <div class="Norecord">
                <img class="Nrimg" src="/static/images/public/public_empty_pic.png" alt>
                <span class="span login_span">为了提供更精准的服务，请登录您的账号</span>
                <navigator class="ADDaddress" url="/pages/userCenter/login/wxLogin/main" hover-class="none" >登录</navigator>
            </div>
        </template>
    </div>
</template>
<script>
import shipaddress from "@/components/shipaddress";
import BMapWX from '@/utils/bmap-wx.min.js';
import { mapak } from '@/utils';
import { gainAddressList, reviseAddress, getUserLocation } from "@/api";
export default {
    components: {
        "v-shipaddress": shipaddress
    },
    data() {
        return {
            location:{
                city: '定位失败',
                street_number: ''
            },
            is_select: false,
            shop_id: "",
            token: '',
            locationInfo: wx.getStorageSync("locationInfo"),
            is_address: false,
            is_reload: false,
            init_laction: '定位失败',
            addresslist: [],
            phonestyleShow:false
        };
    },
    onLoad(){
        this.phonestyleShow = false;
        this.sa_page(this,false,'收货地址','');
        Object.assign(this.$data, this.$options.data());
        let phoneMobile = wx.getStorageSync('phoneMobile'); //判断是否为IPhonex
        console.log(phoneMobile);
        if(phoneMobile.model.indexOf('X')>-1 || phoneMobile.model.indexOf('unknown<iPhone11,8>')>-1){
            this.phonestyleShow = true;
        }
        let token = wx.getStorageSync("token"); //用户返回上一页
        let shan_shop_id = wx.getStorageSync('shan_shop_id')
        if(token || shan_shop_id){
            wx.removeStorageSync('leshonghome');
        }else{
            wx.setStorageSync('leshonghome',true)
        }
    },
    onShow() {
        wx.removeStorageSync('leshonghome')
        this.is_select = false;
        this.windowHeight = wx.getStorageSync('windowHeight')
        this.token = wx.getStorageSync("token");
        let locationInfo = wx.getStorageSync("locationInfo");
        let currCity =  wx.getStorageSync("currCity");
        if( !locationInfo ) {
            this.is_reload = true;
        }
        let latitude = locationInfo.latitude;
        let longitude = locationInfo.longitude;
        if(currCity){
            this.location.city = currCity;
        }
        if( locationInfo.longitude ){
            this.funcSetLocaton(latitude, longitude);
        }
        this.funcGetShopId();
        this.funcGetAddress();
    },
    // onUnload(){
    //     if(this.location.street_number == ''){
    //         wx.switchTab({
    //             url:'/pages/index/main'
    //         })
    //     }
    // },
    methods: {
        //获取shopId
        funcGetShopId() {
            let shopId = wx.getStorageSync('shan_shop_id');
            let locationInfo = wx.getStorageSync("locationInfo");
            let params = {
                location_info: {
                    poi_address: "",
                    poi_name: "",
                    latitude: locationInfo.latitude,
                    longitude: locationInfo.longitude
                }
            };
            if( !shopId ) {
                getUserLocation(params).then(res => {
                    wx.setStorageSync('shan_shop_id', res.shop_id)
                    this.funcGetAddress();
                });
            }
            
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
                    console.log(res)
                    let currCity =  wx.getStorageSync("currCity");
                    // _this.location.street_number = res.originalData.result.addressComponent.street + res.originalData.result.addressComponent.street_number;
                     _this.location.street_number = res.originalData.result.sematic_description;
                    if(!currCity){
                        _this.location.city = res.originalData.result.addressComponent.city;
                        wx.setStorageSync("currCity",_this.location.city);
                    }
                }
            });
        },
        // 获取地址列表
        funcGetAddress() {
            let params = {
                shop_id: wx.getStorageSync('shan_shop_id')
            };
            if (this.token) {
                gainAddressList(params).then(res => {
                    if (JSON.stringify(res)!='{}') {
                        this.addresslist = res.address_list;
                        // debugger
                    } else {
                        this.is_address = true;
                    }
                });
            }
        },
        // 重新定位
        funcRelocation() {
            let that = this;
            that.is_reload = true;
            that.is_select = true;
            that.init_laction = '定位中...'
            wx.getSetting({
                success(res) {
                    if( res.authSetting['scope.userLocation'] ){
                        that.funcUserLocation();
                    } else {
                        wx.openSetting({
                            success(res) {
                                if (res.authSetting['scope.userLocation']) {
                                    that.funcGetShopId();
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
                    that.funcGetAddress();
                }
            });
        },
        searchaddress() {
            this.is_select = true;
            wx.navigateTo({ 
                url: "/pages/search/quickGoods/main" 
            });
        },
        //城市列表
        funcSelectCity(){
            let that = this;
            wx.navigateTo({
                url:'/pages/search/citySelect/main?city=' + that.location.city
            })
        },
        gotoLedelivery(){ //跳转到乐闪送首页
            wx.showLoading({title: '正在加载中', mask: true});
            if(!this.is_reload){
                // let shopId = wx.getStorageSync('shan_shop_id');
                let locationInfo = wx.getStorageSync("locationInfo");
                let params = {
                    location_info: {
                        poi_address: "",
                        poi_name: "",
                        latitude: locationInfo.latitude,
                        longitude: locationInfo.longitude,
                        user_select_location:1
                    }
                };
                getUserLocation(params).then(res => {
                    wx.hideLoading();
                    if(res.shop_id){
                        wx.setStorageSync('shan_shop_id', res.shop_id)
                        wx.redirectTo({url:'/pages/leDelivery/index/main?shan_shop_id='+res.shop_id})
                        // wx.navigateBack({
                        //     delta: 1
                        // })
                    }else{
                        wx.showToast({
                            title: '该地址不在配送范围',
                            icon: 'none'
                        })
                    }
                });
            }
        }
    }
};
</script>
<style scoped>
.addressBox {
    /* background: #f3f5f7; */
    /* height: 100vh; */
    /* min-height: 2000rpx; */
}
.alike {
    display: flex;
    align-items: center;
    height: 88rpx;
    width: 100%;
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
/* 中间的提示 */
.addresswarn {
    height: 32rpx;
    /* margin-top: 35rpx; */
    font-size: 26px;
    color: #999999;
    line-height: 32px;
    padding: 35rpx 0 28rpx 28rpx;
    background: #f3f5f7;
}
/* 当前定位标签 */
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
    padding-bottom: 28rpx;
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
    font-size: 26rpx;
    border: 1px solid #ff5000;
    border-radius: 26px;
    height: 48rpx;
    width: 160rpx;
    text-align: center;
    line-height: 48rpx;
    color: #ff5000;
}
/* 顶部导航 */
.header {
    border-bottom: 1rpx solid #f3f5f7;
}
.header .search {
    position: relative;
    background: #f2f2f2;
    border-radius: 40rpx;
    height: 56rpx;
    width: 562rpx;
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
/* 添加新地址 */
.ADDaddress {
    background: #ff5000;
    border-radius: 50px;
    height: 80rpx;
    width: 320rpx;
    margin: 0 auto;
    text-align: center;
    line-height: 80rpx;
    font-family: PingFangSC-Regular;
    font-size: 30px;
    color: #ffffff;
    text-align: center;
}


.addresss_add_m {
    position: fixed;
    /* left: 0; */
    height: 100rpx;
    bottom: 0;
    /* left: 0; */
    width: 100%;

}

.iPhone {
    bottom: 68rpx;
}

/* 现在地址 */
.shipadd {
    background: #ffffff;
    border-radius: 30rpx;
    /* min-height: 732rpx; */
    width: 750rpx;
}
/* 暂无数据 */
.Norecord {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* text-align: center; */
    /* width: 400rpx; */
    margin: 0 auto;
    margin-top: 172rpx;
}
.Norecord .Nrimg {
    width: 218rpx;
    height: 218rpx;
}
.NrSpan {
    margin-top: 40rpx;
    margin-left: 0;
    line-height: 40px;
    margin-bottom: 218rpx;
}
.login_span {
    padding-top: 50px;
    margin-bottom: 100px;
}
</style>



