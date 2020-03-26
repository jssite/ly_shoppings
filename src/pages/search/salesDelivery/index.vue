<template>
    <div class="search">
        <div class="search_top_fixed">
            <div class="search_classify">
                <div class="search_classify_item" :class="{'active':class_active == 1}" @click="funcSearchComprehensive">综合</div>
                <div class="search_classify_item" :class="{'active':class_active == 2}" @click="funcSearchProdcutsellamount">销量</div>
                <div class="search_classify_item" :class="{'active':class_active == 3}" @click="funcSearchPrice">
                    <div>价格</div>
                    <div class="search_classify_img">
                        <template v-if="initPrice == null">
                            <img style="width: 16rpx;height: 20rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_price.png" alt="">
                        </template>
                        <template v-if="initPrice">
                            <img style="width: 16rpx;height: 20rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_price_up.png" alt="">
                        </template>
                        <template v-if="initPrice == false">
                            <img style="width: 16rpx;height: 20rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_price_down.png" alt="">
                        </template>
                    </div>
                </div>
                <div class="search_classify_item" :class="{'active':class_active == 4}" @click="funcSearchCategory">
                    <div class="search_classify_item_txt">{{initCategoryTxt}}</div>
                    <div class="search_classify_img" v-if="!search_query.category.length">
                        <template v-if="initCategoryShow">
                            <img style="width: 16rpx;height: 8rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_classify_up.png" alt="">
                        </template>
                        <template v-else>
                            <img style="width: 16rpx;height: 8rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_classify_down.png" alt="">
                        </template>
                        
                    </div>
                </div>
                <div class="search_classify_item" :class="{'active':class_active == 5}" @click="funcSearchMfctnames">
                    <div class="search_classify_item_txt">{{initMfctnamesTxt}}</div>
                    <div class="search_classify_img" v-if="!search_query.mfctcode.length">
                        <template v-if="initMfctnamesShow">
                            <img style="width: 16rpx;height: 8rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_classify_up.png" alt="">
                        </template>
                        <template v-else>
                            <img style="width: 16rpx;height: 8rpx;" class="search_classify_img_arrow" src="../../../../static/images/search/search_icon_classify_down.png" alt="">
                        </template>
                    </div>
                </div>
            </div>
            <!--  -->
            <!-- 品类 -->
            <div class="category_dialog" catchtouchmove="ture" v-if="initCategoryShow">
                <scroll-view scroll-y="true" class="category_scroll_view">
                    <div class="category_lists">
                        <div class="category_item" :class="{'active':item.checked}" v-for="(item,index) in initCategoryList" :key="index" @click="funcSearchCategorySelect(item)">
                            <span>{{item.name}}</span>
                            <template v-if="item.checked">
                                <img style="width:21rpx;height:14rpx;" src="../../../../static/images/twohr_orderpop_list_pre.png">
                            </template>
                        </div>
                    </div>
                </scroll-view>
                <div class="category_footer">
                    <span class="category_reset" @click="funcSearchCategoryReset">重置</span>
                    <span class="category_enter" @click="funcSearchCategoryEnter">确定</span>
                </div>
            </div>
            <!-- End -->
            <!-- 品牌 -->
            <div class="category_dialog" catchtouchmove="ture" v-if="initMfctnamesShow">
                <scroll-view scroll-y="true" class="category_scroll_view">
                    <div class="category_lists">
                        <div class="category_item" :class="{'active':item.checked}" v-for="(item,index) in initMfctnamesList" :key="index" @click="funcSearchMfctnamesSelect(item)">
                            <span>{{item.name}}</span>
                            <template v-if="item.checked">
                                <img style="width:21rpx;height:14rpx;" src="../../../../static/images/twohr_orderpop_list_pre.png">
                            </template>
                        </div>
                    </div>
                </scroll-view>
                <div class="category_footer">
                    <span class="category_reset" @click="funcSearchMfctnamesReset">重置</span>
                    <span class="category_enter" @click="funcSearchMfctnamesEnter">确定</span>
                </div>
            </div>
            <!-- End -->
            <!-- dialog background -->
            <div class="search_updown_dialog" catchtouchmove="ture" v-if="initCategoryShow || initMfctnamesShow"></div>
        </div>
        <!-- End -->
        <!-- start -->
        <div class="sales_dialog" >
            <div class="sales_tag">{{sales_tag}}</div>
            <div class="sales_content">{{sales_content}}</div>
        </div>
        <!-- End -->
        <!-- 搜索结果 -->
        <template v-if="search_result.length">
            <div class="products_small_wrap" v-if="product_tabs == 'small'">
                <samll-product v-for="(item,index) in search_result" :key="index" initDetail="shansong"  @shopCartNum="funCartNum" :product="item"></samll-product>
            </div>
            <div class="products_thumb_wrap" v-if="product_tabs == 'thumb'">
                <thumbnail-product v-for="(item,index) in search_result" :key="index" initDetail="shansong" @shopCartNum="funCartNum" :product="item"></thumbnail-product>
            </div>
            <div class="weui-loadmore">
                <div v-if="curr_page !== pages" class="weui-loading"></div>
                <div class="weui-loadmore__tips">{{curr_page == pages?"已经全部加载完毕":"正在加载..."}}</div>
            </div>
        </template>
        <template v-if="is_no_data">
            <div class="search_no_data">
                <img class="search_no_data_img" src="../../../../static/images/public/public_empty_pic.png" alt="">
                <p class="search_no_data_txt">哎呀，什么也没搜到</p>
            </div>
        </template>
        <div class="search_like" v-if="is_no_data">
            <promote-title :title_aaa_bbb="'猜你喜欢'"></promote-title>
            <div class="search_like_result">
                <likeGood :mainData="item" v-for="(item,index) in like_result" :key="index"></likegood>
            </div>
            <div class="weui-loadmore">
                <div v-if="!like_end" class="weui-loading"></div>
                <div class="weui-loadmore__tips">{{like_end?"已经全部加载完毕":"正在加载..."}}</div>
            </div>
        </div>
        
        <template v-if="search_result.length">
            <img  class="cartImg"  @click="onInCart" src="/static/images/twohr_left_shopping.png">
            <div v-if="shopCartNum" class="product_cartNum">{{shopCartNum>99?'99+':shopCartNum}}</div>
        </template>

        <div v-if="ModuleClass"  :class="['cartModule',{'slideModule':ModuleClass}]">
            <cart-modaldata  :shop_id='cartShopIds' :cart_id='shansongcart_id' @closeModel='closeModal' catchtouchmove="ture"></cart-modaldata>
        </div>

    </div>
