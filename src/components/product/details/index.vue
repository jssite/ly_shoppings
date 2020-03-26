<template>
  <div class="product_detail">
    <!-- 切换 -->
    <div class="product_detail_tabs">
      <span class="product_detail_tab active">图文详情</span>
      <span class="product_detail_tab">商品参数</span>
      <span class="product_detail_tab">售后服务</span>
    </div>
    <!-- 内容 -->
    <div class="product_detail_content"></div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: {}
    }
  }
};
</script>

<style scoped>
.product_detail {
  padding-bottom: 98px;
  background: #fff;
}
.product_detail_tabs {
  display: flex;
  padding: 0 45px;
  justify-content: space-around;
}
.product_detail_tab {
  padding: 23px 0;
  width: 160px;
  font-size: 30px;
  line-height: 42px;
  text-align: center;
}
.product_detail_tabs .active {
  color: #ff5000;
  border-bottom: 1px #ff5000 solid;
}
.product_detail_content {
  min-height: 800px;
}
</style>