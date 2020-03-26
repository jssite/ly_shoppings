<template>
    <div class="dialog" @click="close()" catchtouchmove='true'>
        <div class="content" @click.stop="closeTip()">
            <img class="cartImg" @click="close()" src="/static/images/twohr_left_shopping.png">
            <span class="sanj"></span>
            <div v-if="baseData.cart_self_count" class="product_cartNum">{{baseData.cart_self_count>99?'99+':baseData.cart_self_count}}</div>
            <div class="title">
                <span class="ti-box" @click.stop="showTIp()">
                    <img v-if="showtip" class="bg_rule" src="/static/images/twohr_shop_bg_rule.png" alt="">
                    <p v-if="showtip" class="dialog-tip">{{baseData.freight_rule}}</p>
                    <img class="icon-tip" src="/static/images/public/public_icon_tip.png" alt="">
                </span>{{baseData.freight_desc}}
            </div>
            <div class="list-box"  >
                <scroll-view scroll-y style="height: 100%">
                    <!--<div class="switch" v-if="baseData.is_need_vip">-->
                        <!--<span class="switch-msg">企业尊享价(本月内购余额{{baseData.company_sale_message}}元)</span>-->
                        <!--<switch class="btn" color="#FF5000" v-model="is_use_vip" :checked="is_use_vip"  @change="funcVip"></switch>-->
                    <!--</div>-->
                    <div v-for="(item,index) in baseData.cart_product_type_list" :key="index">
                        <div
                                class="list-good-box"
                                v-for="(itemf,indexf) in item.cart_info_product_list"
                                :key="indexf"
                        >
                            <div class="list-tip" v-if="itemf.promotion_info_vo.promotion_id">
                                <span class="tip-btn">{{itemf.promotion_info_vo.promotion_type_title}}</span>
                                <span class="tip-msg">{{itemf.promotion_info_vo.promotion_content}}</span>
                                <span class="skip" v-if="itemf.promotion_info_vo.forward_title" @click="gotoPromotion(itemf.promotion_info_vo,true)">
                        {{itemf.promotion_info_vo.forward_title}}
                                <img class="pic-right" src="/static/images/public/order_arrow_redright.png" alt="">
                        </span>
                            </div>
                            <div
                                    v-for="(itemc,indexc) in itemf.cart_product_list"
                                    :key="indexc"

                            >
                                <div @touchstart="touchstart($event,indexc,indexf,index)"
                                     @touchend="touchend($event,indexc,indexf,index)"
                                     :class="itemc.showDel==1?'showDel list-goods':'list-goods'"
                                     v-if="!itemc.product_status&&itemc.product_type!=1&&itemc.product_type!=6">
                                    <img
                                            class="circle"
                                            @click="select(itemc,item.cart_type)"
                                            v-if="!itemc.is_check"
                                            src="/static/images/public/publicCircle-checkOff.png"
                                            alt
                                    />
                                    <img
                                            class="circle"
                                            @click="select(itemc,item.cart_type)"
                                            v-if="itemc.is_check"
                                            src="/static/images/public/publicCircle-checkOn.png"
                                            alt
                                    />

                                    <img class="goods-img" @click="goMsg(itemc)" :src="itemc.image" alt />
                                    <span
                                            v-if="itemc.quantity>itemc.shop_quantity"
                                            class="only-g"
                                    >仅剩{{itemc.shop_quantity}}件</span>
                                    <div class="goods-right">
                                        <p class="goods-msg">
                                            {{itemc.marketing_title}}</p>
                                        <p
                                                class="goods-attr"
                                        >{{itemc.product_color?'颜色：'+itemc.product_color:''}} {{itemc.product_size?'尺码：'+itemc.product_size:'&nbsp;'}}</p>

                                        <p>
                                        </p>
                                        <p class="list-bottom">
                      <span class="money">
                        {{itemc.sale_price}}
                      </span>
                                            <span class="add-reduce">
                        <img
                                v-if="itemc.min_limit_sale?(itemc.quantity>itemc.min_limit_sale):(itemc.quantity>1)"
                                class="add"
                                src="/static/images/public/public_number_sub.png"
                                alt
                                @click="doGoods(itemc,item.cart_type,-1)"
                        />
                        <img
                                v-if="itemc.min_limit_sale?(itemc.quantity<itemc.min_limit_sale):(itemc.quantity<2)"
                                class="add"
                                src="/static/images/public/public_number_subnot.png"
                                alt
                        />
                                                <!--<span :class="itemf.quantity<2?'reduce gray':'reduce'" @click="doGoods(itemf,item.cart_type,-1)">-</span>-->
                        <span
                                class="goods-num"
                                @click="showInput(itemc,item.cart_type,itemc.quantity)"
                        >{{itemc.quantity}}</span>
                        <img
                                v-if="itemc.shop_quantity?(itemc.quantity<itemc.shop_quantity):(itemc.quantity<99)"
                                class="add"
                                src="/static/images/public/public_number_add.png"
                                alt
                                @click="doGoods(itemc,item.cart_type,1)"
                        />
                        <img
                                v-if="itemc.shop_quantity?(itemc.quantity>=itemc.shop_quantity):(itemc.quantity>=99)"
                                class="add"
                                src="/static/images/public/public_number_addnot.png"
                                alt
                        />
                                                <!--<span  :class="itemc.quantity<2?'reduce gray':'reduce'" class="reduce" @click="doGoods(itemc,item.cart_type,-1)">-</span>-->
                                                <!--<span class="goods-num">{{itemc.quantity}}</span>-->
                                                <!--<span :class="itemc.shop_quantity>itemc.quantity?(itemc.quantity>99?'add gray':'add'):'add gray'" @click="doGoods(itemc,item.cart_type,1)">+</span>-->
                      </span>
                                        </p>
                                    </div>
                                    <div class="del" @click="delGoode(itemc,item.cart_type)">删除</div>
                                </div>
                                <div
                                        class="list-goods"
                                        v-if="itemc.product_type==6">
                                    <span class="circle" ></span>

                                    <img class="goods-img" @click="goMsg(itemc)" :src="itemc.image" alt />
                                    <span
                                            v-if="itemc.quantity>itemc.shop_quantity"
                                            class="only-g"
                                    >仅剩{{itemc.shop_quantity}}件</span>
                                    <div class="goods-right">
                                        <p class="goods-msg">
                                            <span class="huangou">换购</span>
                                            {{itemc.marketing_title}}</p>
                                        <p
                                                class="goods-attr"
                                        >{{itemc.product_color?'颜色：'+itemc.product_color:''}} {{itemc.product_size?'尺码：'+itemc.product_size:'&nbsp;'}}</p>

                                        <p>
                                        </p>
                                        <p class="list-bottom">
                      <span class="money">
                        {{itemc.sale_price}}
                      </span>
                                            <span class="add-reduce">
                        <!--<img-->
                                <!--v-if="itemc.min_limit_sale?(itemc.quantity>itemc.min_limit_sale):(itemc.quantity>1)"-->
                                <!--class="add"-->
                                <!--src="/static/images/public/public_number_sub.png"-->
                                <!--alt-->
                                <!--@click="doGoods(itemc,item.cart_type,-1)"-->
                        <!--/>-->
                        <!--<img-->
                                <!--v-if="itemc.min_limit_sale?(itemc.quantity<itemc.min_limit_sale):(itemc.quantity<2)"-->
                                <!--class="add"-->
                                <!--src="/static/images/public/public_number_subnot.png"-->
                                <!--alt-->
                        <!--/>-->
                                                <!--<span :class="itemf.quantity<2?'reduce gray':'reduce'" @click="doGoods(itemf,item.cart_type,-1)">-</span>-->
                                                        <!--@click="showInput(itemc,item.cart_type,itemc.quantity)"-->
