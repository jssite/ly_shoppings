/**
 * config
 */
import { formatNumber } from '@/utils';
export const BASE_DATE= new Date();
export const BASE_YEAR = BASE_DATE.getFullYear();
export const BASE_MONTH = formatNumber(BASE_DATE.getMonth() + 1);
export const BASE_DAY = formatNumber(BASE_DATE.getDate());
export const BASE_HOURS = formatNumber(BASE_DATE.getHours());
export const BASE_MINUTES = formatNumber(BASE_DATE.getMinutes());
export const BASE_SECONDS = formatNumber(BASE_DATE.getSeconds());
export const BASE_TIME = BASE_DATE.getTime().toString();
// export const BASE_TOKEN = "08762da689fcbbfba6351aaabd26af08";
// export const BASE_TOKEN = wx.getStorageSync('token')||'';
export const MESSAGE_Id = () => {
    return BASE_YEAR+BASE_MONTH+BASE_DAY+BASE_HOURS+BASE_MINUTES+BASE_SECONDS+BASE_TIME
}
export const REQUEST_HEADER = () =>{
    let BASE_TOKEN = wx.getStorageSync('token')||'';
    let openid = wx.getStorageSync('openid')||'';
    return  {
        "build_mode": "",
        "channel": "1",
        "city_id": 110100,
        "imei": openid,
        "ip": "10-216-157-29",
        "message_id": MESSAGE_Id(),
        "network_oper": "",
        "network_status": "",
        "res_code": 0,
        "sign": "",
        "terminal": 14,
        "time_stamp": BASE_TIME,
        "token": BASE_TOKEN,
        "transaction_type": "",
        "ua": "",
        "version": "5.3.4"
    }
}
