<template>
    <div class="return_goods">
        <div class="return_goods_top">
            <template v-if="source == 'order'">
                <div class="order_product">
                    <div class="return_goods_price">
                        <span>订单号：{{return_goods.order_products[0].order_id}}</span>
                        <!-- 自助退货：订单 NO.1 -->
                        <template v-if="source == 'order'">
                            <span>订单金额：￥{{return_goods.order_total_fee}}</span>
                        </template>
                    </div>
                    <div class="return_goods_detail">
                        <scroll-view scroll-x>
                            <div class="return_wrap_scroll" :style="{'width':return_goods.order_products.length*140 + 'rpx'}">
                                <div class="return_goods_img_wrap" v-for="(item,index) in return_goods.order_products" :key="index" @click="funcGoToDetail(item)">
                                    <img :src="BASE_IMG_URL + item.le_image" class="return_goods_img">
                                </div>
                            </div>
                        </scroll-view>
                        
                        <!-- <div class="return_goods_info" v-if="false">
                            <div class="return_goods_title">{{item.product_title}}</div>
                            <div class="return_goods_class">颜色：{{item.color}}  尺码：{{item.specifications}}</div>
                            <div class="return_goods_number">
                                <span>数量：×{{return_goods.order_skus_num}}</span>
                                <template v-if="source == 'sku'">
                                    <span>订单金额：￥{{refund_price}}</span>
                                </template>
                                
                            </div>
                        </div> -->
                    </div>
                </div>
            </template>
            <template v-if="source == 'sku'">
                <div class="order_product"
                    v-for="(item,index) in return_goods.order_products"
                    :key="index">
                        <div class="return_goods_price">
                            <span>订单号：{{item.order_id}}</span>
                            <!-- 自助退货：订单 NO.1 -->
                            <template v-if="source == 'order'">
                                <span>订单金额：￥{{refund_price}}</span>
                            </template>
                        </div>
                        <div class="return_goods_detail">
                            <div class="return_goods_img_wrap">
                                <img :src="BASE_IMG_URL + item.le_image" class="return_goods_img">
                            </div>
                            <div class="return_goods_info">
                                <div class="return_goods_title">{{item.product_title}}</div>
                                <div class="return_goods_class"><!--颜色：{{item.color}}  尺码：{{item.specifications}}--></div>
                                <div class="return_goods_number">
                                    <span>数量：×{{return_goods.order_products[0].quantity}}</span>
                                    <!-- 自助退货：SKU NO.1 -->
                                    <template v-if="source == 'sku'">
                                        <span>订单金额：￥{{refund_price}}</span>
                                    </template>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
            </template>
            
        </div>
        <div class="return_goods_type">
            <div class="return_goods_li">
                <span class="return_goods_label">退货类型</span>
                <div class="return_goods_type_content" @click="funcRefundType">
                    <div 
                    class="retrun_goods_txt" 
                    :class="{'detail': refund_type == ''}"
                    v-if="refund_type == ''">退款退货</div>
                    <div 
                    class="retrun_goods_txt" 
                    v-else>{{refund_type}}</div>
                    <div class="return_goods_arrow"></div>
                </div>
            </div>
            <div class="return_goods_li">
                <span class="return_goods_label">退货原因</span>
                <div class="return_goods_type_content" @click="funcRefundReason">
                    <div 
                    class="retrun_goods_txt" 
                    :class="{'detail': refund_reason == ''}"
                    v-if="refund_reason == ''">请选择</div>
                    <div v-else class="retrun_goods_txt">{{refund_reason}}</div>
                    <div class="return_goods_arrow"></div>
                </div>
            </div>
        </div>
        <div class="return_goods_conter">
            <!-- 自助退货：订单 NO.2 -->
            <template v-if="source == 'order'">
                <div class="return_goods_freight">退还商品金额：<span class="red">￥{{refund_price}}</span></div>
                <div class="return_goods_freight">退还运费：<span class="red">￥{{refund_default_express_price}}</span></div>
            </template>
            <!-- 自助退货：SKU NO.2 -->
            <template v-if="source == 'sku'">
               <div class="return_goods_freight_number">
                    <span>退货数量：</span>
                    <span class="return_number_reduce" @click="funcRefundReduce">
                        <template v-if="refund_number == 1">
                            <img class="return_number_img" src="../image/public_number_subnot.png" alt="">
                        </template>
                        <template v-else>
                            <img class="return_number_img" src="../image/public_number_sub.png" alt="">
                        </template>
                    </span>
                    <span class="retrun_goods_value">{{refund_number}}</span>
                    <span class="return_goods_increase" @click="funcRefundIncrease">
                        <template v-if="refund_number >= return_goods.order_products[0].quantity">
                            <img class="return_number_img" src="../image/public_number_addnot.png" alt="">
                        </template>
                        <template v-else>
                            <img class="return_number_img" src="../image/public_number_add.png" alt="">
                        </template>
                    </span>
                </div>
                <div class="return_goods_freight">
                    <div>退货金额：<span class="red">￥{{order_price}}</span></div>
                    <div class="return_goods_freight_txt"><span><img class="return_goods_freight_txt_img" src="../image/public_icon_tip01.png" alt=""></span>仅退回实际支付的金额</div>
                </div> 
            </template>
            <div class="return_goods_explain">
                <div class="return_goods_explain_title">退款说明<span class="label">（选填）</span></div>
                <template v-if="refund_reason_show || refund_type_show">
                    <div v-if="refund_info" class="return_goods_explain_textarea">{{refund_info}}</div>
                    <div v-if="!refund_info" class="return_goods_explain_textarea">最多200字</div>
                </template>
                <template v-else>
                    <textarea name="" id="" maxlength="200" class="return_goods_explain_textarea" placeholder="最多200字" v-model="refund_info"></textarea>
                </template>
            </div>
            <div class="return_goods_upload">
                <div class="return_goods_upload_title">上传凭证<span class="label">（最多四张）</span></div>
                <div class="upload_wrap">
                    <div class="upload_image_li"
                    v-for="(item,index) in upload_file"
                    :key="index">
                        <img :src="img_url + '/leyoutest1/' + item.url" mode="scaleToFill" class="upload_image">
                        <icon 
                        type="clear" 
                        size="20" 
                        class="upload_clear_button" 
                        color="#000000"
                        @click="funcDeluploadFile(index)" />
                    </div>
                    <div class="upload_image_button_wrap" @click="funcChooseImgAlbum" v-if="upload_file.length < 4">
                        <img class="upload_image_button_img" src="../image/comment_icon_upload.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="return_goods_concat">
            <div class="return_concat_li">
                <span class="return_concat_label">联系人：</span>
                <input type="text" placeholder="请输入联系人" placeholder-style="color:#999999;" v-model="refund_user_name" class="return_concat_val">
            </div>
            <div class="return_concat_li">
                <span class="return_concat_label">联系电话：</span>
                <input type="text" placeholder="请输入联系电话" placeholder-style="color:#999999;" v-model="refund_mobile" class="return_concat_val">
            </div>
        </div>
        <div class="return_goods_submit"  :class="{iPhone:phonestyleShow}">
        <button class="return_goods_button" type="button"  @click="funcAddRefundApplicationInfo">提交申请</button>
       </div>
        <div class="refund_fixed_dialog" catchtouchmove="true" v-if="refund_reason_show || refund_type_show">
            <!-- 类型 -->
            <div class="refund_wrap" v-if="refund_type_show">
                <div class="refund_wrap_title">
                    退货类型
                    <span class="refund_wrap_close" @click="funcRefundClose"><img class="refund_wrap_close_img" src="../image/public_pop_close.png" ></span>
                </div>
                <div 
                class="refund_wrap_label" 
                :class="{'active': refund_type == item.value}" 
                v-for="(item,i) in refund_type_list"
                :key="i"
                @click="funcRefundTypeSelect(item)">{{item.name}}</div>
            </div>
            <!-- End -->
            <!-- 原因 -->
            <div class="refund_wrap" v-if="refund_reason_show">
                <div class="refund_wrap_title">
                    退货原因
                    <span class="refund_wrap_close" @click="funcRefundClose"><img class="refund_wrap_close_img" src="../image/public_pop_close.png" ></span>
                </div>
                <div 
                class="refund_wrap_label" 
                :class="{'active': refund_reason == item.value}" 
                v-for="(item,idx) in refund_reasons_list"
                :key="idx"
                @click="funcRefundReasonSelect(item)">{{item.name}}</div>
            </div>
            <!-- End -->
        </div>
    </div>
