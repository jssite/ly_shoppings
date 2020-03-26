<template>

    <div class="dialog" catchtouchmove='true'>
        <image class="close" @click="closeDialog" src="/static/images/public_pop_close.png"></image>
        <div class="optcity" v-if="showchange==2">
            <optcity @deliverModal="deliverModal"></optcity>
        </div>
        <div class="dialog-content" v-if="showchange==4">
            <div class="title">选择收货地址</div>
            <scroll-view scroll-y="true" class="address-list">
                <div class="list-box" v-for="(item,index) in address_list" @click="seclectListIndex(index)">
                    <img v-if="address_id===item.address_id"  class="select" src="../../../pages/cutprice/images/public_check_on_sale.png" alt="">
                    <img v-else  class="select" src="/static/images/public/publicCircle-checkOff.png" alt="">
                    <p class="name-title" >
                        <span class="name-span">{{item.consignee}}</span>
                        <span>{{item.mobile}}</span>
                    </p>
                    <p>{{item.add_detail}}</p>
                </div>
            </scroll-view>
            <p class="add-address" @click="addAddress">添加新地址</p>

        </div>
        <div class="dialog-content" v-if="showchange==1">
            <div class="title">新增收货地址</div>
            <div >
                <form @submit="formSubmit" report-submit bindreset="formReset">
                    <div class="changeAddalike">
                        <text>收货人：</text>
                        <input placeholder-style="color:#cacaca" v-model="addFormData.username" maxlength="12" placeholder="请填写收货人" >
                    </div>
                    <div class="changeAddalike">
                        <text>手机号码：</text>
                        <input  placeholder-style="color:#cacaca"
                                v-model="addFormData.userphone"
                                type="number"
                                maxlength="11"
                                placeholder="请填写手机号码"
                        >
                    </div>
                    <div @click.stop="showChangeModel" class="changeAddalike">
                        <text>所在地区：</text>
                        <div v-if="!addFormData.province"  @click="showChangeModel" class="changeAddinfotip" >点击选择所在地区</div>
                        <div
                                v-if="addFormData.province"
                                class="changeAddinfo"
                        >{{addFormData.province}}{{addFormData.city}}{{addFormData.area}}</div>
                        <img class="ADDressimg" src="/static/goodsdetail/lecard_arrow_right.png">
                    </div>
                    <div class="changeAddalike" @click="relocation">
                        <text>收货地址：</text>
                        <input placeholder-style="color:#cacaca" v-model="addFormData.userdetailedaddress"  disabled placeholder="点击选择收货地址" >
                        <img class="ADDressimg" src="/static/goodsdetail/lecard_arrow_right.png">
                    </div>
                    <div class="changeAddalike">
                        <text>门牌号：</text>
                        <input  placeholder-style="color:#cacaca" v-model="addFormData.userdoor"  placeholder="请输入门牌号" >
                    </div>
                    <button class="confirm" form-type="submit" data-type="click">保存</button>
                </form>

            </div>
        </div>
        <div class="dialog-content" v-if="showchange==3">
            <div class="title">选择收货地址</div>
            <div class="top">
                <div class="address">
					<span class="cityText" @click="showSelect()">{{cityText}}
					<img class="arrow" v-if="!selcetBtn" src="/static/images/public/public_arrow_down.png" alt="">
									<img class="arrow" v-if="selcetBtn" src="/static/images/public/public_arrow_up.png" alt="">
					</span>
                    <div   @click="showSelect()" class="dialog-select" v-if="selcetBtn">
                        <div class="address-box" v-if="selcetBtn" >
                            <div class="left" @click.stop>
                                <p :class="actIndex==index?'city-text active-city':'city-text'" v-for="item in addData" :key="index" @click="selectCity(index)">{{item.city}}

                                </p>
                            </div>
                            <div class="right" @click.stop>
                                <span v-if="addData[actIndex]" class="area-text" @click="selectArea(index)" v-for="item in addData[actIndex].areas" :key="index">{{item.area}}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="homeTopSelect">
                    <input  placeholder-style="color:#cacaca"  class="input" placeholder="输入关键字" auto-focus type="text" @input="bindKeyInput" >
                    <img class="position selectImg" src="/static/images/navbar_search.png">
                </div>
            </div>
            <div class="address-list-select-box">
                <div class="address-list-select" v-for="item in sugData" @click="selectList(item)">
                    <p class="address-list-name">{{item.name}}</p>
                    <p class="address-list-city">{{item.city}}</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import BMapWX from '@/utils/bmap-wx.min.js';
    import { mapak } from '@/utils';
    import { isEmpty, ischaracter, isNumphone } from "@/utils/index";
    import optcity from '@/components/public/optcity'
    import {
        gainAddressList,
        reviseAddress,
        getCartAllData ,synAllShoppingCart,getShopStock,getAdvertisement,getLevelAddressTwo
    } from '@/api'
    export default {
        props:{
            address_id:""
        },
        data(){
            return{
                address_list:"",
                region:{},
                showchange:4,
                sugData:"",
                shops:[],
                goodsList:[],
                showBtn:false,
                xuanBtn:false,
                noGoodsBtn:false,
                actIndex:0,
                areaIndex:'',
                searchText:'',
                addData:'',
                cityText:'北京市',
                regiontext:'北京市',
                shop_area_id:'',
                selcetBtn:false,
                options:{},
                selectIndex:"",
                addFormData:{
                    province:"",
                    province:"",
                    city:"",
                    area:"",
                    province_id:"",
                    city_id:"",
                    area_id:"",
                    userdetailedaddress:"",
                    poi_name:"",
                    username:"",
                    userphone:"",
                }
            }
        },
        components:{
            optcity
        },
        onLoad(){
            this.addFormData={
                province:"",
                province:"",
                city:"",
                area:"",
                province_id:"",
                city_id:"",
                area_id:"",
                userdetailedaddress:"",
                poi_name:"",
                username:"",
                userphone:"",
            }
            console.log()
            this.searchText=''
            this.cityText='北京市'
            this.shops=[]
            this.xuanBtn=false
            this.goodsList=[]
            this.actIndex=0
            this.selcetBtn=false
            this.showBtn=false
            this.shop_area_id=''
            this.options={}
            this.noGoodsBtn=false
            this.funcSetLocaton(wx.getStorageSync('locationInfo').latitude,wx.getStorageSync('locationInfo').longitude)
            getLevelAddressTwo({}).then(res=>{
                this.addData=res
            })
            this.UserAddressinfo()
        },
        mounted(){
        },

        methods:{
            seclectListIndex(index){

                this.selectIndex=index
                var _this =this
                this.addlistData=this.address_list[index]
                this.$emit('selectChanege',this.addlistData)
               setTimeout(function(){
                   _this.closeDialog()
                },200)
            },
            selectList(data){
                console.log(data)
                this.addFormData.poi_name = data.name;
                this.addFormData.userdetailedaddress=data.province+data.city+data.district+data.name
                this.addFormData.location=data.location
                this.showchange=1
            },
            formSubmit() {
                console.log(this.addFormData)
                let _this = this;
                let username = this.addFormData.username;
                let userphone = this.addFormData.userphone;
                let userdetailedaddress = this.addFormData.userdetailedaddress;
                let userdoor = this.addFormData.userdoor;
                if (isEmpty(username)) {
                    wx.showToast({ title: "请填写收货人姓名", icon: "none" });
                    return;
                } else if (!ischaracter.test(username)) {
                    wx.showToast({ title: "用户名只能输入中英文", icon: "none" });
                    return;
                } else if (isEmpty(userphone)) {
                    wx.showToast({ title: "请填写手机号码", icon: "none" });
                    return;
                } else if (!isNumphone.test(userphone)) {
                    wx.showToast({ title: "手机格式错误", icon: "none" });
                    return;
                } else if (isEmpty(userdetailedaddress)) {
                    wx.showToast({ title: "请选择收货地址", icon: "none" });
                    return;
                } else if (isEmpty(userdoor)) {
                    wx.showToast({ title: "请选择收货地址", icon: "none" });
                    return;
                }
                wx.showLoading({
                    title: "加载中"
                });
                var params = {
                    consignee: username,
                    mobile: userphone,
                    add_detail: userdetailedaddress,
                    door_number: userdoor,
                    province: this.addFormData.province,
                    city: this.addFormData.city,
                    area: this.addFormData.area,
                    province_id: this.addFormData.province_id + "",
                    city_id: this.addFormData.city_id + "",
                    area_id: this.addFormData.area_id + "",
                    poi_name:this.addFormData.poi_name + "",
                };

                if (this.addFormData.location.lat) {
                    params.latitude = this.addFormData.location.lat + '';
                }

                if (this.addFormData.location.lng) {
                    params.longitude = this.addFormData.location.lng + '';
                }
                let shop_id = wx.getStorageSync('shan_shop_id');
                if (shop_id && shop_id != '') {
                    params.shop_id = shop_id;
                }
                console.log(params)
                reviseAddress(params).then(res => {
                wx.showToast({ title: "保存成功", icon: "none" });
                wx.hideLoading();
                this.showchange=4
                this.UserAddressinfo()
            });
            },

            deliverModal(data){

                this.addFormData.province=data.provinceName;
                this.addFormData.city=data.DcityName;
                this.addFormData.area=data.areaName;
                this.addFormData.province_id=data.provinceId;
                this.addFormData.city_id=data.DcityId;
                this.addFormData.area_id=data.areaId;
                this.showchange=1
                console.log(data)
            },
            addAddress(){
                this.showchange=1;

            },
            closeDialog(){
                if(this.showchange!=1&&this.showchange!=4){
                    this.showchange=1
                }else if(this.showchange==1){
                    this.showchange=4;
                }else{
                    this.showchange=0;
                    this.$emit('closeDialog')
                }
            },
            selectArea(index){
                this.areaIndex=index
                this.shop_area_id=this.addData[this.actIndex].areas[this.areaIndex].areaid
                this.cityText=this.addData[this.actIndex].city+' '+this.addData[this.actIndex].areas[this.areaIndex].area
                this.regiontext=this.addData[this.actIndex].city
                this.selcetBtn=false
            },
            showSelect(){
                this.selcetBtn=!this.selcetBtn
            },
            funcSetLocaton(x, y) {

                let _this = this;
                var BMap = new BMapWX({
                    ak: mapak
                });
                BMap.regeocoding({
                    location: `${x},${y}`,
                    fail: err => {
                    console.log(err,'222222222222222')

            },
                success: res => {
                    _this.cityText=`${res.originalData.result.addressComponent.city}  ${res.originalData.result.addressComponent.district}`
                    // console.log(res,'222222222222222')
                    _this.regiontext=res.originalData.result.addressComponent.city
                    // _this.location.street_number = res.originalData.result.addressComponent.street + res.originalData.result.addressComponent.street_number;
                    // _this.location.city = res.originalData.result.addressComponent.city;
                },
                complete:data=>{
                    console.log(data,'222222222222222')

                }
            });
            },
            selectCity(index){
                this.actIndex=index
            },
            addText(){
                this.shops.forEach(res=>{
                    if(res.shop_name.indexOf(this.searchText)!=-1||res.shop_address.indexOf(this.searchText)!=-1){
                        res.show=false
                    }else{
                        res.show=true
                    }
                })
            },
            relocation(){
                this.showchange=3

            },
            bindKeyInput: function(e) {
                console.log(e)
                var that = this;
                // 新建百度地图对象
                var BMap = new BMapWX({
                    ak: mapak
                });
                var fail = function(data) {
                    console.log(data)
                };
                var success = function(data) {
                    that.sugData=data.result
                    console.log(that.sugData)
                }
                // 发起suggestion检索请求
                BMap.suggestion({
                    query: e.target.value,
                    region: this.regiontext,
                    city_limit: true,
                    fail: fail,
                    success: success
                });
            },

            showChangeModel(){
                this.showchange=2
            },
            UserAddressinfo() { //获取地址
                gainAddressList().then(res => {
                    this.address_list = res.address_list;
                });
            },
        }
    }
