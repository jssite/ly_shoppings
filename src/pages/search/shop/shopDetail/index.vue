<template>
    <div class="shop_details">
        <template v-if="ad_info.length">
            <swiper class="shop_details_swiper" indicator-dots="true" autoplay="true" interval="5000" duration="1000" indicator-active-color='#ff5000'>
                <block>
                    <!-- <swiper-item 
                    v-for="(item, index) in banner" 
                    :key="index"
                    @click="funcOoToH5(item)">
                        <image :src="item.activity_image" class="slide-image" mode="aspectFill"></image>
                    </swiper-item> -->
                    <swiper-item 
                    v-for="(item, index) in ad_info" 
                    :key="index"
                    @click="funcOoToH5(item)">
                        <image :src="item.url" class="slide-image" mode="aspectFill"></image>
                    </swiper-item>
                </block>
            </swiper>
        </template>
        <div class="shop_details_info">
            <div class="shop_details_address" @click="funcGetLocation">
                <div class="shop_address_left">
                    <div class="shop_title">{{shopgetStoreStaffs.shop_name}}</div>
                    <div class="shop_address">{{shopgetStoreStaffs.address}}</div>
                </div>
                <span class="shop_map_icon">
                    <img class="shop_details_address_icon" src="../../images/nearstore_icon_location.png">
                </span>
            </div>
            <div class="shop_details_tel" @click="funcmakePhoneCall" v-if="shopgetStoreStaffs.phone">
                <span>{{shopgetStoreStaffs.phone}}</span>
                <span><img class="shop_details_tel_icon" src="../../images/nearstore_icon_phone.png"></span>
            </div>
        </div>
        <div class="shop_set_offet">
            <template v-if="shopgetStoreStaffs.is_default">
                <span class="shop_set_offet_btn" @click="funcSetOffetShop">取消常购门店</span>
            </template>
            <template v-else>
                <span class="shop_set_offet_btn" @click="funcSetOffetShop">设置为常购门店</span>
            </template>
        </div>
        <!-- 顾问 -->
        <div class="shop_details_adviser">
            <div class="shop_details_sub_tit">本店顾问</div>
            <template v-if="staff_info.length">
                <div class="shop_user_wrap"
                v-for="item in staff_info"
                :key="item.staff_id">
                    <div class="shop_user_header">
                        <div class="shop_user_info">
                            <img class="shop_user_photo" :src="item.staff_icon">
                            <div class="shop_user_name">{{item.real_name}}<span class="shop_user_number">工号{{item.staff_id}}</span></div>
                            <div class="shop_user_comment">
                                获得了 <span class="shop_user_comment_num">{{item.score}}</span> 个好评
                            </div>
                        </div>
                        <!-- <div class="shop_user_handler">
                            <span class="shop_user_handler_btn" @click="funcSetFollowStaff(item)">
                                <template v-if="item.is_follow == 0">
                                    加关注
                                </template>
                                <template v-if="item.is_follow == 1">
                                    取消关注
                                </template>
                            </span>
                        </div> -->
                    </div>
                    <div class="shop_user_recommend" v-if="item.product_info.length">
                        <div class="shop_item_ul"
                        v-for="(product,pindx) in item.product_info" 
                        @click="funcGoToGoodsDetail(product.product_sku)" 
                        :key="pindx">
                            <template v-if="pindx < item.init_num">
                                <div class="shop_item_li">
                                    <img class="shop_item_img" :src="product.product_image">
                                    <div class="shop_item_info">
                                        <div class="shop_item_title">
                                            {{product.product_name}}
                                        </div>
                                        <div class="shop_item_price">￥{{product.product_money}}</div>
                                    </div>
                                </div>
                                <div class="shop_item_txt">
                                    {{product.product_remark}}
                                </div>
                                <div class="shop_item_tags">
                                    <span class="shop_item_tag"
                                    v-for="(tag,tagidx) in product.product_lables"
                                    :key="tagidx">{{tag}}</span>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="shop_item_more" v-if="item.product_info.length > item.init_num" @click="funcProductMore(item)">更多推荐商品</div>
                </div>
                <div class="weui-loadmore" v-if="!staff_info.length">
                    <div class="weui-loading"></div>
                    <div class="weui-loadmore__tips">正在加载...</div>
                </div>
            </template>
            <div class="data_no" v-if="is_no_data">
                <div class="">暂无门店导购</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getStoreStaffs, getMessageMainSideShop, followStaff, updateOftenShop, getNearByShopImg } from '@/api'
