<template>
  <div>
    <!-- 地址模板 -->
    <div
      class="tpAddress"
      v-for="(item,index) in addresslist"
      :key="index"
      :class="{'address_none':item.lightning_info.lightning_status == 3}"
    >
      <div>
        <div class="tpUserinfo" @click="funsetdefuild(item)">
          <div>
            <span class="tpName">{{item.consignee}}</span>
            <span class="tpphone">{{item.mobile}}</span>
          </div>
          <div v-if="item.lightning_info.lightning_status == 3">
            <span>不在配送范围</span>
          </div>
        </div>
        <div class="tpcontent">
          <span class="tpcontent_ress" @click="funsetdefuild(item)">{{item.province + item.city + item.area + item.poi_name + item.door_number}}</span>
        </div>
      </div>
      <img v-if="item.lightning_info.lightning_status == 3"
        class="tpcontent_img"
        src="/static/images/order_manage_edit_dis.png"
        @click="amendaddress(index)"
      >
      <img v-else class="tpcontent_img"
        src="/static/images/order_manage_edit.png"
        @click="amendaddress(index)">
    </div>
  </div>
</template>
<script>
import { setdefaultaddress } from "@/api";
export default {
  props: {
    addresslist: {
      type: Array
    }
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.addresslist);
  },
  methods: {
    // 修改地址
    amendaddress(index) {
      // 跳转到
      let params = Object.keys(this.addresslist[index]).map(res => {
        return `&${res}=${this.addresslist[index][res]}`;
      });
      let url = "/pages/shipAddress/changeAddress/main?" + params.join("");
      wx.navigateTo({ url });
    },
    funsetdefuild(item) {
      console.log(item);
      let that = this;
      let params = {
        address_id: item.address_id.toString(),
        is_default: 1
      };
      if (item.lightning_info) {
        if (item.lightning_info.lightning_status == 3) {
            wx.showToast({
                title: '该配送地址不在配送范围内',
                icon: 'none'
            })
        //   wx.showModal({
        //     title: "配送范围限制",
        //     content: "选择该地址可能需要重新筛选商品",
        //     success(res) {
        //       if (res.confirm) {
        //         // setdefaultaddress(params).then(res=>{
        //         wx.navigateTo({
        //           url:
        //             "/pages/leDelivery/index/main?address_id=" + item.address_id
        //         });
        //         // })
        //       } else if (res.cancel) {
        //       }
        //     }
        //   });
        } else {
          // setdefaultaddress(params).then(res=>{
          wx.redirectTo({
            url: "/pages/leDelivery/index/main?address_id=" + item.address_id
          });
          // })
        }
      } else {
        wx.navigateBack({ delta: 2 });
      }
    }
  }
};
</script>
<style scoped>
.tpAddress {
  /* margin-left: 28rpx; */
  /* margin-right: 28rpx; */
  padding: 28rpx;
  border-bottom: 1px solid #f3f5f7;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* color: #CACACA !important; */
}
.tpAddress .tpUserinfo {
  /* padding: 28rpx 0; */
  font-family: PingFangSC-Medium;
  font-size: 30px;
  color: #333333;
  letter-spacing: 0;
  line-height: 36px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
}
.tpAddress .tpUserinfo .tpName {
  margin-right: 30rpx;
}
.tpAddress .tpUserinfo .tpphone {
  /* margin-right: 170rpx; */
}
.tpAddress .tpcontent {
  display: flex;
  align-items: flex-start;
  /* margin-bottom: 28rpx; */
  color: #666666;
  margin-top: 28rpx;
}
.tpAddress .tpcontent .tpcontent_ress {
  font-family: PingFangSC-Regular;
  font-size: 26px;
  letter-spacing: 0;
  width: 562rpx;
}
.tpcontent_img {
  width: 34rpx;
  height: 34rpx;
  margin-left: 80rpx;
}
.address_none .tpUserinfo {
  color: #cacaca;
}
.address_none .tpcontent {
  color: #cacaca;
}
</style>
