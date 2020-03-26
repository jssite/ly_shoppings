import { userGetPayInfomaiton } from "../api";


function funcGlobalWxpayInfomation(res) {
  let openid = wx.getStorageSync("openid");
  let product_name = "乐友孕婴童";
  let pay_info = {
    serial_num: res.serial_num,
    detail: res.serial_num,
    title: product_name,
    // type: "weixin",
    pay_money: res.payable_amount,
    ipAddress: "0.0.0.0",
    type: "smallpay",
    wx_type: 2,
    open_id: openid
  };
  this.funcGoPay(res, pay_info);
}

//去支付的逻辑
function funcGoPay(le_order_info, pay_order_info) {

    userGetPayInfomaiton(pay_order_info).then(res_pay_info => {
        let self = this;
        wx.requestPayment({
          timeStamp: res_pay_info.timeStamp,
          nonceStr: res_pay_info.nonceStr,
          package: res_pay_info.package,
          signType: res_pay_info.signType,
          paySign: res_pay_info.sign,
          success(res_wx_info) {
            wx.hideLoading();
            console.log(res_wx_info);
            resolve(le_order_info);
            self.funcGoFinshPage(le_order_info);
          },
          fail(res_wx_info) {
            wx.hideLoading();
            // 此处应该跳转订单列表
            reject();
            self.funcScan();
          }
        });
      });
    // return new Promise((resolve,reject) => {
        
    // }
}

// 支付成功跳转支付成功页面
function funcGoFinshPage(options) {
  let url =
    "/pages/confirm/finish/main?pay_info=" +
    JSON.stringify(options) +
    "&is_le_vip=0";
  wx.redirectTo({
    url: url
  });
}

// 支付失败跳转订单列表
function funcScan() {
  let url = "/pages/confirm/list/main?order_status=2";
  wx.navigateTo({
    url: url
  });
}

export {
    funcGlobalWxpayInfomation
}
