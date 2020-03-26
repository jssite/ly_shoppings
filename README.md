# leyou
旧的 appid:wx07283a792a0142c5
新的 appid:wx8d003ff4973c2ff2
> leyou

## Build Setup

``` bash
# 初始化项目
vue init mpvue/mpvue-quickstart myproject
cd myproject

# 安装依赖
yarn

# 开发时构建
npm dev

# 打包构建
npm build

# 指定平台的开发时构建
npm dev:wx

# 指定平台的打包构建
npm build:wx

# 生成 bundle 分析报告
npm run build --report

# 目录结构
components
----- details	商品详情
----- small	    两列商品列表
----- thumbnail	一行商品列表
----- promote   猜你喜欢

pages
----- index	                    首页
----- coupon	                卡券
----- leDelivery	            闪送
      |----- index	            闪送首页
----- rankingList               排行榜
----- products	                商品
      |----- details	        商品详情
      |----- order	            订单流程
----- shoopingCart	            购物车  
----- search	                搜索
      |----- index	            首页-搜索
      |----- leshansong	        乐闪送-搜索
      |----- filter	            筛选-搜索
      |----- shop               身边门店
             |----- index	    身边门店-列表
             |----- shopDetail  身边门店-门店详情
----- serviceCenter	            服务中心
      |----- autoRefunds	    自动退货
      |----- onlineService	    在线客服 
----- userCenter	            个人中心
      |----- login	            登录页面
             |----- mobileLogin	手机快捷登录
             |----- mxLogin	    微信快捷登录
      |----- selectId	        注册-选择身份
      |----- babyFiles	        注册-选择身份-宝宝信息
      |----- woman	            注册-选择身份-怀孕
      |----- returnGoods	    自助退货-申请退货
      |----- address            送货地址管理
      |----- logistics	        物流列表
      |----- mycollect	        我的收藏
      |----- coupon             优惠券
      |----- address	        地址管理
      |----- barcode	        条形码
      |----- setting	        设置
      |----- invoice	        发票管理
             |----- add         发票管理-添加发票
             |----- list        发票管理-发票列表  
