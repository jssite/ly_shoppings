<template>
    <div>
        <web-view
        src="https://m.leyou.com.cn/newspage?id=1351">
        </web-view>
    </div>
</template>

<script>
    export default {

        onLoad() {
            this.sa_page(this,false,'精选活动','');
        },
        onShareAppMessage(res) {
            if (res.from === 'button') {
            // 来自页面内转发按钮
                console.log(res.target)
            }
            return {
                title: '快乐时光，与你童在',
                path: '/pages/activity/main'
            }
        }
    }
</script>

<style scoped>

</style>