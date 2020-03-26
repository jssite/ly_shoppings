/**
 * Date: 2019
 */
import { REQUEST_HEADER,  MESSAGE_Id, BASE_TIME } from '@/config'
import { evenNumber, oddNumber, calcuMD5,radix } from '@/utils'
const ajax = {}
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
ajax.post =(url,type = '',  params = {}, request = {}) => {
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
                    let { body, header,data} = res.data;
                    if( header.res_code == 0 ){
                        console.log(body||data)
                        resolve(body||data)
                    } else if(header.res_code == 99998 ){
                        resolve(header)
                    } else if(header.res_code == 99996 ){
                        resolve(header)
                    } else if(header.res_code == 99997 ){
                        resolve(body)
                    } else if( header.res_code == 215003 ){
                        resolve(body)
                    } else if( header.res_code == 900001 ){
                        wx.removeStorage({
                            key: 'token',
                        });
                        resolve(header)
                    } else {
                        wx.hideLoading();
                        if(header.transaction_type==="getUserinfo"){

                        }else{
                            wx.showToast({
                                title: header.message,
                                icon: 'none',
                                duration: 2000
                            });
                        }

                    }
                } else {
                    wx.hideLoading();
                    reject(res.data)
                }
            },
            fail(error) {
                wx.hideLoading();
                reject(error.data)
            },
            complete(){
                wx.stopPullDownRefresh();
                wx.hideNavigationBarLoading()
            }
          })
    });
};
/**
 * GET
 */
ajax.get = (url, type = '', params = {}, request = {}) => {
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
                    let { body, header} = res.data;
                    if(header.time_stamp){
                        wx.setStorageSync('time',header.time_stamp)
                    }
                    if( header.res_code == 0 ){
                        resolve(body)
                    } else if(header.res_code == 100701){
                        resolve(header)
                    } else if( header.res_code == 100708 ){
                        resolve(header)
                    } else if(header.res_code == 100999){
                        resolve(header)
                    } else if(header.res_code == 999999 ){
                        resolve(res.data)
                    } else {
                        wx.hideLoading();
                        if(header.transaction_type==="getUserinfo"){
                        }else{
                            wx.showToast({
                                title: header.message,
                                icon: 'none',
                                duration: 2000
                            });
                        }
                        // resolve(header)
                    }
                } else {
                    wx.hideLoading();
                    reject(res.data)
                }
            },
            fail(error) {
                wx.hideLoading();
                reject(error.data)
            },
            complete(){
                wx.stopPullDownRefresh();
                wx.hideNavigationBarLoading()
            }
        })
    });
}



/**
 * ORDER POST
 */
ajax.orderPost =(url,type = '',  params = {}, request = {}) => {
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
                    resolve(res.data);
                } else {
                    reject(res.data)
                }
            },
            fail(error) {
                wx.hideLoading();
                reject(error.data)
            },
            complete(){
                // debugger

                // wx.stopPullDownRefresh();
                // wx.hideNavigationBarLoading()
            }
          })
    });
};
/**
 * ORDER  GET
 */
ajax.orderGet = (url, type = '', params = {}, request = {}) => {
    let config = {
        "body": params,
        "header": Object.assign(REQUEST_HEADER(),{
            "transaction_type": type,
            "sign":INIT_SIGN(type)
        },request)
    };
    return new Promise((resolve,reject) => {
        wx.request({
            url: `${url}/${encodeBase64Content(JSON.stringify(config))}`,
            method: 'get',
            success(res) {
                const isSuccess = isHttpSuccess(res.statusCode);
                if ( isSuccess ) {
                    let { body, header} = res.data;
                    if(header.time_stamp){
                        wx.setStorageSync('time',header.time_stamp)
                    }
                    resolve(res.data);
                } else {
                    reject(res.data)
                }
            },
            fail(error) {
                wx.hideLoading();
                reject(error.data)
            },
            complete(){
                // debugger
                // wx.hideLoading();
                // wx.stopPullDownRefresh();
                // wx.hideNavigationBarLoading()
            }
        })
    });
}




export default ajax;

