import { BASE_APP_INFO, BASE_TOKEN,BASE_AD_INFO, BASE_BABY_INFO } from './types';
const mutations = {
    [BASE_APP_INFO](state, v){
        state.BASE_APP_INFO = v;
    },
    [BASE_TOKEN](state,v){
        state.BASE_USER_TOKEN = v;
    },
    [BASE_AD_INFO](state,v){
        state.BASE_AD_INFO = v;
    },
    [BASE_BABY_INFO](state,v){
        state.BASE_BABY_INFO = v;
    },
    searchFilterMutations(state,v){
        state.search_filter = v;
    },
    backFilterInfoMutations(state,v){
        state.backFilterInfo = v;
    },
    shopLocationMutations(state,v){
        state.shopLocation = v;
    },
    shopgetStoreStaffsMutations(state,v){
        state.shopgetStoreStaffs = v;
    },
    logisticsMutations(state,v){
        state.logistics_name = v;
    },
    returnGoodsMutations(state,v){
        state.return_goods = v;
    },
    serviceLogisticsMutations(state,v){
        state.service_logistics = v;
    },
    placeholderMutations(state,v){
        state.init_placeholder = v;
    },
    bodyTextMutations(state,v){
        state.bodyText = v;
    },
    bobyInfoMutations(state,v){
        state.bobyInfo = v;
    },
    userInfoMutations(state,v){
        state.userInfo = v;
    },
    tokenMutations(state,v){
        state.token = v;
    },
    userInfoMutations(state,v){
        state.userInfo = v;
    },
    fromTagMutations(state,v) {
        state.fromTag = v;
    },
    fromSubTagMutations(state,v) {
        state.fromSubTag = v;
    },
    mpSourceMutations(state, v) {
        state.mp_source = v;
    },
    mpGroupIdMutations(state, v) {
        state.mp_group_id = v;
    },
    staffIdMutations(state, v) {
        state.staff_id = v;
    },
    mpShareFromModuel(state, v) {
        state.mp_shareFromModule = v;
    }
}
export default mutations;