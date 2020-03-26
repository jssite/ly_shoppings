<template>
  <div class="content">
    <!-- <div>111111</div>
    <open-data type='userAvatarUrl'></open-data>
    <open-data type='userGender'></open-data>
    <open-data type='userNickName'></open-data>
    <open-data type='userCity'></open-data>
    <open-data type='userCity'></open-data>
    <open-data type='userCountry'></open-data>-->

    <div class="bgview">
      <label class="title" for>群名称：</label>
      <open-data type="groupName" :open-gid="mp_group_id"></open-data>
    </div>
    <div class="bgview">
      <label class="title" for>群id：</label>
      <label for>{{mp_group_id}}</label>
    </div>
    <div class="bgview">
      <label class="title">请输入群名称设备该微信群信息，用于数据监控</label>
    </div>

    <!-- <div class="bgview">
      <label class="title" for="">群名称：</label>
      <input name="name" v-model="groupName" class="content" type="text" placeholder-class="input-placeholder" placeholder="请输入群名称"/>
    </div>-->
    <div class="bgview">
      <label class="title" for>群名称：</label>
      <input
        name="name"
        v-model="groupName"
        class="content"
        type="text"
        placeholder-class="input-placeholder"
        placeholder="请输入群名称"
      />
    </div>
    <div class="bgview">
      <label class="title" for>群编码：</label>
      <input
        name="name"
        class="content"
        v-model="groupCode"
        type="text"
        placeholder-class="input-placeholder"
        placeholder="请输入群编码"
      />
    </div>
    <div class="bgview">
      <label class="title" for>上报部门：</label>
      <input
        name="name"
        class="content"
        v-model="groupCompany"
        type="text"
        placeholder-class="input-placeholder"
        placeholder="请输入上报部门"
      />
    </div>

    <button class="rent" type="primary" @click="funcUpload">上报群信息</button>
  </div>
</template>

<script>
import { uploadOpenGidInfo } from "@/api";
import uploadFile from "@/utils/upload-config";
import { EventBus } from "@/bus/event-bus.js";
import { mapState } from "vuex";
export default {
  onLoad(options) {
    console.log(this.mp_group_id);
    wx.showShareMenu({
      withShareTicket: true,
      success: result => {
        console.log(result);
      },
      fail: () => {},
      complete: () => {}
    });
    this.groupCompany = "";
    this.groupName = "";
    this.groupCode = "";
  },

  computed: mapState(["mp_group_id"]),
  data() {
    return {
      groupCompany: "",
      groupName: "",
      groupCode: ""
    };
  },

  methods: {
    funcUpload() {
      let parmas = {
        gId: this.mp_group_id
      };
      if (this.groupName && this.groupName != "") {
        parmas.gName = this.groupName;
      } else {
        wx.showToast({
          title: "请输入群名称",
          icon: "none"
        });
        return;
      }
      if (this.groupCode && this.groupCode != "") {
        parmas.gCode = this.groupCode;
      } else {
        wx.showToast({
          title: "请输入群编码",
          icon: "none"
        });
        return;
      }
      if (this.groupCompany && this.groupCompany != "") {
        parmas.uplodDepartment = this.groupCompany;
      } else {
        wx.showToast({
          title: "请输入上报部门",
          icon: "none"
        });
        return;
      }

      uploadOpenGidInfo(parmas).then(res => {
        console.log(res);
        this.groupCompany = ''
        this.groupName = ''
        this.groupCode = ''
        wx.showToast({
          title: '上报成功',
          icon: 'none'
        })
      });
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100vh;
  background: #fefefe;
}

.bgview {
  height: 88rpx;
  width: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1rpx solid #eee;
}

.title {
  font-size: 30rpx;
  color: #333333;
  padding-right: 20rpx;
}

.input-placeholder {
  font-size: 30rpx;
  color: #999999;
}

.content {
  /* padding-left: 20rpx; */
  /* border: 2rpx solid #eee; */
  /* box-sizing: border-box; */
  flex: 1;
  height: 80rpx;
  font-size: 30rpx;
  color: #333333;
}

.rent {
  position: fixed;
  bottom: 78rpx;
  left: 20rpx;
  width: 710rpx;
  height: 88rpx;
}
</style>
