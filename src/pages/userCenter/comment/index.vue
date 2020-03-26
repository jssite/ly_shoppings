<template>
  <div class="content">
    <div class="shop-l">
      <div class="shop-l-box">
        <!-- <div class="shop-l-box" v-for="(item,index) in orderData.order_products" :key="index"> -->
        <img class="shop-l-img" :src="BASE_IMG_URL" alt>
        <p class="shop-l-p">{{item.marketing_title}}</p>
      </div>
    </div>

    <div class="comment-box">
      <p class="star-p">
        <span>整体评价</span>
        <img
          class="star active"
          @click="starClick(5)"
          :src="starIndex>4?'/static/goodsdetail/fullstar.png':'/static/goodsdetail/emptystar.png'"
        >
        <img
          class="star active"
          @click="starClick(4)"
          :src="starIndex>3?'/static/goodsdetail/fullstar.png':'/static/goodsdetail/emptystar.png'"
        >
        <img
          class="star active"
          @click="starClick(3)"
          :src="starIndex>2?'/static/goodsdetail/fullstar.png':'/static/goodsdetail/emptystar.png'"
        >
        <img
          class="star active"
          @click="starClick(2)"
          :src="starIndex>1?'/static/goodsdetail/fullstar.png':'/static/goodsdetail/emptystar.png'"
        >
        <img
          class="star active"
          @click="starClick(1)"
          :src="starIndex>0?'/static/goodsdetail/fullstar.png':'/static/goodsdetail/emptystar.png'"
        >
      </p>
      <textarea
        v-model="rev_text"
        class="textA"
        maxlength="500"
        placeholder="无论吐槽还是赞美，都是您的权利..."
        placeholder-style="color:#cacaca;font-size:26rpx;"
      ></textarea>
      <div class="img-box">
        <span class="img-upload-box" v-for="(item,index) in picUrlArr" :key="index">
          <img class="img-upload" mode="aspectFill" :src=" img_url + '/leyoutest1/' + item" alt>
          <img class="delImg" @click="del(index)" src="../image/comment_icon_delete.png" alt>
        </span>
        <span class="img-upload-box">
          <img class="img-upload" src="../image/comment_icon_upload.png" @click="chooseImg()" alt>
        </span>
      </div>
      <p class="btn" @click="addCom()">发布</p>
    </div>
  </div>
</template>