</template>

<script>
import { getOssConfig, addRefundApplicationInfo, queryRefundPrice } from '@/api';
import uploadFile from '@/utils/upload-config';
import { mapState } from 'vuex'
export default {
    data() {
        return {
            source: '',
            refund_type: '',
            refund_type_value: '001',
            refund_type_show: false,
            refund_reason: '',
            refund_reason_value: '',
            refund_reason_show: false,
            refund_number: 1,
            refund_info: '',
            refund_application_images: [],
            upload_file: [],
            refund_mobile: '',
            refund_user_name: '',
            refund_type_list: [],
            refund_reasons_list: [],
            order_skus_num: '',
            refund_price: '',
            refund_default_express_price: '',
            img_url: '',
            phonestyleShow:false,
            order_price: ''
        }
    },
      computed: {
        BASE_IMG_URL() {
            return this.$store.state.BASE_APP_INFO["download_le_image"];
        },
        return_goods(){
            return this.$store.state.return_goods
        }
    },
    onLoad(opts){
        this.sa_page(this,false,'退货申请','');
        Object.assign(this.$data, this.$options.data())
        this.source = opts.source;
        this.phonestyleShow = false;
        let phoneMobile = wx.getStorageSync('phoneMobile'); //判断是否为IPhonex
        if(phoneMobile.model.indexOf('X')>-1 || phoneMobile.model.indexOf('unknown<iPhone11,8>')>-1){
            this.phonestyleShow = true;
        }
        getOssConfig({}).then(res=>{
            this.img_url = res.endpoint;
            wx.setStorageSync('config',res)
        });
    },
    onShow(){
        this.funcQueryRefundPrice();
        this.refund_number = this.return_goods.order_products[0].quantity;
        this.order_price = this.return_goods.order_products[0].sale_price*this.refund_number;
    },
    created(){
    },
    methods: {
        //跳转详情
        funcGoToDetail(item){
            wx.navigateTo({ 
                url: "/pages/goodsdetailed/main?sku=" + item.sku 
            });
        },
        //清算接口
        funcQueryRefundPrice(){
            let query = {
                order_id: this.return_goods.order_products[0].order_id,
                sku: this.source == 'order'?'':this.return_goods.order_products[0].sku,
                quantity: this.source == 'order'?'':1
            }
            queryRefundPrice(query).then( res => {
                this.refund_user_name = res.link_man;
                this.refund_mobile = res.phone;
                this.refund_reasons_list = res.refund_reasons;
                this.refund_type_list = res.refund_types;
                this.order_skus_num = res.quantity;
                this.refund_price = res.refund_price;
                // 这个地方是实际支付运费，不是订单的默认运费
                this.refund_default_express_price = res.express_price;
            })
        },
        //显示选择类型
        funcRefundType(){
            this.refund_type_show = !this.refund_type_show;
        },
        //选择类型
        funcRefundTypeSelect(item){
            this.refund_type_value = item.value;
            this.refund_type = item.name;
            this.funcRefundClose();
        },
        //显示选择原因
        funcRefundReason(){
            this.refund_reason_show = !this.refund_reason_show;
        },
        //选择原因
        funcRefundReasonSelect(item){
            this.refund_reason = item.name;
            this.refund_reason_value = item.value;
            this.funcRefundClose();
        },
        //关闭弹窗
        funcRefundClose(){
            this.refund_type_show = false;
            this.refund_reason_show = false;
        },
        //退货数量-减少
        funcRefundReduce(){
            if( this.refund_number == 1 ){
                this.refund_number = 1
            } else {
                this.refund_number--;
            }
            this.order_price = this.return_goods.order_products[0].sale_price*this.refund_number;
        },
        //退货数量-增加
        funcRefundIncrease(){
            if( this.refund_number >= this.return_goods.order_products[0].quantity ){
                this.refund_number = this.return_goods.order_products[0].quantity
            } else {
                this.refund_number++;
            }
            this.order_price = this.return_goods.order_products[0].sale_price*this.refund_number;
        },
        //上传图片
        funcChooseImgAlbum(){
            let _this = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: [ 'album','camera'],
                success(res) {
                    let config = wx.getStorageSync('config');
                    let file = res.tempFilePaths[0];
                    wx.showLoading({
                        title: '上传中',
                        mask: true
                    });
                    uploadFile(config,{
                        filePath: file,
                        dir:'',
                        success:function (data) {
                            let json = {
                                width: '',
                                url: data,
                                height: ''
                            }
                            _this.upload_file.push(json);
                            wx.hideLoading();
                        },
                        fail:function (data) {

                        }
                    })
                }
            })
        },
        //删除图片
        funcDeluploadFile(index){
            this.upload_file.splice(index,1)
        },
        //提交表单
        funcAddRefundApplicationInfo(){
            debugger
            let query = {
                all_refund: this.source == 'order'?true:false,
                is_online_refund: this.return_goods.can_refund_online,
                order_id: this.return_goods.order_products[0].order_id,
                // link_man: this.return_goods.order_receiver_name,
                link_man: this.refund_user_name,
                phone: this.refund_mobile,
                refund_info: this.refund_info,
                refund_reason: this.refund_reason_value,
                refund_type: this.refund_type_value,
                refund_application_products: this.return_goods.order_products,
                refund_application_images: this.upload_file
            }
            wx.showLoading({
                title: '处理中',
                mask: true
            });
            addRefundApplicationInfo(query).then( res => {
                wx.hideLoading();
                wx.navigateBack({
                    delta: 2
                });
            });
        }
    }
}
</script>

