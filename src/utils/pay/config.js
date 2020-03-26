/**
 * 小程序配置文件, 配置文件请勿更改！
 */

let hosts = {
  test: 'test.quick.ipay.so',
  production: 'showmoney.cn',
  testHttps: 'test.ipay.so',
  sandbox:'sandbox.showmoney.cn'
}

//
var host = hosts.production

var config = {

    // 用code换取openId
    sessionKeyUrl: `https://${host}/scanpay/fixed/mpauth`,

    // 生成支付订单的接口
    paymentUrl: `https://${host}/scanpay/unified`,

};

module.exports = config
