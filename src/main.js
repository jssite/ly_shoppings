import { sa } from './utils/sensorsdata'
import '../static/sdk/ald-stat'
import Vue from 'vue'
import App from './App'
import store from './store'

sa.init();
Vue.prototype.$store=store
Vue.config.productionTip = false
Vue.prototype.sa_page = function saPageInfo(self,isWeb,pageName,staffId) {
    var appInst =  getApp(); 
    let source = self.$store.state.mp_source;
    let groupId = self.$store.state.mp_group_id;
    let shareFromModule = self.$store.state.mp_shareFromModule;
    let page_type = '原生页';
    if (isWeb) {
        page_type = 'web页';
    }
    let sa_info = {
        mp_source:source,
        mp_group_id:groupId,
        staff_id:staffId,
        pageType:page_type,
        pageName:pageName,
        shareFromModule:shareFromModule,
    }
    appInst.sensors.track('mp_appPageView', sa_info);
    console.log(sa_info,pageName);
}
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
