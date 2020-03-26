<template>
  <div>
    <!-- 0  普通订单(快递和闪送) -->
    <div class="address" v-if="order_type===0">
      <div v-if="is_show_flash" class="addressTop" :custom="1" @click="funcSelectWay(1)">
        <img
          v-show="is_select_meituan"
          style="width:36rpx; height:36rpx;"
          src="/static/images/public/publicCircle-checkOn.png"
        />
        <img
          v-show="!is_select_meituan"
          style="width:36rpx; height:36rpx;"
          src="/static/images/public/publicCircle-checkOff.png"
        />
        <span class="addressWay">乐闪送</span>
        <!-- 暂时不需要展示闪送提示 -->
        <!-- <span
          style="color:#ff5000;font-size:26rpx;margin-left:20rpx;"
          v-if="header_info.leyou_flash"
        >{{header_info.leyou_flash.desc}}</span>-->
      </div>
      <img
        v-show="is_select_meituan"
        src="/static/images/twohr_shop_bgarrow.png"
        class="shopBgarrow"
      />
      <div class="addressContent" v-show="is_select_meituan">
        <div class="addressContentTop" @click="funcAddressClick">
          <div style="padding-bottom:30rpx">
            <div class="nameTel">
              <div v-if="header_info.consignee_name" class="name">{{header_info.consignee_name}}</div>
              <div v-else class="name">请添加收货地址</div>
              <div class="tel" style="margin-left: 50rpx;">{{header_info.consignee_mobile}}</div>
            </div>
            <div v-if="header_info.post_address" class="addressText">{{header_info.post_address}}</div>
            <div v-else class="addressText">不知道将您的宝贝送到哪里</div>
          </div>
          <img style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png" />
        </div>
        <div
          class="addressContentBottom"
          @click="funcArrivalTime"
          style="justify-content: space-between;"
        >
          <div class="addressArrivalDesc">预计送达时间</div>
          <div class="addressArrivalTime">
            <span style="margin-right:20rpx">{{arrival_time}}</span>
            <img
              style="width:13rpx;height:23rpx; marign-left:20rpx"
              src="/static/goodsdetail/lecard_arrow_right.png"
            />
          </div>
        </div>
      </div>
      <div class="addressTop" :custom="2" @click="funcSelectWay(0)">
        <img
          v-show="!is_select_meituan"
          style="width:36rpx; height:36rpx;"
          src="/static/images/public/publicCircle-checkOn.png"
        />
        <img
          v-show="is_select_meituan"
          style="width:36rpx; height:36rpx;"
          src="/static/images/public/publicCircle-checkOff.png"
        />
        <span class="addressWay">快递配送</span>
        <!-- <span style="color:#ff5000;font-size:26rpx;margin-left:20rpx;">{{header_info.msg}}</span> -->
      </div>
      <img
        v-show="!is_select_meituan"
        src="/static/images/twohr_shop_bgarrow.png"
        class="shopBgarrow"
      />
      <div class="addressContent" v-show="!is_select_meituan">
        <div class="addressContentTop" @click="funcAddressClick">
          <div style="padding-bottom:30rpx">
            <div class="nameTel">
              <div v-if="header_info.consignee_name" class="name">{{header_info.consignee_name}}</div>
              <div v-else class="name">请添加收货地址</div>
              <div class="tel" style="margin-left: 50rpx;">{{header_info.consignee_mobile}}</div>
            </div>
            <div v-if="header_info.post_address" class="addressText">{{header_info.post_address}}</div>
            <div v-else class="addressText">不知道将您的宝贝送到哪里</div>
          </div>
          <img style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png" />
        </div>
      </div>
      <img
        style="width:100%;height:8rpx;vertical-align: bottom"
        src="/static/images/confirm/order_way_line.png"
      />
    </div>

    <!-- 1 门店自提  -->

    <div class="address" v-else-if="order_type===1">
      <div class="addressTop">
        <img
          style="width:36rpx; height:36rpx;"
          src="/static/images/public/publicCircle-checkOn.png"
        />
        <span class="addressWay">门店自提</span>
        <span
          style="color:#ff5000;font-size:26rpx;margin-left:20rpx;"
          v-if="header_info.msg"
        >{{header_info.msg}}</span>
      </div>
      <img src="/static/images/twohr_shop_bgarrow.png" class="shopBgarrow" />
      <div class="addressContent">
        <div class="addressContentTop" v-if="header_info.shop_info">
          <div style="padding-bottom:30rpx">
            <div class="nameTel">
              <div class="name">{{header_info.shop_info.shop_name}}</div>
              <div class="tel" style="margin-left: 50rpx;">{{header_info.shop_info.phone}}</div>
            </div>
            <div class="addressText">{{header_info.shop_info.shop_address}}</div>
          </div>
          <!-- <img style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png"> -->
        </div>
        <div class="addressContentBottom">
          <img style="height:26rpx; width:26rpx;" src="/static/images/public/public_icon_tip.png" />
          <span style="margin-left:20rpx;font-size:26rpx;color:#333">请在7个工作日内到门店提货</span>
        </div>
      </div>
      <img
        style="width:100%;height:8rpx;vertical-align: bottom"
        src="/static/images/confirm/order_way_line.png"
      />
    </div>

    <!--  2    闪送 -->
    <div class="address" v-else-if="order_type===2">
      <div class="addressTop">
        <img
          style="width:36rpx; height:36rpx;"
          src="/static/images/public/publicCircle-checkOn.png"
        />
        <span class="addressWay">乐闪送</span>
        <!-- 闪送暂时不需要展示闪送提示 -->
        <!-- <span
          style="color:#ff5000;font-size:26rpx;margin-left:20rpx;"
          v-if="header_info.leyou_flash"
        >{{header_info.leyou_flash.desc}}</span>-->
      </div>
      <img src="/static/images/twohr_shop_bgarrow.png" class="shopBgarrow" />
      <div class="addressContent">
        <div class="addressContentTop" @click="funcAddressClick">
          <div style="padding-bottom:30rpx">
            <div class="nameTel">
              <div v-if="header_info.consignee_name" class="name">{{header_info.consignee_name}}</div>
              <div v-else class="name">请添加收货地址</div>
              <div class="tel" style="margin-left: 50rpx;">{{header_info.consignee_mobile}}</div>
            </div>
            <div v-if="header_info.post_address" class="addressText">{{header_info.post_address}}</div>
            <div v-else class="addressText">不知道将您的宝贝送到哪里</div>
          </div>
          <img style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png" />
        </div>
        <div
          class="addressContentBottom"
          @click="funcArrivalTime"
          style="justify-content: space-between;"
        >
          <div class="addressArrivalDesc">预计送达时间</div>
          <div class="addressArrivalTime">
            <span style="margin-right:20rpx">{{arrival_time}}</span>
            <img
              style="margin-left:20rpx; width:13rpx;height:23rpx;"
              src="/static/goodsdetail/lecard_arrow_right.png"
            />
          </div>
        </div>
      </div>
      <img
        style="width:100%;height:8rpx;vertical-align: bottom"
        src="/static/images/confirm/order_way_line.png"
      />
    </div>

    <!-- 3:海淘  -->
    <div class="address" style="padding-top:20rpx;" v-else-if="order_type===3">
      <div class="addressContent">
        <div class="addressContentTop" @click="funcAddressClick">
          <div style="padding-bottom:30rpx">
            <div class="nameTel">
              <div v-if="header_info.consignee_name" class="name">{{header_info.consignee_name}}</div>
              <div v-else class="name">请添加收货地址</div>
              <div class="tel" style="margin-left: 50rpx;">{{header_info.consignee_mobile}}</div>
            </div>
            <div v-if="header_info.post_address" class="addressText">{{header_info.post_address}}</div>
            <div v-else class="addressText">不知道将您的宝贝送到哪里</div>
          </div>
          <img style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png" />
        </div>
        <div
          v-if="encry_id_num != ''"
          class="addressContentBottom"
          style="justify-content: space-between;padding:0 20rpx 0 50rpx"
        >
          <input
            type="text"
            class="card_content"
            :placeholder="encry_id_num"
            placeholder-style="color:#333333;"
          />
          <button class="invoice_button_activity" @click.stop="funcEeitId">编辑</button>
        </div>
        <div
          v-else
          class="addressContentBottom"
          style="justify-content: space-between;padding:0 20rpx 0 50rpx"
        >
          <input
            type="text"
            class="card_content"
            v-model="id_num"
            placeholder="请提供收货人的身份证号，要准确哦"
            placeholder-style="color:#333333;"
          />
          <button class="invoice_button_activity" @click.stop="funcSave">确认</button>
        </div>
      </div>
      <img
        style="width:100%;height:8rpx;vertical-align: bottom"
        src="/static/images/confirm/order_way_line.png"
      />
    </div>

    <!-- 4:预售  -->
    <!-- <div class="address" v-else-if="order_type===4">
      <div class="addressTop">
        <img style="width:20rpx; height:20rpx;background:#ff5000" src alt>
        <span class="addressWay">{{is_delivery?"乐闪送":"门店自提"}}</span>
        <span style="color:#ff5000;font-size:26rpx;margin-left:20rpx;">满99立减5元，每日仅限1单</span>
      </div>
      <img src="/static/images/twohr_shop_bgarrow.png" class="shopBgarrow">
      <div class="addressContent">
        <div class="addressContentTop">
          <div>
            <div class="nameTel">
              <div class="name">xxx</div>
              <div class="tel" style="margin-left: 50rpx;">1678902894844</div>
            </div>
            <div class="addressText">北京市朝阳区慈云寺住邦2000商务中心1号楼西区四层乐友前台</div>
          </div>
          <img style="width:20rpx;height:20rpx;background:red">
        </div>
      </div>
      <img style="width:100%;height:8rpx;background:#ff5000;vertical-align: bottom" src alt>
    </div>-->
    <!-- 5:扫码购 -->
    <div class="address" v-else-if="order_type==5">
      <div style="border-bottom:1rpx #eee solid;">
        <div class="addressTop" @click="funcScanClick(2)">
           <img
            v-show="!is_select_meituan"
            style="width:36rpx; height:36rpx;"
            src="/static/images/public/publicCircle-checkOn.png"
          />
          <img
            v-show="is_select_meituan"
            style="width:36rpx; height:36rpx;"
            src="/static/images/public/publicCircle-checkOff.png"
          />
          <span class="addressWay">门店自提</span>
          <span
            style="color:#ff5000;font-size:26rpx;margin-left:20rpx;"
            v-if="header_info.msg"
          >{{header_info.msg}}</span>
        </div>
      </div>

      <!-- <div v-if="is_show_flash">
        <div class="addressTop" :custom="1" @click="funcScanClick(1)">
          <img
            v-show="is_select_meituan"
            style="width:36rpx; height:36rpx;"
            src="/static/images/public/publicCircle-checkOn.png"
          />
          <img
            v-show="!is_select_meituan"
            style="width:36rpx; height:36rpx;"
            src="/static/images/public/publicCircle-checkOff.png"
          />
          <span class="addressWay">乐闪送</span>
        </div>
        <img
          v-show="is_select_meituan"
          src="/static/images/twohr_shop_bgarrow.png"
          class="shopBgarrow"
        />
        <div class="addressContent" v-show="is_select_meituan">
          <div class="addressContentTop" @click="funcAddressClick">
            <div style="padding-bottom:30rpx">
              <div class="nameTel">
                <div v-if="header_info.consignee_name" class="name">{{header_info.consignee_name}}</div>
                <div v-else class="name">请添加收货地址</div>
                <div class="tel" style="margin-left: 50rpx;">{{header_info.consignee_mobile}}</div>
              </div>
              <div v-if="header_info.post_address" class="addressText">{{header_info.post_address}}</div>
              <div v-else class="addressText">不知道将您的宝贝送到哪里</div>
            </div>
            <img style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png" />
          </div>
          <div
            class="addressContentBottom"
            @click="funcArrivalTime"
            style="justify-content: space-between;"
          >
            <div class="addressArrivalDesc">预计送达时间</div>
            <div class="addressArrivalTime">
              <span style="margin-right:20rpx">{{arrival_time}}</span>
              <img
                style="width:13rpx;height:23rpx; marign-left:20rpx"
                src="/static/goodsdetail/lecard_arrow_right.png"
              />
            </div>
          </div>
        </div>
      </div> -->
      <!-- <div v-else>
        <div class="addressTop" :custom="2" @click="funcScanClick(0)">
          <img
            v-show="is_select_meituan"
            style="width:36rpx; height:36rpx;"
            src="/static/images/public/publicCircle-checkOn.png"
          />
          <img
            v-show="!is_select_meituan"
            style="width:36rpx; height:36rpx;"
            src="/static/images/public/publicCircle-checkOff.png"
          />
          <span class="addressWay">快递配送</span>
        </div>
        <img
          v-show="is_select_meituan"
          src="/static/images/twohr_shop_bgarrow.png"
          class="shopBgarrow"
        />
        <div class="addressContent" v-show="is_select_meituan">
          <div class="addressContentTop" @click="funcAddressClick">
            <div style="padding-bottom:30rpx">
              <div class="nameTel">
                <div v-if="header_info.consignee_name" class="name">{{header_info.consignee_name}}</div>
                <div v-else class="name">请添加收货地址</div>
                <div class="tel" style="margin-left: 50rpx;">{{header_info.consignee_mobile}}</div>
              </div>
              <div v-if="header_info.post_address" class="addressText">{{header_info.post_address}}</div>
              <div v-else class="addressText">不知道将您的宝贝送到哪里</div>
            </div>
            <img style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png" />
          </div>
        </div>
      </div> -->
      <!-- <img
        style="width:100%;height:8rpx;vertical-align: bottom"
        src="/static/images/confirm/order_way_line.png"
      /> -->
    </div>

    <!-- 兑换券 -->
    <div class="address" v-else-if="order_type===6">
      <div class="addressTop">
        <img
          style="width:36rpx; height:36rpx;"
          src="/static/images/public/publicCircle-checkOn.png"
        />
        <span class="addressWay">快递配送</span>
        <!-- <span style="color:#ff5000;font-size:26rpx;margin-left:20rpx;">{{header_info.msg}}</span> -->
      </div>
      <img src="/static/images/twohr_shop_bgarrow.png" class="shopBgarrow" />
      <div class="addressContent">
        <div class="addressContentTop" @click="funcAddressClick">
          <div style="padding-bottom:30rpx">
            <div class="nameTel">
              <div v-if="header_info.consignee_name" class="name">{{header_info.consignee_name}}</div>
              <div v-else class="name">请添加收货地址</div>
              <div class="tel" style="margin-left: 50rpx;">{{header_info.consignee_mobile}}</div>
            </div>
            <div v-if="header_info.post_address" class="addressText">{{header_info.post_address}}</div>
            <div v-else class="addressText">不知道将您的宝贝送到哪里</div>
          </div>
          <img style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png" />
        </div>
      </div>
      <img
        style="width:100%;height:8rpx;vertical-align: bottom"
        src="/static/images/confirm/order_way_line.png"
      />
    </div>
    <!--砍价-->
    <div class="address" v-else-if="order_type==7">
      <div >
        <div style="border-bottom:1rpx #eee solid;" >
          <div class="addressTop" @click="funcScanClick(2)">
            <img
                    v-show="!is_select_meituan"
                    style="width:36rpx; height:36rpx;"
                    src="/static/images/public/publicCircle-checkOn.png"
            />
            <img
                    v-show="is_select_meituan"
                    style="width:36rpx; height:36rpx;"
                    src="/static/images/public/publicCircle-checkOff.png"
            />
            <span class="addressWay">门店自提</span>
            <span
                    style="color:#ff5000;font-size:26rpx;margin-left:20rpx;"
                    v-if="header_info.msg"
            ></span>
          </div>
          <div class="addressContent" v-show="!is_select_meituan">
            <div class="addressContentTop" v-if="header_info.shop_info">
              <div style="padding-bottom:30rpx">
                <div class="nameTel">
                  <div class="name">{{header_info.shop_info.shop_name}}</div>
                  <div class="tel" style="margin-left: 50rpx;">{{header_info.shop_info.phone}}</div>
                </div>
                <div class="addressText">{{header_info.shop_info.shop_address}}</div>
              </div>
               <img @click="gotoselect" style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png">
            </div>
            <div class="addressContentTop" v-if="!header_info.shop_info">
              <div class="noshop">
                <div @click="gotoselect" class="addressText"> 请选择门店</div>
               </div>
              <img @click="gotoselect" style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png">

            </div>
            <div class="addressContentBottom">
              <img style="height:26rpx; width:26rpx;" src="/static/images/public/public_icon_tip.png" />
              <span style="margin-left:20rpx;font-size:26rpx;color:#333">请在7个工作日内到门店提货</span>
            </div>
          </div>

          <!-- <img src="/static/images/twohr_shop_bgarrow.png" class="shopBgarrow" /> -->
          <!-- <div class="addressContent">
            <div class="addressContentTop" v-if="header_info.shop_info">
              <div style="padding-bottom:30rpx">
                <div class="nameTel">
                  <div class="name">{{header_info.shop_info.shop_name}}</div>
                  <div class="tel" style="margin-left: 50rpx;">{{header_info.shop_info.phone}}</div>
                </div>
                <div class="addressText">{{header_info.shop_info.shop_address}}</div>
              </div>
            </div>
            <div class="addressContentBottom">
              <img style="height:26rpx; width:26rpx;" src="/static/images/public/public_icon_tip.png" />
              <span style="margin-left:20rpx;font-size:26rpx;color:#333">请在7个工作日内到门店提货</span>
            </div>
          </div> -->
        </div>

        <div v-if="is_show_shan">
          <div class="addressTop" :custom="1" @click="funcScanClick(1)">
            <img
                    v-show="is_select_meituan&&is_select_type"
                    style="width:36rpx; height:36rpx;"
                    src="/static/images/public/publicCircle-checkOn.png"
            />
            <img
                    v-show="is_select_meituan?!is_select_type:!is_select_meituan"
                    style="width:36rpx; height:36rpx;"
                    src="/static/images/public/publicCircle-checkOff.png"
            />
            <span class="addressWay">乐友到家</span>
          </div>
          <img
                  v-show="is_select_meituan&&is_select_type"
                  src="/static/images/twohr_shop_bgarrow.png"
                  class="shopBgarrow"
          />
          <div class="addressContent" v-show="is_select_meituan&&is_select_type">
            <div class="addressContentTop" @click="funcAddressClick">
              <div style="padding-bottom:30rpx">
                <div class="nameTel">
                  <div v-if="header_info.consignee_name" class="name">{{header_info.consignee_name}}</div>
                  <div v-else class="name">请添加收货地址</div>
                  <div class="tel" style="margin-left: 50rpx;">{{header_info.consignee_mobile}}</div>
                </div>
                <div v-if="header_info.post_address" class="addressText">{{header_info.post_address}}</div>
                <div v-else class="addressText">不知道将您的宝贝送到哪里</div>
              </div>
              <img style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png" />
            </div>
            <div
                    class="addressContentBottom"
                    @click="funcArrivalTime"
                    style="justify-content: space-between;"
            >
              <div class="addressArrivalDesc">预计送达时间</div>
              <div class="addressArrivalTime">
                <span style="margin-right:20rpx">{{arrival_time}}</span>
                <img
                        style="width:13rpx;height:23rpx; marign-left:20rpx"
                        src="/static/goodsdetail/lecard_arrow_right.png"
                />
              </div>
            </div>
          </div>
        </div>
        <div >
          <div class="addressTop" :custom="2" @click="funcScanClick(0)">
            <img
                    v-show="is_select_meituan&&!is_select_type"
                    style="width:36rpx; height:36rpx;"
                    src="/static/images/public/publicCircle-checkOn.png"
            />
            <img
                    v-show="is_select_meituan?is_select_type:!is_select_meituan"
                    style="width:36rpx; height:36rpx;"
                    src="/static/images/public/publicCircle-checkOff.png"
            />
            <span class="addressWay">快递配送</span>
            <!-- <span style="color:#ff5000;font-size:26rpx;margin-left:20rpx;">{{header_info.msg}}</span> -->
          </div>
          <img
                  v-show="is_select_meituan&&!is_select_type"
                  src="/static/images/twohr_shop_bgarrow.png"
                  class="shopBgarrow"
          />
          <div class="addressContent" v-show="is_select_meituan&&!is_select_type">
            <div class="addressContentTop" @click="funcAddressClick">
              <div style="padding-bottom:30rpx">
                <div class="nameTel">
                  <div v-if="header_info.consignee_name" class="name">{{header_info.consignee_name}}</div>
                  <div v-else class="name">请添加收货地址</div>
                  <div class="tel" style="margin-left: 50rpx;">{{header_info.consignee_mobile}}</div>
                </div>
                <div v-if="header_info.post_address" class="addressText">{{header_info.post_address}}</div>
                <div v-else class="addressText">不知道将您的宝贝送到哪里</div>
              </div>
              <img style="width:13rpx;height:23rpx;" src="/static/goodsdetail/lecard_arrow_right.png" />
            </div>
          </div>
        </div>
        <img
                style="width:100%;height:8rpx;vertical-align: bottom"
                src="/static/images/confirm/order_way_line.png"
        />
      </div>

    </div>


  </div>