</template>

<script>
import cartModaldata from '@/components/cartModal/index';
import { searchKeyword, productQueryByShopId, getSuggest ,searchGoodsList, getUserLocation, getLikeInfo,getshopcartNum} from '@/api';
import samllProduct from '@/components/product/samll/index';
import thumbnailProduct from '@/components/product/thumbnail/index';
import likeGood from '@/components/public/likeGood';
import promoteTitle from '@/components/product/promote/title';
import { mapMutations, mapState } from 'vuex';
export default {
    data() {
        return {
            shansongcart_id:'',
            // cartShopIds:'',      //商店ID
            ModuleClass: false,
            ModuleShow: false, //购物车模态框
            shopCartNumTrue:false,
            shopCartNum:0,
            is_no_data: false,
            placeholder: '搜索乐闪送商品',
            input_value: '',
            input_foucs: true,
            history_words:[],
            hot_words:[],
            search_result: [],
            total: 20,
            curr_page: 1,
            pages: 1,
            product_tabs: 'small',
            class_active: 1,
            suggest: [],
            initPrice: null,
            initCategoryShow: false,
            initCategoryTxt:'品类',
            initCategoryList: [],
            initMfctnamesShow: false,
            initMfctnamesTxt: '品牌',
            initMfctnamesList: [],
            shop_id: '',
            like_result: [],
            like_curr_page: 1,
            like_end: false,
            init_pp_num: 0,
            init_fl_num: 0,
            sales_tag: '',
            sales_content: '',
            userLocation: wx.getStorageSync("locationInfo"),
            search_query: {
                comblex_search:[],  //搜索内容
                ctyids: [],  //分类id
                promotionidList:'', //促销查询
                isMeet:1,  //闪送标识
                shopIdList:'',   //门店id
                comprehensive: false,   //综合排序
                price: '',    //价格	true升序  false降序
                addtime: false, //新品优先,
                prodcutsellamount: '',	//按销量
                priceNumber:['0','*'],    //价格
                startmonth: '', //开始时间
                endmonth: '',   //结束时间
                usingAge: '',    //年龄
                category: [],    //筛选品类
                mfctcode: []    //筛选品牌
            }
        }
    },
    components: {
        samllProduct,
        thumbnailProduct,
        likeGood,
        promoteTitle,
        cartModaldata
    },
    onLoad(option){
        this.sa_page(this,false,'促销活动','');
        this.search_query.promotionidList = option.promotion_id;
        this.sales_tag = option.title;
        this.sales_content = option.content;
    },
    created(){
        // this.funUserLocation();
    },
    onShow(){
        this.shop_id = wx.getStorageSync('shan_shop_id') //获取商店ID
        this.init_fl_num = 0;
        this.init_pp_num = 0;
        this.initCategoryList.forEach((item,index) => {
            if( item.checked ){
                this.init_fl_num += 1;
            }
        });
        this.initMfctnamesList.forEach((item,index) => {
            if( item.checked ){
                this.init_pp_num += 1;
            }
        });
        this.funcSearchClassAll();
        this.funcInitQueryList();
        
    },
    onReachBottom(){
        if( this.is_no_data ){
            if( !this.like_end ){
                this.like_curr_page = this.like_curr_page+1;
                this.funcGetLikeInfo();
            }
        }
        if( this.curr_page == this.pages ){
            return false;
        }
        this.curr_page = this.curr_page + 1;
        
        let queryCategory = '';
        let queryMfctcode = '';
        if( this.search_query.category.length ){
            if( this.search_query.category.length == 1 ){
                queryCategory = this.search_query.category.join('')
            } else if( this.search_query.category.length > 1){
                queryCategory = '(' + this.search_query.category.join(' OR ') + ')'
            }
        }
        if( this.search_query.mfctcode.length ){
            if( this.search_query.mfctcode.length == 1 ){
                queryMfctcode = this.search_query.mfctcode.join('')
            } else if( this.search_query.mfctcode.length > 1){
                queryMfctcode = '(' + this.search_query.mfctcode.join(' OR ') + ')'
            }
        }
        let query = {
            channel: 0,
            queryList: [
                `shopIdList:${this.shop_id}`,
                `isMeet:1`,
                `promotionidList:${this.search_query.promotionidList}`,
                `category:${queryCategory}`,
                `mfctcode:${queryMfctcode}`,
            ],
            sortList: [
                `comprehensive:${this.search_query.comprehensive}`,
                `price:${this.search_query.price}`,
                `prodcutsellamount:${this.search_query.prodcutsellamount}`
            ],
            filterList: [
                `price:`,
            ],
            start: this.curr_page,
            rows: this.total
        }
        this.funcInitGetProductLists(query);
    },
    methods: {
        //获取猜你喜欢数据
        funcGetLikeInfo(){
            let query = {
                page_index: this.like_curr_page,
                page_size: this.total,
                is_daguan_data:1
            }
            getLikeInfo(query).then( res => {
                this.like_result = [...this.like_result,...res.product_list];
                this.like_end = res.is_end;
            });
        },
        //获取shop_id
        funUserLocation() {
            let params = {
                location_info: {
                poi_address: "",
                poi_name: "",
                latitude: this.userLocation.latitude,
                longitude: this.userLocation.longitude
                }
            };
            getUserLocation(params).then(res => {
                this.shop_id = res.shop_id;
            });
        },
        //获取闪送品类品牌
        funcInitQueryList(){
            let query = {
                facetOn:1,
                queryList:[
                    `shopIdList:${this.shop_id}`,
                    `isMeet:1`,
                    `promotionidList:${this.search_query.promotionidList}`
                ],
                facetList: ['mfctnames','category']
            }
            productQueryByShopId(query).then( res => {
                let { category, mfctnames } = res;
                this.initCategoryList = category;
                this.initMfctnamesList = mfctnames;
            })
        },
        //综合搜索
        funcSearchComprehensive(){
            this.class_active = 1;
            this.search_query.comprehensive = 'false';
            this.search_query.prodcutsellamount = '';
            this.search_query.price = ''
            this.initPrice = null;
            this.funcSearchClassAll();
        },
        //销量搜索
        funcSearchProdcutsellamount(){
            this.class_active = 2;
            this.search_query.comprehensive = '';
            this.search_query.prodcutsellamount = 'false';
            this.search_query.price = '';
            this.initPrice = null;
            this.funcSearchClassAll();
        },
        //价格搜索
        funcSearchPrice(){
            this.class_active = 3;
            if ( this.initPrice == null ){
                this.initPrice = true;
            } else {
                this.initPrice = !this.initPrice;
            }
            
            this.search_query.price = this.initPrice;
            this.search_query.comprehensive = '';
            this.search_query.prodcutsellamount = '';
            this.funcSearchClassAll();
        },
        //品类搜索
        funcSearchCategory(){
            this.class_active = 4;
            this.initMfctnamesShow = false;
            this.initCategoryShow = !this.initCategoryShow;
        },
        //品类重置
        funcSearchCategoryReset(){
            this.search_query.category = [];
            this.initCategoryTxt = '品类';
            this.init_fl_num = 0;
            this.initCategoryList.forEach((item) => {
                if( typeof item.checked == 'undefined' ){
                    this.$set(item,'checked',false)
                } else {
                    item.checked = false;
                }
            });
        },
        //品类确定
        funcSearchCategoryEnter(){
            let categoryName = []
            this.initCategoryList.forEach((item) => {
                if( item.checked ){
                    categoryName.push(item.name);
                }
            });
            this.initCategoryTxt = categoryName.join(',');
            this.search_query.category = categoryName;
            this.initCategoryShow = false;
            if( !categoryName.length ){
                this.initCategoryTxt = '品类';
            }
            this.funcSearchClassAll();
        },
        //添加品类
        funcSearchCategorySelect(item){
            if( typeof item.checked == 'undefined' ){
                this.$set(item,'checked',true)
            } else {
                item.checked = !item.checked;
            }
            item.checked?this.init_fl_num += 1:this.init_fl_num -= 1;
            if(this.init_fl_num > 5){
                item.checked = false;
                this.init_fl_num = 5;
                wx.showToast({
                    title:'最多可以选择5种哦',
                    icon: 'none'
                });
            }
        },
        funcSearchMfctnames(){
            this.class_active = 5;
            this.initMfctnamesShow = !this.initMfctnamesShow;
            this.initCategoryShow = false;
        },
        //品牌重置
        funcSearchMfctnamesReset(){
            this.search_query.mfctcode = [];
            this.initMfctnamesTxt = '品牌';
            this.init_pp_num = 0;
            this.initMfctnamesList.forEach((item) => {
                if( typeof item.checked == 'undefined' ){
                    this.$set(item,'checked',false)
                } else {
                    item.checked = false;
                }
            });
        },
        //品牌确定
        funcSearchMfctnamesEnter(){
            let mfctnamesName = [];
            let mfctnamesCode = [];
            this.initMfctnamesList.forEach((item) => {
                if( item.checked ){
                    mfctnamesName.push(item.name);
                    mfctnamesCode.push(item.code)
                }
            });
            this.initMfctnamesTxt = mfctnamesName.join(',');
            this.search_query.mfctcode = mfctnamesCode;
            this.initMfctnamesShow = false;
            if( !mfctnamesName.length ){
                this.initMfctnamesTxt = '品牌';
            }
            this.funcSearchClassAll();
        },
        //添加品牌
        funcSearchMfctnamesSelect(item){
            if( typeof item.checked == 'undefined' ){
                this.$set(item,'checked',true)
            } else {
                item.checked = !item.checked;
            }
            item.checked?this.init_pp_num += 1:this.init_pp_num -= 1;
            if(this.init_pp_num > 5){
                item.checked = false;
                this.init_pp_num = 5;
                wx.showToast({
                    title:'最多可以选择5种哦',
                    icon: 'none'
                });
            }
        },
        //搜索
        funcSearchClassAll(){
            this.curr_page = 1;
            this.initCategoryShow = false;
            this.initMfctnamesShow = false;
            this.search_result = [];
            let queryCategory = '';
            let queryMfctcode = '';
            if( this.search_query.category.length ){
                if( this.search_query.category.length == 1 ){
                    queryCategory = this.search_query.category.join('')
                } else if( this.search_query.category.length > 1){
                    queryCategory = '(' + this.search_query.category.join(' OR ') + ')'
                }
            }
            if( this.search_query.mfctcode.length ){
                if( this.search_query.mfctcode.length == 1 ){
                    queryMfctcode = this.search_query.mfctcode.join('')
                } else if( this.search_query.mfctcode.length > 1){
                    queryMfctcode = '(' + this.search_query.mfctcode.join(' OR ') + ')'
                }
            }
            let query = {
                channel: 0,
                queryList: [
                    `shopIdList:${this.shop_id}`,
                    `isMeet:1`,
                    `promotionidList:${this.search_query.promotionidList}`,
                    `category:${queryCategory}`,
                    `mfctcode:${queryMfctcode}`,
                ],
                sortList: [
                    `comprehensive:${this.search_query.comprehensive}`,
                    `price:${this.search_query.price}`,
                    `prodcutsellamount:${this.search_query.prodcutsellamount}`
                ],
                filterList: [
                    `price:`,
                ],
                start: this.curr_page,
                rows: this.total
            }
            this.funcInitGetProductLists(query);
        },
        //获取购物车的数量
        funCartNum() {
            let tokenid = wx.getStorageSync('token')
            let cart_id = wx.getStorageSync('shansongcart_id');
            let params ={};
            if(tokenid){
                //获取购物车数量
                params = {
                    shop_id: wx.getStorageSync('shan_shop_id'),
                    cart_type: 2,
                    is_check: 2
                };
                getshopcartNum(params).then(res => {
                    console.log(res, "购物车数量");
                    this.shopCartNum = res.num;
                });
            }else if(cart_id){
                params = {
                shop_id: wx.getStorageSync('shan_shop_id'),
                cart_type: 2,
                is_check: 2,
                cart_id:wx.getStorageSync('shansongcart_id')
                };
                getshopcartNum(params).then(res => {
                    console.log(res, "购物车数量");
                    this.shopCartNum = res.num;
                });
            }
          
        },
        closeModal(msg) {   //关闭购物车模态框
            // that.ModuleShow = false;
            this.ModuleClass = false;
        },
        onInCart() {  //点击购物车
            this.shansongcart_id = wx.getStorageSync('shansongcart_id')
            this.cartShopIds = wx.getStorageSync('shan_shop_id') //获取商店ID
            console.log(12312)
            // that.ModuleShow = true;
            this.ModuleClass = true;
        },


        /**
         * 默认请求数据
         */
        funcInitGetProductLists(query){
            wx.showLoading({
                title: '数据加载中',
            })
            this.is_no_data = false;
            productQueryByShopId(query).then( res => {
                wx.hideLoading();
                if( res.data.length ){
                    res.data.forEach((item,index) => {
                        let arr = item.prices.split('.');
                        if( arr.length.length < 2){
                            arr.push('00');
                        } else {
                            if( arr[1].length < 2 ){
                                arr[1] = arr[1].toString() + '0';
                            }
                        }
                        item.prices = arr;
                        // this.search_result.push(item);
                    });
                    this.search_result = [...this.search_result, ...res.data];
                    this.pages = res.pages;
                }
                if(!this.search_result.length){
                    this.is_no_data = true;
                    this.funcGetLikeInfo();
                }
                this.funCartNum();
                
            });
        }
    }

}
</script>