</script>

<style scoped>
    .inputplaceholder{
            color: red;
        }
    .selectspan{
        height: 35rpx;
        width: 35rpx;
        position: absolute;
        top: 60rpx;
        left: 20rpx;
        display: inline-block;
        border:1px solid #eee;
        border-radius: 50%;
    }
    .select{
        height: 36rpx;
        width: 36rpx;
        position: absolute;
        top: 60rpx;
        left: 20rpx;
    }
    .close{
        position: absolute;
        z-index: 999;
        right:0;
        top: calc(100% - 800rpx);
        height: 40rpx;
        width: 40rpx;
        padding: 20rpx;
    }
    .address-list-select-box{
        height: 600rpx;
        overflow: auto;
    }
    .address-list-select{
        border-bottom: 1px solid #eee;
    }
    .address-list-name{
        font-family: PingFangSC-Regular;
        font-size: 30rpx;
        color: #333;
        letter-spacing: 0;
        line-height: 32px;
        padding: 24rpx 20rpx 12rpx;
    }
    .address-list-city{
        font-family: PingFangSC-Light;
        font-size: 26rpx;
        color: #999999;
        letter-spacing: 0;
        line-height: 28px;
        padding: 0  20rpx 24rpx;

    }
    .arrow{
        width: 22rpx;
        height: 12rpx;
        vertical-align: middle;
    }
    .pic-right{
        height: 22rpx;
        width: 12rpx;
        padding-left: 20rpx;
        padding-bottom: 8rpx;
        vertical-align: middle;
        display: inline-block;
    }
    /* 搜索栏 */

    .cityText{
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 70rpx;
        font-size: 26rpx;
    }
    .area-text{
        display: inline-block;
        width: 33%;
        height: 80rpx;
        line-height:80rpx;
        text-align: center;
        font-size: 24rpx;
    }
    .area-text:active{
        background: #999;
    }
    .top{
        background: #fff;
        width: 100%;
        height: 70rpx;
        display: flex;
        align-items:center;
    }
    .address-box{
        position: absolute;
        width: 750rpx;
        height: 700rpx;
        top: 80rpx;
        background: #F3F5F7;
    }
    .address{
        width: 240rpx;
        height: 70rpx;
        text-align: center;
        font-size: 26rpx;
        line-height: 70rpx;
        position: relative;
        bottom: 4rpx;
        left: 10rpx;
    }
    .left,.right{
        height: 700rpx;
        float: left;
        overflow: auto;
    }
    .left{
        width: 200rpx;
        background: #fff;
    }
    .right{
        width: 550rpx;
        text-align: left;
    }
    .city-text{
        padding: 10rpx;
        font-size: 26rpx;
        border-bottom: 1rpx solid #eee;
    }
    .active-city{
        border-left: 4px solid #ff5000;
        background: #F3F5F7;
    }
    .homeTopSelect{
        height: 76rpx;
        width: 480rpx;
        position: relative;
    }
    .homeTopSelect .input{
        height: 63rpx;
        width: 480rpx;
        margin-left: 20rpx;
        box-sizing: border-box;
        background: #F2F2F2;
        border-radius: 40px;
        padding-left: 71rpx;
        font-size: 26rpx;
    }
    .position{
        position: absolute;
    }
    .homeTopSelect .selectImg{
        width: 30rpx;
        height: 30rpx;
        left: 40rpx;
        top: 16rpx;
    }
    .homeTopSelect .sweepImg{
        width: 42rpx;
        height: 42rpx;
        right: 56rpx;
        top: 11rpx;
    }
    /* 公共样式 */
    .changeAddalike {
        display: flex;
        align-items: center;
        height: 100rpx;
        background: #ffffff;
        font-family: PingFangSC-Regular;
        font-size: 30px;
        color: #333333;
        letter-spacing: 0;
        padding-left: 20rpx;
        line-height: 100rpx;
        border-bottom: solid 1rpx #f3f5f7;
    }
    .changeAddalike text {
        height: 100rpx;
        line-height: 100rpx;
        width: 200rpx;
    }
    .changeAddalike input {
        height: 100rpx;
        line-height: 100rpx;
        width: 500rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .picker-rigion {
        width: 500rpx;
    }
    .confirm {
        margin-top: 60rpx;
        background: #ff5000;
        border-radius: 50px;
        width: 710rpx;
        height: 80rpx;
        text-align: center;
        line-height: 80rpx;
        font-family: PingFangSC-Regular;
        font-size: 30px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
        margin-left: 20rpx;
    }
    .ADDressimg {
        width: 13rpx;
        height: 24rpx;
    }
    .optModal {
        height: 800rpx;
        position: fixed;
        bottom: 0rpx;
        z-index: 555;
    }
    .drawer_screen {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        background: rgba(0, 0, 0, 0.6);
        overflow: hidden;
    }
    .changeAddinfo {
        width: 500rpx;
        height: 100rpx;
        overflow: hidden;
    }
    .changeAddinfotip{
        width: 500rpx;
        height: 100rpx;
        overflow: hidden;
        color: #cacaca;
    }
    .optcity{
        position: absolute;
        bottom: 0;
        background: #fff;
    }
    .add-address{
        width: 710rpx;
        height: 90rpx;
        border:1px solid #ddd;
        font-size: 30rpx;
        color: #333;
        line-height: 90rpx;
        text-align: center;
        border-radius: 45rpx;
        margin: auto;
    }
    .list-box{
        font-size: 26rpx;
        color: #666;
    }
    .name-title{
        font-size: 26rpx;
        color: #333;
        font-weight: bold;
        padding: 30rpx 0 10rpx;
    }
    .name-span{
        padding-right: 20rpx;
    }
    .address-list{
        height: 570rpx!important;
        overflow: auto;
    }
    .list-box{
        position: relative;
        padding:   0 0 20rpx;
        border-bottom: 1px solid #eee;
        padding-left: 100rpx;
    }
    .dialog{
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.3);
        top: 0;
        left: 0;
    }
    .title{
        font-size:30rpx;
        color: #333;
        font-weight: bold;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
    }
    .dialog-content{
        height: 800rpx;
        width: 100%;
        background: #fff;
        border-top-left-radius: 15rpx;
        border-top-right-radius: 15rpx;
        position: absolute;
        bottom: 0;
    }
</style>
