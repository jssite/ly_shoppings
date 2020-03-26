import ajax from './http';
import axios from './axios';
// const BASE_WEBAPI = process.env.BASE_WEBAPI;
// const BASE_APPAPI = process.env.BASE_APPAPI;
const BASE_TEST = process.env.BASE_TEST;
const BASE_OPEN_Gid = 'http://192.168.98.215/leyou-gateway-services/'

// const BASE_WEBAPI = 'http://192.168.98.215/leyou-gateway-services'
// const BASE_APPAPI = 'http://192.168.196.229'

// const BASE_WEBAPI = 'https://webapi.leyou.com.cn/leyou-gateway-services'
// const BASE_APPAPI = 'https://app.leyou.com.cn'

const BASE_WEBAPI = 'https://test.ruiyunit.com.cn/leyou-gateway-services'
const BASE_APPAPI = 'http://test1.ruiyunit.com.cn'

// BASE_WEBAPI: '"http://test.ruiyunit.com.cn/leyou-gateway-services"',
// BASE_APPAPI: '"http://test1.ruiyunit.com.cn"',

/**
 * 全局配置接口a
 */
export const getAppInfo = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/my/getAppInfo`, 'getAppInfo', params, header)
}

/**
 * 全局广告
 */
export const getAdverInfo = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/content/getAdvertisement`, 'getAppInfo', params, header)
}


/**
 * 搜索-获取搜索热词
 */
export const searchKeyword = (params, header = {}) => {
        return ajax.get(`${BASE_WEBAPI}/product/searchKeyword`, 'searchKeyword', params, header)
    }
    /**
     * 搜索 - 获取搜索关联字
     */
export const getSuggest = (params, header = {}) => {
        return ajax.post(`${BASE_WEBAPI}/solr/product/getSuggest`, 'getSuggest', params, header)
    }
    /**
     * 搜索-获取搜索商品列表||获取品类品牌等筛选的内容
     */
export const productQuery = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/solr/product/productQuery`, 'productQuery', params, header)
}

/**
 * 搜索-获取闪送搜索商品列表||获取闪送品类品牌等筛选的内容
 */
export const productQueryByShopId = (params, header = {}) => {
        return ajax.post(`${BASE_WEBAPI}/solr/product/productQueryByShopId`, 'productQueryByShopId', params, header)
    }
    /**
     * 附近门店
     */
export const getAdderssShops = (params, header = {}) => {
        return ajax.get(`${BASE_WEBAPI}/user/getAdderssShops`, 'getAdderssShops', params, header)

    }
    /**
     * 身边门店
     */
export const getLocationShops = (params, header = {}) => {
        return ajax.get(`${BASE_WEBAPI}/user/getLocationShops`, 'getLocationShops', params, header)

    }
    // /user/getLevelAddress/
    //城市联动
export const optCity = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/user/getLevelAddress/`, 'optCity', params, header)
}

/** 乐闪送
 * 1，乐闪送 导航请求tab getmeetFacet   solr/product/meetCategoryFacet
 * 2,获取用户的地利位置  user/homepage
 */
export const getmeetFacet = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/solr/product/meetCategoryFacet`, 'getmeetFacet', params, header)
}
export const getUserLocation = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/user/homepage`, 'getUserLocation', params, header)
}

/*** 乐闪送 添加购物车
 * 1,闪送商品添加，购物车    /mtshoppingcart/postShoppingCart
 * 2，闪送商品有规格   product/getMeetProductImageColors   "sku" : "T120068016", "product_id" : 510380,  "shop_id" : "2478"
 * 3.获取闪送购物车 数量  /mtshoppingcart/getCartCount  getshopcartNum
 */
export const getshanaddCart = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/mtshoppingcart/postShoppingCart`, 'getshanaddCart', params, header)
}

export const getMeetProductSize = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/product/getMeetProductImageColors`, 'getMeetProductSize', params, header)
}

