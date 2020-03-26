function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

/* This program is free software. It comes without any warranty, to
     * the extent permitted by applicable law. You can redistribute it
     * and/or modify it under the terms of the Do What The Fuck You Want
     * To Public License, Version 2, as published by Sam Hocevar. See
     * http://www.wtfpl.net/ for more details. */
var cache = ['', ' ', '  ', '   ', '    ', '     ', '      ', '       ', '        ', '         '];

function leftPad(str, len, ch) {
  // convert `str` to a `string`
  str = str + ''; // `len` is the `pad`'s length now

  len = len - str.length; // doesn't need to pad

  if (len <= 0) return str; // `ch` defaults to `' '`

  if (!ch && ch !== 0) ch = ' '; // convert `ch` to a `string` cuz it could be a number

  ch = ch + ''; // cache common use cases

  if (ch === ' ' && len < 10) return cache[len] + str; // `pad` starts with an empty string

  var pad = ''; // loop

  while (true) {
    // add `ch` to `pad` if `len` is odd
    if (len & 1) pad += ch; // divide `len` by 2, ditch the remainder

    len >>= 1; // "double" the `ch` so this operation count grows logarithmically on `len`
    // each time `ch` is "doubled", the `len` would need to be "doubled" too
    // similar to finding a value in binary search tree, hence O(log(n))

    if (len) ch += ch; // `len` is 0, exit the loop
    else break;
  } // pad `str`!


  var res = pad + str;
  return '00' + res.slice(0, res.length - 2);
}

/**
 * 小程序配置文件, 配置文件请勿更改！
 */