import { mapState } from 'vuex';
export default {
    data() {
        return {
            shopId: '',
            offset: 1,
            limit: 20,
            staff_info: [],
            banner: [],
            is_no_data: false,
            ad_info:[],
        }
    },
    onLoad(){
        this.ad_info = [];
        this.sa_page(this,false,'门店详情','');
    },

    onShow(){
        this.funcInitGetStoreStaffs();
        this.funcGetMessageMainSideShop();
        this.funcGetNearByImg();
    },
    computed:mapState(['shopgetStoreStaffs']),
    methods: {
        //默认获取信息
        funcInitGetStoreStaffs(){
            let query = {
                shop_id: this.shopgetStoreStaffs.shop_id,
                offset: this.offset,
                limit: this.limit
            }
            this.staff_info = [];
            this.is_no_data = false;
            getStoreStaffs(query).then( res => {
                let { total_page, staff_info } = res;
                if( total_page ){
                    this.staff_info = staff_info;
                    this.staff_info.forEach((item,index) => {
                        this.$set(item, 'init_num', 2);
                    });
                } else {
                    this.is_no_data = true;
                }
            })
        },
        //拨打电话
        funcmakePhoneCall(){
            let _this = this;
            wx.makePhoneCall({
                phoneNumber: this.shopgetStoreStaffs.phone
            })
        },
        //地图
        funcGetLocation(){
            let _this = this;
            wx.openLocation({
                latitude: parseFloat(_this.shopgetStoreStaffs.ycoordinate),
                longitude: parseFloat(_this.shopgetStoreStaffs.xcoordinate),
                name: _this.shopgetStoreStaffs.shop_name,
                address: _this.shopgetStoreStaffs.address
            })
        },
        //关注
        funcSetFollowStaff(item){
            let query = {
                follow_status: item.is_follow,
                staff_id: item.staff_id
            }
            let token = wx.getStorageSync('token');
            if(token) {
                followStaff(query).then( res => {
                    item.is_follow = res.is_follow;
                });
            } else {
                wx.navigateTo({
                    url: '/pages/userCenter/login/wxLogin/main'
                })
            }
        },
        //设置常购门店
        funcSetOffetShop(){
            let token = wx.getStorageSync('token');
            let query = {
                shop_id: this.shopgetStoreStaffs.shop_id.toString(),
                is_default: this.shopgetStoreStaffs.is_default?0:1
            }
            if(token) {
                updateOftenShop(query).then( res => {
                    this.shopgetStoreStaffs.is_default = !this.shopgetStoreStaffs.is_default;
                })
            } else {
                wx.navigateTo({
                    url: '/pages/userCenter/login/wxLogin/main'
                })
            }
        },
        //门店活动接口
        funcGetMessageMainSideShop(){
            let query = {
                shop_id: this.shopgetStoreStaffs.shop_id.toString()
            }
            getMessageMainSideShop(query).then(res => {
               this.banner = res;
            })
        },

        funcGetNearByImg() {
            let query = {
                shop_id: this.shopgetStoreStaffs.shop_id.toString()
            }
            getNearByShopImg(query).then(res => {
               this.ad_info = res.ads;
            })
        },
        //跳转商品详情
        funcGoToGoodsDetail(sku){
            wx.navigateTo({
                url: `/pages/goodsdetailed/main?sku=${sku}`
            });
        },
        //加载更多商品
        funcProductMore(item){
            item.init_num = item.product_info.length;
        },
        //活动跳转H5
        funcOoToH5(item){
            // wx.setStorageSync('urlH5',item.activity_url);
            wx.setStorageSync('urlH5',item.link);
            wx.navigateTo({
                url:'/pages/transferH5/main'
            });
        }
    }
}
</script>

