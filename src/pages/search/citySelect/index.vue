<template>
    <div class="citys_wrap">
        <div class="quick_citys">
            <span class="quick_citys_zm" v-for="(val, key) in city_result" :key="key" @click.stop="funcQuickCitys(key)">{{key}}</span>
        </div>
        <scroll-view
            scroll-y
            style="height: 100vh;"
            :scroll-into-view="currView"
        >
            <div class="curr_citys">
                <span>当前：{{init_laction}}</span>
                <span class="reload_btn" @click.stop="funcRelocation">重新定位</span>
            </div>
            <div class="history_citys">
                <div class="history_title">历史访问城市</div>
                <div class="history_list">
                    <span class="citys_label" v-for="(item,j) in visitCityList" :key="j" @click.stop="funcCitysSave(item)">{{item}}</span>
                </div>
            </div>
            <div class="hot_citys">
                <div class="hot_title">热门城市</div>
                <div class="hot_list">
                    <span class="citys_label" v-for="(city, idx) in hotCityList" :key="idx" @click.stop="funcCitysSave(city.city_name)">{{city.city_name}}</span>
                </div>
            </div>
            <div class="citys_content">
                <div v-for="(val, key) in city_result" :key="key">
                    <div class="citys_content_tit" :id="'init_' + key">{{key}}</div>
                    <div class="citys_content_ul">
                        <div class="citys_content_li" v-for="(item,m) in city_result[key]" @click.stop="funcCitysSave(item.city_name)" :key="m">{{item.city_name}}</div>
                    </div>
                </div>
            </div>
        </scroll-view>
    </div>
</template>
<script>
import { setSelectCity } from "@/api"
import { mapak } from '@/utils';
import BMapWX from '@/utils/bmap-wx.min.js';
export default {
    data () {
        return {
            init_laction: '',
            currView: '',
            visitCityList: [], //历史城市
            hotCityList: [], //热门城市
            cityList: [],    //所有的城市
            selectCity: {},
            city_result: {},
            sort_citys: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        }
    },
    onLoad(option){
        this.sa_page(this,false,'选择城市','');
        this.initCityList();
    },
    onShow() {
        let history = wx.getStorageSync('historyCitys');
        let locationInfo = wx.getStorageSync("locationInfo");
        if(history){
            this.visitCityList = history;
        }
        let latitude = locationInfo.latitude;
        let longitude = locationInfo.longitude;
        this.funcSetLocaton(latitude, longitude);
    },
    methods: {
        funcSetLocaton(x, y) {
            let _this = this;
            var BMap = new BMapWX({ 
                ak: mapak
            });
            BMap.regeocoding({
                location: `${x},${y}`,
                fail: res => {}, 
                success: res => {
                    _this.init_laction = res.originalData.result.addressComponent.city;
                }
            });
        },
        funcRelocation() {
            let that = this;
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
                type: "wgs84",
                success: function(res) {
                    wx.setStorageSync("locationInfo", {
                        latitude: res.latitude,
                        longitude: res.longitude
                    });
                    that.funcSetLocaton(res.latitude, res.longitude);
                }
            });
        },
        initCityList() {
            setSelectCity().then((result) => {
                let _this = this;
                let json = {}
                // this.cityList = result.citys;
                this.hotCityList = result.hot_city;
                result.citys.forEach((item,index) => {
                    if(!json[item.first_spell]){
                        json[item.first_spell] = [];
                    }
                    json[item.first_spell].push(item)
                });
                console.log(json);
                _this.city_result = json;
            })
        },
        funcQuickCitys(city){
            this.currView = `init_${city}`;
        },
        funcCitysSave(item){
            this.visitCityList.push(item);
            this.visitCityList = this.funcUnique1(this.visitCityList);
            wx.setStorageSync('historyCitys',this.visitCityList);
            wx.setStorageSync('currCity',item);
            wx.navigateBack({
                delta: 1
            })
        },
        funcUnique1(arr){
            var hash=[];
            for (var i = 0; i < arr.length; i++) {
                if(hash.indexOf(arr[i])==-1){
                hash.push(arr[i]);
                }
            }
            return hash;
        }
    }
}
</script>

<style scoped>
.citys_wrap{
    background:#f3f5f7;
}
.curr_citys {
    padding: 0 20px;
    background: #ffffff;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26px;
    color: #333333;
}
.reload_btn {
    width: 160px;
    height: 48px;
    border-radius: 24px;
    border: #FF5000 1px solid;
    color: #FF5000;
    text-align: center;
    line-height: 48px;
}
.history_title {
    padding: 40px 0 28px;
    color: #999999;
    font-size: 26px;
    line-height: 28px;
}
.history_citys{
    padding-left: 20px;
    font-size: 26px;
    color: #333333;
}
.history_list,.hot_list {
    display: flex;
    flex-wrap: wrap;
}
.hot_title {
    padding: 20px 0 28px 20px;
    color: #999999;
    font-size: 26px;
    line-height: 28px;
}
.hot_list {
    padding-left: 20px;
    font-size: 26px;
    color: #333333;
}
.citys_label {
    width: 210px;
    height: 58px;
    margin-right: 20px;
    margin-bottom: 20px;
    border-radius: 29px;
    text-align: center;
    color: #333333;
    font-size: 26px;
    background: #ffffff;
    white-space: nowrap;
    line-height: 58px;
}
.citys_content {
    
}
.citys_content_tit{
    padding: 28px 0 28px 20px;
    color: #999999;
    font-size: 26px;
}
.citys_content_ul {
    padding-left: 20px;
    background: #ffffff;
}
.citys_content_li {
    height: 80px;
    font-size: 26px;
    line-height: 80px;
    color: #333333;
    border-bottom: #EEEEEE 1px solid;
}
.quick_citys {
    width: 30px;
    height: 100%;
    color: #FF5000;
    position: fixed;
    top: 0px;
    right: 20px;
    display: flex;
    flex-wrap: wrap;
    font-size: 24px;
    align-content: center;
    z-index: 999;
}
.quick_citys_zm {
    width: 30px;
    height: 35px;
    text-align: center;
    line-height: 35px;
}
</style>