var hosts = {
  test: 'test.quick.ipay.so',
  production: 'showmoney.cn',
  testHttps: 'test.ipay.so',
  sandbox:'sandbox.showmoney.cn'

};
var host = hosts.production;
var config = {
  // 用code换取openId
  sessionKeyUrl: "https://".concat(host, "/scanpay/fixed/mpauth"),
  // 生成支付订单的接口
  paymentUrl: "https://".concat(host, "/scanpay/unified")
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var convertHex = createCommonjsModule(function (module) {
!function(globals) {

var convertHex = {
  bytesToHex: function(bytes) {
    /*if (typeof bytes.byteLength != 'undefined') {
      var newBytes = []

      if (typeof bytes.buffer != 'undefined')
        bytes = new DataView(bytes.buffer)
      else
        bytes = new DataView(bytes)

      for (var i = 0; i < bytes.byteLength; ++i) {
        newBytes.push(bytes.getUint8(i))
      }
      bytes = newBytes
    }*/
    return arrBytesToHex(bytes)
  },
  hexToBytes: function(hex) {
    if (hex.length % 2 === 1) throw new Error("hexToBytes can't have a string with an odd number of characters.")
    if (hex.indexOf('0x') === 0) hex = hex.slice(2);
    return hex.match(/../g).map(function(x) { return parseInt(x,16) })
  }
};


// PRIVATE

function arrBytesToHex(bytes) {
  return bytes.map(function(x) { return padLeft(x.toString(16),2) }).join('')
}

function padLeft(orig, len) {
  if (orig.length > len) return orig
  return Array(len - orig.length + 1).join('0') + orig
}


if ( module.exports) { //CommonJS
  module.exports = convertHex;
} else {
  globals.convertHex = convertHex;
}

}(commonjsGlobal);
});

var convertString = createCommonjsModule(function (module) {
!function(globals) {

var convertString = {
  bytesToString: function(bytes) {
    return bytes.map(function(x){ return String.fromCharCode(x) }).join('')
  },
  stringToBytes: function(str) {
    return str.split('').map(function(x) { return x.charCodeAt(0) })
  }
};

//http://hossa.in/2012/07/20/utf-8-in-javascript.html
convertString.UTF8 = {
   bytesToString: function(bytes) {
    return decodeURIComponent(escape(convertString.bytesToString(bytes)))
  },
  stringToBytes: function(str) {
   return convertString.stringToBytes(unescape(encodeURIComponent(str)))
  }
};

if ( module.exports) { //CommonJS
  module.exports = convertString;
} else {
  globals.convertString = convertString;
}

}(commonjsGlobal);
});

var sha256 = createCommonjsModule(function (module) {
!function(globals) {

var _imports = {};

if ( module.exports) { //CommonJS
  _imports.bytesToHex = convertHex.bytesToHex;
  _imports.convertString = convertString;
  module.exports = sha256;
} else {
  _imports.bytesToHex = globals.convertHex.bytesToHex;
  _imports.convertString = globals.convertString;
  globals.sha256 = sha256;
}

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

// Initialization round constants tables
var K = [];

// Compute constants
!function () {
  function isPrime(n) {
    var sqrtN = Math.sqrt(n);
    for (var factor = 2; factor <= sqrtN; factor++) {
      if (!(n % factor)) return false
    }

    return true
  }

  function getFractionalBits(n) {
    return ((n - (n | 0)) * 0x100000000) | 0
  }

  var n = 2;
  var nPrime = 0;
  while (nPrime < 64) {
    if (isPrime(n)) {
      K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
      nPrime++;
    }

    n++;
  }
}();

var bytesToWords = function (bytes) {
  var words = [];
  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
    words[b >>> 5] |= bytes[i] << (24 - b % 32);
  }
  return words
};

var wordsToBytes = function (words) {
  var bytes = [];
  for (var b = 0; b < words.length * 32; b += 8) {
    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
  }
  return bytes
};

// Reusable object
var W = [];

var processBlock = function (H, M, offset) {
  // Working variables
  var a = H[0], b = H[1], c = H[2], d = H[3];
  var e = H[4], f = H[5], g = H[6], h = H[7];

    // Computation
  for (var i = 0; i < 64; i++) {
    if (i < 16) {
      W[i] = M[offset + i] | 0;
    } else {
      var gamma0x = W[i - 15];
      var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                    ((gamma0x << 14) | (gamma0x >>> 18)) ^
                    (gamma0x >>> 3);

      var gamma1x = W[i - 2];
      var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                    ((gamma1x << 13) | (gamma1x >>> 19)) ^
                    (gamma1x >>> 10);

      W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
    }

    var ch  = (e & f) ^ (~e & g);
    var maj = (a & b) ^ (a & c) ^ (b & c);

    var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
    var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

    var t1 = h + sigma1 + ch + K[i] + W[i];
    var t2 = sigma0 + maj;

    h = g;
    g = f;
    f = e;
    e = (d + t1) | 0;
    d = c;
    c = b;
    b = a;
    a = (t1 + t2) | 0;
  }

  // Intermediate hash value
  H[0] = (H[0] + a) | 0;
  H[1] = (H[1] + b) | 0;
  H[2] = (H[2] + c) | 0;
  H[3] = (H[3] + d) | 0;
  H[4] = (H[4] + e) | 0;
  H[5] = (H[5] + f) | 0;
  H[6] = (H[6] + g) | 0;
  H[7] = (H[7] + h) | 0;
};

function sha256(message, options) {  if (message.constructor === String) {
    message = _imports.convertString.UTF8.stringToBytes(message);
  }

  var H =[ 0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
           0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19 ];

  var m = bytesToWords(message);
  var l = message.length * 8;

  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;

  for (var i=0 ; i<m.length; i += 16) {
    processBlock(H, m, i);
  }

  var digestbytes = wordsToBytes(H);
  return options && options.asBytes ? digestbytes :
         options && options.asString ? _imports.convertString.bytesToString(digestbytes) :
         _imports.bytesToHex(digestbytes)
}

sha256.x2 = function(message, options) {
  return sha256(sha256(message, { asBytes:true }), options)
};

}(commonjsGlobal);
});

var sessionKeyUrl = config.sessionKeyUrl,
    paymentUrl = config.paymentUrl;