export const getshopcartNum = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/mtshoppingcart/getCartCount`, 'getshopcartNum', params, header)
}



/**收货地址的曾删改
 * 1，收货地址-获取收货地址的列表 gainAddressList
 * 2，收货地址-添加与修改收货地址 reviseAddress
 * 3，城市的选择
 * 4 ,删除地址  user/deleteAddress/
 * 5, 设置默认地址  user/updateDefaultAddress/
 */

export const gainAddressList = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/user/getAddresses`, 'gainAddressList', params, header)
}
export const reviseAddress = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/user/postAddress`, 'postAddress', params, header)
}
export const setSelectCity = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/user/getCityInfo/`, 'getCityInfo', params, header)
}

export const setDeteletadd = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/user/deleteAddress/`, 'setDeteletadd', params, header)
}

export const setdefaultaddress = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/user/updateDefaultAddress`, 'setdefaultaddress', params, header)
}

/** 1，购物车,获取购物车的数量
 *
 */
export const getCartNum = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/shoppingcart/getCartCount`, 'getCartNum', params, header)
}


/**商品详情
 * 1,商品详情-获取商品详情基本信息 getDoodsData
 * 2,商品详情-获取商品详情（扩展信息）动态信息getDoodsDataDynamic
 * 3,商品详情-商品图文详情数据       getDoodsImgTxtData
 * 4,商品详情-同一系列商品数据     getDoodsIdenticalData(数据规格)
 * 5,商品评论列表      getGoodsCommentList
 * 6,加入收藏         addCollectData(加入)
 * 7,移除收藏         deteleCollectData（移除）
 * 8,领取优惠卷       getcoupon(领取优惠卷)
 * 9,积分兑换         getintegral
 * 10,相关推荐    getrecomment      /hotlist/daGuanHotlistRecomment
 * 11,添加商品到购物车 addshoppingcart
 */
export const getDoodsData = (params, header = {}) => {
    return axios.post(`${BASE_WEBAPI}/lyproduct/getProductStaticInfo/`, 'getDoodsData', params, header)
}
export const getDoodsDataDynamic = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/lyproduct/getProductDynamicInfo/`, 'getDoodsDataDynamic', params, header)
}
export const getDoodsImgTxtData = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/lyproduct/getProductImageInfo/`, 'getDoodsImgTxtData', params, header)
}
export const getDoodsIdenticalData = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/product/getRelatedSkuInfo/`, 'getDoodsIdenticalData', params, header)
}
export const getGoodsCommentList = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/product/getReviews/`, 'getGoodsCommentList', params, header)
}
export const addCollectData = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/my/addMyAttentions`, 'addCollectData', params, header)
}
export const deteleCollectData = (params, header = {}) => {
    return axios.get(`${BASE_WEBAPI}/my/removeMarkProducts`, 'deteleCollectData', params, header)
}
export const getCoupon = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/coupons/getFreeCoupons`, 'getCoupon', params, header)
}
export const getintegral = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/point/putCouponsByPoint`, 'getintegral', params, header)
}
export const getrecomment = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/hotlist/daGuanHotlistRecomment`, 'getrecomment', params, header)
}
export const addshoppingcart = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/shoppingcart/postShoppingCart`, 'addshoppingcart', params, header)
}

/**商品秒杀列表
 * 1，商品秒杀 getskillinfo
 * 2，商品秒杀提醒  与取消
 */
export const getskillinfo = (params, header = {}) => {
    return axios.post(`${BASE_WEBAPI}/skillProduct/getSkillProduct`, 'getskillinfo', params, header)
}

export const getskillRemind = (params, header = {}) => {
    return axios.post(`${BASE_WEBAPI}/skillProduct/getSkillProductRemind`, 'getskillinfo', params, header)
}


/**售后服务
 * 1，售后列表  refund/queryRefundApplicationList
 * 2， 退货详情  refund/queryRefundApplicationInfo
 * 3， 取消退货   refund/cancelRefundApplication
 */
export const getRefundtion = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/refund/queryRefundApplicationList`, 'getRefundtion', params, header)
}

export const getcancelDetailed = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/refund/queryRefundApplicationInfo`, 'getcancelDetailed', params, header)
}

