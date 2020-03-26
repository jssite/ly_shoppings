<template>
    <div class="filter">
        <!-- <div class="filter_title">乐友服务</div>
        <div class="filter_wrap">
            <span 
            class="filter_label" 
            :class="{'active': item.checked}" 
            v-for="(item,index) in search_filter.leyou_service" 
            :key="index"
            @click="funcFilterSelect(item)">
                {{item.name}}
            </span>
        </div> -->
        <!-- <div class="filter_title">乐友门店</div>
        <div class="filter_wrap">
            <span 
            class="filter_label" 
            :class="{'active': shopLocation.name}" @click="funcGoToShopList">门店查询</span>
            <span class="shop_name" v-if="shopLocation.name">
                <span>已选择：</span>
                <span>{{shopLocation.name}}</span>
                <span class="shop_clear" @click="funcShopClear">
                    <img class="shop_fixed_close_img" src="../../../../static/images/public/public_icon_delete.png" alt="">
                </span>
            </span>
        </div> -->
        <div class="filter_title">价格区间</div>
        <div class="filter_wrap">
            <span class="filter_price">
                <input type="text" name="" id="" maxlength="6" v-model="priceStart" placeholder="最低价" placeholder-style="color:#cacaca;" class="filter_price_start">
            </span>
            <span class="filter_price_space">-</span>
            <span class="filter_price">
                <input type="text" name="" id="" maxlength="6" v-model="priceEnd" placeholder="最高价" placeholder-style="color:#cacaca;" class="filter_price_end">
            </span>
        </div>
        <div class="filter_title">
            <span>品类</span>
            <span class="padding_10" @click="funcShowPinl" v-if="search_filter.initCategoryList.length > 6">
                <template v-if="isHidePinl == 12">
                    <img class="filter_arrow" src="../../../../static/images/public_arrow_down.png" alt="">
                </template>
                <template v-else>
                    <img class="filter_arrow" src="../../../../static/images/public_arrow_up.png" alt="">
                </template>
            </span>
        </div>
        <div class="filter_wrap">
            <span 
            class="filter_label" 
            :class="{'active': item.checked}" 
            v-for="(item,index) in search_filter.initCategoryList" 
            :key="index"
            v-show="index < isHidePinl"
            @click="funcFilterSelectClass(item)">
                {{item.name}}
            </span>
        </div>
        <div class="filter_title">
            <span>品牌</span>
            <span class="padding_10" @click="funcShowPinp" v-if="search_filter.initMfctnamesList.length > 6">
                <template v-if="isHidePinp == 12">
                    <img class="filter_arrow" src="../../../../static/images/public_arrow_down.png" alt="">
                </template>
                <template v-else>
                    <img class="filter_arrow" src="../../../../static/images/public_arrow_up.png" alt="">
                </template>
            </span>
        </div>
        <div class="filter_wrap">
            <span 
            class="filter_label" 
            :class="{'active': item.checked}" 
            v-for="(item,index) in search_filter.initMfctnamesList" 
            :key="index"
            v-show="index < isHidePinp"
            @click="funcFilterSelectMfctnames(item)">
                {{item.name}}
            </span>
        </div>
        <!-- <div 
        v-for="(item,idxkey) in search_filter.custom_search_key"
        :key="idxkey">
            <div class="filter_title">{{idxkey}}</div>
            <div class="filter_wrap">
                <span 
                class="filter_label" 
                :class="{'active': ele.checked}" 
                v-for="(ele,idxele) in item" 
                :key="idxele"
                @click="funcFilterSelect(ele)">
                    {{ele.name}}
                </span>
            </div>
        </div> -->
        <!-- footer -->
        <div class="filter_footer" :class="phonestyleShow?'full_screen':''">
            <span class="footer_reset_button" @click="funcFilterReset">重置</span>
            <span class="footer_submit_button" @click="funcFilterEnter">确定</span>
        </div>
        <!-- End -->
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
    data() {
        return {
            priceStart: '',
            priceEnd: '',
            isHidePinl: 12,
            isHidePinp: 12,
            init_num_class: 0,
            init_num_mfctnames: 0,
            phonestyleShow: false
        }
    },
    computed: mapState(['search_filter','shopLocation']),
    onLoad(){
        this.sa_page(this,false,'搜索筛选','');
        let _this = this;
        wx.getSystemInfo({
          success(res) {
            if(res.model.indexOf('iPhone X')>-1 || res.model.indexOf('unknown<iPhone11,8>')>-1){
                _this.phonestyleShow = true;
            }else{
                _this.phonestyleShow = false;
            }
          }
        })
    },
    onShow(){
        if( this.search_filter.price[0] == 0 ){
            this.priceStart = ''
        } else {
            this.priceStart = this.search_filter.price[0]
        }
        if( this.search_filter.price[1] == '*' ){
            this.priceEnd = ''
        } else {
            this.priceStart = this.search_filter.price[0]
        }
        this.init_num_mfctnames = 0;
        this.init_num_class = 0;
        this.search_filter.initMfctnamesList.forEach((item,index) => {
            if( item.checked ){
                this.init_num_mfctnames += 1;
            }
        });
        this.search_filter.initCategoryList.forEach((item,index) => {
            if( item.checked ){
                this.init_num_class += 1;
            }
        });
    },
    watch: {
        'priceStart':function(n,o){
            let reg = /^[0-9]*$/;
            if( !reg.test(n) ){
                this.priceStart = o;
            }
        },
        'priceEnd':function(n,o){
            let reg = /^[0-9]*$/;
            if( !reg.test(n) ){
                this.priceEnd = o;
            }
        }
    },
    methods: {
        funcGoToShopList(){
            wx.navigateTo({
                url: '/pages/search/shop/index/main?source=search'
            });
        },
        funcShopClear(){
            this.$store.commit('shopLocationMutations', {});
        },
        funcShowPinl(){
            this.isHidePinl==12?this.isHidePinl=this.search_filter.initCategoryList.length:this.isHidePinl=12;
        },
        funcShowPinp(){
            this.isHidePinp==12?this.isHidePinp=this.search_filter.initMfctnamesList.length:this.isHidePinp=12;
        },
        //选中状态
        funcFilterSelect(item){
            if( typeof item.checked == 'undefined' ){
                this.$set(item,'checked',true)
            } else {
                item.checked = !item.checked;
            }
        },
        funcFilterSelectClass(item){
            if( typeof item.checked == 'undefined' ){
                this.$set(item,'checked',true)
            } else {
                item.checked = !item.checked;
            }
            item.checked?this.init_num_class += 1:this.init_num_class -= 1;
            if(this.init_num_class > 5){
                item.checked = false;
                this.init_num_class = 5;
                wx.showToast({
                    title:'最多可以选择5种哦',
                    icon: 'none'
                });
            }
        },
        funcFilterSelectMfctnames(item){
            if( typeof item.checked == 'undefined' ){
                this.$set(item,'checked',true)
            } else {
                item.checked = !item.checked;
            }
            item.checked?this.init_num_mfctnames += 1:this.init_num_mfctnames -= 1;
            if(this.init_num_mfctnames > 5){
                item.checked = false;
                this.init_num_mfctnames = 5;
                wx.showToast({
                    title:'最多可以选择5种哦',
                    icon: 'none'
                });
            }
        },
        //确定
        funcFilterEnter(){
            if(parseFloat(this.priceStart) > parseFloat(this.priceEnd)){
                wx.showToast({
                    title:'最高价不能低于最低价',
                    icon: 'none'
                });
                return false;
            }
            let data = {
                initCategoryTxt: '',
                initMfctnamesTxt: '',
                category: [],
                mfctcode: [],
                price: ['0','*'],
                logistics: '',
                service: []
            };
            let mfctnamesName = [];
            this.search_filter.initCategoryList.forEach((item) => {
                if( item.checked ){
                    data.category.push(item.name);
                }
            });
            this.search_filter.initMfctnamesList.forEach((item) => {
                if( item.checked){
                    mfctnamesName.push(item.name);
                    data.mfctcode.push(item.code);
                }
            });
            this.search_filter.leyou_service.forEach((item) => {
                if( item.checked && item.name != '物流有货' ){
                    data.service.push(item.code)
                }
                if( item.checked && item.name == '物流有货' ){
                    data.logistics = 1;
                }
            });
            for(let ele in this.search_filter.custom_search_key){
                this.search_filter.custom_search_key[ele].forEach((item) => {
                    if( item.checked ){
                        data.service.push(item.code)
                    }
                });
            }
            data.initCategoryTxt = data.category.join(',');
            data.initMfctnamesTxt = mfctnamesName.join(',');
            if( this.priceStart != '' ){
                data.price[0] = this.priceStart;
            }
            if( this.priceEnd != '' ){
                data.price[1] = this.priceEnd;
            }
            this.$store.commit('backFilterInfoMutations', data);
            wx.navigateBack({
                delta: 1
            });
        },
        //重置
        funcFilterReset(){
            this.priceStart = '';
            this.priceEnd = '';
            this.init_num_class = 0;
            this.init_num_mfctnames = 0;
            this.search_filter.leyou_service.forEach(element => {
                this.funcResetPulic(element)
            });
            this.search_filter.initCategoryList.forEach(element => {
                this.funcResetPulic(element)
            });
            this.search_filter.initMfctnamesList.forEach(element => {
                this.funcResetPulic(element)
            });
            for(let ele in this.search_filter.custom_search_key){
                this.search_filter.custom_search_key[ele].forEach((item) => {
                    this.funcResetPulic(item)
                });
            }
            this.funcShopClear();
        },
        funcResetPulic(item){
            if( typeof item.checked == 'undefined' ){
                this.$set(item,'checked',false)
            } else {
                item.checked = false;
            }
        }
    }
}
</script>