</template>

<script>
export default {
  props: {
    order_type: 0,
    have_idcard: true,
    // is_delivery: true,
    encry_id_num: "",
    is_auto_select_meituan: false,
    header_info: {},
    is_select_meituan: true,
    arrival_time: "",
    is_select_shan:false,
    show_shan:true,
  },

  computed: {
      is_show_shan(){
          if(this.show_shan){
              return true
          }else if(this.is_select_meituan&&this.header_info.leyou_flash){
              let support = this.header_info.leyou_flash.support;
              if(support){
                  return true
              }else{
                  return false
              }
          }else{
              return this.show_shan
          }
      },
    is_select_type(){
        if (this.header_info.leyou_flash&&this.header_info.leyou_flash.support&&this.is_select_shan) {
            return true
        }else{
            if(this.show_shan&&(this.sender.value===1||this.sender.value===3)){
                return true
            }else{
                return false
            }
        }
    },
    is_show_flash() {
      if (this.header_info.leyou_flash) {
        let support = this.header_info.leyou_flash.support;
        return support;
      } else {
        return false;
      }
    },
    is_delivery() {
      return this.order_type === 2;
    }
  },
    mounted(){

  },
  data() {
    return {
        is_stock: false,
      is_le_vip: false,
      id_num: "",
      // is_delivery: false,
      have_idcard: true,
      leyou_flash: {
        desc: ""
      },
      temp_header_info: {},
      arrival_time: "",
      is_select_flash: true,

      // key 1  选中 状态   1:乐闪送   2: 快递配送
      // key 2  地址切换    1:乐闪送   2: 快递配送
      // key 3  切换送达时间
      sender: {
        key: "",
        value: ""
      }
    };
  },

  methods: {
    funcSelectWay(index) {
      this.sender.key = 1;
      if (index === 1) {
        this.is_select_meituan = true;
        this.sender.value = 1;
      }
      else {
        this.is_select_meituan = false;
        this.sender.value = 2;
      }
      this.$emit("headerViewClick", this.sender);
    },
      gotoselect(){
        console.log(11)
          this.$emit("gotoselect", this.sender);

      },
    funcScanClick(index) {
      this.sender.key = 1;
      if (index == 1) {
        // 闪送

          this.is_select_meituan = true;
        this.sender.value = 1;
      } else if (index == 2) {
        // 门店自提
        this.is_select_meituan = false;
        this.sender.value = 3;
      } else {
        // 快递配送

          this.is_select_meituan = true;
        this.sender.value = 2;
      }
      this.$emit("headerViewClick", this.sender);
    },

    funcAddressClick() {
      // 快递配送
      this.sender.key = 2;
      if (this.order_type === 0) {
        if (this.is_select_meituan) {
          // 闪送
          this.sender.value = 1;
        }  else if (this.order_type == 6) {
            if (this.is_show_flash) {
              this.sender.value = 1;
            }  else {
              this.sender.value = 2;
            }
        }
        else {
          if (this.order_type == 2) {
            this.sender.value = 1;
          } else {
            this.sender.value = 2;
          }
          // 快递配送
        }
      }
      this.$emit("headerViewClick", this.sender);
    },

    funcArrivalTime() {
      this.sender.key = 3;
      this.sender.value = "";
      this.$emit("headerViewClick", this.sender);
    },
    funcEeitId() {
      this.encry_id_num = "";
      this.id_num = "";
    },
    funcSave() {
      var p = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      if (!p.test(this.id_num)) {
        wx.showToast({
          title: "请输入正确的身份证号",
          icon: "none",
          duration: 2000
        });
        return;
      }
      this.sender.key = 4;
      this.sender.value = this.id_num;
      this.$emit("headerViewClick", this.sender);
    }
  }
};
</script>

