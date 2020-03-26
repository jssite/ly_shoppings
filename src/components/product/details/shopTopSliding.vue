<template>
    <div class="topSliding" >
            <!-- 分类栏 active-->
        <dl class="ci_tab">
            <dd class="ci_tabtitle" @click.stop="clickTab(idx)" v-for="(item,idx) in arrlist" v-if="type==1?(idx!=2):true" :class="{'active': curIdx==idx}" :key="idx">{{item}}</dd>
        </dl>
        <div   v-if="curIdx==0">
            <img v-if="goodsImgList.length>0" class='swperT1Img' mode="widthFix" v-for="(item,index) in goodsImgList" :key="index" :src="item.url">
            <div class="swipertext">
                <div class="swiperLineBox">
                    <span class="swiperline"></span>
                    <span class="swiperlineName">价格说明</span>
                    <span class="swiperline"></span>
                </div>
                <span class="swiperinfo"><text class="swipername">划线价格 :</text>指商品的专柜价、品牌价、正品零售价、厂商指导价，仅供参考</span>
                <span class="swiperinfo"><text class="swipername">未划线价格 :</text>指商品的实时标价、不因表述的差异改变性质。具体成交价格根据商品参加活动，或用户使用优惠券等发生变化，最终以订单结算页的价格为准</span>
                <span class="swiperinfo">此说明仅当出现价格比较时才有效，若有对价格进行特殊说明的以页面表述为准</span>
            </div>

            <div v-if="detail_text" class="detail_text">
                <wxParse :content="detail_text"/>
            </div>

        </div>
        <div  v-if="curIdx==1"  >
            <div class="swperT2" v-if="standards['商品编号']">
                <span class="text1">商品编号</span>
                <span class="text2">{{standards['商品编号']}}</span>
            </div>
            <div class="swperT2" v-if="standards['季节属性']">
                <span class="text1">季节属性</span>
                <span class="text2">{{standards['季节属性']}}</span>
            </div>
            <div class="swperT2" v-if="standards['尺码']">
                <span class="text1">尺码</span>
                <span class="text2">{{standards['尺码']}}</span>
            </div>
            <div class="swperT2" v-if="standards['材质']">
                <span class="text1">材质</span>
                <span class="text2">{{standards['材质']}}</span>
            </div>
            <div class="swperT2" v-if="standards['适合人群']">
                <span class="text1">适合人群</span>
                <span class="text2">{{standards['适合人群']}}</span>
            </div>
            <div class="swperT2" v-if="standards['适合性别']">
                <span class="text1">适合性别</span>
                <span class="text2">{{standards['适合性别']}}</span>
            </div>
            <div class="swperT2" v-if="standards['颜色']">
                <span class="text1">颜色</span>
                <span class="text2">{{standards['颜色']}}</span>
            </div>
            <div class="swperT2" v-if="standards['包装类型']">
                <span class="text1">包装类型</span>
                <span class="text2">{{standards['包装类型']}}</span>
            </div>
            <div class="swperT2" v-if="standards['重量']">
                <span class="text1">重量</span>
                <span class="text2">{{standards['重量']}}</span>
            </div>
            <div class="swperT2" v-if="standards['单品重量']">
                <span class="text1">单品重量</span>
                <span class="text2">{{standards['单品重量']}}</span>
            </div>
            <div class="swperT2" v-if="standards['规格描述']">
                <span class="text1">规格描述</span>
                <span class="text2">{{standards['规格描述']}}</span>
            </div>
            <div class="swperT2" v-if="standards['规格']">
                <span class="text1">规格</span>
                <span class="text2">{{standards['规格']}}</span>
            </div>
            <div class="swperT2" v-if="standards['材质']">
                <span class="text1">材质</span>
                <span class="text2">{{standards['材质']}}</span>
            </div>
            <div class="swperT2" v-if="standards['保质期']">
                <span class="text1">保质期</span>
                <span class="text2">{{standards['保质期']}}</span>
            </div>
            <div class="swperT2" v-if="standards['年龄段']">
                <span class="text1">年龄段</span>
                <span class="text2">{{standards['年龄段']}}</span>
            </div>

        </div>
        <div  v-if="curIdx==2&&type!=1" >
            <div class="swperT3box" v-if="!is_haitao">
                <h5 class="title_h5">送货说明与售后服务</h5>
                <div class="article">
                    <h3 class="h3">乐友 “正品行货” 保障服务承诺：</h3>
                    <p class="text" >乐友孕婴童向您保证所售商品均为正品行货，均可开具正规发票（海淘商品除外）并享受国家规定的售后服务。</p>
                    <p class="text">注：因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，本司不能确保客户收到的货物与商城图片、产地、附件 说明完全一致。只能确保为原厂正货！并且保证与当时市场上同样主流新品一致。若本商城没有及时更新，请大家谅解！</p>
                </div>
                <h5 class="title_h5">运费说明</h5>
                <div  class="article">
                    <h3 class="h3">运费标准:</h3>
                    <p class="text" >1、北京、天津满79元包邮，其他省份（仅限大陆）满99包邮，少量不包邮商品除外，具体以提交订单时产生的运费为准；</p>
                    <p class="text">2、未满包邮条件的订单运费如下：</p>
                    <p class="text" >A 类地区：包括北京、天津满79免运费，订单金额不满79元运费5元</p>
                    <p class="text">B 类地区：包括陕西 、江苏 、浙江、 安徽 、上海、 山西、 山东、 辽宁、 吉林、 黑龙江、 湖北 、湖南、 广东、 福建 、河南、 江西、 四川、 重庆 、内蒙 、河北满99免运费，订单金额不满99元，运费8元</p>
                    <p class="text">C 类地区：包括云南、 贵州、 广西 、海南、 甘肃、 宁夏 、青海 、新疆、 西藏满99免运费，订单金额不满99元，运费15元</p>
                    <p class="text">3、海淘商品运费标准见海淘商品运费规则，无特殊说明的同本规则一致；</p>
                    <p class="text">4、厂家直发商品运费规则同网站规则，另有说明的以单个商品运费说明及购物车显示运费为准</p>
                </div>
                <div class="article">
                    <h3 class="h3">温馨提示：</h3>
                    <p class="text">1、所有订单按照乐友库存及订单目的地分配库存及快递，确保安全快速送到您的手中；</p>
                    <p class="text">2、如遇节假日、天气问题、国家政策等特殊情况，会有部分区域禁运，航空运输限制类等情况，配送时效会有所延迟，请您谅解！</p>
                    <p class="text">3、为保障您的权益，请与配送员当面核对商品种类、数量、规格、赠品、金额等是否与订单一致，准确无误再进行签收。</p>
                </div>
                <div class="article">
                    <h3 class="h3">发货时间：</h3>
                    <p class="text">1、正常情况下每天16：00之前的订单当天发货，16:00之后的订单次日发货，如遇节假日、大促期间，发货时间以咨询客服为准！所有订单乐友负责安排合适的快递发出，不接受指定快递；</p>
                    <p class="text">2、海淘商品因受海关及发货国家地区以及流程的特殊性，与一般贸易商品有所区别，具体以页面公式为准</p>
                    <p class="text">3、厂家直发商品以页面公式为准</p>
                </div>
                <div class="article">
                    <h3 class="h3">特别说明：</h3>
                    <p class="text">1、兑换礼品配送</p>
                    <p class="text">积分兑换或通过乐友其他途径兑换的礼品均随订购的其它商品一起发出；</p>
                    <p class="text">2、退货运费处理</p>
                    <p class="text">商品质量问题、乐友原因等造成退换货：免费办理，收取的原运费退还客户；需要客户提供实物照片，经客服确认后方可办理退货，原运费退还到客户在乐友的预付款帐号中；</p>
                    <p class="text">3、换货运费处理</p>
                    <p class="text">商品质量问题、乐友原因等造成换货：免费换货；</p>
                </div>
                <h5 class="title_h5">退换货说明</h5>
                <div class="article">
                    <p class="text">本规定依据《中华人民共和国消费者权益保护法》、《中华人民共和国产品质量法》等法律法规制定。</p>
                    <h3 class="h3">退换货政策：</h3>
                    <!--<h3>货到付款的订单退换货政策：</h3>-->
                    <p class="text">1、网站实行7日无理由退换货（法律规定不适用七日无理由退换货的除外）；</p>
                    <p class="text">提示：由于商品质量问题和乐友原因造成退换货，乐友承担相关费用；由于其他原因造成退换货，需客户承担相关费用；</p>
                    <p class="text">2、 乐友所售均为正品，为保护您的利益，以下情况视为影响二次销售，除因质量问题之外，均不予办理退换货：</p>
                    <!--<p>3、电器/车床/鞋/防辐射服类商品售出后30天内有质量问题，需要厂家鉴定后方可退换货，退货时凭购物小票或发票，配件齐全；超过30天的，参照厂家的三包政策，由厂家负责维修；</p>
                    <p>4、退货时应退回相应的赠券/赠品/积分/返利；</p>
                    <p>5、换货时不同类商品换货，需同时更换或退回相应赠券/赠品；</p>
                    <p>6、乐友所售均为正品，为保护您的利益，以下情况视为影响二次销售，除因质量问题之外，均不予办理退换货：</p>-->
                    <ul class="Ul">
                        <li class="li">1）商品标签涂改、移位、撕毁；</li>
                        <li class="li">2）商品原包装已打开或已安装；</li>
                        <li class="li">3）商品已通电、过水、充气、插入卡槽等；</li>
                        <li class="li">4）商品已安装电池开机启动；</li>
                        <li class="li">5）商品已使用。</li>
                        <li class="li">6）部分商品经特别提示（标题，图片，详情页等）不能退换货的。</li>
                    </ul>
                    <p class="text">3、根据国家相关律法法规，以下情形，均不予办理退换货：</p>
                    <ul class="Ul">
                        <li  class="li">1）因人为疏忽或使用不当而导致商品损坏的；</li>
                        <li  class="li">2）未经授权的维修、误用、碰撞、疏忽、不正确的安装等原因所造成的商品质量问题；</li>
                        <li  class="li">3）商品的外包装、附件、赠品、说明书不完整，发票缺失或涂改；</li>
                        <li  class="li">4）商品使用的正常磨损；</li>
                        <li  class="li">5）不适用七日无理由退货的商品（订单提交时弹窗提示提示）</li>
                    </ul>
                    <p class="text">4、退换货说明： </p>
                    <ul class="Ul">
                        <li  class="li">1）礼盒或套装中的商品不可以部分退换货； </li>
                        <li  class="li">2）如发生退货，乐友同时收回促销礼券、赠品及相应积分； </li>
                        <li  class="li">3）使用乐友礼金卡、电子代金券购买的商品发生退货时，礼金卡退款退回礼金卡内；电子代金劵根据退货原因及电子券本身的条件，如符合退还条件，按实际使用比例退回注册账户内；非乐友原因退换货，造成优惠券过期、失效等情况，乐友不再退还； </li>
                        <li  class="li">4）请按照客服提供的地址寄回商品，其他地址无法直接办理； </li>
                        <li  class="li">5）退回的包裹请您先行垫付，乐友收到退回包裹后，将退还相关运费；如与客服协商确认到付，请不要用顺丰到付和邮局普通邮寄；</li>
                    </ul>
                    <p  class="text">5、海淘商品因购买方式的独特性，以页面公示为准。 </p>
                    <p  class="text">6、厂家直发商品因厂家直接发货，以产品页面介绍为准。 </p>
                </div>
                <div class="article">
                    <h3 class="h3">退换货方法： </h3>
                    <p class="text">退换货办理，请登录后点击“我的乐友”查找相应订单进行退换货，根据提示办理</p>
                </div>
                <div class="article">
                    <h3 class="h3">温馨提示：</h3>
                    <p class="text">如是由于商品质量问题或是我们其他的服务原因，为您造成需要退款，我们将为您承担因退款所产生的相关手续费，如是由于您个人原因造成退款，需要您自行承担因退款所产生的相关手续费；费用收取额度将按照第三方支付平台规定从货款中扣除，为您带来不便请您谅解；</p>
                </div>
            </div>
            <div class="swperT3box" v-else>
                <div class="tab_boxb">
                    <div class="midd_con">
                        <article class="article">
                            <p class="text">全球购商品从国外进口至国内并发货的全程由海关监管，从海外直发或保税仓发货,预计在4-20个工作日送达（如订单出现海关申报和清关异常，发货会有延迟，乐友会尽快给予协调处理）</p>
                            <p class="text">根据海关总署对于跨境商品的管理规定：从2017年4月8日起对于跨境商品征收跨境综合税；并且每个ID单次交易限值为2000元，年度交易限值为20000元；对于超出规定限值的订单，系统会进行退单处理</p>
                            <p class="text">全球购商品（涉及海关清关、税费以及货品安全问题）非质量问题不支持7天无理由退换货；</p>
                        </article>
                        <article class="article">
                            <h3 class="h3">全球购提示：</h3>
                            <p class="text">1、结算时需要提供真实的收货人姓名、身份证号码用于全球购商品入境清关（乐友严格为该信息保密）</p>
                            <p class="text">2、全球购的购物属于境外购买行为，因此乐友无法为您开具发票。</p>
                            <p class="text">3、当您下单支付后，订单提交至海关申报及纳税，客户将不能取消订单，请知晓并谅解。</p>
                            <p class="text">4、如出现售后问题，请及时联系乐友客服，电话：400-666-9998</p>
                        </article>
                        <article class="article">
                            <h3 class="h3">对于您在乐友全球购上购买的商品，若符合以下情况自客户收到商品7日内可以申请退换货</h3>
                            <p class="text">1、商品在运输过程中造成的破损、内容物泄漏、性能故障，经售后人员核查情况属实</p>
                            <p class="text">2、商品丢件、漏发经快递人员证明及售后人员核查情况属实</p>
                            <p class="text">3、收到商品与实际购买商品不符，经客户提供证明及售后人员核查情况属实</p>
                            <p class="text">4、收到的商品（无提示效期将到）已过保质期或离保质期限在3个月内，经售后人员核查情况属实</p>
                        </article>
                        <article class="article">
                            <h3 class="h3">申请退货流程：</h3>
                            <p class="text">1、请确保您的商品符合退换货政策。</p>
                            <p class="text">2、拨打客服电话400-666-9998，说明退换货原因，提供相关证明资料</p>
                            <p class="text">3、客服人员审核确定</p>
                            <p class="text">4、如同意您的退款申请，退款将按照原路径退回或者商品的补发。</p>
                        </article>
                        <article class="article">
                            <h3 class="h3">以下情况不适用全球购退货政策：</h3>
                            <p class="text">1、任何非乐友全球购出售的商品；</p>
                            <p class="text">2、超过受理时限（签收后7天内未提交申请将不能申请售后）；</p>
                            <p class="text">3、由于运输过程中的不可抗拒因素，商品外包装出现轻微破损，但不影响正常使用；</p>
                            <p class="text">4、因涉及到食品安全问题，食品类商品（包括奶粉）不支持无理由退换货；</p>
                            <p class="text">5、商品出售时，已在页面明示效期；</p>
                            <p class="text">6、任何因客户的非正常使用及保管，导致出现商品质量问题的；</p>
                            <p class="text">7、一个订单不可以部分退换货；</p>
                            <p class="text">8、其他依法不办理退货的；</p>
                        </article>
                    </div>
                </div>
            </div>
        </div>
        <img src="/static/images/public/public_link_mall.png" @click.stop='ongotoIndex' class="upImg" alt="">
        <img src="/static/images/public/public_link_top.png" class="upImg Top" @click.stop='goTop'>
    </div>
