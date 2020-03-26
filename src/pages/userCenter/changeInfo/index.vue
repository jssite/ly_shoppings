<template>
    <div>
        <p class="changePic" @click="showImg()">
            <span>头像</span>
            <img class="manpic" src="https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640" alt="">
        </p>
        <p>
            <span>昵称</span>
            <span>13135755330</span>
        </p>

        <div class="dialog">
            <img class="dialog-pic"  :src="picUrl?(configHeader+picUrl):'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640'" alt="">
            <!--<camera-->
                    <!--device-position="back"-->
                    <!--flash="off"-->
                    <!--binderror="error"-->
                    <!--style="width: 100%; height: 300px;"-->
            <!--&gt;</camera>-->
            <div class="btn-group">
                <p class="btn-p" @click="chooseImgCamera()">拍摄</p>
                <p class="btn-p" @click="chooseImgAlbum()">从相册选择</p>
                <p class="btn-q">取消</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {getOssConfig} from '@/api'
    import uploadFile from '@/utils/upload-config'
    export default {
        name: "index",
        data(){
            return{
                showBtn:false,
                picUrl:'',
                configHeader:'http://oss-cn-beijing.aliyuncs.com/leyoutest1/'
            }
        },
        onLoad(){
            this.sa_page(this,false,'个人资料','');
            getOssConfig({}).then(res=>{
                wx.setStorageSync('config',res)
                // uploadFile()
            })
            // wx.chooseImage({
            //     count: 1,
            //     sizeType: ['original', 'compressed'],
            //     sourceType: [ 'camera'],
            //     success(res) {
            //         // tempFilePath可以作为img标签的src属性显示图片
            //         const tempFilePaths = res.tempFilePaths
            //     }
            // })
        },
        methods:{
            showImg(){

            },
            chooseImgAlbum(){
                console.log('chooseImgAlbum')
                var that=this
                wx.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: [ 'album'],
                    success(res) {
                        console.log(res)
                        uploadFile(wx.getStorageSync('config'),{
                            filePath:res.tempFilePaths[0],
                            dir:'',
                            success:function (data) {
                                that.picUrl=data
                                console.log(this.picUrl)
                            },
                            fail:function (data) {
                                console.log(data)

                            }
                        })
                    }
                })
            },
            chooseImgCamera(){
                console.log('chooseImgCamera')
                var that=this
                wx.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: [ 'camera'],
                    success(res) {

                        uploadFile(wx.getStorageSync('config'),{
                            filePath:res.tempFilePaths[0],
                            dir:'',
                            success:function (data) {
                                that.picUrl=data
                                console.log(this.picUrl)
                            },
                            fail:function (data) {
                                console.log(data)

                            }
                        })
                        // tempFilePath可以作为img标签的src属性显示图片
                        console.log(res)
                        // const tempFilePaths = res.tempFilePaths
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .btn-group{
        height: 310rpx;
        background: #fff;
        width: 100%;
        position: absolute;
        bottom: 0;
    }
    .btn-p,.btn-q{
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        font-size: 26rpx;
        border-bottom: 1px solid #eee;
    }
    .btn-q{
        border-top: 5rpx solid #eee;
    }
    .dialog-pic{
        height: 400rpx;
        width: 400rpx;
        position: absolute;
        top: 100rpx;
        left: 175rpx;
    }
    .changePic{
        height: 100rpx;
        padding: 10rpx 20rpx;
        font-size:30rpx;
        line-height: 100rpx;
        border-bottom: 1px solid #eee;

    }
    .dialog{
        position: fixed;
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,0.3);
        top: 0;
    }
    .manpic{
        height: 100rpx;
        width: 100rpx;
        float: right;
        padding-right: 20rpx;
    }
</style>