<script>
import { getOssConfig, addComments, getSuccessOrder } from "@/api";
import uploadFile from "@/utils/upload-config";
import { EventBus } from "@/bus/event-bus.js";
export default {
  name: "index",
  onLoad(options) {
    this.sa_page(this,false,'评价晒单','');
    this.funcClearData();
    this.options = options;
    this.item = JSON.parse(options.product);
    getOssConfig({}).then(res => {
      this.img_url = res.endpoint;
      wx.setStorageSync("config", res);
    });
  },

  computed: {
    BASE_IMG_URL() {
      return this.$store.state.BASE_APP_INFO["download_le_image"] + this.item.le_image;
    }
  },
  data() {
    return {
      options: "",
      picUrlArr: [],
      starIndex: 5,
      rev_text: "",
      img_url: "",
      // orderData: ""
      item: {}
    };
  },
  methods: {
    funcClearData() {
      this.item = {};
      this.picUrlArr = [];
      this.starIndex = 5;
      this.rev_text = "";
      this.orderData = "";
    },

    del(index) {
      this.picUrlArr.splice(index, 1);
      console.log(this.picUrlArr);
    },
    funSuccessOrder(orderId) {
      //订单详情（订单号 已经付款）
      let that = this;
      let params = { order_id: orderId };
      getSuccessOrder(params).then(res => {
        console.log(res);
        this.orderData = res;
        wx.hideLoading();
        // res.order_status = parseInt(res.order_status);
        // res.order_products.map(res=>{  //处理照片
        //     res.le_image = that.urlImage+res.le_image
        // })
        // this.order_id = res.order_products[0].order_id;//订单号
        // this.order_total_fee = res.payment_details[0].value //付款金额
        // this.orderData = res;
        // wx.hideLoading();
      });
    },
    //         order_id	int	true	订单id
    //         prod_id	int	true	商品id
    //         qual_rating	string	true	星级(0.0-1.0)
    //         rev_text	string	true	评价内容
    //         header_img_url	string	true	用户头像，从个人中心头像获取
    // img_list	string[]	true	从阿里云获取的图片名称
    addCom() {
      if (this.starIndex == 0) {
        wx.showToast({
          title: "请评价星级",
          icon: "none"
        });
        return;
      }
      if (!this.rev_text) {
        wx.showToast({
          title: "请填写评价内容",
          icon: "none"
        });
        return;
      }
      var data = {
        order_id: this.options.order_id,
        prod_id: this.item.product_id,
        qual_rating: this.starIndex / 5 + "",
        rev_text: this.rev_text,
        header_img_url: wx.getStorageSync("userinfo").avatar,
        img_list: this.picUrlArr
      };
      addComments(data).then(res => {
        wx.showToast({ title: "评论成功", icon: "none" });
        setTimeout(function() {
          EventBus.$emit("listRefersh");
          wx.navigateTo({ url: "/pages/confirm/list/main" });
        }, 1000);
      });
    },
    starClick(index) {
      this.starIndex = index;
    },
    chooseImg() {
      if (this.picUrlArr.length >= 9) {
        wx.showToast({
          title: "最多支持上传9张图片",
          icon: "none"
        });
        return;
      }
      console.log("chooseImgAlbum");
      var that = this;
      let uploadCount = 9 - this.picUrlArr.length;

      wx.chooseImage({
        count: uploadCount,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success(res) {
          console.log(res);
          wx.showLoading({
            title: "加载中"
          });
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            uploadFile(wx.getStorageSync("config"), {
              filePath: res.tempFilePaths[i],
              dir: `https://oss-cn-beijing.aliyuncs.com/leyoutest1/`,
              success: function(data) {
                if (i == res.tempFilePaths.length - 1) {
                  wx.hideLoading();
                }
                that.picUrlArr.push(data);
                console.log(that.picUrlArr);
              },
              fail: function(data) {
                console.log(data);
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.content {
  height: 100%;
  background: #f3f5f7;
}
.img-upload-box {
  display: inline-block;
  margin: 8rpx;
  padding-top: 10rpx;
  vertical-align: middle;
  position: relative;
}
.delImg {
  height: 36rpx;
  width: 36rpx;
  position: absolute;
  top: -7rpx;
  right: -12rpx;
}
.img-upload {
  display: inline-block;
  height: 160rpx;
  width: 160rpx;
  vertical-align: middle;
}
.btn {
  margin: 20rpx;
  left: 0;
  text-align: center;
  position: absolute;
  bottom: 20rpx;
  background: #ff5000;
  width: 710rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
  color: #fff;
  border-radius: 40rpx;
}
.img-box {
}
.comment-box {
  background: #fff;
  padding: 20rpx 20rpx;
  border-radius: 16rpx;
}
.star-p {
  font-size: 30rpx;
  padding: 10rpx 20rpx 20rpx;
  border-bottom: 1px solid #eee;
}
.star {
  display: inline-block;
  margin: 5rpx;
  margin-left: 11rpx;
  height: 36rpx;
  width: 36rpx;
  float: right;
}
.textA {
  width: 680rpx;
  padding: 20rpx;
  font-size: 26rpx;
  border-bottom: 1px solid #eee;
}
.shop-l {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}
.shop-l-box {
  height: 180rpx;
  position: relative;
  padding: 20rpx;
}
.shop-l-img {
  height: 120rpx;
  width: 120rpx;
  padding: 10rpx;
  float: left;
}
.shop-l .money {
  position: absolute;
  bottom: 20rpx;
  color: #ff5000;
  font-size: 26rpx;
}
.shop-l-p {
  padding-left: 160rpx;
  font-size: 24rpx;
  padding-top: 20rpx;
}
.products_small_wrap {
  padding-top: 6px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