</template>
<script>
import { getDoodsImgTxtData } from '@/api'
import wxParse from "mpvue-wxparse";
export default {
    components: {
        wxParse
    },
     props: {
        sku: {
            type: String,
            default: ''
        },
         type:"",
        is_haitao: {
            type: Boolean,
            default:false,
        }
    },
    data(){
        return{
            sheight:0,
            imageNum:0,
            detail_text:'',  //详情信息
            goodsImgList:[], //存储商品图片
            curIdx:0,  //初始默认的
            standards:'',
            arrlist:[
                '图文详情','参数规格','售后服务'
            ]
        }
    },
    onLoad(options){
        let sku =  wx.getStorageSync('sku')
        this.funDoodsImgTxt({sku:options.sku || sku})
        this.sheight=wx.getStorageSync('windowHeight')

    },

    methods:{
        bindchange(e) {  //滑动
            this.curIdx = e.target.current
        },
        clickTab(i) {  //点击
            if (this.curIdx === i) return
            this.curIdx = i
        },
        funDoodsImgTxt(params){
            getDoodsImgTxtData(params).then(res=>{

                if(res.product_images_detail.product_images){
                    res.product_images_detail.product_images.map(r=>{
                        this.imageNum +=r.height
                    })
                }
                this.goodsImgList = res.product_images_detail.product_images;
                this.detail_text = res.product_images_detail.detail_text;
                let arr = []
                this.standards=res.standards
                for( let keys in res.standards){
                    arr.push(res.standards[keys])
                }
            })
        },
        ongotoIndex(){
            wx.switchTab({url:'/pages/index/main'})
        },
        goTop: function (e) {  // 一键回到顶部
            if (wx.pageScrollTo) {
                wx.pageScrollTo({
                    scrollTop: 0
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                })
            }
        },
    }
}
</script>
<style scoped>

    .topSliding{
        position: relative;
        background: #fff;
    }

    .Top{
        bottom: 200rpx !important;
    }
    .upImg{
        position: fixed;
        height: 80rpx;
        width: 80rpx;
        bottom: 295rpx;
        right: 0rpx;
    }
    /* swperT2 */
    .swperT2{
        display: flex;
        font-size: 24rpx;
        color: #999;
        height: 88rpx;
        background: #ffffff;
        line-height: 88rpx;
        padding-left: 20rpx;
        border-bottom: 1rpx solid #f3f5f7;
    }
    .swperT2 .text1{
        color: black;
        width: 200rpx;
    }
    .swperT2 .text2{
        color: black;
    }
    /* 顶部 */
    .active{
        color: #FF5000 !important;
        border-bottom: 4rpx solid #FF5000;
    }
    .ci_tab{
        height: 88rpx;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content:space-around;
        font-family: PingFangSC-Regular;
        font-size: 30px;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
        background: #ffffff;
        box-sizing: border-box;
        overflow: hidden;
        border-bottom: 1rpx solid #f3f5f7;
    }
    .ci_tabtitle{
        width: 150rpx;
        height: 88rpx;
        line-height: 88rpx;
        box-sizing: border-box;
    }
    /* 图文1 */
    .swperT1Img{
        height: 100%;
        width: 100%;
    }
    .detail_text{
        font-size:22rpx;
        padding-top:20rpx;
        font-family: PingFangSC-Regular;
        background: #ffffff;
    }
    .detail_text .inline{
        font-size: 26rpx !important;
    }
    .detail_text view{
        font-size: 24rpx !important;
    }
    .swipertext{
        display: flex;
        align-content: center;
        flex-direction: column;
        padding:10rpx 26rpx 0;
        background: #fff;
    }
    .swiperinfo{
        color:#999;
        line-height:40rpx;
        font-size:24rpx;
        margin-bottom: 20rpx;
    }
    .swipername{
        font-size:26rpx;
        color:#333;
        margin-right: 15rpx;
    }
    .swiperLineBox{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 40rpx;
        margin-top: 25rpx;
    }
    .swiperline{
        height: 3rpx;
        background: #f3f5f7;
        width:260rpx;
    }
    .swiperlineName{
        font-size: 30rpx;
        color:#333;
    }


    /* 售后信息 */
    .swperT3box{
        font-family: "Microsoft YaHei", 微软雅黑, Arial;
        padding-bottom:20rpx;
    }
    .title_h5{
        font-size: 26rpx;
        color: #333;
        height: 60rpx;
        line-height: 60rpx;
        background-color: #fff4dd;
        padding-left: 26rpx;
        font-weight: bold;
        margin-top: 40rpx;
    }
    .swperT3box .article{
        border-bottom: 0;
        padding: 10rpx 26rpx 0px;
    }
    .article .h3{
        font-size: 26rpx;
        margin-top: 20rpx;
        color: #333;
    }
    .article .text{
        color: #999;
        line-height: 40rpx;
        font-size: 26rpx;
        margin-top: 20rpx;
    }
    .Ul{
        padding-left: 0;
        list-style-type: none;
    }
    .Ul .li{
        color: #999;
        font-size: 26rpx;
        padding-left: 26rpx;
        line-height: 40rpx;
    }
.tab_boxb {
    font-size: 24px;
    padding: 0 20px;
    line-height: 30px;
    text-align: justify;
}

</style>

