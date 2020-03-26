<template>
    <div class="barCode" >
        <img class="bg-img" mode="widthFix	" src="../image/barcode_bg.png" alt="">
        <div class="barCode-content">
            <p class="title">
                请将条形码出示给门店人员完成验证
            </p>
            <div>
                <p class="noCode" v-if="!code">小主，条码被顽皮的友友弄丢了^_^</p>
                <canvas class="canvas" canvas-id="barcode" />
                <p class="code">{{code}}</p>
            </div>
            <!-- <p class="tip">
                如条形码失效，请检查网络后<span class="reGet" @click="codeCreated()">重新获取</span>
            </p> -->
        </div>
    </div>
</template>
<!--服务器时间（MMddHHmm）+截取11位token-->
<!--例如：0710027700111111111-->

<!--偶数坐标和基数坐标互换位置（坐标从0开始）-->

<!--换位后中间位置不变 前9换后9-->

<!--前三个和后三个-->

<!--第四个换第十四个-->

<!--第五个换第十三个-->

<!--解密 第五个换第十三个-->
<!--第四个换第十四个-->
<!--前三个和后三个-->
<!--换位后中间位置不变 前9换后9-->
<!--偶数坐标和基数坐标互换位置（坐标从0开始）-->
<script>
    import {creatBarcode} from "@/utils";
    import {getAppInfo} from "@/api";

    export default {
        name: "index",
        onLoad(){
            this.sa_page(this,false,'会员码','');
           this.codeCreated()
        },
        onShow(){
            this.codeCreated()

        },
        data(){
            return{
                code:'',
                height:wx.getStorageSync('screenHeight')
            }
        },
        methods:{
            codeCreated(){
                wx.showLoading({
                    title:'加载中'
                })
                getAppInfo({}).then(res=>{
                    console.log(res,'获取的会员码')
                    wx.hideLoading()
                    var date = new Date(parseInt(wx.getStorageSync('time')))
                    var year =date.getFullYear()
                    var day = date.getDate()
                    var moth = date.getMonth()+1
                    var h= date.getHours()
                    var m= date.getMinutes()
                    var str1 =`${moth<10?'0'+moth:moth}${day<10?'0'+day:day}${h<10?'0'+h:h}${m<10?'0'+m:m}`
                    console.log(wx.getStorageSync('userInfo').user_id,'dddd')
                    var str2 =wx.getStorageSync('userInfo').user_id.toString().substring(0,11)
                    var l = str2.length
                    if(l<11){
                        for (var i=0;i<11-l;i++){
                            str2='0'+str2
                        }
                    }
                    var code =str1+str2
                    console.log(code,'aaa')
                    var arr =code.split('')
                    for (var i=0;i<arr.length;i++){
                        if(i%2==1){
                            var s =arr[i]
                            arr[i]=arr[i-1]
                            arr[i-1]=s
                        }
                    }
                    for (var i=0;i<arr.length;i++){
                        if(i<9){
                            var s =arr[i]
                            arr[i]=arr[i+10]
                            arr[i+10]=s
                        }
                    }
                    for (var i=0;i<arr.length;i++){
                        if(i<3){
                            var s =arr[i]
                            arr[i]=arr[i+16]
                            arr[i+16]=s
                        }
                    }
                    var n= arr[3]
                    arr[3]=arr[13]
                    arr[13]=n
                    var bn= arr[4]
                    arr[4]=arr[12]
                    arr[12]=bn

                    code=arr.toString().replace(/\,/g,'')
                    this.code=code.substr(0,2) + "******" + code.substr(code.length-2)
                    creatBarcode('barcode',code,590,168)
                })

            }
        }
    }
</script>

<style scoped>

    .noCode{
        font-size: 28rpx;
        color: #999;
        text-align: center;
        width: 100%;
        position: absolute;
        top: 250rpx;
        z-index: 999;
    }
    .tip{
        font-size: 30rpx;
        text-align: center;
        position: absolute;
        bottom: 40rpx;
        width: 100%;
    }
    .reGet{
        color: #ff9600;
    }
    .code{
        text-align: center;
        font-size: 30rpx;
    }
    .canvas{
        margin:50rpx auto ;
        background: #e9eaf1;
        width: 590rpx;
        height: 170rpx;
    }
    .title{
        height: 100rpx;
        line-height: 100rpx;
        background: #f6f6f6;
        color: #999;
        text-align: center;
        font-size: 28rpx;
    }
    .barCode-content{
        position: absolute;
        height: 560rpx;
        width: 670rpx;
        background: #fff;
        border-radius: 16rpx;
        overflow: hidden;
        top: 80rpx;
        left: 40rpx;
    }
    .bg-img{
        height: 100%;
        width: 100%;
    }
    .barCode{
        position: fixed;
        height: 100%;
        width: 100%;
    }
