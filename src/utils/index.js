import md5 from 'js-md5'
import wxbarcode  from './wxbarcode'

function calcuMD5(par) {
    par = md5(par);
    return par;
}
function creatBarcode(id,code,w,h) {
    console.log(code)
    wxbarcode.barcode(id, code.toString(), w, h);
}
function creatQrcode(id,code,w,h) {
    wxbarcode.qrcode(id, code.toString(), w, h);
}
function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}

function oddNumber(n) {
    let r = /[^0-9]/ig;
    let b = n.replace(r, "");
    let s = '';
    for (let i = 0; i < b.length; i++) {
        if (b[i] % 2 == 0) {
            s += b[i];
        }
    }
    return s;
}

function radix(n) {
    let s = '';
    for(let i=0; i <= n.length; i++){
        if( i%2 == 0 ){
            s += n.charAt(i);
        }
    }
    return s;
}

function evenNumber(n) {
    let r = /[^0-9]/ig;
    let b = n.replace(r, "");
    let s = '';
    for (let i = 0; i < b.length; i++) {
        if (b[i] % 2 != 0) {
            s += b[i];
        }
    }
    return s;
}

function formatTime(time) {
    const date = new Date(time);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const t1 = [year, month, day].map(formatNumber).join('/')
    const t2 = [hour, minute, second].map(formatNumber).join(':')
    return month + '月' + day + '日' + hour + ':' + minute + second;
    // return `${t1} ${t2}`
}

function saPageInfo(self,isWeb,pageName,staffId) {
    var appInst =  getApp();
    let source = self.$store.state.mp_source;
    let groupId = self.$store.state.mp_group_id;
    let page_type = '原生页';
    if (isWeb) {
        page_type = 'web页';
    }
    let sa_info = {
        mp_source:source,
        mp_group_id:groupId,
        staffId:staffId,
        pageType:page_type,
        pageName:pageName
    }
    appInst.sensors.track('mp_appPageView', sa_info);
    console.log(sa_info,pageName);
}

// 排序
const compare = (obj1, obj2) => {
    if (obj1 < obj2) {
        return 1;
    } else if (obj1 > obj2) {
        return -1;
    } else {
        return 0;
    }
}

/**判断是否为空 */
const isEmpty = (obj) => {
        if (typeof obj == "undefined" || obj == null || obj == "") {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 正则表达式
     */
const ischaracter = /^[\u4e00-\u9fa5A-Za-z]+$/; //只能是汉字与字母
const isNumphone =  /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/; //手机格式
const remarkFormatExp = /[~'!@#￥$%^&*()-+_=:]/; //非法字符

/**
 * 金额处理 返回  保留两位小数 [ 50 , .00]
 * fNum 传入的金额   Number传入保留 小数的个数(暂时未写)
 */
const priceFormat = (fNum, Number) => {
        if (fNum == undefined || fNum == null || fNum == 0 || fNum == '0') {
            return ['0','.00']
        }
        var fNum_;
        fNum_=fNum
        if(typeof(fNum_)==='string'&&fNum_.indexOf('￥')>-1){fNum_ = fNum_.replace('￥', '')}
        let fNumA = Math.floor(fNum_);
        let tempStr = Math.round((fNum_ - fNumA) * 100);
        let fNumB = tempStr < 10 ? '.' + '0' + tempStr : '.' + tempStr + '';
        let tempArr = [
            fNumA + '', fNumB
        ]
    return tempArr

}
/**
 * 保留两位小数，不足补0
 */


const returnFloat = (value) =>{

    let valueNum = Math.round(parseFloat(value) * 100) / 100;
    let xsd = valueNum.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
}

const couponSaleFormat = (value)  => {
    let style = [];
    if (value.indexOf(".") > 0 && value.length >= 4) {
      style.push(value.substr(0, 2));
      style.push(value.substr(2, 1));
      style.push(value.slice(3));
    } else {
      if (value.length >= 2) {
        style.push(value.substr(0, 1));
        style.push('');
        style.push(value.slice(1));
      } else {
        style.push(value);
        style.push('');
        style.push('');
      }
    }
    console.log(value, value.length, value[1], style);
    return style;
  }

/**
* 倒计时
 */
function countDown(times) {
    var timer = null;
    timer = setInterval(function() {
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0; //时间默认值
        if (times > 0) {
            day = Math.floor(times / (60 * 60 * 24));
            hour = Math.floor(times / (60 * 60)) - (day * 24);
            minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (day <= 9) day = '0' + day;
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        times--;
        return day + ":" + hour + ":" + minute + ":" + second
    }, 1000);
    if (times <= 0) {
        clearInterval(timer);
    }
}
function getQueryString(paramName, url){
    var index = url.indexOf('?');
    var url = url.substr(index + 1);
    var seachUrl = url;
    var ss = seachUrl.split("&");
    var paramNameStr = "";
    var paramNameIndex = -1;
    for (var i = 0; i < ss.length; i++) {
        paramNameIndex = ss[i].indexOf("=");
        paramNameStr = ss[i].substring(0, paramNameIndex);
        if (paramNameStr == paramName) {
            var returnValue = ss[i].substring(paramNameIndex + 1, ss[i].length);
            if (typeof(returnValue) == "undefined") {
                returnValue = "";
            }
            return returnValue;
        }
    }
    return "";
}

function isFullScreenPhone() {
    let phoneMobile = wx.getStorageSync('phoneMobile'); //判断是否为IPhonex
    let  type = false;
    if(phoneMobile.model.indexOf('iPhone X')>-1 || phoneMobile.model.indexOf('unknown<iPhone11,8>')>-1){
        type = true;
    }
    return type;
}

const mapak = '583CiYvHaYvYGsov8Imp0NfOGTdHt8ts';

export {
    countDown,
    formatNumber,
    formatTime,
    oddNumber,
    evenNumber,
    calcuMD5,
    isEmpty,
    ischaracter,
    isNumphone,
    remarkFormatExp,
    priceFormat,
    compare,
    radix,
    creatBarcode,
    creatQrcode,
    returnFloat,
    mapak,
    getQueryString,
    saPageInfo,
    couponSaleFormat,
    isFullScreenPhone
}
