<template>
  <div>
    <div class="item_product" @click.stop="gotoDetailed(product.sku)">
      <div class="item_product_img_wrap">
        <img :src="BASE_IMG_URL + product.le_image" class="item_product_img" alt />
        <span v-if="product.is_pre_sell == 1" class="item_presell_bg">预售</span>
        <span class="item_product_video" v-if="product.video == 1">
          <img
            class="item_product_video_img"
            src="../../../../static/images/product_icon_video.png"
            alt
          />
        </span>
      </div>
      <div class="item_product_info">
        <h1 class="item_product_title">
          <template v-if="product.leyou_flash && initDetail == 'other'">
            <span style="width: 76rpx; padding-right: 5rpx;">
              <img
                style="width: 76rpx;height: 30rpx; margin-right:10rpx; vertical-align: middle;"
                src="../../../../static/images/search/search_sign_speed.png"
                alt
              />
            </span>
          </template>
          <template v-if="product.ishaitao == '1'">
            <span class="txt_title">【全球购】</span>
          </template>
          {{product.title}}
        </h1>
        <div class="item_product_price">
          <div class="item_product_price_sale">
            <span class="item_product_price_sign">￥</span>
            <span class="price_init">{{product.prices[0]}}</span>
            <span class="price_float">.{{product.prices[1]}}</span>
          </div>
          <div class="item_product_price_vip" v-if="product.vip_price">
            <span>¥{{product.vip_price}}</span>
            <img
              style="width: 40rpx;height:24rpx;margin-left:10rpx;vertical-align: middle;"
              src="../../../../static/images/search/search_sign_vip.png"
              alt
            />
          </div>
          <div
            class="item_product_tags"
            :class="{'active':initDetail == 'other'}"
            v-for="(item,index) in product.awardtag"
            :key="index"
          >
            <span>{{item}}</span>
          </div>
        </div>
        <div class="item_product_footer">
          <div class="item_product_footer_number">
            <template v-if="logistics">
              <span class="logistics_span">仅物流有货</span>
            </template>
            <template v-if="product.prodcutsellamount > 10">{{product.prodcutsellamount}}人已购</template>
          </div>
          <template v-if="initDetail != 'other'">
            <div class="item_product_cart" @click.stop="shanAddCart(product)">
              <img class="item_product_cart_img" src="/static/images/twohr_list_shopping.png" alt />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 规格选择框 -->
    <div class="product_sku_dialog" v-if="productModule">
      <div class="product_sku_warp">
        <img
          src="/static/images/public_pop_close.png"
          class="product_sku_dialog_close"
          @click="closeSizeModal"
        />
        <div class="product_sku_lists">
          <div style="width: 100%;display: flex;margin-right:20rpx;justify-content:center">
            <h1 class="product_sku_title">{{goodsSpecTile}}</h1>
          </div>
          <div class="product_sku_list">
            <h4 class="product_sku_sub_tit">颜色</h4>
            <div class="product_sku_category_wrap">
              <span
                v-for="(item,ind) in goodsSpecData"
                :key="ind"
                @click.stop="selectSpecColor(item,ind)"
                :class="['product_sku_category',{'active':ind==goodsSpecNum}]"
              >{{item.color_name}}</span>
              <!-- <span class="product_sku_category active">粉红色</span>
                    <span class="product_sku_category disabled">白色</span>
              <span class="product_sku_category">黑色</span>-->
            </div>
          </div>
          <div class="product_sku_list">
            <h4 class="product_sku_sub_tit">尺码</h4>
            <div class="product_sku_category_wrap">
              <!-- <span class="product_sku_category">60cm</span> -->
              <span
                v-for="(item,index) in goodsSizeData"
                :key="index"
                :class="['product_sku_category',{'disabled':item.stock==0},{'active':pitchonSize==index}]"
                @click.stop="selectSize(item,index)"
              >{{item.size}}</span>
            </div>
          </div>
        </div>
        <!-- 数量 -->
        <div class="product_add_numner">
          <span class="product_add_txt">购买数量</span>
          <div class="product_input_wrap">
            <span class="product_input_add" @click="subgoodsCart">
              <img
                :src="goodsAddNum == 1 ? '/static/images/public/public_number_subnot.png':'/static/images/public/public_number_sub.png'"
                class="product_input_add_img"
              />
            </span>
            <input type="number" :value="goodsAddNum" disabled class="product_input_value" />
            <span class="product_input_reduce" @click="addgoodsCart">
              <img
                :src=" addgoodsNumShow ?'/static/images/public/public_number_add.png':'/static/images/public/public_number_addnot.png'"
                class="product_input_reduce_img"
              />
            </span>
          </div>
        </div>
        <!-- 价格 -->
        <div class="product_cart_price">
          <div class="product_price">
            <span class="product_price_span">￥</span>
            {{goodsSpecPrice}}
          </div>
          <button type="button" class="product_cart_submit" @click="addSizeCart">加入购物车</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { getshanaddCart, getshopcartNum, getMeetProductSize } from "@/api";
