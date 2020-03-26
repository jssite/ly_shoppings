<template>
    <div class="components-content" @click.stop="close" catchtouchmove='true'>
        <div v-if="!shareCanvas" class="bottom-share" @click.stop>
            <p class="share-title">分享给好友</p>
            <image class="close" @click.stop="close" src="/static/images/public_pop_close.png"></image>
            <div class="share-content">
                <div class="content-list" v-if="type!=1">
                    <shareButton class="shareHw" type=2 fore-color='#333'  :product="product" bind:error="on_error"/>
                    <img class="shareImg" src="../../pages/cutprice/images/kan_share_rec.png" alt="">
                    <p>推荐到好物圈</p>
                </div>
                <div class="content-list" @click.stop>
                    <button class="shareBtn" open-type='share' data-type="1">
                        <img class="shareImg" src="../../pages/cutprice/images/kan_share_wechat.png" alt="">
                    </button>
                    <p class="shareWechat">微信好友</p>
                </div>
                <div  class="content-list" @click.stop="draw">
                    <img class="shareImg" src="../../pages/cutprice/images/kan_share_pic.png" alt="">
                    <p>图文分享</p>
                </div>
            </div>
            <!--<p class="share-tip">好物推荐，和大家一起分享你发现的好物</p>-->
        </div>
        <div v-if="shareCanvas"  @click.stop>
            <canvas  canvas-id="firstCanvas" id="myCan"></canvas>
            <div class="subPhoto" @click="holdposter">保存海报</div>
        </div>

    </div>
</template>

<script>
    import {
        cutDetail,
        getQrcode,
    } from '@/api'
    export default {
        name: "drawPost",
        props:{
            cut_id:54,
            baseData:{},
            type:"",
            product:{
                item_code:'123',
                title:'',
                desc:'',
                category_list:'',
                image_list:'',
                src_mini_program_path:'',
            }
        },
        data(){
            return{
                msg:{
                    text:"呼朋唤友来乐砍价，好货一起搬回家！",
               },
                type:0,
                postMsg:{},
                baseData:"",
                shareCanvas:false
            }
        },
        methods:{
            holdposter(){ //保存图片
                console.log(123)
                let that = this;
                var scale =wx.getStorageSync('phoneMobile').screenWidth/375
                that.tempPoster(that, 'firstCanvas', 750*scale, 900*scale, 750, 900);
                wx.getSetting({
                    success(res) {
                        if (!res.authSetting['scope.writePhotosAlbum']) {
                            wx.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success() {//这里是用户同意授权后的回调
                                    wx.showToast({
                                        title: '保存中...',
                                        icon: 'none'
                                    })
                                    that.save(that);
                                },
                                fail() {//这里是用户拒绝授权后的回调
                                    wx.showToast({
                                        title: '授权后才能保存至手机相册',
                                        icon: 'none'
                                    })
                                    that.setData({
                                        btnShow: 'authorize'
                                    })
                                    return
                                }
                            })
                        } else {//用户已经授权
                            wx.showToast({
                                title: '保存中...',
                                icon: 'none'
                            })
                            that.save(that);
                        }
                    }
                })
            },
            save(obj){//保存图片到相册
                let that = obj;
                if (!that.canvasUrl) {
                    return;
                }
                wx.saveImageToPhotosAlbum({
                    filePath: that.canvasUrl,
                    success(res) {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'none'
                        })
                        that.giveposter= false;
                        that.$emit('closeShare')
                    }
                })

            },

            //缓存成图片
            tempPoster(obj,id,width,height,destWidth,destHeight){
                let that=obj;
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    destWidth: destWidth,
                    destHeight: destHeight,
                    fileType: 'jpg',
                    canvasId: id,
                    success: function (res) {
                        that.canvasUrl = res.tempFilePath;
                        that.giveposter = true;  //海报页面
                        wx.hideLoading();
                    }
                })
            },
            close(){
                this.$emit('closeShare')
            },
            shareP(){

            },
            roundedRect(ctx, x, y, width, height, radius) {
                ctx.strokeStyle = "#fff";
                ctx.beginPath();
                ctx.moveTo(x, y + radius);
                ctx.lineTo(x, y + height - radius);
                ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
                ctx.lineTo(x + width - radius, y + height);
                ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
                ctx.lineTo(x + width, y + radius);
                ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
                ctx.lineTo(x + radius, y);
                ctx.quadraticCurveTo(x, y, x, y + radius);
                ctx.stroke();
            },
            cutText(attr,num){
                var result = []
                for(var i=0;i<attr.length/num;i++){
                    result.push(attr.substring(num*i,num*(i+1)))
                }
                console.log(result)
                return result
            },
            drawPost(){
                this.shareCanvas=true
                var _this =this
                var scale =wx.getStorageSync('phoneMobile').screenWidth/375
                var context = wx.createCanvasContext('firstCanvas')
                context.setFillStyle('#fff');
                context.fillRect(0, 0, 375*scale, 900*scale);//设置白色背景
                context.save()
                context.font=`${14*scale}px Arial`;
                let w = context.measureText(_this.msg.text).width;
                context.setFontSize(14*scale);
                context.setFillStyle('#333333');
                context.fillText(_this.msg.text , (375*scale  - w)/2 , 30*scale );//绘制店铺名
                let attr = _this.cutText(_this.postMsg.name,12)
                context.setFontSize(13*scale);
                context.setFillStyle('#333333');
                context.drawImage('/static/images/public/kan_share_logo_20year.png', 155* scale,40*scale, 75 * scale, 22 * scale);//绘制海报
                attr.map((item,n)=>{
                    context.fillText(item , 60*scale, (345+n*15)*scale );//绘制店铺名
                })
                context.fillText(wx.getStorageSync('userinfo').nick_name, 100*scale ,(345+attr.length*15+15)*scale );//绘制店铺名
                context.draw()
                context.save()
                if(_this.postMsg.avatar.indexOf('http')<=-1){
                    context.drawImage(_this.postMsg.avatar, 62.5* scale,(340+attr.length*15) * scale, 30 * scale, 30 * scale);//绘制海报
                    context.draw(true)
                }else{
                    wx.downloadFile({
                        url: _this.postMsg.avatar,
                        success: function (res) {
                            context.drawImage(res.tempFilePath.avatar, 62.5* scale,(340+attr.length*15) * scale, 30 * scale, 30 * scale);//绘制海报
                            context.draw(true)

                        },
                        fail:function (err) {
                            wx.showTosat({
                                title:err,
                                icon:none
                            })
                        }
                    })
                }
                var img_url = _this.postMsg.img_url.replace('http','https')
                wx.downloadFile({
                    url: img_url,
                    success: function (res) {
                        // context.restore()
                        // context.beginPath();
                        // _this.roundedRect(context, 62.5* scale, 73.5 * scale, 250 * scale, 250 * scale, 15 * scale);
                        // context.clip();  // 通过裁剪得到圆角矩形
                        context.drawImage(res.tempFilePath, 62.5* scale, 73.5 * scale, 250 * scale, 250 * scale);//绘制海报
                        _this.roundRectColor(context,75*scale, 285*scale, 118*scale, 28*scale, 28*scale);
                        context.drawImage('/static/images/public/kan_share_icon.png', 79*scale, 290*scale, 17 * scale, 17 * scale);//绘制海报
                        context.setFontSize(11*scale);
                        context.setFillStyle('#ffffff');
                        context.fillText('底价' , 100*scale, 305*scale );
                        context.setFontSize(11*scale);
                        context.fillText('￥' , 121*scale, 305*scale );
                        context.setFontSize(17*scale);
                        context.fillText(_this.postMsg.price, 131*scale, 305*scale );
                        context.draw(true)
                        wx.hideLoading()
                    }
                })
                var qrcode_url = _this.postMsg.qrcode_url.replace('http','https')
                wx.downloadFile({
                    url: qrcode_url,
                    success: function (res) {
                        // context.restore()
                        context.drawImage(res.tempFilePath,  242.5* scale, 335.5 * scale, 70 * scale, 70 * scale);//绘制海报
                        context.draw(true)
                    }
                })
            },
            roundRectColor(context, x, y, w, h, r) {  //绘制圆角矩形（纯色填充）
                context.save();
                context.setFillStyle("#FF0000");
                context.setStrokeStyle('#FF0000')
                context.setLineJoin('round');  //交点设置成圆角
                context.setLineWidth(r);
                context.strokeRect(x + r/2, y + r/2, w - r , h - r );
                context.fillRect(x + r, y + r, w - r * 2, h - r * 2);
                context.stroke();
                context.closePath();
            },
            draw(){
                    wx.showLoading({
                        title:'加载中',
                        icon:'none'
                    })
                    cutDetail({cut_id:this.cut_id}).then(res=>{
                    this.baseData=res
                    this.baseData.avatar = this.baseData.avatar ==''?'/static/goodsdetail/default_pic_user.png':this.baseData.avatar.indexOf('gif')>-1?'/static/goodsdetail/default_pic_user.png':res.avatar
                    this.postMsg.img_url=this.baseData.sku.img_url
                    this.postMsg.name=this.baseData.sku.name
                    this.postMsg.price=this.baseData.sku.base_price
                    this.postMsg.avatar=this.baseData.avatar
                    getQrcode({cut_id:this.cut_id}).then(data=>{
                            this.postMsg.qrcode_url=data.qrcode_url
                            this.drawPost()
                        })
                    })
            }
        }
    }
