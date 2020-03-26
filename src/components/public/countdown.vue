
<template>
  <!-- 订单详情待支付所需要的倒计时 -->

  <div>
    <!-- 待支付 -->
    <div class="orderDel" v-if="skillNum==3">
      <span class="orderTime">{{h}}</span><span class="space_blank">:</span>
      <span class="orderTime">{{m}}</span><span class="space_blank">:</span>
      <span class="orderTime">{{s}}</span>
    </div>

    <!-- 秒杀开始 -->
    <p  class ='SecKill' v-if="skillNum==1">{{ '距结束:' + time}}</p>

    <!-- 秒杀预告 -->
    <p class ='SecKill' v-if="skillNum==0">{{ '距开始:' + time}}</p>

    <!-- 限时秒杀 -->
    <div v-if="skillNum==2" class="skillMise">
      <span class="timeText">{{h}}</span>:
      <span class="timeText">{{m}}</span>:
      <span class="timeText">{{s}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    endTime: {
      type: String
    },
    skillNum: {
      type: Number
    },
    currTime: {
        type: String
    }
  },
  data() {
    return {
      time: "",
      flag: false,
      h: "",
      s: "",
      m: ""
    };
  },
  mounted() {
    let time = setInterval(() => {
      if (this.flag == true) {
        clearInterval(time);
      }
      this.timeDown();
    }, 500);
  },
  onLoad() {
    // console.log(this.endTime)
     
    //  console.log(this.endTime)
  },
  methods: {
  
    timeDown() {
      let leftTime = 0;
      if (this.skillNum == 3) {
        if (this.endTime >= 0) {
          this.endTime -= 500;
          leftTime = this.endTime / 1000;
        }
      } else {
        let  endTimeTime = (this.endTime+'').indexOf('-')>-1?this.endTime.replace(/\-/g,"/"):this.endTime;
        const endTime = new Date(endTimeTime);
        const nowTime = this.currTime = parseInt(this.currTime) + 500;//new Date();
        leftTime = parseInt((endTime.getTime() - nowTime) / 1000);
      }
      let d = parseInt(leftTime / (24 * 60 * 60));
      let h = this.formate(parseInt((leftTime / (60 * 60)) % 24));
      let m = this.formate(parseInt((leftTime / 60) % 60));
      let s = this.formate(parseInt(leftTime % 60));
      if (leftTime <= 0) {
        this.flag = true;
        this.$emit("time-end");
      }
      this.h = h;
      this.m = m;
      this.s = s;
      this.time = d == 0 ? `${h}:${m}:${s}` : `${d}:${h}:${m}:${s}`; // 需要修改时间样式的话 ，比如需要什么30分钟倒计时，就只保留分和秒
    },
    formate(time) {
      if (time >= 10) {
        return time;
      } else {
        return `0${time}`;
      }
    }
  }
};
</script>

<style scoped>
.orderDel {
  display: flex;
  align-items: center;
}
.orderTime {
  background: #ffffff;
  border-radius: 4px;
  height: 34rpx;
  width: 34rpx;
  font-family: PingFangSC-Regular;
  font-size: 22px;
  color: #333333;
  line-height: 34rpx;
  text-align: center;
}
.skillMise {
  display: flex;
  align-items: center;
}
.timeText {
  background: #4a4a4a;
  border-radius: 4px;
  height: 34rpx;
  width: 34rpx;
  font-size: 22px;
  color: #ffffff;
  line-height: 34rpx;
  text-align: center;
  margin-right: 5rpx;
}
.SecKill{
  width: 255rpx;
}
.space_blank {
    padding: 0 10px;
    color: #ffffff;
}

</style>