export const getRemoveCancel = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/refund/cancelRefundApplication`, 'getRemoveCancel', params, header)
}


/**商品分类
 * 1,获取年龄分类信息 goodsage_detail
 * 2,主分类 goodscategoryFacet
 * 3,场景分类 goodsscenede_tail
 * 4，品牌  content/getBrandRecommend
 */
export const goodsage_detail = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/solr/product/age_detail`, 'getage_detail', params, header)
}
export const goodscategoryFacet = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/solr/product/categoryFacet`, 'goodscategoryFacet', params, header)
}
export const goodsscenede_tail = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/solr/product/scene_detail`, 'goodsscenede_tail', params, header)
}

export const goodsbrand = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/content/getBrandRecommend`, 'goodsbrand', params, header)
}

/**个人中心
 * 1,个人中心首页 getUserinfo
 * 2,发票列表   getInvoice
 * 3,添加发票   reviseInvoice
 * 4,删除发票   sdeleteInvoice
 * 5,我的收藏列表   my/getProductMarkList      "page_index" : 1, "page_size" : "20"
 * 6, 取消收藏 列表  my/removeMarkProduct
 */
export const getUserinfo = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/my/getUserInfoIndex`, 'getUserinfo', params, header)
}
export const getInvoice = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/userInvoiceBase/listUserInvoice`, 'getInvoice', params, header)
}
export const reviseInvoice = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/userInvoiceBase/modifyUserInvoice`, 'anySubmitOrder', params, header)
}
export const myMarkCollect = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/my/getProductMarkList/`, 'getProductMarkList', params, header)
}
export const removeMarkCollect = (params, header = {}) => {
    return axios.get(`${BASE_WEBAPI}/my/removeMarkProduct/`, 'removeMarkCollect', params, header)
}

/**
 * 1,普通订单详情 getMyorderdel /myorder/getMySerialOrderInfo （未付款用流水）
 * 2，普通订单     （已经付款用订单）
 */
export const getMyorderdel = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/myorder/getMySerialOrderInfo`, 'getMySerialOrderInfo', params, header)
}
export const getSuccessOrder = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/myorder/getMyOrderInfo`, 'getSuccessOrder', params, header)
}

// 获取提交订单信息
export const getSubmitOrderInfo = (params, header = {}) => {
    return ajax.orderPost(`${BASE_WEBAPI}/order/anyOrderInfo/`, 'anyOrderInfo', params, header)
}

// 海淘订单信息
export const getHaiTaoSubmitOrderInfo = (params, header = {}) => {
    return ajax.orderPost(`${BASE_WEBAPI}/haitaoOrder/anyHaitaoInfo/`, 'anyHaitaoInfo', params, header)
}

// 海淘验证身份证
export const checkHaiTaoIdCard = (params, header = {}) => {
    return ajax.orderPost(`${BASE_WEBAPI}/haitaoOrder/checkIdcard/`, 'checkIdcard', params, header)
}


// 用户提交订单
export const userSubmitOrder = (params, header = {}) => {
    return ajax.orderPost(`${BASE_WEBAPI}/order/anySubmitOrder/`, 'anySubmitOrder', params, header)
}

// 海淘提交订单
export const userHaiTaoSubmitOrder = (params, header = {}) => {
    return ajax.orderPost(`${BASE_WEBAPI}/haitaoOrder/submitHaiTaoOrder/`, 'submitHaiTaoOrder', params, header)
}

// 扫码购获取订单信息
export const getSmgSubmitOrder = (params, header = {}) => {
    return ajax.orderPost(`${BASE_WEBAPI}/smgorder/anyOrderInfo/`, 'anyOrderInfo', params, header)
}

// 扫码购提交订单
export const userSmgSubmitOrder = (params, header = {}) => {
    return ajax.orderPost(`${BASE_WEBAPI}/smgorder/anySubmitOrder/`, 'anySubmitOrder', params, header)
}

// 扫码购支付完成
export const smgPayFinishInfomation = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/smgorder/getOrderPayInfo/`, 'getOrderPayInfo', params, header)
}

