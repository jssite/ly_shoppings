
<template>
  <div style="background:#f3f5f7;">
    <form @submit="formSubmit" report-submit bindreset="formReset">
      <div class="changeAddalike">
        <text>收货人：</text>
        <input v-model="username" maxlength="101" placeholder="请填写收货人" name="username">
      </div>
      <div class="changeAddalike">
        <text>手机号码：</text>
        <input
          v-model="userphone"
          type="number"
          maxlength="11"
          placeholder="请填写手机号码"
          name="userphone"
        >
      </div>
      <div @click.stop="showModal" class="changeAddalike">
        <text>所在地区：</text>
        <div v-if="!region.provinceName" class="changeAddinfo" style="color: #888;">点击选择所在地区</div>
        <div
          v-if="region.provinceName"
          class="changeAddinfo"
        >{{region.provinceName}}{{region.DcityName}}{{region.areaName}}</div>
        <img class="ADDressimg" src="/static/goodsdetail/lecard_arrow_right.png">
      </div>
      <div class="changeAddalike" @click="relocation">
        <text>收货地址：</text>
        <input v-model="poi_name" disabled placeholder="点击选择收货地址" name="userdetailedaddress">
        <img class="ADDressimg" src="/static/goodsdetail/lecard_arrow_right.png">
      </div>
      <div class="changeAddalike">
        <text>门牌号：</text>
        <input v-model="userdoor" placeholder="请输入门牌号" name="userdoor">
      </div>
      <button class="confirm" form-type="submit" data-type="click">保存</button>
    </form>
    <div class="drawer_screen" v-if="optModal" @click.stop="closeModal"></div>
    <div class="optModal" v-if="optModal" style="background:#fff;">
        <!-- :provinceList="provinceList" -->
      <cityinfo @deliverModal="deliverModal"></cityinfo>
    </div>
  </div>
</template>

<script>
// import { getAreaCodeByNames } from "@/utils/area";
import cityinfo from "@/components/public/optcity";
import { isEmpty, ischaracter, isNumphone } from "@/utils/index";
import { reviseAddress, optCity } from "@/api";
import { EventBus } from "@/bus/event-bus.js";
export default {
  components: {
    cityinfo
  },
  data() {
    return {
      poi_name: "",
      position: true, //地理位置
      optModal: false, //初始模态框
      region: {}, //所在地区
      username: "", //收货人姓名
      userphone: "", //收货人电话
      userdetailedaddress: "", //收货人详细地址
      userdoor: "", //收件人门牌号
      latitude: "",
      longitude: "",
      imgUrls: [
        "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640",
        "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640",
        "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640"
      ],
      options: {},
      confirm: false,
    };
  },
  onLoad(options) {
    // wx.showLoading({title: '正在加载中', mask: true});
    this.sa_page(this,false,'添加地址','');
    this.confirm = false;
    if (options.confirm == '1') {
        this.confirm = true;
        // this.options = JSON.parse(options.info);
        this.options = {};
    } else {
        this.options = options;
    }
    
    if (JSON.stringify(this.options) != "{}") {
      // this.position = false;
      this.username = this.options.consignee;
      this.userphone = this.options.mobile;
      this.userdetailedaddress = this.options.add_detail;
      // 省，城市，区 的名字和ID
      this.region.provinceId = this.options.province_id;
      this.region.DcityId = this.options.city_id;
      this.region.areaId = this.options.area_id;
      this.region.provinceName = this.options.province;
      this.region.DcityName = this.options.city;
      this.region.areaName = this.options.area;
      this.userdoor = this.options.door_number;
      this.poi_name = this.options.poi_name;
      this.address_id = this.options.address_id;
      wx.setNavigationBarTitle({ title: "修改地址" });
    } else {
      this.region = {}; //所在地区
      this.username = ""; //收货人姓名
      this.userphone = ""; //收货人电话
      this.userdetailedaddress = ""; //收货人详细地址
      this.userdoor = ""; //收件人门牌号
      this.poi_name = "";
    }
    // this.funcityList();
  },
  methods: {
    // 获取城市列表
    funcityList() {
      optCity().then(res => {
        console.log(res);
        // wx.hideLoading();
        this.provinceList = res.address_level_list; //省
      });
    },
    // 提交到服务器
    formSubmit(e) {
      let _this = this;
      let username = e.mp.detail.value.username;
      let userphone = e.mp.detail.value.userphone;
      let userdetailedaddress = e.mp.detail.value.userdetailedaddress;
      let userdoor = e.mp.detail.value.userdoor;
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
        province: this.region.provinceName,
        city: this.region.DcityName,
        area: this.region.areaName,
        province_id: this.region.provinceId + "",
        city_id: this.region.DcityId + "",
        area_id: this.region.areaId + "",
        poi_name: this.poi_name
      };
      if (this.address_id) {
        params.address_id = parseInt(this.address_id);
      }
      if (this.latitude && this.latitude != '') {
          params.latitude = this.latitude + '';
      }

      if (this.longitude && this.longitude != '') {
          params.longitude = this.longitude + '';
      }

      let shop_id = wx.getStorageSync('shan_shop_id');

      if (shop_id && shop_id != '') {
          params.shop_id = shop_id;
      }
      reviseAddress(params).then(res => {
        wx.showToast({ title: "保存成功", icon: "none" });
        wx.hideLoading();
        wx.navigateBack({
          detail: 1
        });
        if (this.confirm) {
            EventBus.$emit("addressSubmit", params);
        }
        // wx.navigateTo({url:'/pages/userCenter/address/main'})
      });
    },
    relocation() {
        let that = this;
        wx.showLoading({
            title:'数据处理中',
            icon:'loading'
        })
        wx.getSetting({
            success(res){
                if(res.authSetting['scope.userLocation']){
                    that.funcChooseLocation()
                } else {
                     wx.openSetting({
                        success(res) {
                            if (res.authSetting['scope.userLocation']) {
                                that.funcChooseLocation()
                            } else {
                               wx.showToast({
                                   title:'请授权获取地理位置信息！',
                                   icon: 'none'
                               })
                            }
                        },
                        fail(){
                            wx.showToast({
                                title:'请开启手机地理位置！',
                                icon: 'none'
                            })
                        }
                    });
                }
                wx.hideLoading();
            }
        })
    },
    funcChooseLocation(){
        let that = this;
        wx.getLocation({
            type: "wgs84",
            success: function(res) {
            wx.chooseLocation({
                success: function(res) {
                that.latitude = res.latitude;
                that.longitude = res.longitude;
                that.poi_name = res.name;
                that.userdetailedaddress = res.address;
                }
            });
            }
        });
    },
    showModal() {
      this.optModal = true;
    },
    closeModal() {
      this.region = {};
      this.optModal = false;
    },
    deliverModal(msg) {
      if (msg) {
        this.region = msg;
      }
      this.optModal = false;
    }
  },
  onHide() {
    console.log(1);
  },
  onUnload() {
    this.region = {};
    // this.options={};
  }
};
</script>

<style scoped>
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
  width: 12.3rpx;
  height: 22.3rpx;
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
</style>

