<template>
    <span>
        <span class="downTimer" :style="{'fontSize':size+'rpx'}">{{d}}天 {{h}}:{{m}}:{{s}}</span>
    </span>

</template>



<script>
    export default {
        name: "timeDown",
        props:{
            timeStamp: 0,//截止日期时间戳
            size:{
                type:Number,
                default:26
            },
            color:{
                type:String,
                default:'#333'
            }
        },
        computed: {

        },
        data(){
            return{
                downTimer: null,
                _html: '',
                d: '00',
                h: '00',
                m: '00',
                s: '00'
            }
        },
        methods:{
            initTimeDown(){//初始化砍价结束倒计时
                clearInterval(this.downTimer);
                let end = new Date(this.timeStamp*1000);
                let _now = new Date();
                if(end - _now > 0){
                    this.downTimer = setInterval(()=>{
                        let now = new Date();
                        let deltaTime = end - now; //到期时间和当前时间相差的毫秒数
                        if (deltaTime <= 0) {//结束停止
                            clearInterval(this.downTimer);
                            return;
                        }
                        let d = Math.floor(deltaTime / (60*1000*60*24));
                        let h = Math.floor(deltaTime / (60*1000*60)%24);
                        let m = Math.floor(deltaTime / (60*1000)%60);
                        let s = Math.floor(deltaTime / 1000 % 60);
                        this.d = d<10?"0"+d:d;
                        this.h = h<10?"0"+h:h;
                        this.m = m<10?"0"+m:m;
                        this.s = s<10?"0"+s:s;
                    }, 1000);
                }

            }
        },
        mounted(){
            this.initTimeDown()
        }
    }
</script>

<style scoped>

</style>
