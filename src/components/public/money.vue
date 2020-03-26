<template>
    <span>
        <span :style="{'fontSize':fSize+'rpx',}" >¥</span>
        <!-- <span :style="{'fontSize':iSize+'rpx',}">{{moneyI }}</span>
        <span :style="{'fontSize':fSize+'rpx',}" v-if="moneyf">.{{moneyf}}</span> -->
        <span v-if='order_list_money' :style="{'fontSize':iSize+'rpx','fontWeight':fontweight}">{{order_list_money[0] }}</span>
        <span v-if='order_list_money' :style="{'fontSize':fSize+'rpx','fontWeight':fontweight}">{{order_list_money[1]}}</span>
    </span>

</template>



<script>

    import { priceFormat } from "@/utils";
    export default {
        name: "money",
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
            },
            fontweight:{
                type:Number,
                default:400
            }
        },
        computed: {
            // 计算属性的 getter

            order_list_money() {
                return priceFormat(this.money);
            },
             moneyI:function() {
                 var money = parseInt(this.money)

                 return money
             },
            moneyf:function(){
                var f = this.money?this.money.toString().split('.'):'';
                if (f[1]&&f[1].length>=2){
                    f = f[1].slice(0,2)
                }
                else if (f[1] && f[1].length == 1){
                    f = f[1]+'0'
                }
                else{
                    f = ''
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