<style scoped>
.return_wrap_scroll {
    display: flex;
}
.return_goods {
    background: #f3f5f7;
}
.return_goods_price {
    padding: 28px;
    display: flex;
    background: #ffffff;
    font-size: 26px;
    color: #333333;
    line-height: 28px;
    justify-content: space-between;
}
.return_goods_img,.return_goods_img_wrap {
    width: 120px;
    height: 120px;
    display: block;
    
}
.return_goods_img_wrap {
    margin-right: 20px;
}
.return_goods_detail {
    padding-left: 20px;
    padding-bottom: 32px;
    margin-bottom: 20px;
    background: #ffffff;
    display: flex;
}
.return_goods_info {
    flex: 1;
}
.return_goods_title {
    font-size: 26px;
    color: #333333;
    line-height: 32px;
}
.return_goods_class {
    padding: 16px 0;
    height: 24px;
}
.return_goods_class,.return_goods_number {
    font-size: 22px;
    line-height: 24px;
    color: #999999;
}
.return_goods_number {
    padding-right: 20px;
    display: flex;
    justify-content: space-between;
}
.return_goods_type {
    background: #ffffff;
    padding-left: 20px; 
}
.return_goods_li {
    border-bottom: #EEEEEE 1px solid;
    line-height: 88px;
    font-size: 26px;
    color: #333333;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.return_goods_type_content {
    padding-right: 20px;
    display: flex;
    align-items: center;
}
.retrun_goods_txt {
    min-width: 100px;
    padding-right: 10px;
}
.retrun_goods_txt.detail {
    color: #999999;
}
.return_goods_arrow {
    width: 13px;
    height: 13px;
    border-top: #666666 1px solid;
    border-right: #666666 1px solid;
    transform: rotate(45deg);
}
.return_goods_conter {
    margin-top: 20px;
    padding-left: 20px;
    background: #ffffff;
}
.return_goods_freight,.return_goods_freight_number {
    border-bottom: #EEEEEE 1px solid;
    line-height: 88px;
    font-size: 26px;
    color: #333333;
}
.return_goods_freight_number {
    display: flex;
    align-items: center;
}
.return_goods_freight .red {
    color: #FF5000;
}
.return_goods_explain {
    padding: 0 20px 30px 0;
    border-bottom: #EEEE 1px solid;
}
.return_goods_explain_title, .return_goods_upload_title {
    padding: 26px 0 24px;
    font-size: 26px;
    color: #333333;
    line-height: 37px;
}
.return_goods_explain_title .label,.return_goods_upload_title label {
    color: #999999;
}
.return_goods_explain_textarea {
    width: 100%;
    height: 160px;
    padding: 17px;
    box-sizing: border-box;
    background: #F3F5F7;
    height: 180px;
    display: block;
    font-size: 22px;
    line-height: 30px;
    color: #333333;
}
.return_goods_concat {
    margin-top: 20px;
    padding-left: 20px;
    background: #ffffff;
}
.return_concat_li {
    display: flex;
    line-height: 88px;
    color: #333333;
    border-bottom: #eeeeee 1px solid;
}
.return_concat_label {
    font-size: 26px;
}
.return_concat_val {
    height: 88px;
    line-height: 88px;
    font-size: 26px;
    flex: 1;
    color: #333333;
}
.return_goods_submit {
    background-color: #ffffff;
    margin-top: 20px;
}