<!---->
                                                <span
                                class="goods-num"
                        >{{itemc.quantity}}</span>
                        <!--<img-->
                                <!--v-if="itemc.shop_quantity?(itemc.quantity<itemc.shop_quantity):(itemc.quantity<99)"-->
                                <!--class="add"-->
                                <!--src="/static/images/public/public_number_add.png"-->
                                <!--alt-->
                                <!--@click="doGoods(itemc,item.cart_type,1)"-->
                        <!--/>-->
                        <!--<img-->
                                <!--v-if="itemc.shop_quantity?(itemc.quantity>=itemc.shop_quantity):(itemc.quantity>=99)"-->
                                <!--class="add"-->
                                <!--src="/static/images/public/public_number_addnot.png"-->
                                <!--alt-->
                        <!--/>-->
                                                <!--<span  :class="itemc.quantity<2?'reduce gray':'reduce'" class="reduce" @click="doGoods(itemc,item.cart_type,-1)">-</span>-->
                                                <!--<span class="goods-num">{{itemc.quantity}}</span>-->
                                                <!--<span :class="itemc.shop_quantity>itemc.quantity?(itemc.quantity>99?'add gray':'add'):'add gray'" @click="doGoods(itemc,item.cart_type,1)">+</span>-->
                      </span>
                                        </p>
                                    </div>
                                </div>
                                <div class="promo-t" v-if="itemc.product_type==1">
                                    <span class="chuxiao-s">赠品</span>
                                    <span class="zenp-msg">{{itemc.marketing_title}}</span>
                                    <span class="zenp-num">x{{itemc.quantity}}</span>
                                    <span
                                            class="skip"
                                            @click="selectZenp(itemf.promotion_info_vo,itemc.sku)"
                                            v-if="itemf.promotion_info_ext&&itemf.promotion_info_ext.product_list_enable===0"
                                    ><span>去修改</span><img class="arrow" style="align-self:center;width:13rpx;height:23rpx;margin-left:20rpx" src="/static/goodsdetail/lecard_arrow_right.png" /></span>
                                </div>
                                <div
                                        v-for="(itemcx ,indexcx) in itemc.product_promotion_list"
                                        class="promo-t"
                                        v-if="itemcx.is_check&&itemc.product_promotion_list&&itemc.product_promotion_list.length>1"
                                        @click="shipTochuxiao(itemc.product_promotion_list,itemc.sku)"
                                >
                                    <span class="chuxiao-s">促销</span>
                                    <span class="tip-msg">{{itemcx.content}}</span>
                                    <span class="skip"><span>去修改</span><img class="arrow" style="align-self:center; width:13rpx;height:23rpx;margin-left:20rpx" src="/static/goodsdetail/lecard_arrow_right.png" /></span>
                                </div>
                            </div>


                        </div>

                        <!--<span class="zenp-btn">赠品</span>-->
                        <!--<span class="zenp-msg ">{{itemf.marketing_title}}</span>-->
                        <!--<span class="zenp-num">x{{itemf.quantity}}</span>-->
                        <!--</div>-->
                        <!--<div v-if="itemf.product_type==1">-->
                    </div>
                    <div v-if="showLow" class="box-low"     >
                        <p class="low-good">因配送范围、库存原因导致失效的商品 <span class="clear-good" @click="clearG()">清空失效商品</span></p>
                        <div v-for="(item,index) in baseData.cart_product_type_list" :key="index">
                            <div  class="list-good-box" v-for="(itemf,indexf) in item.cart_info_product_list" :key="indexf">
                                <div v-for="(itemc,indexc) in itemf.cart_product_list" :key="indexc"  :class="itemc.showDel==1?'showDel':''" @touchstart="touchstart($event,indexc,indexf,index)" @touchend="touchend($event,indexc,indexf,index)" >
                                    <div class="list-goods gray-text"   v-if="itemc.product_status">
                                        <span class="no-low">失效</span>
                                        <!--<img class="circle"  src="/static/images/public/publicCircle-checkOff.png" alt="">-->
                                        <img class="goods-img" :src="itemc.image" alt="">
                                        <!--<span class="only-p" v-if="itemf.product_status==0&&itemf.shop_quantity==0&&itemf.sale_quantity!=0">仅支持快递配送</span>-->
                                        <!--<span class="only-z" v-if="itemf.product_status==0&&itemf.sale_quantity==0&&itemf.shop_quantity!=0">仅支持门店自提</span>-->
                                        <!--<span v-if="itemc.quantity>itemc.shop_quantity" class="only-g">{{itemc.quantity-itemc.shop_quantity}}缺货</span>-->
                                        <!--<span v-if="itemf.product_status==2" class="only-g">下架</span>-->
                                        <!--<span v-if="itemf.product_status==3" class="only-g">已抢光</span>-->
                                        <div  class="goods-right">
                                            <p class="goods-msg ">{{itemc.marketing_title}}</p>
                                            <p class="goods-attr "></p>
                                            <p >
                                                <!--<span class="new-btn" >111</span>-->
                                            </p>
                                            <p class="list-bottom">
                                                <span class="money gray-text" ><moneySpan :money="itemc.sale_price" :iSize="28"></moneySpan></span>
                                                <!--<span class="mark">乐享</span>-->

                                            </p>
                                        </div>
                                        <div class="del" @click="delGoode(itemc,item.cart_type)">
                                            删除
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="zanwei"  v-if="!baseData.cart_product_type_list">
                        <img class="zanwei-img" src="/static/images/public/public_empty_pic.png" alt="" />
                        <p class="zanwei-tip">空空如也，快去装满它</p>
                    </div>
                </scroll-view>

            </div>
            <div class="list-bottom-box" v-if="baseData.cart_product_type_list">
                <p class="tiptxt" v-if="!numbtn">{{tiptext}}</p>
                <!--<p class="tip">暂时只支持闪送6件以内的商品哦~</p>-->
                <!--<p class="tip">1件商品库存不足，忽略该商品可继续下单</p>-->
                <p class="all-monry">合计：<span class="money-span"><moneySpan :money="baseData.total_money" :iSize="26"></moneySpan></span></p>
                <p class="coupon_money">已优惠：<span>{{baseData.coupon_money}}</span></p>
                <span :class="showBuy?'sureBuybtn':'graysureBuybtn'" @click="subBuy()">
                    立即下单{{num?'('+(num>99?'99':num)+')':''}}
                </span>
                <!--<span class="graysureBuybtn"  v-if="!showBuy1">-->
                    <!--立即下单{{num?'('+(num>99?'99':num)+')':''}}-->
                <!--</span>-->
            </div>
        </div>
        <div class="dialog-input" v-if="showChu" catchtouchmove='true' @click.stop="closeinputDialog()">
            <div  class="chuxiao-dialog" @click.stop>
                    <img @click="closeinputDialog()" class="close-dialog" src="/static/images/public/public_pop_close.png" alt="" />
                <p class="chu-title">促销修改</p>
                <div class="chu-list" v-for="item in chuList" @click="selectChu(item.promotion_id)">
                    <img v-if="item.is_check" @click="showShop(indexs)"  class="circle" src="/static/images/public/publicCircle-checkOn.png" alt="">
                    <img v-if="!item.is_check" @click="showShop(indexs)"  class="circle" src="/static/images/public/publicCircle-checkOff.png" alt="">
                    <p class="chu-list_content">{{item.content}}</p>
                </div>
            </div>
        </div>
        <div class="dialog-input" v-if="inputBtn" catchtouchmove='true' @click.stop="closeinputDialog()">
            <div  class="input-dialog" @click.stop>
                <p class="input-title">输入数量</p>
                <input class="num-input" type="text" v-model="goodsNum">
                <p class="btn-p">
                    <span class="quxbtn" @click="closeinputDialog()">取消</span>
                    <span class="quebtn" @click="sureInput()">确认</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {getmtCartAllData,synmtAllShoppingCart,choosePromotion} from '@/api'
    import moneySpan from '@/components/public/money.vue'

    export default {
        name: "index.vue",
        components:{
            moneySpan
        },
        props:{
            shop_id:{
                type:String,
                default:null
            },
            cart_id:{
                type:String,
                default:null
            }
        },
        computed: {


        },
        data(){
            return{
                chuList:"",
                baseData:'',
                showBuy:true,
                numbtn:true,
                num:0,
                subData:[],
                tiptext:'',
                showLow:false,
                showtip:false,
                inputBtn:false,
                goodsNum:'',
                goodsData:'',
                cart_type:'',
                chuSkus:'',
                showChu:false
            }
        },

        onLoad(){
            this.cart_id=this.cart_id?this.cart_id:undefined
            console.log(this.cart_id,'this.cart_id')
            wx.showLoading({title: '加载中...',mask:true})
            getmtCartAllData({shop_id:this.shop_id,cart_id:this.cart_id?this.cart_id:undefined}).then(res=>{
                this.is_use_vip =this.baseData.is_need_vip?this.baseData.is_use_vip:false
                this.baseData=res
                wx.hideLoading();

                this.showSelect()
            })
            console.log(this.shop_id)
        },
        onReady(){
            console.log(this.shop_id)

        },
        onShow(){
            this.cart_id=this.cart_id?this.cart_id:undefined
            console.log(this.shop_id)

        },
        methods:{
            selectChu(id){
                choosePromotion({
                    cart_id:wx.getStorageSync('cart_id')?wx.getStorageSync('cart_id'):undefined,
                    sku:this.chuSkus,
                    promotion_id:id,
                    source:2
                }).then(res=>{
                    wx.showLoading({
                        title:'加载中'
                    })
                    this.showChu=false
                    getmtCartAllData({shop_id:this.shop_id,cart_id:this.cart_id?this.cart_id:undefined}).then(res=>{
                        this.is_use_vip =this.baseData.is_need_vip?this.baseData.is_use_vip:false
                        this.baseData=res
                        wx.hideLoading();
                        this.showSelect()
                    })
                })
            },
            shipTochuxiao(data,skus){
                console.log(data)
                this.chuSkus=skus
                this.chuList=data
                this.showChu=true
            },
            goMsg(data){
                if(data.product_status!=0){
                    return
                }
                console.log(data.sku)
                wx.navigateTo({
                    url:`/pages/leDelivery/Deliverydetailed/main?sku=`+data.sku
                });
            },
            closeinputDialog(){
                this.inputBtn=false
                this.showChu=false
            },
            sureInput(){
                var reg=/^\+?[1-9][0-9]*$/
                if(!reg.test(this.goodsNum)){
                    wx.showToast({
                        title:'请输入有效数量',
                        icon:'none'
                    })
                    return
                }
                wx.showLoading({ title: '加载中...', mask: true })
                var goodsData={
                    cart_id:this.cart_id?this.cart_id:undefined,
                    sku:this.goodsData.sku,
                    shop_id:this.shop_id,
                    quantity:this.goodsNum>99?99-this.goodsData.quantity:this.goodsNum-this.goodsData.quantity,
                    hander_type:1,
                    is_check:this.goodsData.is_check,
                    cart_type:this.cart_type,
                    is_use_vip:this.baseData.is_use_vip
                }
                var subDaata={
                    cart_id:this.cart_id?this.cart_id:undefined,
                    shop_id:this.shop_id,
                    is_use_vip:this.baseData.is_use_vip,
                    hander_cart:[goodsData]
                }

                synmtAllShoppingCart(subDaata).then(res=>{
                    getmtCartAllData({shop_id:this.shop_id,cart_id:this.cart_id?this.cart_id:undefined}).then(res=>{
                        this.baseData=res
                        this.inputBtn=false
                        wx.hideLoading()
                        this.showSelect()
                        console.log(res)
                    })
                })
            },

            showInput(data,cart_type,num){
                this.inputBtn=true
                this.goodsNum=num
                this.goodsData=data
                this.cart_type=cart_type
            },
            showTIp(){
                this.showtip=!this.showtip
            },
            closeTip(){
                this.showtip=false
            },
            funcVip(e){
                this.is_use_vip=e.target.value
                var that =this
                var arr=[]
                this.baseData.cart_product_type_list.forEach(data=>{
                    data.cart_info_product_list.forEach(item=>{
                    item.cart_product_list.forEach(res=>{
                        if(res.product_status==0){
                            var goodsData={
                                cart_id:this.cart_id?this.cart_id:undefined,
                                sku:res.sku,
                                shop_id:this.shop_id,
                                quantity:0,
                                hander_type:1,
                                is_check:res.is_check,
                                cart_type:data.cart_type,
                                is_use_vip:this.is_use_vip
                            }
                            console.log(data.cart_type)
                            arr.push(goodsData)
                        }



            })
            })
            })
                var subDaata={
                    cart_id:this.cart_id?this.cart_id:undefined,
                    shop_id:this.shop_id,
                    is_use_vip:this.is_use_vip,
                    hander_cart:arr
                }
                console.log(subDaata)
                wx.showLoading({ title: '加载中…', mask: true })

                synmtAllShoppingCart(subDaata).then(res => {
                    getmtCartAllData({shop_id: this.shop_id,cart_id:this.cart_id?this.cart_id:undefined}).then(res => {
                        wx.hideLoading();
                        this.baseData = res
                        this.showSelect()
                    })
                })
                console.log(this.is_use_vip)
            },
            gotoPromotion(data){
                // content
                //     :
                //     "3件及以上8.8折"
                // promotion_id
                //     :
                //     "241627"
                // sort
                //     :
                //     "5"""
                this.close();
                let params = `content=${data.promotion_content}&promotion_id=${data.promotion_id}&sort=1&title=${data.forward_title}&shansong=shansong`
                wx.navigateTo({ url: '/pages/search/salesPromotion/main?'+params})
            },
            selectZenp(data){
                let params = `gift=true&source=2&content=${data.promotion_content}&promotion_id=${data.promotion_id}&sort=1&title=${data.promotion_type_title}&shop_id=${this.shop_id}&cart_id=${this.cart_id}`
                wx.navigateTo({ url: '/pages/search/salesPromotion/main?'+params})
            },
            clearG(){
                var arr=[]
                this.baseData.cart_product_type_list.forEach((item,index)=>{
                    item.cart_info_product_list.forEach(res=>{
                        res.cart_product_list.forEach(data=>{
                            if(data.product_status!=0){
                                var goodsData = {
                                    sku: data.sku,
                                    shop_id: this.shop_id,
                                    quantity: data.quantity,
                                    hander_type: 2,
                                    is_check: data.is_check,
                                    cart_type: item.cart_type,
                                    is_use_vip: this.baseData.is_use_vip
                                }
                                arr.push(goodsData)
                            }

                        })
                    })

                })

                var subDaata = {
                    shop_id: this.shop_id,
                    is_use_vip: this.baseData.is_use_vip,
                    cart_id:this.cart_id?this.cart_id:undefined,
                    hander_cart: arr
                }
                console.log(subDaata)
                wx.showLoading({ title: '加载中...', mask: true })

                synmtAllShoppingCart(subDaata).then(res => {
                    getmtCartAllData({shop_id: this.shop_id,cart_id:this.cart_id?this.cart_id:undefined}).then(res => {
                        wx.hideLoading();
                        this.baseData = res
                        this.showSelect()
                    })
                })
            },
            touchstart (e,indexf,indexc,index) {
                this.showSelect()
                // console.log('看我的内容',e,i)
                // console.log(e,'距离距离');
                //开始触摸时 重置所有删除
                this.touchindexf=indexf
                this.touchindexc=indexc
                this.touchindex=index
                this.startX = e.clientX
                this.startY =e.clientY
            },
            touchend(e,indexf,indexc,index) {
                console.log(this.touchindex)
                //  console.log(e,'距离距离');
                var baseData= JSON.parse(JSON.stringify(this.baseData) ),
                    startX = this.startX,//开始X坐标
                    endX = e.mp.changedTouches[0].pageX;//滑动变化坐标
                console.log(indexf,indexc,index)

                if((startX-endX)>50&&this.touchindexf==indexf
                    &&this.touchindexc==indexc
                    &&this.touchindex==index){
                    baseData.cart_product_type_list[index].cart_info_product_list[indexc].cart_product_list[indexf].showDel=1
                }
                this.baseData=baseData

                //获取滑动角度

            },
            //g购物车加减
            delGoode(data,cart_type) {
                var goodsData = {
                    sku: data.sku,
                    shop_id: this.shop_id,
                    quantity: data.quantity,
                    hander_type: 2,
                    is_check: data.is_check,
                    cart_type: cart_type,
                    is_use_vip: this.baseData.is_use_vip
                }
                var subDaata = {
                    shop_id: this.shop_id,
                    is_use_vip: this.baseData.is_use_vip,
                    cart_id:this.cart_id?this.cart_id:undefined,
                    hander_cart: [goodsData]
                }
                console.log(subDaata)
                wx.showLoading({ title: '加载中...', mask: true })

                synmtAllShoppingCart(subDaata).then(res => {
                    getmtCartAllData({shop_id: this.shop_id,cart_id:this.cart_id?this.cart_id:undefined}).then(res => {
                        wx.hideLoading();
                        this.baseData = res
                        console.log(this.baseData)
                        this.showSelect()
                        this.$emit('removerCartNum')
                    })
                })
            },
            showSelect(){
                this.num=0
                this.nonum=0
                this.showBuy=true
                this.numbtn=true
                this.weight=true
                this.showLow=false
                console.log(this.baseData)
                var that =this
                if(this.baseData.cart_product_type_list){
                    this.baseData.cart_product_type_list.map((item,index)=>{
                        item.check=true
                        item.cart_info_product_list.map(res=>{
                            res.cart_product_list.map(data=>{
                                if(data.product_status==1){
                                    this.showLow=true
                                }
                                data.showDel=0
                                if(data.is_check){
                                    var num1 = data.quantity
                                    that.num=data.quantity+that.num
                                    // this.product_weight+=data.product_weight
                                }
                                if(data.quantity>data.shop_quantity&&data.is_check){
                                    this.nonum+=data.quantity-data.shop_quantity
                                }
                            })
                        })
                    })
                }
                console.log(this.baseData)
                if(this.nonum>0){
                    this.numbtn=false
                    this.tiptext=`${this.nonum}件商品库存不足，忽略该商品可继续下单~`
                }
                if(this.product_weight>6){
                    this.numbtn=false
                    this.tiptext='暂时只支持闪送6kg以内的商品哦~'
                }
                if(this.num>6){
                    this.numbtn=false;
                    this.tiptext='暂时只支持闪送6件以内的商品哦~'
                }
                if(this.num>6||this.product_weight>6){
                    this.showBuy=false;
                }

                wx.hideLoading();
            },
            //subBuy
            subBuy(){
                if(!this.showBuy){
                    return
                }
                if(!wx.getStorageSync('token')){
                    wx.navigateTo({
                        url:`/pages/userCenter/login/wxLogin/main`
                    });
                    return
                }
                this.baseData.cart_product_type_list.forEach((item,index)=>{
                    this.subData[index]=[]
                    // item.num=0
                    // item.money=0
                    item.cart_info_product_list.forEach(res=>{
                        res.cart_product_list.forEach(data=>{
                            if(data.is_check||data.product_type){
                                this.subData[index].push(data)
                                // item.num+=data.quantity
                                // item.money+=data.sale_price*data.quantity
                            }
                            // if(data.is_check&&data.sale_quantity<data.quantity){
                            //     this.noData.push(data)
                            // }
                        })
                    })
                })
                console.log( this.subData)

                var skulist=[]
                wx.showLoading({ title: '加载中...', mask: true })

                for(var i =0;i<this.subData.length;i++){
                    if(this.subData[i].length){
                        this.subData[i].forEach(item=>{
                            // if(item.sale_quantity){
                                // if(item.sale_quantity>item.quantity){
                                    var data={
                                        staff_id: item.staff_id,
                                        marketing_title:item.marketing_title,
                                        sku: item.sku,
                                        img: item.image,
                                        stock: item.stock,
                                        qty: item.quantity,
                                        sale_price: item.sale_price,
                                        product_status:item.product_status,
                                        product_type: item.product_type,
                                        list_price: item.list_price,
                                    }
                                // }
                                // else{
                                //     var data={
                                //         staff_id: item.staff_id,
                                //         marketing_title:item.marketing_title,
                                //         sku: item.sku,
                                //         img: item.image,
                                //         stock: item.stock,
                                //         qty: item.sale_quantity,
                                //         sale_price: item.sale_price,
                                //         product_status:item.product_status,
                                //         product_type: item.product_type,
                                //         list_price: item.list_price,
                                //     }
                                // }
                                skulist.push(data)
                            // }
                        })
                        break
                    }

                }
                console.log(skulist)
                wx.navigateTo({
                    url: '/pages/confirm/main?shop_id='+this.shop_id+'&order_type=2&is_use_vip='+(this.is_use_vip?'1':'0')+'&skulist='+JSON.stringify(skulist),
                })
                this.close();
            },
            close(){
                console.log(111)
                this.$emit('closeModel')
            },
            select(data,cart_type){
                var that =this
                console.log(data.is_check)
                var arr=[]
                var goodsData={
                    cart_id:this.cart_id?this.cart_id:undefined,
                    sku:data.sku,
                    shop_id:this.shop_id,
                    quantity:0,
                    hander_type:1,
                    is_check:data.is_check?0:1,
                    cart_type:cart_type,
                    is_use_vip:this.baseData.is_use_vip
                }
                arr.push(goodsData)
                var subDaata={
                    cart_id:this.cart_id?this.cart_id:undefined,
                    shop_id:this.shop_id,
                    is_use_vip:this.baseData.is_use_vip,
                    hander_cart:arr
                }
                wx.showLoading({ title: '加载中...', mask: true })

                synmtAllShoppingCart(subDaata).then(res=>{
                    that.baseData=res
                wx.hideLoading()
                that.showSelect()

                // getmtCartAllData({shop_id:this.shop_id,cart_id:this.cart_id?this.cart_id:undefined}).then(res=>{
                //         wx.hideLoading()
                //     })
                    // this.baseData=res
                // console.log(this.baseData)

                // this.showSelect()

                    // getmtCartAllData({shop_id:this.shop_id}).then(res=>{
                    // })
                })
            },

            doGoods(data,cart_type,num){
                console.log(this.cart_id)
                if((data.quantity==1&&num==-1)||(data.quantity==99&&num==1)){
                    return false
                }
                var goodsData={
                    cart_id:this.cart_id?this.cart_id:undefined,
                    sku:data.sku,
                    shop_id:this.shop_id,
                    quantity:num,
                    hander_type:1,
                    is_check:data.is_check,
                    cart_type:cart_type,
                    is_use_vip:this.baseData.is_use_vip
                }
                var subDaata={
                    cart_id:this.cart_id?this.cart_id:undefined,
                    shop_id:this.shop_id,
                    is_use_vip:this.baseData.is_use_vip,
                    hander_cart:[goodsData]
                }
                wx.showLoading({ title: '加载中...', mask: true })

                console.log(subDaata)
                synmtAllShoppingCart(subDaata).then(res=>{
                    getmtCartAllData({shop_id:this.shop_id,cart_id:this.cart_id?this.cart_id:undefined}).then(res=>{
                        wx.hideLoading()
                        this.baseData=res
                        this.showSelect()
                        console.log(res)
                    })
                })
            }

        }
    }
