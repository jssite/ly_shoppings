<template>
    <div class="user_logistics">
        <div class="user_logistics_dl">
            <div class="user_logistics_dt">A</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('安能物流')">安能物流</div>
            </div>
            <div class="user_logistics_dt">B</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('百世快递')">百世快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('百世快运')">百世快运</div>
            </div>
            <div class="user_logistics_dt">C</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('城市之星')">城市之星</div>
            </div>
            <div class="user_logistics_dt">D</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('德邦快递')">德邦快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('德邦物流')">德邦物流</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('点点送')">点点送</div>
            </div>
            <div class="user_logistics_dt">E</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('EMS')">EMS</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('EMS经济快递')">EMS经济快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('E速宝')">E速宝</div>
            </div>
            <div class="user_logistics_dt">F</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('飞远配送')">飞远配送</div>
            </div>
            <div class="user_logistics_dt">G</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('国通快递')">国通快递</div>
            </div>
            <div class="user_logistics_dt">H</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('黑猫宅急便')">黑猫宅急便</div>
            </div>
            <div class="user_logistics_dt">I</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('佳吉快递')">佳吉快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('佳吉快运')">佳吉快运</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('佳怡物流')">佳怡物流</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('筋斗云轿车物流')">筋斗云轿车物流</div>
            </div>
            
            <div class="user_logistics_dt">K</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('卡行天下')">卡行天下</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('跨越速运')">跨越速运</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('快捷快递')">快捷快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('快消宅配')">快消宅配</div>
            </div>
            <div class="user_logistics_dt">L</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('联邦快递')">联邦快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('联昊通')">联昊通</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('林氏物流')">林氏物流</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('龙邦速递')">龙邦速递</div>
            </div>
            <div class="user_logistics_dt">M</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('')">门对门</div>
            </div>
            <div class="user_logistics_dt">Q</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('全峰快递')">全峰快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('全一快递')">全一快递</div>
            </div>
            \<div class="user_logistics_dt">R</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('日日顺物流')">日日顺物流</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('如风达配送')">如风达配送</div>
            </div>
            <div class="user_logistics_dt">S</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('申通快递')">申通快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('晟邦')">晟邦</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('盛辉物流')">盛辉物流</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('顺丰速运')">顺丰速运</div>
            </div>
            <div class="user_logistics_dt">T</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('能达速递')">能达速递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('天地华宇')">天地华宇</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('天天快递')">天天快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('天翔快递')">天翔快递</div>
            </div>
            <div class="user_logistics_dt">Y</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('韵达快递')">韵达快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('远成快运')">远成快运</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('韵达快递')">韵达快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('优梵物流')">优梵物流</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('优速快递')">优速快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('邮政标准快递')">邮政标准快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('邮政快递包裹')">邮政快递包裹</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('圆通快递')">圆通快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('圆通速递')">圆通速递</div>
            </div>
            <div class="user_logistics_dt">Z</div>
            <div class="user_logistics_wrap">
                <div class="user_logistics_dd" @click="funcLogisticsSelect('中铁快运')">中铁快运</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('中铁物流')">中铁物流</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('中通快递')">中通快递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('中通快运')">中通快运</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('增益速递')">增益速递</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('宅急送')">宅急送</div>
                <div class="user_logistics_dd" @click="funcLogisticsSelect('卓志速运')">卓志速运</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    onLoad() {
        this.sa_page(this,false,'物流信息','');
    },
    methods: {
        funcLogisticsSelect(name){
            this.$store.commit('logisticsMutations',name);
            wx.navigateBack({
                delta: 1
            })
        }
    }
}
</script>

<style scoped>
.user_logistics {
    background: #f3f6f7;
    height: 100vh;
}
.user_logistics_dt {
    height: 80px;
    padding-left: 20px;
    color: #999999;
    font-size: 26px;
    line-height: 80px;
}
.user_logistics_wrap {
    background: #ffffff;
    padding-left: 20px;
}
.user_logistics_dd {
    height: 80px;
    border-bottom: #EEEEEE 1px solid;
    line-height: 80px;
    color: #333333;
    font-size: 26px;
}
</style>