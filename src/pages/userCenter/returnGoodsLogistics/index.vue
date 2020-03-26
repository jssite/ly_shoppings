<template>
    <div class="return_goods">
        <div class="return_goods_top" v-for="(item,index) in service_logistics.products" :key="index">
            <div class="return_goods_price">
                <span v-if="service_logistics.products.order_id">订单号：{{service_logistics.products.order_id}}</span>
                <span v-else-if="service_logistics.order_id">订单号：{{service_logistics.order_id}}</span>
            </div>
            <div class="return_goods_detail">
                <div class="return_goods_img_wrap">
                    <img :src="item.url" class="return_goods_img">
                </div>
                <div class="return_goods_info">
                    <div class="return_goods_title">{{item.prod_title}}</div>
                    <!-- <div class="return_goods_class">颜色：粉色  尺码：90</div> -->
                    <div class="return_goods_number">
                        <span>数量：×{{item.quantity}}</span>
                        <span v-if="service_logistics.products.refund_price">订单金额：￥{{service_logistics.products.refund_price}}</span>
                        <span v-else-if="service_logistics.refund_price">订单金额：{{service_logistics.refund_price}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="return_goods_conter">
            <div class="return_goods_li">
                <span class="return_goods_label">快递公司</span>
                <div class="return_goods_type_content" @click="funcGoToLogistics">
                    <template v-if="logistics_name == ''">
                        <div class="retrun_goods_txt normal">请选择</div>
                    </template>
                    <template v-else>
                       <div class="retrun_goods_txt">{{logistics_name}}</div>
                    </template>
                    <div class="return_goods_arrow"></div>
                </div>
            </div>
            <div class="return_goods_freight_number">
                <span>快递单号：</span>
                <div class="goods_freight_number_wrap">
                    <input type="text" class="return_number_order" v-model="logistics_numbers" placeholder="请填写快递单号">
                    <span class="return_goods_code" @click="funcScanOrderNumber"><img class="return_goods_code_img" src="../image/order_return_scan.png" alt=""></span>
                </div>
            </div>
            <div class="return_goods_freight">
                <div class="goods_freight_price">
                    <span>运&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费：</span>
                    <input type="text" class="goods_freight_input" v-model="logistics_price" placeholder="请输入运费金额（元）">
                </div>
                <div class="return_goods_freight_txt"><span><img class="return_goods_freight_txt_img" src="../image/public_icon_tip01.png" alt=""></span>运费请先垫付，退款成功后，打入您的账户余额</div>
            </div>
            <div class="return_goods_upload">
                <div class="return_goods_upload_title">上传凭证<span class="label">（最多1张）</span></div>
                <div class="upload_wrap">
                    <div class="upload_image_li"
                    v-for="(item,index) in upload_file"
                    :key="index">
                        <img :src="'http://oss-cn-beijing.aliyuncs.com/leyoutest1/' + item" mode="scaleToFill" class="upload_image">
                        <icon 
                        type="clear" 
                        size="20" 
                        class="upload_clear_button" 
                        color="#000000"
                        @click="funcDeluploadFile(index)" />
                    </div>
                    <div class="upload_image_button_wrap" @click="funcChooseImgAlbum" v-if="upload_file.length < 1">
                        <img class="upload_image_button_img" src="../image/comment_icon_upload.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        <button class="return_goods_submit" type="button" @click="funcSubmitForm">确认提交</button>
    </div>
</template>

<script>
import { addGoodsReturnedNote, getOssConfig } from '@/api';
import uploadFile from '@/utils/upload-config'
import { mapState, mapMutations } from 'vuex';
export default {
    data() {
        return {
            logistics_numbers: '',
            logistics_price: '',
            upload_file: []
        }
    },
    onLoad(){
        //获取阿里云配置
        this.sa_page(this,false,'填写快递信息','');
        getOssConfig({}).then(res=>{
            wx.setStorageSync('config',res)
        });
        this.$store.commit('logisticsMutations','')
        Object.assign(this.$data, this.$options.data());
    },
    onShow(){
        console.log(this.service_logistics);
    },
    computed: mapState(['logistics_name','service_logistics']),
    methods: {
        //跳转物流列表
        funcGoToLogistics(){
            wx.navigateTo({
                url: '/pages/userCenter/logistics/main'
            })
        },
        //上传图片
        funcChooseImgAlbum(){
            let _this = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: [ 'album','camera'],
                success(res) {
                    wx.showLoading({
                        title: '上传中',
                        mask: true
                    });
                    uploadFile(
                        wx.getStorageSync('config'),{
                        filePath:res.tempFilePaths[0],
                        dir:'',
                        success:function (data) {
                            console.log(1);
                            console.log(data);
                            _this.upload_file.push(data);
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
        //扫描条形码
        funcScanOrderNumber(){
            let _this = this;
            wx.scanCode({
                scanType: ['barCode','qrCode','datamatrix','pdf417'],
                success(res) {
                    let { result, errMsg } = res;
                    if( errMsg == 'scanCode:ok' ){
                        _this.logistics_numbers = result
                    }
                }
            });
        },
        //提交订单
        funcSubmitForm(){
            if( this.logistics_name == '' ){
                wx.showToast({
                    title: '快递公司不能为空',
                    icon: 'none'
                });
                return false;
            }
            if( this.logistics_numbers == '' ){
                wx.showToast({
                    title: '快递单号不能为空',
                    icon: 'none'
                });
                return false;
            }
            if( this.logistics_price == '' ){
                wx.showToast({
                    title: '运费不能为空',
                    icon: 'none'
                });
                return false;
            }
            let query = {
                refund_id: this.service_logistics.refund_id,
                express_company: this.logistics_name,
                express_number: this.logistics_numbers,
                express_price: this.logistics_price,
                express_image: this.upload_file
            }
            addGoodsReturnedNote(query).then( res => {
                wx.navigateBack({
                    delta:1
                })
            });
        }
    }
}
</script>

<style scoped>
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
    
}
.return_goods_img_wrap {
    margin-right: 20px;
    margin-left: 20px;
}
.return_goods_detail {
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
}
.return_goods_class,.return_goods_number {
    margin-top: 26rpx;
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
.retrun_goods_txt.normal{
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
.return_concat_val {
    height: 88px;
    line-height: 88px;
    font-size: 26px;
    flex: 1;
    color: #333333;
}
.return_goods_submit {
    width: 100%;
    color: #ffffff;
    background: #FF5000;
    text-align: center;
    font-size: 30px;
    line-height: 88px;
    margin-top: 20px;
    border-radius: 0;
    border: 0;
    position: fixed;
    left: 0;
    bottom: 0;
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
    z-index: 18;
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
.retrun_goods_value {
    width: 68px;
    height: 48px;
    text-align: center;
    line-height: 48px;
    font-weight: 700;
    font-size: 26px;
    color: #333333;
}
.return_goods_upload_title {
    padding: 26px 0 24px;
    font-size: 26px;
    color: #333333;
    line-height: 37px;
}
.return_goods_upload_title label {
    color: #999999;
}
.return_goods_code_img {
    width: 36px;
    height: 32px;
    display: block;
}
.goods_freight_input,.return_number_order {
    width: 400px;
    color: #333333;
    font-size: 26px;
    height: 88px;
    line-height: 88px;
}
.goods_freight_price {
    display: flex;
}
.goods_freight_number_wrap {
    padding-right: 20px;
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
}
</style>