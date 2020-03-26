<template>
    <div class="scan_content">
        <div class="scan_head_search">
            <img src="/static/images/navbar_search.png" class="search_icon" alt="">
            <input class="search_val" type="text" confirm-type="search" v-model="search_val" placeholder="请输入门店名称、地址或商圈">
        </div>
        <template v-if="is_data">
            <div class="location_result">
                <img class="shop_no_img" src="/static/images/public/public_empty_pic.png" alt="">
                <div class="shop_no_data">请输入您所在门店的地址信息搜索</div>
            </div>
        </template>
        <template v-else>
            <div class="location_shop_list">
                <div class="location_shop_content" @click="funcSaveLocation(item)" v-for="(item, index) in result" :key="index">
                    <div class="location_shop_info">
                        <div class="location_shop_name">
                            {{item.shop_name}}
                        </div>
                        <div class="location_shop_address">
                            {{item.address}}
                        </div>
                        <div class="location_shop_time" v-if="item.work_time">可提货时间：{{item.work_time}}</div>
                    </div>
                    <div class="location_shop_range">
                        <div class="location_range_icon">
                            <img class="location_icon" src="/static/images/shop_store_location.png" alt="">
                        </div>
                        <div class="location_range_number">{{item.distance_str}}</div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { queryShopLists } from "@/api";
export default {
    data() {
        return {
            search_val: '',
            is_data: false,
            result: []
        }
    },
    watch: {
        search_val: function(n,o){
            this.funcGetQueryShopLists(n);
        }
    },
    onShow(){

    },
    methods: {
        /* 关键字搜索门店 */
        funcGetQueryShopLists(keywords){
            let storage = wx.getStorageSync('locationInfo')
            let query = {
                keyword: keywords,
                longitude: storage.longitude,
                latitude: storage.latitude
            }
            queryShopLists(query).then( res => {
                let { body, header } = res;
                if( header.res_code == 0 ){
                    this.result = body.shop_list;
                    if( shop_list.length ){
                        this.is_data = false
                    } else {
                        this.is_data = true;
                    }
                }
            })
        },
        /* 缓存信息 */
        funcSaveLocation(item){
            // wx.setStorageSync('scan_location',JSON.stringify(item))
            wx.setStorageSync('shop_name',item.shop_name)
            wx.setStorageSync('shop_id',item.shop_id)
            wx.navigateBack({
                delta: 2
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
    padding-left: 63px;
    box-sizing: border-box;
    border-radius: 26px;
    background: #F2F2F2;
    color: #333333;
    line-height: 1;
    font-size: 30px;
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
    width: 160px;
    text-align: center;
    padding-top: 28px;
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
    height: 99vh;
    background: #f3f5f7;
    text-align: center;
    font-size: 30px;
    color: #333333;
}
.search_icon {
    width: 30px;
    height: 31px;
    position: absolute;
    left: 40px;
    top: 11px;
}
</style>