var app = getApp();

export default {
  data() {
    return {
      goodsSpecNum: 0, //初始化规格
      goodsSpecList: [], //获取规格列表
      productModule: false,
      shopCartNum: "",
      goodsSpecData: [],
      goodsSizeData: [],
      goodsSku: null,
      goodsAddNum: 1,
      pitchonSize: -1,
      addgoodsNumShow: false,
      goodsStock: 0,
      goodsSpecPrice: null, //规格商品价格
      goodsSpecTile: null //规格商品名字
    };
  },
  computed: {
    BASE_IMG_URL() {
      return this.$store.state.BASE_APP_INFO["download_le_image"];
    }
  },
  props: {
    sa_search_type: {
      type: Boolean,
      default: false
    },
    sa_click_index: {
      type: Number
    },
    sa_search_info: {
      type: Object
    },
    product: {
      type: Object,
      default: []
    },
    initDetail: {
      type: String,
      default: "other"
    },
    shopid: {
      type: Number
    },
    logistics: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    gotoDetailed(sku) {
      if (this.sa_search_type) {
        console.log("搜索搜索搜索大图");
        let sa_info = {
          commodityID: sku,
          searchIndex: this.sa_click_index
        };
        Object.assign(sa_info, this.sa_search_info);
        console.log("搜索搜索搜索小图",sa_info);
        app.sensors.track("mp_searchClick", sa_info);
      }

      if (this.initDetail == "shansong") {
        wx.navigateTo({
          url:
            "/pages/leDelivery/Deliverydetailed/main?sku=" +
            sku +
            "&shopid=" +
            this.shopid
        });
        this.initDetail = null;
      } else {
        wx.navigateTo({ url: "/pages/goodsdetailed/main?sku=" + sku });
      }
    },
    shanAddCart(product) {
      //选择商品添加到购物车
      console.log(product);
      //添加购物车
      // console.log(product, "回调后的");
      // stock_hbqty
      // product.multi_sku
      if (product.multi_sku == 1) {
        wx.showLoading({ title: "正在加载", mask: true });
        this.goodsSpecPrice = product.price;
        this.goodsSpecTile = product.productname;
        this.productModule = true;
        //有多个规格 "sku" : "T120068016", "product_id" : 510380,  "shop_id" : "2478"
        let params = {
          sku: product.sku,
          product_id: product.productid,
          shop_id: wx.getStorageSync("shan_shop_id")
        };
        getMeetProductSize(params).then(res => {
          console.log(res, "lelele");
          let sizeObj = res.meet_product;
          if (res.image_colors_list.length > 0) {
            //如果有多种颜色
            res.image_colors_list.map(r => {
              r.sku_size_vos.map(j => {
                for (let key in sizeObj) {
                  if (key == j.sku) {
                    j.stock = sizeObj[key].stock;
                    j.sale_price = sizeObj[key].sale_price;
                  }
                }
              });
            });
            this.goodsSpecList = res;
            this.goodsSpecData = res.image_colors_list;
            this.goodsSizeData = res.image_colors_list[0].sku_size_vos;
          }
          wx.hideLoading();
        });
      } else {
        //没有规格直接加入购物车
        let params = {};
        let that = this;
        this.shansongcart_id = wx.getStorageSync("shansongcart_id");
        let token = wx.getStorageSync("token");

        if (token) {
          this.shansongcart_id = "";
          wx.removeStorageSync("shansongcart_id");
          params = {
            shop_id: wx.getStorageSync("shan_shop_id"), //门店Id
            quantity: 1, //数量
            cart_type: 2, //0普通商品 1海涛商品
            hander_type: 1, //默认添加
            sku: product.sku //商品sku
          };
        } else {
          if (this.shansongcart_id) {
            params = {
              shop_id: wx.getStorageSync("shan_shop_id"), //门店Id
              quantity: 1, //数量
              cart_type: 2, //0普通商品 1海涛商品
              hander_type: 1, //默认添加
              sku: product.sku, //商品sku
              cart_id: this.shansongcart_id //购物车id
            };
          } else {
            params = {
              shop_id: wx.getStorageSync("shan_shop_id"), //门店Id
              quantity: 1, //数量
              cart_type: 2, //0普通商品 1海涛商品
              hander_type: 1, //默认添加
              sku: product.sku //商品sku
            };
          }
        }
        getshanaddCart(params).then(res => {
          if (!token) {
            //没有登录
            if (!this.shansongcart_id) {
              //没有存过
              wx.setStorageSync("shansongcart_id", res.cart_id);
            }
          }
          this.$emit("shopCartNum", res.cart_num);
          console.log(res, "请问我执行了么");
          wx.showToast({ title: "加入购物车成功", icon: "none" });
          this.productModule = false;
          // this.funCartNum();
        });
      }
    },

    funCartNum() {
      //获取购物车数量
      let params = {
        shop_id: wx.getStorageSync("shan_shop_id"),
        cart_type: 2,
        is_check: 2
      };
      getshopcartNum().then(res => {
        console.log(res, "购物车数量");
        this.productModule = false;
        // this.shopCartNum = res.num;
        this.$emit("shopCartNum", res.num);
      });
    },
    closeSizeModal() {
      //关闭选着规格模态框
      this.pitchonSize = -1;
      this.productModule = false;
      this.addgoodsNumShow = false;
      this.goodsStock = null;
      this.goodsAddNum = 1;
    },
    subgoodsCart() {
      //减购物车数量
      if (this.goodsAddNum != 1) {
        this.goodsAddNum -= 1;
        this.addgoodsNumShow = true;
      }
    },
    addgoodsCart() {
      //加购物车数量
      if (!this.addgoodsNumShow) return;
      if (this.goodsStock >= this.goodsAddNum) {
        this.goodsAddNum += 1;
      } else {
        wx.showToast({
          title: "该商品的最大库存为" + this.goodsAddNum,
          icon: "none"
        });
        this.addgoodsNumShow = false;
      }
    },
    addSizeCart() {
      //选中规格完毕 后 加入购物车
      if (this.pitchonSize == -1) {
        wx.showToast({ title: "请选择规格", icon: "none" });
        return;
      }
      let params = {};
      let that = this;
      this.shansongcart_id = wx.getStorageSync("shansongcart_id");
      let token = wx.getStorageSync("token");
      if (token) {
        this.shansongcart_id = "";
        wx.removeStorageSync("shansongcart_id");
        params = {
          shop_id: wx.getStorageSync("shan_shop_id"), //门店Id
          quantity: this.goodsAddNum, //数量
          cart_type: 2, //0普通商品 1海涛商品
          hander_type: 1, //默认添加
          sku: this.goodsSku //商品sku
        };
      } else {
        if (this.shansongcart_id) {
          params = {
            shop_id: wx.getStorageSync("shan_shop_id"), //门店Id
            quantity: this.goodsAddNum, //数量
            cart_type: 2, //0普通商品 1海涛商品
            hander_type: 1, //默认添加
            sku: this.goodsSku, //商品sku
            cart_id: this.shansongcart_id //购物车id
          };
        } else {
          params = {
            shop_id: wx.getStorageSync("shan_shop_id"), //门店Id
            quantity: this.goodsAddNum, //数量
            cart_type: 2, //0普通商品 1海涛商品
            hander_type: 1, //默认添加
            sku: this.goodsSku //商品sku
          };
        }
      }
      getshanaddCart(params).then(res => {
        if (!token) {
          //没有登录
          if (!this.shansongcart_id) {
            //没有存过
            wx.setStorageSync("shansongcart_id", res.cart_id);
          }
          this.$emit("shopCartNum", res.cart_num);
        }
        wx.showToast({ title: "加入购物车成功", icon: "none" });
        this.pitchonSize = -1;
        this.productModule = false;
        // this.funCartNum();
      });
    },
    selectSize(item, i) {
      //选着尺寸
      if (item.stock == 0) return;
      if (this.pitchonSize == i) {
        this.pitchonSize = -1;
        this.addgoodsNumShow = false;
        return;
      }
      this.pitchonSize = i;
      this.addgoodsNumShow = true;
      console.log(item, "我是选择尺寸");
      this.goodsSku = item.sku;
      this.goodsStock = item.stock;
    },
    selectSpecColor(item, i) {
      //选择颜色
      this.goodsSpecNum = i;
      this.goodsSizeData = this.goodsSpecList.image_colors_list[i].sku_size_vos;
    }
  }
};
</script>