// 获取支付信息
export const userGetPayInfomaiton = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/orderPay/zhifuPay/`, 'zhifuPay', params, header)
}

// 获取讯联支付信息
export const userGetXlzfInfomaiton = (params, header = {}) => {
    // return ajax.post(`${BASE_WEBAPI}/orderPay/xunlian_small/`, 'xunlian_small', params, header)

    return ajax.post(`${BASE_WEBAPI}/orderPay/zhifuPay/`, 'zhifuPay', params, header)
}

// 讯联支付成功信息
export const userGetXlzfFinishInfomaiton = (params, header = {}) => {
    // return ajax.post(`${BASE_WEBAPI}/erification/orderPayVerificationStatus`, 'xunlian_small', params, header)

    return ajax.post(`${BASE_WEBAPI}/verification/orderPayVerificationStatus/`, 'orderPayVerificationStatus', params, header)
}

// 支付成功页面
export const payFinishInfomaiton = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/orderPaySuccess/orderShareInfo/`, 'orderShareInfo', params, header)
}

// 线上订单列表
export const getOrderListByApp = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/myorder/getMySerialOrdersByApp/`, 'getMySerialOrdersByApp', params, header)
}

// 门店订单列表
export const getOrderListByStore = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/myorder/getMySerialOrdersByStore/`, 'getMySerialOrdersByStore', params, header)
}

// 取消订单
export const orderCancle = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/order/cancelorder`, 'cancelorder', params, header)
}

// 确认收货
export const orderAccept = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/refund/confirmRecept`, 'confirmRecept', params, header)
}

// 删除订单
export const orderDelete = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/order/delMyOrderBySerialNum`, 'delMyOrderBySerialNum', params, header)
}

// 获取发票列表
export const getInvoiceList = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/userInvoiceBase/listUserInvoice/`, 'listUserInvoice', params, header)
}

// 添加修改发票
export const alertInvoice = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/userInvoiceBase/modifyUserInvoice/`, 'modifyUserInvoice', params, header)
}

// 删除发票
export const deleteInvoice = (params, header = {}) => {
        return ajax.get(`${BASE_WEBAPI}/userInvoiceBase/deleteInvoiceBase/`, 'deleteInvoiceBase', params, header)
    }
    // 验证礼金卡
export const vailGidtCard = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}//gift/getGiftCart/`, 'getGiftCart', params, header)
}

//检查用户是否存在
export const getUserByUserName = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/user/getUserByUserName/`, 'getUserByUserName', params, header)
}

//注册
export const appRegister = (params, header = {}) => {
    return ajax.post(`${BASE_APPAPI}/user/appRegister`, 'appRegister', params, header)
}

//user/getRegisterToken/
export const getRegisterToken = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/user/getRegisterToken/`, 'getRegisterToken', params, header)
}

//获取微信用户id
export const getTokenByCode = (params, header = {}) => {1
    return ajax.get(`${BASE_WEBAPI}/applet/getTokenByCode`, 'getTokenByCode', params, header)
}

//微信登录
export const getTokenByMobileAndOpenid = (params, header = {}) => {
    return axios.get(`${BASE_WEBAPI}/applet/getTokenByMobileAndOpenid`, 'getTokenByMobileAndOpenid', params, header)
}

//微信登录 -- 获取手机号
export const getWXPhoneNumber = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/applet/getWXPhoneNumber`, 'getWXPhoneNumber', params, header)
}

//登录
export const fastLogin = (params, header = {}) => {
    return ajax.get(`${BASE_APPAPI}/user/fastLogin`, 'fastLogin', params, header)
}

//获取验证码
export const getMobileIdentifyCode = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/user/getMobileIdentifyCode `, 'getMobileIdentifyCode', params, header)
}

//密码登录
export const passwordLogin = (params, header = {}) => {
    return ajax.get(`${BASE_APPAPI}/user/login`, 'login', params, header)
}

//语音验证码
export const putVoiceValidateCode = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/user/putVoiceValidateCode/`, 'putVoiceValidateCode', params, header)
}

//获取图形验证码
export const getValidateCode = (params, header = {}) => {
        return ajax.post(`${BASE_WEBAPI}/sys/getValidateCode/`, 'getValidateCode', params, header)
    }
    //校验图形验证码
export const putValidateCode = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/sys/putValidateCode/`, 'putValidateCode', params, header)
}


