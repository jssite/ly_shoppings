<template>
  <div class="backgroundView">
    <div class="nav_bg">
      <scroll-view
        class="nav_scroll"
        scroll-x="true"
        scroll-with-animation="true"
        :scroll-left="leftValue"
      >
        <div
          v-for="(items, index) in nav_list"
          :key="index"
          @click.stop="getstatus(index)"
          class="nav_scroll_content"
          :class="{activity: index == status}"
        >{{items.class_name}}</div>
      </scroll-view>
    </div>
    <div class="linebackground" v-if="is_show_data"></div>
    <div class="page_content_box" v-if="is_show_data">
      <div class="page_content" v-if="pro_list_info.length">
        <div @click.stop="gotoGoodsDetail(index)" class="pro_content" v-for="(item, index) in pro_list_info" :key="index">
          <img class="pro_image" :src="item.image"/>
          <img class="mark_title" v-if="index == 0" src="/static/images/public/public_label_top_1.png">
          <img class="mark_title" v-if="index == 1" src="/static/images/public/public_label_top_2.png">
          <img class="mark_title" v-if="index == 2" src="/static/images/public/public_label_top_3.png">
          <div class="pro_right">
            <div class="pro_name">{{item.prod_title}}</div>
            <div class="pro_price_content">
              <!-- <div class="pro_price"><span style="font-size:24rpx;">¥</span><span>{{item.sale_price}}</span></div> -->
              <div class="pro_price" style="font-family:PingFangSC-Medium;" v-if="item.list_price">
                <span style="font-size:24rpx;">¥</span>
                <span style="margin-left:4rpx;">{{item.list_price[0]}}</span>
                <span style="font-size:22rpx;">{{item.list_price[1]}}</span>
              </div>
              <div class="pro_mark" v-for="(tag, tag_index) in item.promotion_tag" :key="tag_index">{{tag}}</div>
            </div>
            <!-- <div class="buy_count" v-if="item.quantity > 0">{{item.quantity}}人已购买</div> -->
            <!-- <div class="buy_count">{{item.quantity}}人已购买</div> -->
          </div>
        </div>
        <div v-if="is_show_bottom" class="weui-loadmore">
          <div v-if="!bottom" class="weui-loading"></div>
          <div class="weui-loadmore__tips">{{bottom?"已经到底啦":"正在加载..."}}</div>
        </div>
      </div>
      <div
      class="page_content"
        v-else
        style="display: flex; align-items:center; padding-top:100rpx;flex-direction: column"
      >
        <img src="/static/images/public/public_empty_pic.png" style="width:266rpx;height:222rpx;">
        <span style="color:#333; font-size:30rpx;margin-top:40rpx">暂无商品信息</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {
  getProductTypeCategory,
  daGuanRecommentGoods,
  hotListGoods
} from "@/api";
import { EventBus } from "@/bus/event-bus.js";
import {priceFormat} from '@/utils'
export default {
  data() {
    return {
      status: 0,
      nav_list: [],
      leftValue: 0,
      type: "1",
      page_size: 10,
      page_index: 1,
      pro_list_info: [],
      category_info: [],
      requset_info:{},
      id_end:false,
      bottom:false,
      is_show_bottom:false,
      is_show_data:false,
    };
  },

  onLoad(options) {
    wx.showLoading({title: '正在加载中', mask: true});
    this.sa_page(this,false,'排行榜','');
    this.type = "2";
    this.configClearGlobalData();
    this.getNetWorkInfo();
  },

  onPullDownRefresh() {
    this.page_index = 1;
    this.bottom = false;
    this.is_show_bottom = false;
    this.pro_list_info = [];
    this.funcGetProductInfo();
  },

  onReachBottom() {
    console.log(1234);
    if (this.id_end) {
      this.bottom = true;
      return;
    }
    this.page_index += 1;
    this.requset_info.page_index = this.page_index;
    this.funcGetProductInfo();
  },

  methods: {
    configClearGlobalData() {
      this.nav_list = [];
      this.leftValue = 0;
      this.pro_list_info = [];
      this.page_index = 1;
      this.category_info = [];
      this.requset_info = {};
      this.is_end = false;
      this.is_show_bottom = false;
      this.is_show_data = false;
      this.status = 0;
    },

    getNetWorkInfo() {
      getProductTypeCategory({ type: this.type }).then(res => {
        if (res.category_list.length) {
          let cat_info = {
            class_name: "全部",
            category_id: ""
          };
          this.nav_list.push(cat_info);
          this.nav_list.push(...res.category_list);
        // this.nav_list = res.category_list;
        // if (this.nav_list.length) {
          let category_info = this.nav_list[0];
          console.log(res);
          let requset_info = {
            page_index: this.page_index,
            page_size: this.page_size,
            scene_type: "ios_hot_list",
            scene_category_id: category_info.category_id,
            is_promotion: "1"
          };
          this.requset_info = requset_info;
          this.funcGetProductInfo();
        }
      });
    },

    getstatus(index) {
      wx.showLoading({title: '正在加载中', mask: true});
      this.status = index;
      let margin = index * 90 - 180;
      if (margin <= 0) {
        this.leftValue = 0;
      } else {
        this.leftValue = margin;
      }
      this.page_index = 1;
      this.is_show_bottom = false;
      this.bottom = false;
      this.is_show_data = false;
      let category_info = this.nav_list[index];
      let requset_info = {
            page_index: this.page_index,
            page_size: this.page_size,
            scene_type: "ios_hot_list",
            scene_category_id: category_info.category_id,
            is_promotion: "1"
          };
      this.requset_info = requset_info;
      this.pro_list_info = [];
      // wx.startPullDownRefresh();
      this.funcGetProductInfo();
    },

    funcGetProductInfo() {
      hotListGoods(this.requset_info).then(res => {
        // wx.stopPullDownRefresh();
        this.is_show_data = true;
        if (this.page_index == 1) {
          this.pro_list_info = [];
        }
        if(res.is_end) {
            this.id_end = true;
            this.bottom = true;
        }
        res.product_list.map(pro_items_temp => {
          let tag_promoti = [];
          if (pro_items_temp.promotion_tag && pro_items_temp.promotion_tag.length) {
            pro_items_temp.promotion_tag.map( (tag , tag_index) => {
              if (tag_index < 1) {
                tag_promoti.push(tag);
              }
            });
          }
          pro_items_temp.promotion_tag = tag_promoti;
          pro_items_temp.list_price = priceFormat(pro_items_temp.sale_price);
          this.pro_list_info.push(pro_items_temp);
        });
        // this.pro_list_info.push(...res.product_list);
        if (this.pro_list_info.length > 6) {
          this.is_show_bottom = true;
        }
        wx.hideLoading();
        console.log(res);
      });
    },

    gotoGoodsDetail(index) {
      let goods_info = this.pro_list_info[index];
      let url = "/pages/goodsdetailed/main?sku=" + goods_info.sku;
      wx.navigateTo({
        url: url,
      });
    }
  }
};
</script>

