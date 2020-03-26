<template>
    <span>
        <span :style="{'fontSize':fSize+'rpx',}" >¥</span>
         <span :style="{'fontSize':iSize+'rpx',}">{{moneyI }}</span>
        <span :style="{'fontSize':fSize+'rpx',}" v-if="moneyf">.{{moneyf}}</span>
        <!--<span  :style="{'fontSize':iSize+'rpx',}">{{moneyI}}</span>-->
        <!--<span v-if='moneyf' :style="{'fontSize':fSize+'rpx',}">{{moneyf}}</span>-->
    </span>

</template>



<script>
    export default {
        name: "moneyNo",
        props:{
            money:'',
            iSize:{
                type:Number,
                default:26
            },
            fSize:{
                type:Number,
                default:20
            },
            color:{
                type:String,
                default:'#333'
            }
        },
        computed: {
            // 计算属性的 getter

            // order_list_money() {
            //     return priceFormat(this.money);
            // },

            moneyI:function() {
                if (this.money == undefined || this.money == null || this.money == 0 || this.money == '0') {
                    return 0
                }
                var money = parseInt(this.money)
                console.log(money)
                return money

            },
            moneyf:function(){
                if (this.money == undefined || this.money == null || this.money == 0 || this.money == '0') {
                    return ''
                }
                var f = this.money?this.money.toString().split('.'):'';
                if (f[1]&&f[1].length>=2){
                    f = f[1].slice(0,2)
                }else if(f[1]){
                    f = f[1]
                }else{
                    f=''
                }
                return f

            }
        },
        // Vue.filter()
//      filters: {


//      },
        data(){
            return{}
        },

        methods:{
        }
    }
</script>

<style scoped>

</style>
