<template>
  <div class="product_promote">
    <div style="display: flex;justify-content: center; align-items: center;">
      <img src="/static/images/public_recom_title_left.png" class="left_image">
      <span class="title">{{title_aaa_bbb}}</span>
      <img src="/static/images/public_recom_title_right.png" class="right_image">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title_aaa_bbb: {
      type: String,
      default: "继续剁手"
    }
  }
};
</script>

<style scoped>
.product_promote {
  padding: 0 0 20px;
  height: 48rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  /* text-align: center; */
}

.left_image {
    width: 40rpx;
    height: 12rpx;
}

.title {
  margin-left: 24rpx;
  font-size: 34px;
  /* line-height: 48px; */
  color: #333333;
  /* height: 48rpx; */
}

.right_image {
    margin-left: 24rpx;
    width: 40rpx;
    height: 12rpx;
}
</style>