var params1 = {
  txndir: "Q",
  busicd: "WXAU",
  version: "2.3.9",
  signType: "SHA256"
};
var params2 = {
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
  var result = Object.keys(params).sort().map(function (key) {
    return "".concat(key, "=").concat(params[key]);
  }).join("&") + "".concat(key);

  if (debug) {
    console.log(result);
  }

  console.log("sign:", result);
  var sign = sha256(result);
  return sign;
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
  var obj = {};
  keys.forEach(function (key) {
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
  for (var _key in sourceParams) {
    if (!sourceParams[_key]) {
      delete sourceParams[_key];
    }
  }

  var resParams = Object.assign({}, params, sourceParams);
  var sign = produceSign(resParams, key, debug);
  return Object.assign(resParams, {
    sign: sign
  });
}
/**
 *  自定义的请求方法
 *
 * @param {*} agent wechat or ali
 * @param {*} params 请求参数
 */


function myRequest(agent, params) {
  return new Promise(function (resolve, reject) {
    if (agent === "wechat") {
      var data = params.data,
          url = params.url,
          method = params.method,
          _params$header = params.header,
          header = _params$header === void 0 ? {} : _params$header;
      wx.request({
        data: data,
        url: url,
        method: method,
        header: header,
        success: function success(res) {
          resolve(res);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    } else if (agent === "ali") {
      var _data = params.data,
          _url = params.url,
          _method = params.method,
          _header = params.header;
      my.request({
        data: _data,
        url: _url,
        method: _method,
        header: _header,
        success: function success(res) {
          resolve(res);
        },
        fail: function fail(err) {
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
  return new Promise(function (resolve, reject) {
    if (agent === "wechat") {
      wx.login({
        success: function success(res) {
          var code = res.code;
          resolve(code);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    } else {
      my.getAuthCode({
        scope: "auth_base",
        success: function success(res) {
          var authCode = res.authCode;
          resolve(authCode);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    }
  });
}

function checkRest(rest) {
  if (Object.keys(rest).includes("goodsList")) {
    var goodsList = rest.goodsList;

    try {
      goodsList = JSON.parse(goodsList);
    } catch (error) {
      throw new Error("SDK throw errro: goodsList JSON解析失败");
    }

    if (!Array.isArray(goodsList)) {
      throw new Error("SDK throw errro: goodsList类型不正确");
      return;
    }

    goodsList.forEach(function (good) {
      ["goodsId", "goodsName", "goodsNum", "price"].forEach(function (key) {
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


function handlePay(_ref) {
  var res = _ref.res,
      agent = _ref.agent,
      callbackSuccess = _ref.callbackSuccess,
      callbackFail = _ref.callbackFail,
      callbackComplete = _ref.callbackComplete;

  if (agent === "wechat") {
    // 微信支付
    var data = res.data;

    if (data.respcd == "09") {
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.mpSignType,
        paySign: data.mpSign,
        success: function success(result) {
          callbackSuccess(Object.assign({}, result, {
            sdkMsg: getObjByKeys(data, ["mchntid", "inscd", "chcd", "orderNum", "txamt"])
          }));
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
    var _data2 = res.data;

    if (_data2.respcd === "09") {
      var channelOrderNum = _data2.channelOrderNum;
      my.tradePay({
        tradeNO: channelOrderNum,
        // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
        success: function success(result) {
          callbackSuccess(Object.assign({}, result, {
            sdkMsg: getObjByKeys(_data2, ["mchntid", "inscd", "chcd", "orderNum", "txamt"])
          }));
        },
        fail: callbackFail,
        complete: callbackComplete
      });
    } else {
      callbackFail({
        errMsg: _data2.errorDetail
      });
      callbackComplete();
      console.error("sdk throw error", _data2.errorDetail);
    }
  }
}
// callbackFail: fail,
//  callbackComplete: complete
// 针对各种情况的处理函数


var handleFunction = {
  "wx-consumerId-appid": function wxConsumerIdAppid(_ref2) {
    var appId = _ref2.appId,
        inscd = _ref2.inscd,
        orderNum = _ref2.orderNum,
        chcd = _ref2.chcd,
        consumerId = _ref2.consumerId,
        key = _ref2.key,
        callbackSuccess = _ref2.callbackSuccess,
        callbackFail = _ref2.callbackFail,
        callbackComplete = _ref2.callbackComplete,
        debug = _ref2.debug,
        rest = _objectWithoutProperties(_ref2, ["appId", "inscd", "orderNum", "chcd", "consumerId", "key", "callbackSuccess", "callbackFail", "callbackComplete", "debug"]);

    var reqData = Object.assign({
      subappid: appId,
      wxsubopenid: consumerId,
      chcd: chcd,
      inscd: inscd,
      orderNum: orderNum
    }, rest);
    reqData = getReqData(params2, reqData, key, debug);
    myRequest("wechat", {
      url: paymentUrl,
      method: "POST",
      data: reqData
    }).then(function (res) {
      handlePay({
        res: res,
        agent: "wechat",
        callbackSuccess: callbackSuccess,
        callbackFail: callbackFail,
        callbackComplete: callbackComplete
      });
    }).catch(function (error) {
      callbackFail({
        errMsg: error
      });
      callbackComplete();
    });
  },
  "wx-consumerId-noappid": function wxConsumerIdNoappid(_ref3) {
    var appId = _ref3.appId,
        inscd = _ref3.inscd,
        orderNum = _ref3.orderNum,
        chcd = _ref3.chcd,
        consumerId = _ref3.consumerId,
        key = _ref3.key,
        callbackSuccess = _ref3.callbackSuccess,
        callbackFail = _ref3.callbackFail,
        callbackComplete = _ref3.callbackComplete,
        debug = _ref3.debug,
        rest = _objectWithoutProperties(_ref3, ["appId", "inscd", "orderNum", "chcd", "consumerId", "key", "callbackSuccess", "callbackFail", "callbackComplete", "debug"]);

    callbackFail({
      errMsg: "微信环境下需要提供appId"
    });
    callbackComplete();
    console.error("微信环境下需要提供appId");
  },
  "wx-noconsumerId-appid": function wxNoconsumerIdAppid(_ref4) {
    var appId = _ref4.appId,
        inscd = _ref4.inscd,
        orderNum = _ref4.orderNum,
        chcd = _ref4.chcd,
        consumerId = _ref4.consumerId,
        key = _ref4.key,
        callbackSuccess = _ref4.callbackSuccess,
        callbackFail = _ref4.callbackFail,
        callbackComplete = _ref4.callbackComplete,
        debug = _ref4.debug,
        rest = _objectWithoutProperties(_ref4, ["appId", "inscd", "orderNum", "chcd", "consumerId", "key", "callbackSuccess", "callbackFail", "callbackComplete", "debug"]);

    login("wechat").then(function (code) {
      var jsCode = code;
      var reqData = {
        subappid: appId,
        mchntid: rest.mchntid,
        inscd: inscd,
        jsCode: jsCode,
        chcd: chcd
      };
      reqData = getReqData(params1, reqData, key, debug);
      myRequest("wechat", {
        url: sessionKeyUrl,
        method: "POST",
        data: reqData
      }).then(function (res) {
        var data = res.data;
        var sessionKey = data.sessionKey;

        if (sessionKey) {
          var _reqData = _objectSpread2({
            chcd: "WXP",
            subappid: appId,
            inscd: inscd,
            sessionKey: sessionKey,
            terminalType: "miniProgPay",
            orderNum: orderNum
          }, rest);

          _reqData = getReqData(params2, _reqData, key, debug);
          myRequest("wechat", {
            url: paymentUrl,
            method: "POST",
            data: _reqData
          }).then(function (res) {
            handlePay({
              res: res,
              agent: "wechat",
              callbackSuccess: callbackSuccess,
              callbackFail: callbackFail,
              callbackComplete: callbackComplete
            });
          });
        } else {
          callbackFail({
            errMsg: data.errorDetail
          });
          callbackComplete();
          console.error("获取sessionkey失败：" + data.errorDetail);
        }
      });
    }).catch(function (error) {
      callbackFail({
        errMsg: "wx.login失败，失败信息： " + JSON.stringify(error)
      });
      callbackComplete();
    });
  },
  "wx-noconsumerId-noappid": function wxNoconsumerIdNoappid(_ref5) {
    var appId = _ref5.appId,
        inscd = _ref5.inscd,
        orderNum = _ref5.orderNum,
        chcd = _ref5.chcd,
        consumerId = _ref5.consumerId,
        key = _ref5.key,
        callbackSuccess = _ref5.callbackSuccess,
        callbackFail = _ref5.callbackFail,
        callbackComplete = _ref5.callbackComplete,
        debug = _ref5.debug,
        rest = _objectWithoutProperties(_ref5, ["appId", "inscd", "orderNum", "chcd", "consumerId", "key", "callbackSuccess", "callbackFail", "callbackComplete", "debug"]);

    callbackFail({
      errMsg: "微信环境下需要提供appId"
    });
    callbackComplete();
    console.error("微信环境下需要提供appId");
  },
  "ali-consumerId-appid": function aliConsumerIdAppid(_ref6) {
    var appId = _ref6.appId,
        inscd = _ref6.inscd,
        orderNum = _ref6.orderNum,
        chcd = _ref6.chcd,
        consumerId = _ref6.consumerId,
        key = _ref6.key,
        callbackSuccess = _ref6.callbackSuccess,
        callbackFail = _ref6.callbackFail,
        callbackComplete = _ref6.callbackComplete,
        debug = _ref6.debug,
        rest = _objectWithoutProperties(_ref6, ["appId", "inscd", "orderNum", "chcd", "consumerId", "key", "callbackSuccess", "callbackFail", "callbackComplete", "debug"]);

    var reqData = Object.assign({
      openid: consumerId,
      orderNum: orderNum,
      chcd: chcd,
      inscd: inscd
    }, rest);
    reqData = getReqData(params2, reqData, key, debug);
    myRequest("ali", {
      url: paymentUrl,
      method: "POST",
      data: reqData
    }).then(function (res) {
      handlePay({
        res: res,
        agent: "ali",
        callbackSuccess: callbackSuccess,
        callbackFail: callbackFail,
        callbackComplete: callbackComplete
      });
    }).catch(function (error) {
      callbackFail({
        errMsg: error
      });
      callbackComplete();
    });
  },
  "ali-consumerId-noappid": function aliConsumerIdNoappid(_ref7) {
    var appId = _ref7.appId,
        inscd = _ref7.inscd,
        orderNum = _ref7.orderNum,
        chcd = _ref7.chcd,
        consumerId = _ref7.consumerId,
        key = _ref7.key,
        callbackSuccess = _ref7.callbackSuccess,
        callbackFail = _ref7.callbackFail,
        callbackComplete = _ref7.callbackComplete,
        debug = _ref7.debug,
        rest = _objectWithoutProperties(_ref7, ["appId", "inscd", "orderNum", "chcd", "consumerId", "key", "callbackSuccess", "callbackFail", "callbackComplete", "debug"]);

    var reqData = Object.assign({
      openid: consumerId,
      chcd: chcd,
      inscd: inscd,
      orderNum: orderNum
    }, rest);
    reqData = getReqData(params2, reqData, key, debug);
    myRequest("ali", {
      url: paymentUrl,
      method: "POST",
      data: reqData
    }).then(function (res) {
      handlePay({
        res: res,
        agent: "ali",
        callbackSuccess: callbackSuccess,
        callbackFail: callbackFail,
        callbackComplete: callbackComplete
      });
    });
  },
  "ali-noconsumerId-appid": function aliNoconsumerIdAppid(_ref8) {
    var appId = _ref8.appId,
        consumerId = _ref8.consumerId,
        orderNum = _ref8.orderNum,
        chcd = _ref8.chcd,
        inscd = _ref8.inscd,
        key = _ref8.key,
        callbackSuccess = _ref8.callbackSuccess,
        callbackFail = _ref8.callbackFail,
        callbackComplete = _ref8.callbackComplete,
        debug = _ref8.debug,
        rest = _objectWithoutProperties(_ref8, ["appId", "consumerId", "orderNum", "chcd", "inscd", "key", "callbackSuccess", "callbackFail", "callbackComplete", "debug"]);

    login("ali").then(function (code) {
      var jsCode = code;
      var reqData = {
        appId: appId,
        mchntid: rest.mchntid,
        inscd: inscd,
        jsCode: jsCode,
        chcd: chcd
      };
      reqData = getReqData(params1, reqData, key, debug);
      myRequest("ali", {
        url: sessionKeyUrl,
        method: "POST",
        data: reqData
      }).then(function (res) {
        var data = res.data;
        var sessionKey = data.sessionKey;

        if (sessionKey) {
          var _reqData2 = _objectSpread2({
            chcd: "ALP",
            inscd: inscd,
            sessionKey: sessionKey,
            terminalType: "miniProgPay",
            orderNum: orderNum
          }, rest);

          _reqData2 = getReqData(params2, _reqData2, key, debug);
          myRequest("ali", {
            url: paymentUrl,
            method: "POST",
            data: _reqData2
          }).then(function (res) {
            handlePay({
              res: res,
              agent: "ali",
              callbackSuccess: callbackSuccess,
              callbackFail: callbackFail,
              callbackComplete: callbackComplete
            });
          });
        } else {
          callbackFail({
            errMsg: data.errorDetail
          });
          callbackComplete();
          console.error("获取sessionkey失败：" + data.errorDetail);
        }
      });
    }).catch(function (error) {
      callbackFail({
        errMsg: error
      });
      callbackComplete();
    });
  },
  "ali-noconsumerId-noappid": function aliNoconsumerIdNoappid(_ref9) {
    var appId = _ref9.appId,
        inscd = _ref9.inscd,
        orderNum = _ref9.orderNum,
        chcd = _ref9.chcd,
        consumerId = _ref9.consumerId,
        key = _ref9.key,
        callbackSuccess = _ref9.callbackSuccess,
        callbackFail = _ref9.callbackFail,
        callbackComplete = _ref9.callbackComplete,
        debug = _ref9.debug,
        rest = _objectWithoutProperties(_ref9, ["appId", "inscd", "orderNum", "chcd", "consumerId", "key", "callbackSuccess", "callbackFail", "callbackComplete", "debug"]);

    callbackFail({
      errMsg: "请提供appid或consumerId"
    });
    callbackComplete();
    console.error("请提供appid或consumerId");
  }
}; // module.exports = {

function requestPayment(_ref, txamt, callback, debug) {
  var mchntid = _ref.mchntid,
      inscd = _ref.inscd,
      key = _ref.key,
      chcd = _ref.chcd,
      orderNum = _ref.orderNum,
      appId = _ref.appId,
      backUrl = _ref.backUrl,
      consumerId = _ref.consumerId,
      rest = _objectWithoutProperties(_ref, ["mchntid", "inscd", "key", "chcd", "orderNum", "appId", "backUrl", "consumerId"]);

  var noop = function noop() {};

  var success = callback && callback.success || noop;
  var fail = callback && callback.fail || noop;
  var complete = callback && callback.complete || noop;

  try {
    mchntid = mchntid ? mchntid.trim() : "";
    inscd = inscd ? inscd.trim() : "";
    key = key ? key.trim() : "";
    chcd = chcd ? chcd.trim() : "";
    appId = appId ? appId.trim() : "";
    backUrl = backUrl ? backUrl.trim() : "";
    consumerId = consumerId ? consumerId.trim() : "";
    orderNum = orderNum ? orderNum.trim() : ""; // 对rest过滤空字符

    for (var _key in rest) {
      if (!rest[_key]) {
        delete rest[_key];
      } else {
        rest[_key] = typeof rest[_key] === "string" ? rest[_key].trim() : rest[_key];
      }
    }

    checkRest(rest); // txamt: 支付金额，单位-分，货币-人民币;

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
    var appidStr = appId ? "appid" : "noappid";
    var consumerIdStr = consumerId ? "consumerId" : "noconsumerId";
    var chcdStr;

    if (chcd === "ALP") {
      chcdStr = "ali";
    } else if (chcd === "WXP") {
      chcdStr = "wx";
    } else {
      throw new Error("chcd参数有误");
      return;
    }

    var handleKey = [chcdStr, consumerIdStr, appidStr].join("-");

    var options = _objectSpread2({
      mchntid: mchntid,
      chcd: chcd,
      inscd: inscd,
      key: key,
      backUrl: backUrl,
      appId: appId,
      consumerId: consumerId,
      txamt: txamt,
      orderNum: orderNum,
      callbackSuccess: success,
      callbackFail: fail,
      callbackComplete: complete
    }, rest);

    if (handleFunction[handleKey]) {
      try {
        new Promise(function (resolve, reject) {
          resolve(handleFunction[handleKey](options));
        }).catch(function (error) {
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

export { requestPayment };
