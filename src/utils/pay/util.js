const sessionKeyUrl = require("./config").sessionKeyUrl;
const paymentUrl = require("./config").paymentUrl;
const sha256 = require("./sha256").sha256;
const shaObj = require("./sha256");
const leftPad = require("./left-pad");
// 通用参数
const params1 = {
  txndir: "Q",
  busicd: "WXAU",
  version: "2.3.9",
  signType: "SHA256"
};
const params2 = {
  txndir: "Q",
  busicd: "WXMP",
  version: "2.3.9",
  signType: "SHA256",
  charset: "utf-8",
  terminalType: "miniProgPay",
  profitsharing: "N"
};

/**
 * 生成签名
 *
 * @param {*} params 生成key的参数
 * @param {*} key   商户秘钥
 * @param {*} debug  是否开启debug模式
 * @returns  sign  签名
 */
function produceSign(params, key, debug) {
  const result =
    Object.keys(params)
      .sort()
      .map(key => {
        return `${key}=${params[key]}`;
      })
      .join("&") + `${key}`;
  if (debug) {
    console.log(result);
  }
  console.log("sign:", result);
  const sign = sha256(result);
  return sign;
}

/**
 * 生成订单号
 *
 * @param {*} merchantId 商户号
 */
function produceOrderNum(merchantId) {
  const today = new Date();
  const YEAR = today
    .getFullYear()
    .toString()
    .slice(2);
  const MONTH = today.getMonth() + 1;
  const DATE = today.getDate();
  let orderNum = `${merchantId}${YEAR}${MONTH}${DATE}`;
  const length = 32 - orderNum.length;
  const randomNum = Math.random()
    .toString()
    .substr(2, length);
  return orderNum + randomNum;
}

function isNumber(value) {
  if (typeof value === "number") {
    return true;
  }
  if (!isNaN(value)) {
    return true;
  }
  return false;
}

function getObjByKeys(source, keys) {
  let obj = {};
  keys.forEach(key => {
    if (source[key]) {
      obj[key] = source[key];
    }
  });
  return obj;
}

/**
 * 生成请求参数
 *
 * @param {*} params 添加的参数  params1 or params2
 * @param {*} sourceParams 实际参数
 * @param {*} key  商户秘钥
 * @param {*} debug 是否开启debug
 */
function getReqData(params, sourceParams, key, debug) {
  for (let key in sourceParams) {
    if (!sourceParams[key]) {
      delete sourceParams[key];
    }
  }
  let resParams = Object.assign({}, params, sourceParams);
  let sign = produceSign(resParams, key, debug);
  return Object.assign(resParams, { sign });
}

/**
 *  自定义的请求方法
 *
 * @param {*} agent wechat or ali
 * @param {*} params 请求参数
 */
function myRequest(agent, params) {
  return new Promise((resolve, reject) => {
    if (agent === "wechat") {
      let { data, url, method, header = {} } = params;
      wx.request({
        data,
        url,
        method,
        header,
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        }
      });
    } else if (agent === "ali") {
      let { data, url, method, header } = params;
      my.request({
        data,
        url,
        method,
        header,
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        }
      });
    } else {
      throw new Error("invalid agent type");
    }
  });
}

/**
 * login方法，兼容wx & ali
 * @param {*} agent  wx or ali
 */
function login(agent) {
  return new Promise((resolve, reject) => {
    if (agent === "wechat") {
      wx.login({
        success: res => {
          let { code } = res;
          resolve(code);
        },
        fail: err => {
          reject(err);
        }
      });
    } else {
      my.getAuthCode({
        scope: "auth_base",
        success: res => {
          let { authCode } = res;
          resolve(authCode);
        },
        fail: err => {
          reject(err);
        }
      });
    }
  });
}

function checkRest(rest) {
  if (Object.keys(rest).includes("goodsList")) {
    let goodsList = rest.goodsList;
    try {
      goodsList = JSON.parse(goodsList);
    } catch (error) {
      throw new Error("SDK throw errro: goodsList JSON解析失败");
    }
    if (!Array.isArray(goodsList)) {
      throw new Error("SDK throw errro: goodsList类型不正确");
      return;
    }
    goodsList.forEach(good => {
      ["goodsId", "goodsName", "goodsNum", "price"].forEach(key => {
        if (good[key] === undefined) {
          throw new Error("SDK throw error: goodsList ===>" + key + "必填");
        }
      });
    });
  }
}


