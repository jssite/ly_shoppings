<template>
  <div></div>
</template>
<script>
import { getQueryString } from "@/utils";
import { mapMutations, mapState } from "vuex";

export default {
  data() {
    return {};
  },

  onLoad(option) {
    let url = '/pages/goodsdetailed/main'
    wx.navigateTo({
      url: url
    })
  },

  methods: {}
};
</script>
<style scoped>
</style>