<style scoped>
.filter {
    padding-top: 20px;
    padding-bottom: 50px;
}
.filter_arrow {
    width: 22px;
    height: 12px;
}
.padding_10 {
    padding: 10px;
}
.shop_clear{
    padding-left: 10px;
}
.filter_title {
    padding: 0 20px 28px;
    font-size: 30px;
    color: #999999;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.filter_wrap {
    padding-bottom: 56px;
    display: flex;
    flex-wrap: wrap;
}
.filter_label {
    width: 223px;
    height: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0 16px 20px;
    border-radius: 30px;
    line-height: 60px;
    text-align: center;
    background: #F6F6F6;
    font-size: 24px;
    color: #333333;
}
.filter_label.active {
    background: #FFF7D5;
    color: #FF5000;
}
.filter_footer {
    width: 100%;
    height: 80px;
    display: flex;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #ffffff;
}
.full_screen{
    padding-bottom: 36rpx;
}
.footer_reset_button,.footer_submit_button {
    flex: 1;
    box-sizing: border-box;
    font-size: 30px;
    color: #333333;
    line-height: 80px;
}
.footer_reset_button {
    border-top: #dddddd 1px solid;
}
.footer_submit_button {
    background: #FF5000;
    color: #fff;
}
.filter_price_start,.filter_price_end {
    width: 324px;
    height: 60px;
    border-radius: 30px;
    line-height: 60px;
    text-align: center;
    background: #F6F6F6;
    font-size: 24px;
    color: #333333;
}
.filter_price_start {
    margin-left: 20px;
}
.filter_price_space {
    padding: 0 20px;
    color: #DDDDDD;
}
.shop_name {
    padding: 0 10px;
    color: #333333;
    font-size: 26px;
    display: flex;
    align-items: center;
    height: 60px;
    line-height: 60px;
}
.shop_fixed_close_img {
    width: 32px;
    height: 32px;
    display: block;
}
</style>