<template>
    <div class="user_invoice">
        <template v-if="invoiceList.length>0">
            <div class="user_invoice_ul">
                <div class="user_invoice_li" v-for="(item,index) in  invoiceList " :key="index">
                    <div class="user_invoice_name">{{item.invoice_title}}</div>
                    <div class="user_invoice_info" v-if="item.invoice_num">
                        <span class="user_invoice_label">纳税人识别号：</span>
                        <div class="user_invoice_txt">{{item.invoice_num}}</div>
                    </div>
                    <div class="user_invoice_info" v-if="item.invoice_telephone">
                        <span class="user_invoice_label">注册电话：</span>
                        <div class="user_invoice_txt">{{item.invoice_telephone}}</div>
                    </div>
                    <div class="user_invoice_info" v-if='item.invoice_address'>
                        <span class="user_invoice_label">注册地址：</span>
                        <div class="user_invoice_txt">{{item.invoice_address}}</div>
                    </div>
                    <div class="user_invoice_info" v-if="item.invoice_content">
                        <span class="user_invoice_label">开户银行：</span>
                        <div class="user_invoice_txt">{{item.invoice_content}}</div>
                    </div>
                    <div class="user_invoice_info" v-if="item.invoice_bank_account">
                        <span class="user_invoice_label">银行账号：</span>
                        <div class="user_invoice_txt">{{item.invoice_bank_account}}</div>
                    </div>
                    <div class="user_invoice_handle">
                        <div class="user_handle_wrap" @click = "funreviser(item)" >
                            <div class="user_handle_icon">
                                <img src="../../../../../static/images/userCenter/set_icon_eidt.png" class="user_handle_img">
                            </div>
                            <span class="user_handle_txt">编辑</span>
                        </div>
                        <div class="user_handle_wrap" @click= "funcInvoiceDel(item.invoice_id)">
                            <div class="user_handle_icon">
                                <img src="../../../../../static/images/userCenter/set_icon_eidt2.png" class="user_handle_img">
                            </div>
                            <span class="user_handle_txt">删除</span>
                        </div>
                    </div>
                </div>
            </div>
            <navigator :class="{iPhone:phonestyleShow}" url="/pages/userCenter/invoice/add/main" class="user_invoice_link" hover-class="none">
                <button type="button" class="user_invoice_add">添加开票公司</button>
            </navigator>
        </template>
          <template v-else>   
            <div>
                <div class="placeholder">
                    <img src="/static/images/public/public_empty_pic.png" alt="">
                    <text>您还没有开票公司哦</text>
                    <navigator class="nav" url="/pages/userCenter/invoice/add/main" >添加开票公司</navigator>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import  { getInvoice ,reviseInvoice  ,deleteInvoice} from '@/api'
export default {
    data() {
        return {
            invoiceList:[],  //接受数据
            key: 'value',
            phonestyleShow:false,
        }
    },

    onLoad(){
        this.sa_page(this,false,'发票列表','');
        let phoneMobile = wx.getStorageSync('phoneMobile'); //判断是否为IPhonex
        console.log(phoneMobile);
        if(phoneMobile.model.indexOf('X')>-1 || phoneMobile.model.indexOf('unknown<iPhone11,8>')>-1){
            this.phonestyleShow = true;
        }
    },


    onShow(){
        this.funinvice()
    },
    methods: {
         /**
         *  获取发票列表
         */
        funinvice(){
            getInvoice({invoice_list:[]}).then(res=>{  //获取列表
                this.invoiceList= res.invoice_list;
            })
        },
        funreviser(msg){
            console.log(msg,'dddd');
            let params = Object.keys(msg).map(res=>{
                 return `&${res}=${msg[res]}`
            })
            wx.navigateTo({url:'../../invoice/add/main?'+params.join('')})
        },

        /**
         * 删除发票
         */
        funcInvoiceDel(invoiceid){
            let that = this;
            wx.showModal({
                content: '确认删除此发票吗？',
                confirmColor:'#ff5000',
                success(res){
                    if (res.confirm) {
                        deleteInvoice({invoice_id:invoiceid}).then(res=>{
                            that.funinvice();
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.user_invoice {
    min-height: 2000rpx;
    background: #f3f5f7;

}
.user_invoice_name {
    padding: 28px 20px 23px 0;
    font-size: 30px;
    color: #333333;
}
.user_invoice_ul {
    padding-bottom: 120px;
}
.user_invoice_li {
    margin-bottom: 20px;
    padding-left: 20px;
    background: #ffffff;
}
.user_invoice_info {
    padding: 0 20px 23px 0;
    display: flex;
    font-size: 26px;
    line-height: 38px;
    color: #666666;
}
.user_invoice_label {
    white-space: nowrap;
}
.user_invoice_handle {
    padding-right: 20px;
    justify-content: flex-end;
    display: flex;
    border-top: #EEEEEE 1px solid;
    color: #333333;
    font-size: 26px;
    line-height: 88px;
}
.user_handle_wrap {
    margin-left: 60px;
    display: flex;
    align-items: center;
}
.user_handle_icon {
    width: 34px;
    height: 34px;
    margin-right: 13px;
}
.user_handle_img {
    width: 34px;
    height: 34px;
    display: block;
}
.user_invoice_link {
    width: 100%;
    padding: 28px 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: #f3f5f7;
}
.user_invoice_add {
    width: 710px;
    height: 80px;
    background: #FF5000;
    color: #ffffff;
    font-size: 30px;
    text-align: center;
    border-radius: 40px;
    line-height: 80rpx;
    font-weight: 700;
}
.placeholder{
    display: flex;
    align-items: center;
    flex-direction: column;
}
.placeholder image{
    width: 250rpx;
    height: 210rpx;
    margin-top:240rpx;

}
.placeholder text{
    font-family: PingFangSC-Regular;
    font-size: 26px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    margin:40rpx 0rpx 60rpx 0rpx;
}
.nav{
    background: #FF5000;
    border: 1px solid #FF5000;
    border-radius: 40px;
    height: 72rpx;
    width: 240rpx;
    line-height: 72rpx;
    font-size: 30px;
    color: #FFFFFF;
    text-align: center;
}

.iPhone {
    bottom: 68rpx;
}
</style>