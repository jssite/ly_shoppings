<template>
    <div>
        <div class="TopTitle">
            配送至
        </div>
        <div class="navcity">
            <div class="tabCity" >
                <span :class="['tabCityTxt',{active: !provinceName}]" @click="onprovince">{{provinceName?provinceName:'请选择'}}</span>
                <span :class="['tabCityTxt',{active: !DcityName}]" @click="oncity" v-if='showDcity'>{{ DcityName ? DcityName :'请选择'}}</span>
                <span :class="['tabCityTxt',{active: DcityName}]" @click="onCounty" v-if="showDcounty">请选择</span>
            </div>
            <scroll-view scroll-y  style="height:712rpx" v-if="provinceList&&provinceList.length">
                <div class="cityeList"  @click="clickPro(i,items)"  v-for="(items,i) in provinceList" :key="i">
                    {{items.provname?items.provname:items.cityname?items.cityname:items.disname}}
                </div>

            </scroll-view>
          
        </div>
    </div>
</template>
<script>
import { optCity } from '@/api'
export default {
    data(){
        return{
            provinceList:[],
            showDcity:false,
            showDcounty:false,
            cityListDat:[], //省
            cityList:[],     //市
            areaList:[],
            index:0,//区,县
            indexf:0,//区,县
            indexc:0,//区,县
            provinceName:null, //省名
            DcityName:null,     //市名
            areaName:null      //区名
        }
    },
    onLoad(){
       
        // this.cityListDat = this.provinceList
        // console.log(this.provinceList)
        wx.showLoading({title: '正在加载中', mask: true});
        let cityall = wx.getStorageSync('cityall');
        if(cityall){
            this.provinceList = cityall;
            setTimeout(function () {
                wx.hideLoading();
            }, 1000);  
        }else{
            optCity().then(res=>{
                // this.cityListDat=res.address_level_list
                wx.nextTick(() => {
                    this.provinceList  = res.address_level_list   //省
                })
                wx.setStorageSync('cityall', res.address_level_list);
                console.log(res,'ddddd');
            })
        }

    },
    onShow(){
        console.log(22222)
    },

    updated(){
        wx.hideLoading();
        console.log(111111)

    },
    methods:{
        clickPro(i,items){  //点击省
            let that = this;
            console.log(i,items);
            if(items.provname){  //省
                this.index =i

                this.showDcity = true;
                this.provinceName = items.provname;
                this.provinceId = items.provid;
                this.provinceList = items.cities
            }else if(items.cityname){ //市
                this.indexf =i

                this.showDcounty = true;
                this.DcityName = items.cityname;
                this.DcityId = items.cityid;
                this.provinceList = items.districts;
            }else {  //县
                this.indexc =i

                let params = {
                    provinceName:that.provinceName,
                    provinceId:that.provinceId,
                    DcityName:that.DcityName,
                    DcityId:that.DcityId,
                    areaName:items.disname,
                    areaId:items.disid,
                    position:true
                }
                // 模态框关闭
                this.$emit('deliverModal',params)
            }
        },
        onprovince(){
            this.provinceList = wx.getStorageSync('cityall');
            this.provinceName=null
            this.DcityName=null
            this.areaName=null
            this.showDcity = false;
            this.showDcounty = false;
        },
        oncity(){
            let setcity = wx.getStorageSync('cityall');
            this.provinceList = setcity[this.index].cities
            // console.log(this.provinceList)
            // console.log(this.cityListDat)
            this.DcityName=null
             this.showDcounty = false;
        },
        onCounty(){
            let setcity = wx.getStorageSync('cityall');
            this.areaName=null
            this.provinceList = setcity[this.index].cities[this.indexf].districts;
        }

    }
}
</script>
<style scoped>

.active{
    color: #FF5000 !important;
    border-bottom: 3rpx solid #FF5000 !important;
}

.TopTitle{
    height: 88rpx;
    background: #fff;
    font-size: 30rpx;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    line-height: 88rpx;
    width: 750rpx;
}
.navcity{
    margin-left: 20rpx;
    height: 712rpx;
    background: #fff;
}

/* tab栏 */
.tabCity{
    height: 88rpx;
    display: flex;
    line-height: 88rpx;
    border-bottom: 1rpx solid #f3f5f7;

}
.tabCity .tabCityTxt:first-child{
    margin-left: 0rpx;
}
.tabCity .tabCityTxt{
    font-size: 26px;
    color: #333333;
    /* width: 128rpx; */
    /* margin-left: 40rpx; */
    margin-left: 40rpx;
    border-bottom: 1rpx solid #f3f5f7;
}
.cityeList{
    height: 88rpx;
    line-height: 88rpx;
    border-bottom: 1rpx solid #f3f5f7;
    width: 750rpx;
    font-size: 26px;
    color: #333333;
}


</style>
