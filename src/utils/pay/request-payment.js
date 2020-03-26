const leftPad = require("./left-pad");
const { handleFunction, checkRest, isNumber } = require("./util")

function requestPayment(
  { mchntid, inscd, key, chcd, orderNum, appId, backUrl, consumerId, ...rest },
  txamt,
  callback,
  debug
) {
  const noop = function() {};
  const success = (callback && callback.success) || noop;
  const fail = (callback && callback.fail) || noop;
  const complete = (callback && callback.complete) || noop;
  try {
    mchntid = mchntid ? mchntid.trim() : "";
    inscd = inscd ? inscd.trim() : "";
    key = key ? key.trim() : "";
    chcd = chcd ? chcd.trim() : "";
    appId = appId ? appId.trim() : "";
    backUrl = backUrl ? backUrl.trim() : "";
    consumerId = consumerId ? consumerId.trim() : "";
    orderNum = orderNum ? orderNum.trim() : "";

    // 对rest过滤空字符
    for (let key in rest) {
      if (!rest[key]) {
        delete rest[key];
      } else {
        rest[key] =
          typeof rest[key] === "string" ? rest[key].trim() : rest[key];
      }
    }
    checkRest(rest);
    // txamt: 支付金额，单位-分，货币-人民币;
    txamt = Number(txamt);
    if (isNumber(txamt) && txamt >= 1) {
      txamt = leftPad(txamt.toFixed(2).replace(".", ""), 12, "0");
    } else {
      throw new Error("请保证输入的金额格式正确!");
    }

    if (!mchntid) throw new Error("请输入mchntid!");
    if (!chcd) throw new Error("请输入chcd!");
    if (!inscd) throw new Error("请输入inscd!");
    if (!key) throw new Error("请输入key!");
    if (!txamt) throw new Error("请输入支付金额");
    if (!orderNum) throw new Error("请输入订单号");

    let appidStr = appId ? "appid" : "noappid";
    let consumerIdStr = consumerId ? "consumerId" : "noconsumerId";
    let chcdStr;
    if (chcd === "ALP") {
      chcdStr = "ali";
    } else if (chcd === "WXP") {
      chcdStr = "wx";
    } else {
      throw new Error("chcd参数有误");
      return;
    }
    let handleKey = [chcdStr, consumerIdStr, appidStr].join("-");
    let options = {
      mchntid,
      chcd,
      inscd,
      key,
      backUrl,
      appId,
      consumerId,
      txamt,
      orderNum,
      callbackSuccess: success,
      callbackFail: fail,
      callbackComplete: complete,
      ...rest
    };
    if (handleFunction[handleKey]) {
      try {
        new Promise((resolve, reject) => {
          resolve(handleFunction[handleKey](options));
        }).catch(error => {
          console.error(error);
        });
      } catch (error) {
        console.error("sdk throw error", error);
      }
    } else {
      throw new Error("参数不正确");
    }
  } catch (error) {
    fail({
      errMsg: error.message
    });
    complete();
  }
}

export { requestPayment }
