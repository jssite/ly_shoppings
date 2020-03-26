<script>
import {
  getAppInfo,
  getAdverInfo,
  getTokenByCode,
  daGuanLikeRecomment,
  optCity,
  getOpenGid
} from "@/api";
import { mapState, mapMutations } from "vuex";
import { sa } from "./utils/sensorsdata.js";
import { saPageInfo } from "./utils";
export default {
  onShow(options) {
    let _this = this;
    wx.login({
      success(res) {
        if (res.code) {
          let query = {
            js_code: res.code,
            wx_type: 2
          };

          getTokenByCode(query).then(res => {
            if (res.header) {
              wx.setStorageSync("openid", res.body.openid);
              sa.setOpenid(res.body.openid);
            } else {
              let { token, openid, mobile } = res;
              wx.setStorageSync("openid", openid);
              wx.setStorageSync("telPhone", mobile);
              if (token != "") {
                let userInfo = {
                  user_id: res.userid
                };
                wx.setStorageSync("userInfo", userInfo);
                wx.setStorageSync("token", token);
                sa.login(res.userid);
              } else {
                sa.setOpenid(openid);
              }
            }
            sa.init();
          });
        }
      }
    });

    wx.login({
      success: function(res) {
        if (res.code) {
          if (options.shareTicket) {
            wx.getShareInfo({
              shareTicket: options.shareTicket,
              timeout: 10000,
              success: result => {
                let params = {
                  encryptedData: result.encryptedData,
                  iv: result.iv,
                  code: res.code
                };
                getOpenGid(params)
                  .then(res => {
                    _this.$store.commit("mpGroupIdMutations", res.openGId);
                  })
                  .catch(error => {});
              },
              fail: () => {},
              complete: () => {}
            });
          }
        } else {
        }
      }
    });

    wx.getSystemInfo({
      success: function(res) {
        wx.setStorageSync("windowHeight", res.windowHeight);
        wx.setStorageSync("screenHeight", res.screenHeight);
        wx.setStorageSync("phoneMobile", res);
      }
    });
  },
  created() {
    wx.getLocation({
      type: "gcj02",
      success(res) {
        wx.setStorageSync("locationInfo", res);
      }
    });
    this.funcInitGetAppInfo();
    this.funcGetAdInfo();
    this.funcStoreCityInfo();
    //   this.GetphoneInfo();
  },
  onTabItemTap(e) {},
  methods: {
    /**
     * 获取全局配置项
     */
    funcInitGetAppInfo() {
      getAppInfo().then(res => {
        wx.setStorageSync("appInfo", res);
        wx.setStorageSync("staff_dgId", res.staff_id);
        this.$store.commit("BASE_APP_INFO", res);
      });
    },
    funcGetAdInfo() {
      getAdverInfo().then(res => {
        wx.setStorageSync("adInfo", res);
        this.$store.commit("BASE_AD_INFO", res);
      });
    },
    /**
     * 获取手机型号
     */
    GetphoneInfo() {
      wx.getSystemInfo({
        success: function(res) {
          wx.setStorageSync("windowHeight", res.windowHeight);
          wx.setStorageSync("screenHeight", res.screenHeight);
        }
      });
    },
    funcStoreCityInfo() {
      optCity().then(res => {
        wx.setStorageSync("cityall", res.address_level_list);
      });
    }
    // testDaGuan() {
    //     let params = {
    //         page_index:1,
    //         page_size:10,
    //         scene_type:'ios_pay'
    //     }
    //     daGuanLikeRecomment(params).then(res => {
    //     })
    // }
  }
};
</script>
<style>
page {
  height: 100%;
  overflow: auto;
  /* background: #f3f5f7; */
}
/*  加载更多   */
.weui-loading {
  margin: 10rpx 0;
  width: 40rpx;
  height: 40rpx;
  display: inline-block;
  vertical-align: middle;
  -webkit-animation: weuiLoading 1s steps(12, end) infinite;
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=)
    no-repeat;
  background-size: 100%;
}
.weui-loadmore {
  width: 65%;
  margin: 0 auto;
  padding: 0.5em 0;
  /* line-height: 1em; */
  font-size: 28rpx;
  text-align: center;
}
.weui-loadmore__tips {
  display: inline-block;
  vertical-align: middle;
  color: #999;
}
</style>
