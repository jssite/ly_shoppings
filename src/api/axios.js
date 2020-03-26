/**
 * Date: 2019
 */
import { REQUEST_HEADER,  MESSAGE_Id, BASE_TIME } from '@/config'
import { evenNumber, oddNumber, calcuMD5,radix } from '@/utils'
const axios = {}
const isHttpSuccess = (status => {
    return status >= 200 && status < 300 || status === 304;
});
/**
   * ES6: base64解码
   */
const decodeBase64Content = (base64Content) => {
    let commonContent = base64Content.replace(/\s/g, '+');
    commonContent = Buffer.from(commonContent, 'base64').toString();
    return commonContent;
}
/**
 * ES6: base64编码
 */
const encodeBase64Content = (commonContent) => {
    let base64Content = Buffer.from(commonContent).toString('base64');
    return base64Content;
};

const INIT_SIGN = (type) => {
    let token = REQUEST_HEADER().token;
    let messageID = MESSAGE_Id();
    let sign = `${messageID}&${REQUEST_HEADER().time_stamp}&${type}&${REQUEST_HEADER().terminal}&${token}&ddxcx1234@webapi`;
    let md5Sign = calcuMD5(sign);
    let radixMd5 = radix(md5Sign);
    return calcuMD5(radixMd5);
}

/**
 * POST
 */
axios.post =(url,type = '',  params = {}, request = {}) => {
    let config = {
        "body": params,
        "header": Object.assign(REQUEST_HEADER(),{
            "transaction_type": type,
            "sign":INIT_SIGN(type)
        },request)
    };

    return new Promise((resolve,reject) => {
        wx.request({
            url,
            method: 'post',
            header: {
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: {
                "json": encodeBase64Content(JSON.stringify(config))
            },
            success(res) {
                const isSuccess = isHttpSuccess(res.statusCode);
                if ( isSuccess ) {
                    resolve(res.data)
                } else {
                    wx.hideLoading()
                    reject(res.data)
                }
            },
            fail(error) {
                wx.hideLoading()
                reject(error.data)
            },
            complete(){

            }
          })
    });
};
/**
 * GET
 */
axios.get = (url, type = '', params = {}, request = {}) => {
    let config = {
        "body": params,
        "header": Object.assign(REQUEST_HEADER(),{
            "transaction_type": type,
            "sign":INIT_SIGN(type)
        },request)
    };
    return new Promise((resolve,reject) => {
        wx.showNavigationBarLoading()
        wx.request({
            url: `${url}/${encodeBase64Content(JSON.stringify(config))}`,
            method: 'get',
            success(res) {
                const isSuccess = isHttpSuccess(res.statusCode);
                if ( isSuccess ) {
                    resolve(res.data)
                } else {
                    reject(res.data)
                }
            },
            fail(error) {
                reject(error.data)
            },
            complete(){
                wx.hideNavigationBarLoading();
            }
        })
    });
}
export default axios;