.return_goods_button {
    background: #FF5000;
    text-align: center;
    font-size: 30px;
    line-height: 88px;
    color: #ffffff;
    border-radius: 0;
    border: 0;
    height: 88rpx;
}

.upload_image_li,.upload_image_button_wrap {
    width: 160px;
    height: 160px;
    background: #f3f5f7;
    position: relative;
    margin-right: 24px;
}
.upload_image_button_wrap {
    background: #ffffff;
}
.upload_image_button_img{
    width: 160px;
    height: 160px;
}
.upload_wrap {
    padding-bottom: 20px;
    flex-wrap: wrap;
    display: flex;
}
.upload_clear_button {
    position: absolute;
    right: -15px;
    top: -15px;
}
.upload_image {
    width: 160px;
    height: 160px;
    display: block;
}
.return_goods_freight_txt {
    padding-bottom: 27px;
    font-size: 22px;
    color: #999999;
    line-height: 24px;
    display: flex;
    align-items: center;
}
.return_goods_freight_txt_img {
    width: 24px;
    height: 24px;
    margin-right: 13px;
}
.return_number_reduce,.return_goods_increase {
    background: #F8F8F8;
}
.return_number_img {
    width: 48px;
    height: 48px;
    display: block;
}
.retrun_goods_value {
    width: 68px;
    height: 48px;
    text-align: center;
    line-height: 48px;
    font-weight: 700;
    font-size: 26px;
    color: #333333;
}
.refund_fixed_dialog {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: flex-end;
    z-index: 999;
}
.refund_wrap {
    width: 100%;
    height: 600px;
    background: #ffffff;
}
.refund_wrap_label {
    margin-left: 20px;
    border-bottom: #EEEEEE 1px solid;
    line-height: 81px;
    font-size: 26px;
    color: #333333;
}
.refund_wrap_label.active {
    color: #FF5000;
}
.refund_wrap_title {
    text-align: center;
    line-height: 88px;
    color: #333333;
    font-size: 30px;
    position: relative;
}
.refund_wrap_close {
    padding: 10px;
    position: absolute;
    right: 17px;
    top: 20px;
}
.refund_wrap_close_img {
    width: 29px;
    height: 29px;
    display: block;
}

.return_goods_submit.iPhone {
    height: 156rpx;
}

</style>