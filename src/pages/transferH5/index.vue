<template>
  <div>
    <web-view :src="url" @message="funcMessage" @load="funcLoadSuccess"></web-view>
  </div>
</template>
<script>
import { getQueryString } from "@/utils";
import { mapMutations, mapState } from "vuex";
import { EventBus } from "@/bus/event-bus.js";
var app = getApp();

export default {
  computed: mapState(["mp_source", "BASE_APP_INFO"]),
  data() {
    return {
      url: null,
      title: "",
      imgurl: "",
      staff_id: "",
      originUrl: "",
      mp_sa_dict: {}
    };
  },

  onUnload() {
    EventBus.$off("addressInfo");
  },

  onLoad(option) {
    // address_id
    console.log("onload");
    wx.showShareMenu({
      withShareTicket: true,
      success: result => {
        console.log(result);
      },
      fail: () => {},
      complete: () => {}
    });

    this.funcListenEventBus();

    this.mp_sa_dict = {};
    let token = wx.getStorageSync("token");
    this.staff_id = "";
    console.log("zheshi web yemina", option);
    if (option.url) {
      let test_url = decodeURIComponent(option.url);
      wx.setStorageSync("urlH5", test_url);
      this.originUrl = test_url;
      this.staff_id = option.staff_id;
      let source = option.utm_source;
      if (source && source != "") {
        this.mp_sa_dict.mp_source = source;
        this.$store.commit("mpSourceMutations", source);
      }
      let shareFromModule = option.shareFromModule;
      if (shareFromModule && shareFromModule != "") {
        this.mp_sa_dict.shareFromModule = shareFromModule;
        this.$store.commit("mpShareFromModuel", shareFromModule);
      }
      if (test_url.indexOf("?") < 0) {
        this.url = test_url + "?token=" + token + "&is_mini=1";
      } else {
        this.url = test_url + "&token=" + token + "&is_mini=1";
      }
    } else if (option.q) {
      let params = decodeURIComponent(option.q);
      // let url = params.split("?")[1].split('=')[1];
      let url = params.split("?url=")[1];
      url = decodeURIComponent(url);
      this.staff_id = getQueryString("staff_id", url);
      let source = getQueryString("utm_source", url);
      if (source && source != "") {
        this.mp_sa_dict.mp_source = source;
        this.$store.commit("mpSourceMutations", source);
      }
      let shareFromModule = getQueryString("shareFromModule", url);
      if (shareFromModule && shareFromModule != "") {
        this.mp_sa_dict.shareFromModule = shareFromModule;
        this.$store.commit("mpShareFromModuel", shareFromModule);
      }
      let test_url = url;
      this.originUrl = test_url;
      wx.setStorageSync("urlH5", test_url);
      if (test_url.indexOf("?") < 0) {
        this.url = test_url + "?token=" + token + "&is_mini=1";
      } else {
        this.url = test_url + "&token=" + token + "&is_mini=1";
      }
    } else {
      let url = wx.getStorageSync("urlH5");
      this.originUrl = url;
      let index = url.indexOf("?");
      this.staff_id = getQueryString("staff_id", url);
      let source = getQueryString("utm_source", url);
      if (source && source != "") {
        this.mp_sa_dict.mp_source = source;
        this.$store.commit("mpSourceMutations", source);
      }
      if (index < 0) {
        this.url = url + "?token=" + token + "&is_mini=1";
      } else {
        this.url = url + "&token=" + token + "&is_mini=1";
      }
    }
    if (this.staff_id && this.staff_id != "") {
      this.$store.commit("staffIdMutations", this.staff_id);
    }
    this.mp_sa_dict.staff_id = this.staff_id;
    this.mp_sa_dict.pageName = this.originUrl;
    this.sa_page(this, true, this.url, this.staff_id);
    //   console.log(option);
    // let token = wx.getStorageSync('token');
    // if (option.url) {
    //   let test_url = decodeURIComponent(option.url)
    //   console.log(test_url);
    //   this.url = test_url;
    // } else {
    //   this.url = wx.getStorageSync("urlH5");
    //   let index = this.url.indexOf('?');
    //   if (index < 0) {
    //     this.url = this.url + '?token=' + token+'&is_mini=1';
    //   } else {
    //     this.url =  this.url + '&token=' + token +'&is_mini=1';
    //   }
    // }
    // console.log(this.url);
  },
  onShow() {
    console.log("onshow", this.url);
    let test_url = this.url;
    let token = wx.getStorageSync("token");
    console.log(token, "第二次上传");
    if (test_url.indexOf("token=&") > 0) {
      if (this.originUrl.indexOf("?") < 0) {
        this.url = this.originUrl + "?token=" + token + "&is_mini=1";
      } else {
        this.url = this.originUrl + "&token=" + token + "&is_mini=1";
      }
    } else {
      if (test_url.indexOf("token") < 0) {
        if (this.originUrl.indexOf("?") < 0) {
          this.url = this.originUrl + "?token=" + token + "&is_mini=1";
        } else {
          this.url = this.originUrl + "&token=" + token + "&is_mini=1";
        }
      }
    }
    console.log("onshow里面的", this.url);
  },

  onShareAppMessage(options) {
    let staff_id = wx.getStorageSync("staff_dgId");
    let path =
      "/pages/transferH5/main?url=" +
      encodeURIComponent(this.originUrl) +
      "&utm_source=leyou_xcx&shareFromModule=活动页";
    if (staff_id && staff_id != "") {
      path = path + "&staff_id=" + staff_id;
      this.mp_sa_dict.staff_id = staff_id;
    }

    this.mp_sa_dict.shareFromModule = "活动页";
    this.mp_sa_dict.utm_source = "leyou_xcx";
    console.log("这里是分享", path);
    app.sensors.track("mp_shareWebView", this.mp_sa_dict);

    let _this = this;
    let shareTitle = _this.title;
    let activity_title = _this.BASE_APP_INFO.share_active_prefix;
    if (activity_title && activity_title != "") {
      shareTitle = activity_title + shareTitle;
    }
    return {
      title: shareTitle,
      path: path
    };
  },

  methods: {
    funcMessage(e) {
      let data = e.mp.detail.data[0];
      let _this = this;
      _this.title = data.share_title;
      _this.imgurl = data.share_img;
    },

    funcListenEventBus() {
      EventBus.$on("addressInfo", res => {
        this.funcReloadURL(res.address,res.userinfo);
      });
    },

    funcReloadURL(address,userinfo) {
      let test_url = this.originUrl;
      let token = wx.getStorageSync("token");
      if (test_url.indexOf("?") < 0) {
        this.url = test_url + "?token=" + token + "&is_mini=1";
      } else {
        this.url = test_url + "&token=" + token + "&is_mini=1";
      }
      let reloadURL = this.url + '&address_id=' + address.address_id + "&name="+userinfo.name+"&certificate_num="+userinfo.certificate_num+"&mobile="+userinfo.mobile+"&code="+userinfo.code+"&gestation_period="+userinfo.gestation_period+"&is_angel="+userinfo.is_angel;
      console.log(reloadURL);
      this.url = reloadURL;
    },

    funcLoadSuccess(e) {
      console.log("webview", e, e.mp.detail);
    }
  }
};
</script>
<style scoped>
</style>