//设置常购门店接口
export const updateOftenShop = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/user/updateOftenShop`, 'updateOftenShop', params, header)
}

//门店导购接口
export const getStoreStaffs = (params, header = {}) => {
    return ajax.get(`${BASE_APPAPI}/staff/getStoreStaffs`, 'getStoreStaffs', params, header)
}

//门店导购关注
export const followStaff = (params, header = {}) => {
    return ajax.get(`${BASE_APPAPI}/im/followStaff`, 'followStaff', params, header)
}

//提交退货物流信息信息
export const addGoodsReturnedNote = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/refund/addGoodsReturnedNote/`, 'addGoodsReturnedNote', params, header)
}

//提交退货物流信息信息
export const addRefundApplicationInfo = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/refund/addRefundApplicationInfo/`, 'addRefundApplicationInfo', params, header)
}

//退货结算接口
export const queryRefundPrice = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/refund/queryRefundPrice/`, 'queryRefundPrice', params, header)
}

//门店活动接口
export const getMessageMainSideShop = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/user/getMessageMainSideShop/`, 'getMessageMainSideShop', params, header)
}

// 门店广告位
export const getNearByShopImg = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/content/getNearbyShopImg/`, 'getNearbyShopImg', params, header)
}

//找回密码
export const putChangePwd = (params, header = {}) => {
        return ajax.post(`${BASE_WEBAPI}/user/putChangePwd/`, 'putChangePwd', params, header)
    }
    //操作购物车
export const synAllShoppingCart = (params, header = {}) => {
        return ajax.post(`${BASE_WEBAPI}/shoppingcart/synAllShoppingCart`, 'synAllShoppingCart', params, header)

    }
    //  获取购物车数据
export const getCartAllData = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/shoppingcart/getCartAllData/`, 'getCartAllData', params, header)
}
export const getShopStock = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/oto/areaShopStock/`, 'getShopStock', params, header)
}

export const getAdvertisement = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/content/getAdvertisement/`, 'getAdvertisement', params, header)
}

export const getLikeInfo = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/content/getLikeInfo/`, 'getLikeInfo', params, header)
}

export const mergeShoppingCart = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/shoppingcart/mergeShoppingCart/`, 'mergeShoppingCart', params, header)
}
export const mermtgeShoppingCart = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/mtshoppingcart/mergeShoppingCart/`, 'mermtgeShoppingCart', params, header)
}
export const getCouponsDetails = (params, header = {}) => {
        return ajax.get(`${BASE_WEBAPI}/coupons/getCouponsDetails/`, 'getCouponsDetails', params, header)
    }
    //兑换优惠券

export const putCouponsByCodeNum = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/coupons/putCouponsByCodeNum/`, 'putCouponsByCodeNum', params, header)
}

export const getLevelAddressTwo = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/user/getLevelAddressTwo/`, 'getLevelAddressTwo', params, header)
}

export const getOssConfig = (params, header = {}) => {
    return ajax.post(`https://o2oservice.jmleyou.com/lyo2o-app-gateway/sys/getOssConfig/`, 'getOssConfig', params, header)
}
export const daGuanRelateRecomment = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/relatelist/daGuanRelateRecomment/`, 'daGuanRelateRecomment', params, header)
}
export const getFunctional = (params, header = {}) => {
        return ajax.get(`${BASE_WEBAPI}/content/getFunctional`, 'getFunctional', params, header)
    }
    //评价提交

export const addComments = (params, header = {}) => {
        return ajax.post(`${BASE_WEBAPI}/product/addComments`, 'addComments', params, header)
    }
    //领劵中心

export const getFreeCouponsList = (params, header = {}) => {
        return ajax.get(`${BASE_WEBAPI}/coupons/getFreeCouponsList/`, 'getFreeCouponsList', params, header)
    }
    //领取优惠券


export const getFreeCoupons = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/coupons/getFreeCoupons`, 'getFreeCoupons', params, header)
}