<style scoped>
/* 购物车 */
.cartImg {
  position: fixed;
  bottom: 80rpx;
  left: 30rpx;
  width: 96rpx;
  height: 96rpx;
  z-index: 111;
}
.slideModule {
  transform: translateY(0) !important;
}
/* 购物车模块 */
.cartModule {
  height: 100%;
  width: 100%;
  position: fixed;
  bottom: 0rpx;
  z-index: 10000;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
  /* background-color:white; */
  transition: transform 0.3s ease 0.5s;
  -webkit-transform: translateY(100%);
  transform: translateY(100%);
}

.product_cartNum{
  position: fixed;
  left: 90rpx;
  bottom: 140rpx;
  height: 25rpx;
  color: #ffffff;
  min-width: 25rpx;
  text-align: center;
  line-height: 22rpx;
  border-radius: 50%;
  border: 2rpx solid #ff5000;
  background: #ff5000;
  font-size: 18rpx;
  z-index: 111;
}


.search {
    min-height: 100vh;
    background: #f3f5f7;
}
.products_small_wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #f3f5f7;
}
.search_like_result {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.search_top_fixed {
    width: 100%;
    background: #fff;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 222;
}
.search_input {
    display: flex;
    margin: 6px 30px 10px 20px;
    justify-content: space-between;
    align-items: center;
    position: relative;
    outline: none;
}
.product_tab_samll {
    width: 58px;
    height: 58px;
    display: block;
}
.product_tab_thumb{
    width: 58px;
    height: 58px;
    display: block;
}
.search_dialog_lists{
    width: 100%;
    height: 100%;
    padding: 10px 0 0 20px;
    box-sizing: border-box;
    background: #ffffff;
    position: fixed;
    left: 0;
    top: 70px;
    z-index: 888;
}
.search_dialog_result {
    padding: 0 30px 0 0;
    line-height: 88px;
    font-size: 26px;
    color: #333333;
    border-bottom: #f3f5f7 1px solid;
}
.search_input_icon {
    width: 30.3px;
    height: 29.5px;
    overflow: hidden;
    position: absolute;
    left: 20px;
    top: 15px;
    z-index: 99;
}
.search_input_icon_clear {
    padding: 20px;
    position: fixed;
    right: 115px;
    top: -2px;
    z-index: 999;
}
.search_input_icon_img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    border: none;
}
.search_input_wrap {
    padding-left: 63px;
    width: 620px;
    height: 60px;
    border-radius: 30px;
    box-sizing: border-box;
    background: #F2F2F2;
}
.search_input_wrap_value {
    width: 400px;
    height: 60px;
    line-height: 60px;
    color: #333333;
    font-size: 26px;
}
.search_input_wrap_value:placeholder{
    color: #CACACA;
}
.search_input_button {
    font-size: 30px;
    color: #333333;
}
.search_keys {
    width: 100%;
    height: 100%;
    padding: 58px 30px 0 20px;
    background: #fff;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    top: 70px;
    z-index: 888;
}
.search_keys_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    font-size: 30px;
    line-break: 34px;
    color: #999999;
}
.search_keys_wrap {
    padding-bottom: 58px;
    display: flex;
    flex-wrap: wrap;
}
.search_key {
    margin: 0 20px 20px 0;
    padding: 0 34px;
    border-radius: 29px;
    background: #F6F6F6;
    line-height: 58px;
    font-size: 24px;
    color: #333333;
}
.search_keys_delete {
    width: 32px;
    height: 34px;
}
.search_keys_delete_img {
    width: 32px;
    height: 34px;
}
.products_mores {
    background: #f3f5f7;
    padding: 40px 0;
    text-align: center;
    font-size: 24px;
    line-height: 30px;
}
.search_classify{
    display: flex;
    border-bottom: #f3f5f7 1px solid;
}
.search_classify_item {
    width: 200px;
    padding: 15px 25px;
    box-sizing: border-box;
    text-align: center;
    font-size: 26px;
    line-height: 32px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
}
.search_classify_item_txt{
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
}
.search_classify_item.bold {
    font-weight: 700;
}
.search_classify_img {
    margin-left: 5px;
    width: 16px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.search_classify_img_arrow {
    display: block;
}
.search_classify_item.active {
    color: #FF5000;
}
.scroll_view {
    height: 900px;;
}
.category_dialog {
    width: 100%;
    background: #ffffff;
    position: fixed;
    left: 0;
    top: 60px;
    z-index: 19;
}
.category_scroll_view {
    height: 448px;
}
.category_footer {
    display: flex;
    border-top: #dddddd 1px solid;
    
}
.category_reset,.category_enter {
    width: 50%;
    border: 0px;
    padding: 0;
    margin: 0;
    border-radius: 0;
    background: #FFFFFF;
    text-align: center;
    font-size: 30px;
    line-height: 80px;
    color: #333333;
}
.category_enter{
    background: #FF5000;
    color: #ffffff;
    
}
.category_lists {
    display: flex;
    flex-wrap: wrap;
    padding: 0 40px 0 0;
    justify-content: space-between;
}
.category_item {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 40px;
    box-sizing: border-box;
    line-height: 80px;
    font-size: 24px;
    color: #333333;
}
.category_item.active {
    color: #FF5000;
}
.search_updown_dialog {
    position: fixed;
    left: 0;
    top: 135px;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
}
.search_no_data {
    padding: 400px 0 250px;
    font-size: 30px;
    color: #333333;
    text-align: center;
    display: flex;
    flex-direction: column;

}
.search_no_data_img {
    width: 266px;
    height: 222px;
    display: block;
    margin: 0 auto;
}
.search_no_data_txt {
    width: 100%;
}
.sales_dialog {
    margin-top: 60px;
    padding: 20px 0 20px 20px;
    width: 100%;
    background: #f3f5f7;
    display: flex;
    /* align-items: center; */
    text-align: center;
    box-sizing: border-box;
}
.sales_dialog.margin_top{
    margin-top: 210px;
}
.sales_tag {
    min-width: 104px;
    height: 32px;
    line-height: 30px;
    white-space: nowrap;
    border: #FF5000 1px solid;
    box-sizing: border-box;
    font-size: 22px;
    color: #FF5000;
    padding: 0 10px;
    border-radius: 16px;
}
.sales_content {
    flex: 1;
    padding: 0 20px 0 12px;
    font-size: 24px;
    line-height: 32px;
    color: #333333;
    text-align: justify;
}
</style>