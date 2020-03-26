<template>
    <span :style="style">
        {{formatTime}}
    </span>
</template>
<script>
    export default {
        name: "timeFormat",
        props:{
            timeStamp: 0, //日期时间戳
            style: {    //样式
                type: Object,
                default: {}
            },
            split_type: {//分隔符 默认为.
                type: String,
                default: '0'
            },
            display_type: { //true:显示年月日时分秒，false:只显示年月日
                default: true
            } 
        },
        data(){
            return {

            }
        },
        computed: {
            formatTime() {
                if(this.timeStamp){
                    let date = new Date(this.timeStamp);
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    let hour = date.getHours();
                    let minute = date.getMinutes();
                    let second = date.getSeconds();
                    let split = '.';
                    let str = '';
                    let str1 = '';
                    if(this.display_type){
                        str1 = ' '+(hour>9?hour:'0'+hour) + ':' + (minute>9?minute:'0'+minute) + ':' + (second>9?second:'0'+second);
                    }else{
                        str1 = '';
                    }
                    if(this.split_type == '0'){
                        str = year + '.' + (month>9?month:'0'+month) + '.' + (day>9?day:'0'+day) + str1;
                    }else if(this.split_type == '1'){
                        str = year + '-' + (month>9?month:'0'+month) + '-' + (day>9?day:'0'+day) + str1;
                    }else if(this.split_type == '2'){
                        str = year + '/' + (month>9?month:'0'+month) + '/' + (day>9?day:'0'+day) + str1;
                    }else if(this.split_type == '3'){
                        str = year + '年' + (month>9?month:'0'+month) + '月' + (day>9?day:'0'+day) +'日' + str1;
                    }
                    return str;
                }
            }
        }
    }
</script>
<style scoped>

</style>