<style scoped>
.backgroundView {
  /* background: #ff5000;
  min-height: 1334rpx; */
}

 .linebackground{
    width: 100%;
    position: fixed;
    height: 150rpx;
    background: #ff5000;
    top: 25rpx;
    left: 0;
    z-index: -1;
} 

.page_content_box{
    position: relative;
    z-index: 1;
    /* background:#ff5000;  */
    /* height:100rpx; 
    width:100%;
    border-radius:32rpx; */
}



.nav_bg {
  width: 100%;
  position: fixed;
  height: 80rpx;
  background: #ff5000;
  top: 0;
  left: 0;
  z-index: 100;
}

.nav_scroll {
  height: 80rpx;
  line-height: 80rpx;
  width: 100%;
  white-space: nowrap;
  display: flex;
  font-size: 0;
  /* flex-direction: column; */
}

.nav_scroll_content {
  display: inline-block;
  font-size: 26rpx;
  margin: 0 20rpx;
  height: 70rpx;
  color: #fff;
  font-weight: bold;
  /* z-index: 10; */
  /* flex: 0 0 auto; */
  /* height: 50rpx; */
  /* box-sizing: border-box; */
}

/* .nav_scroll_content:first-child{margin-left: 20rpx;} */
/* .nav_scroll_content:last-child{margin-right: 16rpx;} */

.nav_scroll_content.activity {
  color: #fff;
  border-bottom: 4px #fff solid;
}

.page_content {
  /* position: relative; */
  padding-top: 10rpx;
  margin-top: 90rpx;
  background: #fff;
  width: 100%;
  border-radius: 32rpx;
  min-height: 1500rpx;
}

.pro_content {
  padding: 10rpx;
  box-sizing: border-box;
  height: 220rpx;
  display: flex;
  position: relative;
}

.mark_title {
  position: absolute;
  top: 10rpx;
  left: 30rpx;
  width: 44rpx;
  height: 56rpx;
}

.pro_image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 20rpx;
  background: #fff;
  margin-left: 20rpx;
}
.pro_right {
  width: 490rpx;
  /* margin-left: 20rpx; */
  padding: 0 20rpx;
  border-bottom: #eeeeee 1px solid;
}
.pro_name {
  font-size: 26rpx;
  color: #333;
  height: 72rpx;
  overflow:hidden; 
  text-overflow:ellipsis;
  display:-webkit-box; 
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
}
.pro_price_content {
  margin-top: 34rpx;
  color: #ff5000;
  display: flex;
  align-items: center;
  height: 30rpx;
  width: 100%;
  /* overflow: hidden; */
  /* white-space: nowrap; */
}
.pro_price {
  display: flex;
  align-items: baseline;
  font-size: 34rpx;
}
.pro_mark {
  border: #ff5000 2rpx solid;
  padding: 0 10rpx;
  text-align: center;
  color: #ff5000;
  font-size: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  margin-left: 20rpx;
  /* white-space: nowrap; */
  
}
.buy_count {
  margin-top: 23rpx;
  font-size: 22rpx;
  color: #999;
}
</style>