</style>
<!--/**-->
<!--对二维码进行一定的规则加密-->

<!--@param str 二维码-->
<!--@return 加密后的二维码-->
<!--*/-->
<!--+ (NSString *)encodeScanCodeWithString:(NSString *)str {-->
<!--if (str.length != 19 || !str) {-->
<!--return nil;-->
<!--}-->

<!--const char *scanCode = [str cStringUsingEncoding:NSASCIIStringEncoding];-->
<!--char charScanCode[str.length];-->
<!--strcpy(charScanCode, scanCode);-->
<!--for (int i = 0; i < str.length; i ++) {-->
<!--if (i % 2 == 1) {-->
<!--char charStr = charScanCode[i];-->
<!--charScanCode[i] = charScanCode[i - 1];-->
<!--charScanCode[i - 1] = charStr;-->
<!--}-->
<!--}-->

<!--for (int i = 0; i < str.length; i ++) {-->
<!--if (i < 9) {-->
<!--char charStr = charScanCode[i];-->
<!--charScanCode[i] = charScanCode[i + 10];-->
<!--charScanCode[i + 10] = charStr;-->
<!--} else {-->
<!--break;-->
<!--}-->
<!--}-->

<!--for (int i = 0; i < str.length; i ++) {-->
<!--if (i < 3) {-->
<!--char charStr = charScanCode[i];-->
<!--charScanCode[i] = charScanCode[i + 16];-->
<!--charScanCode[i + 16] = charStr;-->
<!--} else {-->
<!--break;-->
<!--}-->
<!--}-->

<!--char charStr1 = charScanCode[3];-->
<!--charScanCode[3] = charScanCode[13];-->
<!--charScanCode[13] = charStr1;-->

<!--char charStr2 = charScanCode[4];-->
<!--charScanCode[4] = charScanCode[12];-->
<!--charScanCode[12] = charStr2;-->

<!--NSString *encodeScanCode = [NSString stringWithCString:charScanCode encoding:NSASCIIStringEncoding];-->
<!--return encodeScanCode;-->
<!--}-->


<!--/**-->
<!--对二维码进行一定规则的解密-->

<!--@param str 二维码-->
<!--@return 解密后的二维码-->
<!--*/-->
<!--+ (NSString *)decodeScanCodeWithString:(NSString *)str {-->
<!--if (str.length != 19 || !str) {-->
<!--return nil;-->
<!--}-->

<!--const char *scanCode = [str cStringUsingEncoding:NSASCIIStringEncoding];-->
<!--char charScanCode[str.length];-->
<!--strcpy(charScanCode, scanCode);-->

<!--char charStr1 = charScanCode[4];-->
<!--charScanCode[4] = charScanCode[12];-->
<!--charScanCode[12] = charStr1;-->

<!--char charStr2 = charScanCode[3];-->
<!--charScanCode[3] = charScanCode[13];-->
<!--charScanCode[13] = charStr2;-->

<!--for (int i = 0; i < str.length; i ++) {-->
<!--if (i < 3) {-->
<!--char charStr = charScanCode[i];-->
<!--charScanCode[i] = charScanCode[i + 16];-->
<!--charScanCode[i + 16] = charStr;-->
<!--} else {-->
<!--break;-->
<!--}-->
<!--}-->

<!--for (int i = 0; i < str.length; i ++) {-->
<!--if (i < 9) {-->
<!--char charStr = charScanCode[i];-->
<!--charScanCode[i] = charScanCode[i + 10];-->
<!--charScanCode[i + 10] = charStr;-->
<!--} else {-->
<!--break;-->
<!--}-->
<!--}-->

<!--for (int i = 0; i < str.length; i ++) {-->
<!--if (i % 2 == 1) {-->
<!--char charStr = charScanCode[i];-->
<!--charScanCode[i] = charScanCode[i - 1];-->
<!--charScanCode[i - 1] = charStr;-->
<!--}-->
<!--}-->

<!--NSString *decodeScanCode = [NSString stringWithCString:charScanCode encoding:NSASCIIStringEncoding];-->
<!--return decodeScanCode;-->
<!--}-->