/**
 *  支付统一处理
 *
 */
function handlePay({
  res,
  agent,
  callbackSuccess,
  callbackFail,
  callbackComplete
}) {
  if (agent === "wechat") {
    // 微信支付
    const data = res.data;
    if (data.respcd == "09") {
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.mpSignType,
        paySign: data.mpSign,
        success: function(result) {
          callbackSuccess(
            Object.assign({}, result, {
              sdkMsg: getObjByKeys(data, [
                "mchntid",
                "inscd",
                "chcd",
                "orderNum",
                "txamt"
              ])
            })
          );
        },
        fail: callbackFail,
        complete: callbackComplete
      });
    } else {
      callbackFail({
        errMsg: data.errorDetail
      });
      callbackComplete();
      console.error("sdk throw error", data.errorDetail);
    }
  } else {
    // 支付宝支付
    const data = res.data;
    if (data.respcd === "09") {
      let { channelOrderNum } = data;
      my.tradePay({
        tradeNO: channelOrderNum, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
        success: function(result) {
          callbackSuccess(
            Object.assign({}, result, {
              sdkMsg: getObjByKeys(data, [
                "mchntid",
                "inscd",
                "chcd",
                "orderNum",
                "txamt"
              ])
            })
          );
        },
        fail: callbackFail,
        complete: callbackComplete
      });
    } else {
      callbackFail({
        errMsg: data.errorDetail
      });
      callbackComplete();
      console.error("sdk throw error", data.errorDetail);
    }
  }
}

function handleError(error, callback) {
  callback.fail({ errMsg: error });
  callback.complete();
}
// callbackSuccess: success,
// callbackFail: fail,
//  callbackComplete: complete