<style scoped>
.item_product {
  display: flex;
  padding: 16px 0 0 20px;
  background: #ffffff;
}
.item_product_img_wrap {
  width: 220px;
  height: 220px;
  margin-right: 20px;
  position: relative;
  z-index: 1;
}
.item_product_info {
  padding: 0 20px 0 0;
  flex: 1;
  border-bottom: #f3f5f7 1px solid;
}
.item_product_img {
  width: 220px;
  height: 220px;
  border-radius: 16px;
}
.item_product_title {
  margin-top: 10px;
  height: 72px;
  overflow: hidden;
  margin-bottom: 25px;
  color: #333333;
  font-size: 26px;
  line-height: 36px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.txt_title {
  color: #aa82ff;
  margin-right: -10px;
}
.haitao {
  white-space: nowrap;
  color: #aa82ff;
  margin-right: -10px;
  /* padding-right: 10px; */
}

.item_product_footer_number {
  font-size: 20px;
  color: #999999;
  line-height: 24px;
}
.item_product_price {
  height: 34px;
  margin-bottom: 10px;
  /* align-items: center; */
  display: flex;
}
.item_product_price_sale {
  height: 34px;
  display: flex;
  padding: 0 4px 0 16px;
  align-items: flex-end;
  color: #ff5000;
  font-weight: 700;
}
.item_product_price_sign {
  /* margin-top: 12px; */
  font-size: 24px;
  padding-right: 2px;
}
.item_product_price_vip {
  padding: 17rpx 0 0 10px;
  display: flex;
  height: 28px;
  font-size: 26px;
  align-items: center;
}
.item_product_tags {
  /* min-width: 64px; */
  padding: 0 10px;
  height: 28px;
  margin-left: 8px;
  border-radius: 14px;
  box-sizing: border-box;
  border: 1px solid #f55222;
  color: #ff5000;
  font-size: 24px;
  /* line-height: 24px; */
  text-align: center;
  display: flex;
  align-items: center;
  white-space: nowrap;
  /* margin-top: 10px; */
}
.price_float {
  font-size: 24px;
  /* padding-top: 7px; */
  /* line-height: 28px; */
}
.price_init {
  font-size: 32px;
  /* line-height: 32px; */
  /* line-height: 34px; */
}
.item_product_tags.active {
  background: #f55222;
  color: #ffffff;
}
.item_product_footer {
  height: 48px;
  /* padding-top: 10px; */
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.item_product_cart_img {
  width: 48px;
  height: 48px;
  margin-right: 16px;
  display: block;
}
.item_product_footer_number {
  /* padding: 0 0 8px 0; */
  font-size: 22px;
  color: #999999;
  line-height: 24px;
}
.item_product_price_vip {
  padding: 17rpx 0 0 10px;
  display: flex;
  height: 28px;
  font-size: 26px;
  align-items: center;
}
.logistics_span {
  padding: 0 10px;
  margin-right: 10px;
  height: 24px;
  border-radius: 12px;
  box-sizing: border-box;
  border: 1px solid #999999;
  color: #999999;
  font-size: 24px;
  line-height: 24px;
  text-align: center;
}
.item_product_video {
  position: absolute;
  left: 70px;
  top: 70px;
  z-index: 5;
}
.item_product_video_img {
  width: 80px;
  height: 80px;
  display: block;
}

/* 规格模态框 */

.product_sku_dialog {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.product_sku_warp {
  width: 600px;
  min-height: 400px;
  padding: 0 8px 20px 28px;
  box-sizing: border-box;
  border-radius: 16px;
  background: #ffffff;
  position: relative;
  z-index: 222;
}
.product_sku_lists {
  padding-bottom: 20px;
}
.product_sku_title {
  padding: 40px 0 48px;
  font-size: 26px;
  line-height: 30px;
  color: #333333;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 380rpx;
}
.product_sku_sub_tit {
  padding-bottom: 20px;
  font-size: 24px;
  color: #999999;
  line-break: 30px;
}
.product_sku_category_wrap {
  padding-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
}
.product_sku_category_wrap {
  padding-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
}
.product_sku_category {
  width: 160px;
  height: 48px;
  margin: 0 20px 20px 0;
  border-radius: 24px;
  border: #999999 1px solid;
  text-align: center;
  font-size: 24px;
  line-height: 48px;
  color: #333333;
}
.product_sku_category.active {
  background: #ff5000;
  color: #ffffff;
  border: #ff5000 1px solid;
}
.product_sku_category.disabled {
  color: #cccccc;
  border: #dddddd 1px solid;
}
.product_add_numner,
.product_input_wrap {
  display: flex;
}
.product_add_numner {
  margin-right: 20px;
  padding: 40px 0 60px 0;
  border-top: #dddddd 1px solid;
  justify-content: space-between;
}
.product_add_txt {
  color: #999999;
  font-size: 24px;
  line-height: 46px;
  font-family: "PingFangSC-Regular";
}
.product_input_add_img,
.product_input_reduce_img {
  width: 46px;
  height: 46px;
}
.product_input_value {
  width: 80px;
  height: 46px;
  background: #f6f6f6;
  text-align: center;
  font-size: 26px;
  line-height: 46px;
  font-weight: 700;
}
.product_cart_price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product_price {
  font-size: 28px;
  font-weight: 700;
  color: #ff5000;
}
.product_price_span {
  font-size: 24px;
  font-weight: 400;
}
.product_cart_submit {
  width: 300px;
  height: 80px;
  margin: 0 20px 0 0;
  border-radius: 12px;
  font-size: 30px;
  font-weight: 700;
  line-height: 80px;
  text-align: center;
  background: #ff5000;
  color: #ffffff;
}

.product_cartNum {
  position: fixed;
  left: 60rpx;
  bottom: 60rpx;
  height: 25rpx;
  color: #ffffff;
  width: 25rpx;
  text-align: center;
  line-height: 22rpx;
  border-radius: 50%;
  border: 2rpx solid #ff5000;
  background: #ff5000;
  font-size: 18rpx;
  z-index: 111;
}
.item_product_video {
  position: absolute;
  left: 146px;
  top: 146px;
  z-index: 5;
}
.item_product_video_img {
  width: 80px;
  height: 80px;
  display: block;
}

.product_sku_dialog_close {
  height: 44rpx;
  width: 44rpx;
  text-align: end;
  position: absolute;
  right: 20rpx;
  top: 20rpx;
}

.item_presell_bg {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #ff5000;
  color: #fff;
  font-size: 22rpx;
  opacity: 0.9;
  z-index: 2;
  text-align: center;
}
</style>