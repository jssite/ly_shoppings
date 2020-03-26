<template>
    <div class="user_invoice">
         <form  @submit="formSubmit" report-submit bindreset="formReset">
            
            <div class="user_invoice_top">
                <div class="user_invoice_icon"><img src="../../../../../static/images/public/public_icon_tip02.png" class="user_invoice_icon_img" alt=""></div>
                <span>请准确填写“纳税人识别号”，以免影响您的发票报销</span>
            </div>
            <div class="user_invoice_ul">
                <div class="user_invoice_li">
                    <span class="user_invoice_label">公司名称</span>
                    <input type="text" class="user_invoice_input" :value="companyname" name="companyname" placeholder="请输入公司名称" placeholder-style="color:#CACACA;">
                </div>
                <div class="user_invoice_li">
                    <span class="user_invoice_label">纳税人识别号</span>
                    <input type="number" class="user_invoice_input"  :value="companyNum" name="companyNum"    placeholder="请输入纳税人识别号" placeholder-style="color:#CACACA;">
                </div>
                <div class="user_invoice_li">
                    <span class="user_invoice_label">注册电话</span>
                    <input type="number" class="user_invoice_input"  :value="companyPhone" name="companyPhone" placeholder="非必填" placeholder-style="color:#CACACA;">
                </div>
                <div class="user_invoice_li">
                    <span class="user_invoice_label">注册地址</span>
                    <input type="text" class="user_invoice_input"  :value="companyAddress" name="companyAddress" placeholder="非必填" placeholder-style="color:#CACACA;">
                </div>
                <div class="user_invoice_li">
                    <span class="user_invoice_label">开户银行</span>
                    <input type="text" class="user_invoice_input" :value="companybank" name="companybank" placeholder="非必填" placeholder-style="color:#CACACA;">
                </div>
                <div class="user_invoice_li">
                    <span class="user_invoice_label">银行账号</span>
                    <input type="number" class="user_invoice_input" :value="companybankNum" name="companybankNum" placeholder="非必填" placeholder-style="color:#CACACA;">
                </div>
            </div>
             <button class="user_invoice_submit"  form-type="submit" data-type="click">保存</button>
        </form>
        <!-- <div class="user_invoice_submit">保存</div> -->
    </div>
</template>

<script>
import { reviseInvoice } from '@/api'
import { isEmpty ,ischaracter} from "@/utils/index"
    export default {
        data(){
            return{
                companyname:null,
                companyNum:null,
                companyPhone:null,
                companyAddress:null,
                companybank:null,
                companybankNum:null
            }
        },
        onLoad(options){
            this.sa_page(this,false,'添加发票','');
            console.log(options,'ddddddd');
            if(options){
                this.companyname = options.invoice_title;
                this.companyNum  = options.invoice_num;
                this.companyPhone = options.invoice_telephone;
                this.companyAddress = options.invoice_address;
                this.companybank = options.invoice_bank;
                this.companybankNum = options.invoice_bank_account;
                this.invoice_id = options.invoice_id;
            }
        },
        methods:{
    
            formSubmit(e){
                let companyname = e.mp.detail.value.companyname;
                let companyNum = e.mp.detail.value.companyNum;
                let companyPhone = e.mp.detail.value.companyPhone;
                let companyAddress = e.mp.detail.value.companyAddress;
                let companybank = e.mp.detail.value.companybank;
                let companybankNum = e.mp.detail.value.companybankNum;
                if(isEmpty(companyname)){
                    wx.showToast({ title: "请填写公司名称", icon: 'none' });return;
                }else if(isEmpty(companyNum)){
                    wx.showToast({ title: "请填写纳税人编号", icon: 'none' });return;
                }
                wx.showLoading({
                    title: '加载中',
                })
                let params ={
                    invoice_title:companyname,
                    invoice_num:companyNum,
                    invoice_telephone:companyPhone,
                    invoice_address:companyAddress,
                    invoice_bank:companybank,
                    invoice_bank_account:companybankNum
                }
                if(this.invoice_id){
                    params.invoice_id = this.invoice_id;
                }
                console.log(params,'传入的参数')
                reviseInvoice(params).then(res=>{
                    wx.hideLoading();
                    console.log(res);
                    wx.showToast({
                        title:'保存成功',
                        icon:'none'
                    })
                    wx.navigateBack({
                        delta: 1
                    })
                })
            }
        }
    }
</script>

<style scoped>
.user_invoice_top {
    height: 80px;
    display: flex;
    padding: 0 0 0 20px;
    margin-bottom: 20px;
    color: #FAB400;
    font-size: 26px;
    align-items: center;
    line-height: 80px;
    background: #ffffff;
}
.user_invoice_icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
}
.user_invoice_icon_img {
    width: 30px;
    height: 30px;
    display: block;
}
.user_invoice {
    min-height: 100vh;
    background: #f3f5f7;
}
.user_invoice_ul {
    padding-left: 20px;
    background: #ffffff;
}
.user_invoice_li {
    height: 100px;
    display: flex;
    font-size: 30px;
    color: #333333;
    line-height: 100px;
    border-bottom: #EEEEEE 1px solid;
    align-items: center;
}
.user_invoice_label {
    margin-right: 40px;
    
}
.user_invoice_input {
    height: 100px;
    line-height: 100px;
    color: #333333;
}
.user_invoice_submit {
    margin: 60px 20px 0;
    height: 80px;
    border-radius: 40px;
    color: #ffffff;
    background: #FF5000;
    font-size: 30px;
    line-height: 80px;
    text-align: center;
}
</style>