</script>

<style scoped>
    .huangou{
        font-size:20rpx;
        padding: 3rpx 4rpx;
        border: 1px solid #FF5500;
        color: #FF5500;
        border-radius: 8rpx;
    }
    .chu-list_content{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .close-dialog{
        height: 44rpx;
        width: 44rpx;
        position: absolute;
        right: 20rpx;
        top: 20rpx;;
    }
    .zenp-msg{
        font-size: 24rpx;
        width: 400rpx;
        color: #666;
        padding: 10rpx;
        display: inline-block;
        vertical-align: middle;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;

    }
    .zenp-num{
        vertical-align: middle;
        font-size: 22rpx;

    }
    .chu-list{
        display: flex;
        padding: 20rpx 40rpx;
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #333333;
        letter-spacing: 0;
        line-height: 32px;
    }
    .chu-list .circle{
        padding-right: 20rpx;
    }
    .chu-title{
        font-family: PingFangSC-Medium;
        font-size: 30rpx;
        color: #333333;
        text-align: center;
        height: 80rpx;
        line-height: 80rpx;
        font-weight: bold;
    }
    .chuxiao-dialog{
        min-height: 200rpx;
        background: #fff;
        width: 100%;
        position: absolute;
        bottom: 0;
        border-top-left-radius: 15rpx;
        border-top-right-radius:15rpx ;
    }
    .promo-t{
        line-height: 50rpx;
    }
    .promo-t .skip{
        color: #333;
        padding-top: 10rpx;
        font-weight: normal;
    }
    .chuxiao-s{
        font-size: 22rpx;
        padding: 2rpx 10rpx;
        background: #eee;
        border-radius: 20rpx;
        margin-left: 80rpx;
    }
    .gray{
        color: #eee!important;
    }
    .dialog-input{
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.3);
    }
    .input-title{
        font-size: 28rpx;
        line-height: 60rpx;
        padding-left: 40rpx;
        height: 60rpx;
        z-index: 999;
    }
    .num-input{
        margin:0 20rpx;
        width: 560rpx;
        font-size:26rpx;
        border-bottom: 3px solid #429984;
        color:#429984;
    }
    .btn-p{
        padding-top: 40rpx;
        text-align: right;
        padding-right: 40rpx;
    }
    .quxbtn,.quebtn{
        padding: 20rpx;
        font-size: 28rpx;
    }
    .input-dialog{
        width:600rpx;
        height: 250rpx;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -300rpx;
        margin-top: -125rpx;
    }
    .bg_rule{
        width: 292rpx;
        height: 120rpx;
        position: absolute;
        top: 40rpx;
        margin-left: -140rpx;
        z-index: 99;

    }
    .dialog-tip{
        z-index: 100;
        display: inline-block;
        position: absolute;
        top: 80rpx;
        line-height: 25rpx;
        text-align: left;
        width: 280rpx;
        height: 100rpx;
        margin-left: -120rpx;
        font-size: 24rpx;
    }
    .ti-box{
        position: relative;
    }
    .ti-box .sanj{
        top: 35rpx;
        margin: 0;
        margin-left: -100rpx;

    }
    .icon-tip{
        height: 30rpx;
           width: 30rpx;
        vertical-align: middle;
        padding-bottom: 5rpx;
        padding-right: 10rpx;
    }
    .pic-right{
        height: 22rpx;
        width: 12rpx;
        padding-left: 10rpx;
        padding-bottom: 5rpx;
        vertical-align: middle;
        display: inline-block;
    }
    .zanwei-tip{
        font-size: 30rpx;
        padding-bottom:20rpx;
    }
    .zanwei-img{
        width: 266rpx;
        height: 222rpx;
        display: inline-block;
        padding: 40rpx;
    }
    .zanwei{
        text-align: center;
    }

    .tip,.skip{
        float: right;
        font-size: 24rpx;
        padding-right: 20rpx;
    }
    .skip{
        font-weight: 700;
        color: #FF5000;
        vertical-align: middle;

    }

    .list-tip{
        height: 80rpx;
        line-height: 80rpx;
        background: #fff;
    }

    .tip-btn{
        background: #FF5000;
        padding: 0 10rpx;
        height: 32rpx;
        line-height: 32rpx;
        font-size: 20rpx;
        margin-left: 40rpx;
        color: #fff;
        display: inline-block;
        text-align: center;
        border-radius: 16rpx;
        vertical-align: middle;

    }
    .tip-msg{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        max-width:440rpx ;
        display: inline-block;
        font-size: 24rpx;
        margin-left: 20rpx;
        vertical-align: middle;
    }
    .low-good{
        height: 80rpx;
        line-height: 80rpx;
        font-size: 24rpx;
        padding:0 20rpx;
    }
    .clear-good{
        font-size: 24rpx;
        color: #ff5000;
        float: right;
    }
    .box-low{
        margin-top: 20rpx;
        background: #fff;
        border-radius: 15rpx;
    }
    .gray-text{
        color: #999!important;
    }
    .gray{
        color: #eee!important;
    }
    .tiptxt{
        margin: 0 auto;
        padding: 5rpx 20rpx;
        background: #ff5000;
        color: #fff;
        font-size: 22rpx;
        border-radius: 20rpx;
        left:180rpx;
        position: absolute;
        top: -50rpx;
    }
    .only-g{
        width: 120rpx;
        position: absolute;
        bottom:20rpx;
        font-size: 20rpx;
        left: 95rpx;
        border-bottom-right-radius:16rpx;
        border-bottom-left-radius:16rpx;
        text-align: center;
        height: 32rpx;
        line-height: 32rpx;
        color: #fff;
        background: #999;
    }
    .btn{
        float: right;
        line-height: 70rpx;
    }
    .switch{
        height: 80rpx;
        line-height: 80rpx;
        background: #fff;
        font-size: 26rpx;
        margin-bottom: 3rpx;
        border-radius: 16rpx;
    }

    .switch-msg{
        padding-left: 20rpx;
        color: #333;
    }
    .list-good-box{
        overflow: hidden;
        background: #fff;
        border-radius: 10rpx;
        margin-top:5rpx;
    }
    .showDel{
        transform: translateX(-100rpx);
        transition: ease-out 0.5s;
    }
    .del{
        position: absolute;
        width: 100rpx;
        right: -100rpx;
        height: 160rpx;
        background: #ff5000;
        font-size: 26rpx;
        color: #fff;
        line-height: 160rpx;
        text-align: center;
        top: 0;
    }
    .sanj{
        width:0;
        height:0;
        border-width:0 15rpx 15rpx;
        border-style:solid;
        border-color:transparent transparent #fff;
        margin:40rpx auto;
        position:absolute;
        top:-55rpx;
        left: 55rpx;

    }
    .product_cartNum{
        position: absolute;
        left: 90rpx;
        top: -100rpx;
        height: 25rpx;
        color: #ffffff;
        min-width: 25rpx;
        text-align: center;
        line-height: 22rpx;
        border-radius: 50%;
        border: 2rpx solid #ff5000;
        background: #ff5000;
        font-size: 18rpx;
        z-index: 111;
    }
    .cartImg {
        position: absolute;
        top: -106rpx;
        left: 20rpx;
        width: 96rpx;
        height: 96rpx;
    }
    .graysureBuybtn{
        display: inline-block;
        height: 100%;
        width: 240rpx;
        line-height: 100rpx;
        background: #999;
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
        font-size: 30rpx;
        color: #fff;
    }
    .sureBuybtn{
        display: inline-block;
        height: 100%;
        width: 240rpx;
        line-height: 100rpx;
        background: #ff5000;
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
        font-size: 30rpx;
        color: #fff;
    }
    .all-monry{
        font-size: 26rpx;
        padding-top: 20rpx;
        padding-left: 20rpx;
    }
    .all-monry .money-span{
       color: #ff5000;
    }
    .coupon_money{
        font-size: 22rpx;
        padding-left: 20rpx;
        color: #666666;
    }
    .title{
        height: 80rpx;
        padding: 10rpx;
        padding-right: 20rpx;
        font-size: 28rpx;
        text-align: right;
        line-height: 80rpx;
        background: #fff;
        border-top-left-radius: 16rpx;
        border-top-right-radius: 16rpx;
    }

    .new-btn{
        background: #FF5000;
        height: 24rpx;
        font-size: 20rpx;
        color: #fff;
        padding: 0 15rpx;
        border-radius: 14rpx;
        line-height: 24rpx;

    }
    .list-bottom{
        position: absolute;
        bottom: 0;
        height: 45rpx;
        line-height: 45rpx;
        width: 100%;
        vertical-align: middle;
    }
    .money{
        color: #FF5000;
        font-size: 30rpx;
    }
    .goods-right{
        display: inline-block;
        width: 452rpx;
        height: 120rpx;
        padding-left: 20rpx;
        vertical-align: top;
        position: relative;
    }
    .add-reduce{
        font-size: 24rpx;
        float: right;
        height: 45rpx;
        line-height: 45rpx;
        padding-right: 20rpx;
    }
    .reduce,.add,.goods-num{
        display: inline-block;
        height: 40rpx;
        vertical-align: middle;
        line-height:  40rpx;
        text-align: center;
    }
    .reduce,.add{
        height: 40rpx;
        width: 40rpx;
        vertical-align: middle;

    }
    .goods-num{
        width: 68rpx;
        height: 40rpx;
        background: #F6F6F6;
        text-align: center;
        font-size: 28rpx;

    }
    .goods-msg{
        font-size: 26rpx;
        font-size: 26rpx;
        /*overflow:hidden;*/
        /*text-overflow:ellipsis;*/
        /*white-space:nowrap;*/
        padding: 3rpx;
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:1;
        -webkit-box-orient: vertical;
    }
    .goods-attr{
        font-size: 20rpx;
        color: #666;
    }
    .goods-img{
        height: 120rpx;
        width: 120rpx;
        vertical-align: middle;
        margin-left: 20rpx;
        border-radius: 16rpx;
    }
    .circle{
        display: inline-block;
        height: 36rpx;
        width: 36rpx;
        vertical-align: middle;
        padding-left: 20rpx;
        vertical-align: middle;
    }
    .no-low{
        width: 56rpx;
        vertical-align: middle;
        background: #eee;
        text-align: center;
        display: inline-block;
        font-size: 20rpx;
        padding: 5rpx 0;
        border-radius: 20rpx;
    }
    .list-goods{
        min-height: 120rpx;
        padding: 20rpx;
        position: relative;
        background: #fff;
        border-radius: 16rpx;
        margin-bottom: 2px;
    }
    .dialog{
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.5);
        z-index:9999;
    }
    .content{
        height: 940rpx;
        width: 100%;
        position: absolute;
        background: #eee;
        bottom: 0;
        border-radius: 16rpx;
        border-top-left-radius: 16rpx;
        border-top-right-radius: 16rpx;
    }
    .list-box{
        max-height: 700rpx;
        height: 700rpx;
        overflow: auto;
        background: #eee;
        padding: 20rpx;
    }
    .list-bottom-box{
        position: relative;
        height: 100rpx;
        background: #fff;
    }
</style>