</script>

<style scoped>
    .close{
        height: 50rpx;
        width: 50rpx;
        position: absolute;
        right: 30rpx;
        top: 30rpx;
    }
    .shareWechat{
        padding-top: 8rpx;
    }
    .shareBtn{
        height:88rpx;
        width:88rpx;
        background: #fff;
        border-radius: 50%;
        padding: 0;
    }
    .shareHw{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        opacity: 0;
    }
    .share-tip{
        background: #F6F6F6;
        border-radius: 26rpx;
        font-size: 22rpx;
        color: #999999;
        width: 436rpx;
        height: 56rpx;
        line-height: 56rpx;
        text-align: center;
        margin-left: 20rpx;
        margin-top: 20rpx;
    }
    .content-list{
        margin: 0;
        background: #fff;
        border: 1px solid transparent;
        display: block;
        position: relative;
        width: 33%;
        text-align: center;
        font-size: 26rpx;
    }
    .share-content{
        justify-content:center;
        display: flex;
        padding: 20rpx;
    }
    .shareImg{
        height: 88rpx;
        width: 88rpx;
    }
    .share-title{
        font-size: 30rpx;
        text-align: center;
        padding: 20rpx;
    }
    .bottom-share{
        height: 378rpx;
        width: 100%;
        position: absolute;
        bottom: 0;
        background: #fff;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
    }
    #myCan{
        display: block!important;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        height: 900rpx;
        width: 750rpx;
        position: fixed;
        bottom: 100rpx;
        overflow: hidden;
    }
    .subPhoto{
        position: absolute;
        bottom: 0;
        background: #FF5000 ;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        color: #fff;
        font-weight: bold;
        font-size: 30rpx;
        width: 100%;
    }
    .components-content{
        z-index: 1000;
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.3);
    }

</style>