<style scoped>
  .noshop{
    line-height: 70rpx;
  }
.address {
  background: #fff5c8;
  width: 100%;
  box-sizing: border-box;
  /* 解决最后一个img 上面的间隙 */
  font-size: 0;
}

/* 顶部标题 */

.addressTop {
  height: 88rpx;
  width: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  line-height: 88rpx;
  display: flex;
  align-items: center;
}

.addressWay {
  color: #333;
  font-size: 30rpx;
  padding-left: 14rpx;
  font-family: PingFangSC-Medium;
}

.addressContent {
  border-radius: 12rpx;
  background: #fff;
  margin: 0rpx 20rpx 20rpx 20rpx;
}

/* 地址手机号姓名 */

.addressContentTop {
  /* height: 198rpx; */
  display: flex;
  align-items: center;
  border-bottom: #eeeeee 1rpx solid;
  padding: 0 20rpx 0 50rpx;
  justify-content: space-between;
  /* box-sizing: border-box; */
}

.nameTel {
  height: 88rpx;
  display: flex;
  line-height: 88rpx;
  font-size: 30rpx;
  color: #333;
}

.addressText {
  width: 600rpx;
  font-size: 26rpx;
  word-break: break-all;
  /* overflow: hidden; */
  /* white-space: nowrap; */
  /* text-overflow: ellipsis; */
}

