<template>
    <span :style="style">
        {{formatMoney}}
    </span>
</template>
<script>
    export default {
        props:{
            money: 0, //金额
            style: {    //样式
                type: Object,
                default: {}
            },
            sign: {
                type: String,
                default: ''
            },
            position: {
                type: Boolean,
                default: true
            }
        },
        data(){
            return {

            }
        },
        computed: {
            formatMoney() {
                let str = '';
                if(this.money&&this.money>0){
                    let f = this.money.toString().split('.');
                    if(f.length>1){
                        if (f[1]&&f[1].length>=2){
                            str = f[0]+'.'+f[1].slice(0,2);
                        }
                        else if (f[1] && f[1].length == 1){
                            str = f[0]+'.'+f[1]+'0';
                        }
                    }else{
                        str = f[0]+'.00';
                    }
                }else{
                    str = '0.00';
                }
                if(this.position){
                    str = this.sign + str;
                }else{
                    str = str + this.sign;
                }
                return str
            }
        }
    }
</script>
<style scoped>

</style>