//首页
export const getIndex = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/content/getIndex`, 'getIndex', params, header)
}

//首页-秒杀
export const getSeckillInfo = (params, header = {}) => {
    return axios.get(`${BASE_WEBAPI}/content/getSeckillInfo`, 'getSeckillInfo', params, header)
}

//首页-宝宝摸版
export const getBabyInfo = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/content/getBabyInfo`, 'getBabyInfo', params, header)
}

// 分类
export const getProductTypeCategory = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/daGuanProduct/selectProductCategoryByType`, 'selectProductCategoryByType', params, header)
}

// 专属好货
export const daGuanRecommentGoods = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/daGuanRecomment/daGuanLikeRecomment`, 'daGuanHotRecomment', params, header)
}

// 排行榜
export const hotListGoods = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/hotlist/daGuanHotRecomment`, 'daGuanHotRecomment', params, header)
}

export const getExchangeCoupon = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/coupons/getGiftsByCoupons`, 'getGiftsByCoupons', params, header)
}
//闪送购物车
export const getmtCartAllData = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/mtshoppingcart/getCartAllData`, 'getmtCartAllData', params, header)
}
//操作闪送购物车

export const synmtAllShoppingCart = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/mtshoppingcart/synAllShoppingCart`, 'synmtAllShoppingCart', params, header)
}

// 乐享卡
export const buyVipCard = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/expressOrder/expressSubmitOrder`, 'expressSubmitOrder', params, header)
}

// 品牌储值卡
export const buyBrandVipCard = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/expressOrder/expressBuyCard`, 'expressSubmitOrder', params, header)
}

// 乐活动卡
export const buyBrandVerbVipCard = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/expressOrder/expressBuyCard`, 'expressSubmitOrder', params, header)
}
// 下载发票
export const downloadInvoice = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/invoice/loadInvoice`, 'loadInvoice', params, header)
}

// 扫码处理
export const apiScanCode = (params, header = {}) => {
    return ajax.get(`${BASE_APPAPI}/system/scanQrCode`, 'scanQrCode', params, header)
}
// 首页-分类底部导航
export const getMiniProductList = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/daGuanRecomment/getMiniProductList`, 'getMiniProductList', params, header)
}
//分类数据
export const daGuanLikeRecomment = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/daGuanRecomment/daGuanLikeRecomment`, 'daGuanLikeRecomment', params, header)
}

export const getGoodsdetail = (params, header = {}) => {
    return ajax.post(`${BASE_TEST}/goods/detail`, 'getGoodsdetail', params, header)
}
export const getMyLeyouDetail = (params, header = {}) => {
    return ajax.post(`${BASE_TEST}/cut/my`, 'getMyLeyouDetail', params, header)
}
export const getProductCutPageDetail = (params, header = {}) => {
    return ajax.post(`${BASE_TEST}/index/detail`, 'getProductCutPageDetail', params, header)
}
//根据skus查询商品售价、标题、库存、图片
export const getCutPrdtLists = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/lyproduct/getWxProductPrice`, 'getCutPrdtLists', params, header)
}
//根据skus查询商品是否可售
export const getPrdtStatus = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/lyproduct/getProductStatus`, 'getPrdtStatus', params, header)
}

export const cutDo = (params, header = {}) => {
    return ajax.post(`${BASE_TEST}/cut/do`, 'cutDo', params, header)
}
export const cutDetail= (params, header = {}) => {
    return ajax.post(`${BASE_TEST}/cut/detail`, 'cutDetail', params, header)
}

export const getProductDynamicInfo = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/lyproduct/getProductDynamicInfo`, 'getProductDynamicInfo', params, header)
}

export const cutMsgtrigger = (params, header = {}) => {
    return ajax.post(`${BASE_TEST}/user/cut_msg_trigger`, 'cutMsgtrigger', params, header)
}
export const getQrcode = (params, header = {}) => {
    return ajax.post(`${BASE_TEST}/cut/get_qrcode`, 'cutMsgtrigger', params, header)
}

export const updateOrder = (params, header = {}) => {
    return ajax.orderPost(`${BASE_TEST}/cut/update_order`, 'updateOrder', params, header)
}
export const getOpenGid = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/small/getWechatOpenGId`, 'getWechatOpenGId', params, header)
}