/* 底部备注 */

.addressContentBottom {
  display: flex;
  flex-direction: row;
  height: 88rpx;
  padding: 0 20rpx 0 50rpx;
  align-items: center;
}
.addressArrivalDesc {
  font-size: 26rpx;
  color: rgb(65, 43, 43);
}
.addressArrivalTime {
  color: #ff5000;
  font-size: 26rpx;
}

/* 顶部箭头 */
.shopBgarrow {
  /* position: absolute; */
  /* left: 75rpx; */
  /* top: 68rpx; */
  margin-top: -18rpx;
  height: 21rpx;
  width: 36rpx;
  margin-left: 75rpx;
  vertical-align: top;
}

/* 海淘身份证框 */
.card_content {
  height: 42rpx;
  /* padding-left: 40rpx; */
  line-height: 34rpx;
  display: block;
  box-sizing: content-box;
  color: #333333;
  font-size: 26rpx;
  width: 100%;
  /* border-bottom: 1px solid #dddddd; */
}

.invoice_button_activity {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff5000;
  border-radius: 30rpx;
  height: 48rpx;
  box-sizing: content-box;
  background: #fff;
  width: 120rpx;
  padding: 0;
  font-size: 26rpx;
  border: 1rpx solid #ff5000;
  /* margin-bottom: 20rpx; */
}

.address_way_bottom {
}
</style>