<style scoped>
.shop_details_swiper {
    width: 750px;
    height: 380px;
}
.slide-image {
    width: 100%;
    height: 380px;
}
.shop_details_address {
    padding: 20px 25px 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.shop_address_left {
    width: 650px;
}
.shop_title {
    padding: 0 0 12px;
    font-size: 30px;
    color: #333333;
    line-height: 36px;
}
.shop_address {
    padding-bottom: 28px;
    font-size: 24px;
    color: #999999;
    line-height: 30px;
}
.shop_details_address_icon {
    width: 40px;
    height: 40px;
    display: block;
}
.shop_details_tel {
    margin-left: 20px;
    padding-right: 25px;
    border-top: #EEEEEE 1px solid;
    display: flex;
    justify-content: space-between;
    line-height: 88px;
    font-size: 30px;
    color: #333333;
    align-items: center;
}
.shop_details_tel_icon {
    width: 40px;
    height: 40px;
    display: block;
}
.shop_set_offet {
    padding: 20px 0 28px;
    display: flex;
}
.shop_set_offet_btn {
    width: 400px;
    height: 80px;
    margin: auto;
    border-radius: 40px;
    text-align: center;
    line-height: 80px;
    color: #ffffff;
    background: #FF5000;
    font-size: 30px;
}
.shop_details_adviser {
    background: #f3f5f7;
}
.shop_details_sub_tit {
    padding: 28px 0 24px;
    font-size: 30px;
    text-align: center;
    color: #333333;
}
.shop_user_wrap {
    margin-bottom: 40px;
    padding-bottom: 25px;
    background: #ffffff;
}
.shop_user_wrap:last-child{
    margin-bottom: 0;
}
.shop_user_info {
    position: relative;
    flex: 1;
}
.shop_user_photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    position: absolute;
    left: 28px;
    top: -36px;
}
.shop_user_header {
    padding: 16px 20px 26px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.shop_user_name {
    padding-left: 168px;
    font-size: 30px;
    color: #333333;
    line-height: 40px;
}
.shop_user_comment {
    padding-top: 12px;
    padding-left: 168px;
    font-size: 24px;
    color: #999999;
    line-height: 30px;
}
.shop_user_handler_btn {
    width: 140px;
    height: 48px;
    display: block;
    border: #FF5000 1px solid;
    border-radius: 24px;
    text-align: center;
    line-height: 48px;
    font-size: 24px;
    color: #FF5000;
}
.shop_user_handler_btn.active {
    background: #FF5000;
    color: #ffffff;
}
.shop_user_number {
    padding-left: 20px;
    color: #999999;
}
.shop_user_comment_num {
    padding: 0 10px;
    color: #FF5000;
}
.shop_user_recommend{
    margin: 0 20px;
    padding: 20px 0 0 20px;
    background: #f3f5f7;
}
.shop_item_ul{
    /* margin-bottom: 28px; */
    border-bottom: #DDDDDD 1px solid;
}
.shop_item_ul:last-child {
    border-bottom: 0;
}
.shop_item_li {
    display: flex;
}
.shop_item_img{
    width: 120px;
    height: 120px;
    display: block;
    border-radius: 16px;
}
.shop_item_info {
    height: 120px;
    flex: 1;
    display: flex;
    padding: 0 20px;
    flex-direction: column;
}
.shop_item_title {
    height: 60px;
    font-size: 24px;
    color: #333333;
    line-height: 30px;
    text-align: justify;
    overflow: hidden;
}
.shop_item_price {
    padding-top: 33px;
    color: #FF5000;
    font-size: 24px;
    line-height: 30px;
    font-weight: 700;
}
.shop_item_txt {
    padding: 20px 20px 20px 0;
    font-size: 24px;
    color: #333333;
    text-align: justify;
    line-height: 30px;
}
.shop_item_tags {
    padding-bottom: 30px;
    display: flex;
    flex-wrap: wrap;
}
.shop_item_tag {
    padding: 0 12px;
    margin-right: 20px;
    box-sizing: border-box;
    line-height: 32px;
    text-align: center;
    border: #FF5000 1px solid;
    color: #FF5000;
    font-size: 22px;
    border-radius: 4px;
    white-space: nowrap;
}
.shop_item_more {
    margin-top: 20px;
    color: #333333;
    font-size: 30px;
    line-height: 42px;
    text-align: center;
}
.data_no {
    background: #ffffff;
    text-align: center;
    font-size: 24px;
    color: #333333;
    padding: 50px 0;
}
</style>