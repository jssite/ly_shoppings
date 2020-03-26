<template>
  <div class="address_wrap">
    <template v-if="addRessList.length">
      <div
        class="tpAddress"
        v-for="(item,index) in addRessList"
        :key="index"
        @click.stop="funcSelectAddress(index)"
      >
        <text class="text1">{{item.consignee}}</text>
        <text class="text2">{{item.mobile}}</text>
        <div
          class="text3"
        >{{item.province + item.city + item.area + item.poi_name + item.door_number}}</div>
        <div class="operate">
          <!-- publicCircle-checkOn -->
          <img
            class="img1"
            @click.stop="funsetdefuild(item.address_id,1,item.is_default)"
            :src="item.is_default==1?'/static/images/public/publicCircle-checkOn.png':'/static/images/public/publicCircle-checkOff.png'"
            alt
          />
          <span class="text4">{{item.is_default==1?'默认地址':'设为默认'}}</span>
          <span
            class="text5"
            @click.stop="funsetdefuild(item.address_id,0,item.is_default)"
            v-if="item.is_default!=0"
          >取消</span>
          <span class="text5" v-if="item.is_default==0"></span>
          <img
            class="img2"
            @click.stop="funreviseRess(item)"
            src="/static/images/userCenter/set_icon_eidt.png"
            alt
          />
          <span class="text6" @click.stop="funreviseRess(item)">编辑</span>
          <img
            class="img2"
            @click.stop="deteleAddress(item.address_id)"
            src="/static/images/userCenter/set_icon_eidt2.png"
            alt
          />
          <span class="text6" @click.stop="deteleAddress(item.address_id)">删除</span>
        </div>
      </div>
      <navigator
        url="/pages/shipAddress/changeAddress/main"
        class="user_invoice_link"
        :class="{iPhone:phonestyleShow}"
        hover-class="none"
      >
        <button type="button" class="user_invoice_add">添加新地址</button>
      </navigator>
    </template>
    <template v-if="is_show_data">
      <div>
        <div class="placeholder">
          <img src="/static/images/public/public_empty_pic.png" alt />
          <text>您还没有收货地址哦</text>
          <navigator class="nav" url="/pages/shipAddress/changeAddress/main">新建地址</navigator>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { gainAddressList, setDeteletadd, setdefaultaddress } from "@/api";
import { EventBus } from "@/bus/event-bus.js";

export default {
  data() {
    return {
      addRessList: [], //接受数据
      is_show_data: false,
      phonestyleShow: false,
      source_type: 0,
      options_info:{},
    };
  },
  onLoad(options) {
    this.sa_page(this, false, "地址管理", "");
    this.phonestyleShow = false;
    if (options.type) {
      this.source_type = options.type;
      if (this.source_type == 1000) {
          this.options_info = options;
      }
    } else {
      this.source_type = 0;
      Object.assign(this.$data, this.$options.data());
    }
    let phoneMobile = wx.getStorageSync("phoneMobile"); //判断是否为IPhonex
    console.log(phoneMobile);
    if (
      phoneMobile.model.indexOf("X") > -1 ||
      phoneMobile.model.indexOf("unknown<iPhone11,8>") > -1
    ) {
      this.phonestyleShow = true;
    }
  },
  onShow() {
    this.getaddRessList();
  },
  methods: {
    /**
     * 获取数据列表
     */
    getaddRessList() {
      wx.showLoading({
        title: "数据加载中"
      });
      gainAddressList({}).then(res => {
        wx.hideLoading();
        if (JSON.stringify(res) == "{}") {
          this.is_show_data = true;
        } else {
          this.addRessList = res.address_list;
        }
      });
    },
    /**
     * 设置默认值
     * 1设置 0 取消
     */
    funsetdefuild(addressid, Num, is_default) {
      // if(is_default==1){
      //     wx.showToast({title: '已是默认值地址',icon: 'none'})
      //     return }
      let that = this;
      let params = {
        address_id: addressid + "",
        is_default: Num
      };
      // console.log(JSON.parse(params))
      setdefaultaddress(params).then(res => {
        that.getaddRessList();
      });
    },

    /**
     * 修改地址
     */
    funreviseRess(msg) {
      console.log(msg);
      let params = Object.keys(msg).map(res => {
        return `&${res}=${msg[res]}`;
      });
      wx.navigateTo({
        url: "/pages/shipAddress/changeAddress/main?" + params.join("")
      });
    },
    /**
     * 删除地址
     */
    deteleAddress(addressid) {
      let that = this;
      wx.showModal({
        content: "确认删除此地址吗？",
        confirmColor: "#ff5000",
        success(res) {
          if (res.confirm) {
            setDeteletadd({ address_id: addressid }).then(res => {
              that.getaddRessList();
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },

    funcSelectAddress(index) {
      if (this.source_type == 1000) {
        let addressInfo = this.addRessList[index];
        console.log(addressInfo);
        wx.navigateBack({
          delta: 1
        });

        let obje = {
            address:addressInfo,
            userinfo:this.options_info
        }
        EventBus.$emit("addressInfo", obje);
      }
    }
  }
};
</script>

<style scoped>
.address_wrap {
  background: #f3f5f7;
  padding-bottom: 136px;
  box-sizing: border-box;
  min-height: 2000rpx;
}
.tpAddress:first-child {
  margin-top: 0rpx !important;
}
.tpAddress {
  padding-left: 28rpx;
  font-family: PingFangSC-Regular;
  font-size: 30px;
  color: #333333;
  letter-spacing: 0;
  line-height: 32px;
  background: #fff;
  margin-top: 20rpx;
  padding-top: 20rpx;
}
.text1 {
  padding-top: 20rpx;
  /* width: 200rpx; */
  font-weight: 700;
}
.text2 {
  padding-top: 20rpx;
  padding-left: 50rpx;
  font-weight: 700;
}
.text3 {
  font-size: 26px;
  color: #666666;
  margin-top: 20rpx;
  padding-bottom: 20rpx;
  padding-right: 20px;
  border-bottom: 1rpx solid #f3f5f7;
}
.operate {
  display: flex;
  height: 88rpx;
  line-height: 88rpx;
  align-items: center;
}

.img1 {
  height: 36rpx;
  width: 36rpx;
}
.text4 {
  font-size: 26px;
  color: #333333;
  margin: 0 12rpx;
}
.text5 {
  font-size: 26px;
  color: #999999;
  width: 220rpx;
}

.text6 {
  font-size: 26rpx;
}
.img2 {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
  margin-left: 60rpx;
}

.user_invoice_link {
  width: 100%;
  padding: 28px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: #f3f5f7;
}

.iPhone {
  bottom: 68rpx;
}
.user_invoice_add {
  width: 710px;
  height: 80px;
  background: #ff5000;
  color: #ffffff;
  font-size: 30px;
  text-align: center;
  border-radius: 40px;
  font-weight: 700;
}
.placeholder {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.placeholder image {
  width: 250rpx;
  height: 210rpx;
  margin-top: 240rpx;
}
.placeholder text {
  font-family: PingFangSC-Regular;
  font-size: 26px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
  margin: 40rpx 0rpx 60rpx 0rpx;
}
.nav {
  background: #ff5000;
  border: 1px solid #ff5000;
  border-radius: 40px;
  height: 72rpx;
  width: 240rpx;
  line-height: 72rpx;
  font-size: 30px;
  color: #ffffff;
  text-align: center;
}
</style>