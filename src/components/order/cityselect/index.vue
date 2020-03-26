<template>
    <div class="citys_wrap">
        <div class="quick_citys">
            <span class="quick_citys_zm" v-for="(item,i) in sort_citys" :key="i" @click.stop="funcQuickCitys(i)">{{item}}</span>
        </div>
        <scroll-view
            scroll-y
            style="height: 100vh;"
            :scroll-into-view="currView"
        >
            <div class="curr_citys">
                <span>当前：昆明</span>
                <span class="reload_btn">重新定位</span>
            </div>
            <div class="history_citys">
                <div class="history_title">历史访问城市</div>
                <div class="history_list">
                    <span class="citys_label" v-for="(item,j) in visitCityList" :key="j">{{item}}</span>
                </div>
            </div>
            <div class="hot_citys">
                <div class="hot_title">热门城市</div>
                <div class="hot_list">
                    <span class="citys_label" v-for="(city, idx) in hotCityList" :key="idx">{{city.city_name}}</span>
                </div>
            </div>
            <div class="citys_content">
                <div class="citys_content_tit" id="init_1">A</div>
                <div class="citys_content_ul">
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                    <div class="citys_content_li" @click.stop="funcCitysSave('阿拉善盟')">阿拉善盟</div>
                </div>
                <div class="citys_content_tit" id="init_2">B</div>
                <div class="citys_content_ul">
                    <div class="citys_content_li">1阿拉善盟</div>
                    <div class="citys_content_li">2阿拉善盟</div>
                    <div class="citys_content_li">3阿拉善盟</div>
                    <div class="citys_content_li">阿拉善盟</div>
                    <div class="citys_content_li">阿拉善盟</div>
                    <div class="citys_content_li">阿拉善盟</div>
                    <div class="citys_content_li">阿拉善盟</div>
                    <div class="citys_content_li">阿拉善盟</div>
                    <div class="citys_content_li">阿拉善盟</div>
                    <div class="citys_content_li">阿拉善盟</div>
                    <div class="citys_content_li">阿拉善盟</div>
                    <div class="citys_content_li">阿拉善盟</div>
                </div>
            </div>
        </scroll-view>
    </div>
</template>
<script>
import { setSelectCity } from "@/api"
export default {
    data () {
        return {
            currView: '',
            visitCityList: [], //历史城市
            hotCityList: [], //热门城市
            cityList: [],    //所有的城市
            selectCity: {},
            sort_citys: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        }
    },
    onLoad(){
        this.initCityList();
    },
    onShow() {
        console.log(wx.getStorageSync('historyCitys'));
        let history = wx.getStorageSync('historyCitys');
        if(history){
            this.visitCityList = history;
        }
        
    },
    methods: {
        initCityList() {
            setSelectCity().then((result) => {
                this.cityList = result
                this.hotCityList = result.hot_city;
            })
        },
        funcQuickCitys(city){
            this.currView = `init_${city}`;
        },
        funcCitysSave(item){
            this.visitCityList.push(item);
            let arr = this.funcUnique1(this.visitCityList);
            wx.setStorageSync('historyCitys',arr);
            
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