export const uploadOpenGidInfo = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/small/insertSmallAppletInfo`, 'insertSmallAppletInfo', params, header)
}


/* 扫码购-获取扫码购门店列表 */
export const getLocationShopsList = (params, header = {}) => {
    return axios.post(`${BASE_WEBAPI}/shop/getLocationShops`, 'getLocationShops', params, header)
}
/* 扫码购-关键字搜索门店列表 */
export const queryShopLists = (params, header = {}) => {
    return axios.post(`${BASE_WEBAPI}/shop/queryShop/`, 'queryShop', params, header)
}
/* 扫码购-购物车 */
export const getsmCartAllData = (params, header = {}) => {
    return axios.get(`${BASE_WEBAPI}/smgShoppingcart/getCartAllData/`, 'queryShop', params, header)
}
    /* 扫码购-关键字搜索门店列表 */
export const queryDefaultShop = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/shop/userLocationShop/`, 'userLocationShop', params, header)
}
/* 扫码购-加购物车 */
export const smsynShoppingCart = (params, header = {}) => {
    return axios.get(`${BASE_WEBAPI}/smgShoppingcart/synShoppingCart/`, 'smsynShoppingCart', params, header)
}
/* 扫码购-清空购物车 */
export const smsynAllShoppingCart = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/smgShoppingcart/synAllShoppingCart/`, 'smsynShoppingCart', params, header)
}

export const calculatePromotion = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/cartHandle/calculatePromotion/`, 'calculatePromotion', params, header)
}

export const choosePromotion = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/cartHandle/choosePromotion/`, 'choosePromotion', params, header)
}

export const chooseSku = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/cartHandle/chooseSku/`, 'chooseSku', params, header)
}


export const anyOrderInfo = (params, header = {}) => {
    return ajax.orderGet(`${BASE_WEBAPI}/kjorder/anyOrderInfo`, 'anyOrderInfo', params, header)
}

export const anySubmitOrder = (params, header = {}) => {
    return ajax.orderPost(`${BASE_WEBAPI}/kjorder/anySubmitOrder`, 'anyOrderInfo', params, header)
}

export const getDistributionIndex = (params, header = {}) => {
    return ajax.orderPost(`${BASE_WEBAPI}/content/getDistributionIndex`, 'anyOrderInfo', params, header)
}
/*获取佣金商品列表*/
export const getOrderCommissionLists = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/transfer/selectOrderCommissionList`, 'getOrderCommissionLists', params, header)
}
/*获取佣金信息*/
export const getMyCommissionInfo = (params, header = {}) => {
    return ajax.post(`${BASE_WEBAPI}/transfer/getMyCommissionInfo`, 'getMyCommissionInfo', params, header)
}

/**
 * 搜索-分享赚搜索列表
 */
export const shareProductQuery = (params, header = {}) => {
    return axios.post(`${BASE_WEBAPI}/shareSolr/productQuery`, 'productQuery', params, header)
}
export const getSkuShareImg = (params, header = {}) => {
    return axios.post(`${BASE_APPAPI}/user/getSkuShareImg`, 'productQuery', params, header)
}



// 预售 订单

export const getPreSellSubmitOrderInfo = (params, header = {}) => {
    return ajax.orderPost(`${BASE_WEBAPI}/preSaleOrder/settlementOrder/`, 'anyOrderInfo', params, header)
}

// 预售提交订单
export const preSellUserSubmitOrder = (params, header = {}) => {
    return ajax.orderPost(`${BASE_WEBAPI}/preSaleOrder/preSaleSubmitOrder/`, 'anySubmitOrder', params, header)
}

// 预售订单详情
export const getMyPreOrderDetail = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/myorder/getMyPreOrderInfo`, 'getMyPreOrderInfo', params, header)
}

export const getMyPreOrderCashInfo = (params, header = {}) => {
    return ajax.get(`${BASE_WEBAPI}/orderPay/getOrderMoney`, 'getMyPreOrderInfo', params, header)
}