// 针对各种情况的处理函数
let handleFunction = {
  "wx-consumerId-appid": function({
    appId,
    inscd,
    orderNum,
    chcd,
    consumerId,
    key,
    callbackSuccess,
    callbackFail,
    callbackComplete,
    debug,
    ...rest
  }) {
    let reqData = Object.assign(
      {
        subappid: appId,
        wxsubopenid: consumerId,
        chcd,
        inscd,
        orderNum: orderNum
      },
      rest
    );
    reqData = getReqData(params2, reqData, key, debug);
    myRequest("wechat", {
      url: paymentUrl,
      method: "POST",
      data: reqData
    })
      .then(res => {
        handlePay({
          res,
          agent: "wechat",
          callbackSuccess,
          callbackFail,
          callbackComplete
        });
      })
      .catch(error => {
        callbackFail({ errMsg: error });
        callbackComplete();
      });
  },
  "wx-consumerId-noappid": function({
    appId,
    inscd,
    orderNum,
    chcd,
    consumerId,
    key,
    callbackSuccess,
    callbackFail,
    callbackComplete,
    debug,
    ...rest
  }) {
    callbackFail({
      errMsg: "微信环境下需要提供appId"
    });
    callbackComplete();
    console.error("微信环境下需要提供appId");
  },
  "wx-noconsumerId-appid": function({
    appId,
    inscd,
    orderNum,
    chcd,
    consumerId,
    key,
    callbackSuccess,
    callbackFail,
    callbackComplete,
    debug,
    ...rest
  }) {
    login("wechat")
      .then(code => {
        const jsCode = code;
        let reqData = {
          subappid: appId,
          mchntid: rest.mchntid,
          inscd,
          jsCode,
          chcd
        };
        reqData = getReqData(params1, reqData, key, debug);
        myRequest("wechat", {
          url: sessionKeyUrl,
          method: "POST",
          data: reqData
        }).then(res => {
          const data = res.data;
          const sessionKey = data.sessionKey;
          if (sessionKey) {
            let reqData = {
              chcd: "WXP",
              subappid: appId,
              inscd,
              sessionKey,
              terminalType: "miniProgPay",
              orderNum: orderNum,
              ...rest
            };
            reqData = getReqData(params2, reqData, key, debug);
            myRequest("wechat", {
              url: paymentUrl,
              method: "POST",
              data: reqData
            }).then(res => {
              handlePay({
                res,
                agent: "wechat",
                callbackSuccess,
                callbackFail,
                callbackComplete
              });
            });
          } else {
            callbackFail({ errMsg: data.errorDetail });
            callbackComplete();
            console.error("获取sessionkey失败：" + data.errorDetail);
          }
        });
      })
      .catch(error => {
        debugger
        callbackFail({
          errMsg: "wx.login失败，失败信息： " + JSON.stringify(error)
        });
        callbackComplete();
      });
  },
  "wx-noconsumerId-noappid": function({
    appId,
    inscd,
    orderNum,
    chcd,
    consumerId,
    key,
    callbackSuccess,
    callbackFail,
    callbackComplete,
    debug,
    ...rest
  }) {
    callbackFail({
      errMsg: "微信环境下需要提供appId"
    });
    callbackComplete();
    console.error("微信环境下需要提供appId");
  },
  "ali-consumerId-appid": function({
    appId,
    inscd,
    orderNum,
    chcd,
    consumerId,
    key,
    callbackSuccess,
    callbackFail,
    callbackComplete,
    debug,
    ...rest
  }) {
    let reqData = Object.assign(
      {
        openid: consumerId,
        orderNum: orderNum,
        chcd,
        inscd
      },
      rest
    );
    reqData = getReqData(params2, reqData, key, debug);
    myRequest("ali", {
      url: paymentUrl,
      method: "POST",
      data: reqData
    })
      .then(res => {
        handlePay({
          res,
          agent: "ali",
          callbackSuccess,
          callbackFail,
          callbackComplete
        });
      })
      .catch(error => {
        callbackFail({ errMsg: error });
        callbackComplete();
      });
  },
  "ali-consumerId-noappid": function({
    appId,
    inscd,
    orderNum,
    chcd,
    consumerId,
    key,
    callbackSuccess,
    callbackFail,
    callbackComplete,
    debug,
    ...rest
  }) {
    let reqData = Object.assign(
      {
        openid: consumerId,
        chcd,
        inscd,
        orderNum: orderNum
      },
      rest
    );
    reqData = getReqData(params2, reqData, key, debug);
    myRequest("ali", {
      url: paymentUrl,
      method: "POST",
      data: reqData
    }).then(res => {
      handlePay({
        res,
        agent: "ali",
        callbackSuccess,
        callbackFail,
        callbackComplete
      });
    });
  },
  "ali-noconsumerId-appid": function({
    appId,
    consumerId,
    orderNum,
    chcd,
    inscd,
    key,
    callbackSuccess,
    callbackFail,
    callbackComplete,
    debug,
    ...rest
  }) {
    login("ali")
      .then(code => {
        const jsCode = code;
        let reqData = {
          appId,
          mchntid: rest.mchntid,
          inscd,
          jsCode,
          chcd
        };
        reqData = getReqData(params1, reqData, key, debug);
        myRequest("ali", {
          url: sessionKeyUrl,
          method: "POST",
          data: reqData
        }).then(res => {
          const data = res.data;
          const sessionKey = data.sessionKey;
          if (sessionKey) {
            let reqData = {
              chcd: "ALP",
              inscd,
              sessionKey,
              terminalType: "miniProgPay",
              orderNum: orderNum,
              ...rest
            };
            reqData = getReqData(params2, reqData, key, debug);
            myRequest("ali", {
              url: paymentUrl,
              method: "POST",
              data: reqData
            }).then(res => {
              handlePay({
                res,
                agent: "ali",
                callbackSuccess,
                callbackFail,
                callbackComplete
              });
            });
          } else {
            callbackFail({ errMsg: data.errorDetail });
            callbackComplete();
            console.error("获取sessionkey失败：" + data.errorDetail);
          }
        });
      })
      .catch(error => {
        callbackFail({ errMsg: error });
        callbackComplete();
      });
  },
  "ali-noconsumerId-noappid": function({
    appId,
    inscd,
    orderNum,
    chcd,
    consumerId,
    key,
    callbackSuccess,
    callbackFail,
    callbackComplete,
    debug,
    ...rest
  }) {
    callbackFail({
      errMsg: "请提供appid或consumerId"
    });
    callbackComplete();
    console.error("请提供appid或consumerId");
  }
};

// module.exports = {
//   handleFunction,
//   checkRest,
//   isNumber
// }

export {
  handleFunction,
  checkRest,
  isNumber
}