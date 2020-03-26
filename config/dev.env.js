var merge = require("webpack-merge");
var prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
    // BASE_WEBAPI: '"https://test.ruiyunit.com.cn/leyou-gateway-services"',
    // BASE_APPAPI: '"https://test1.ruiyunit.com.cn"',
    // BASE_WEBAPI: '"https://webapi1.leyou.com.cn/leyou-gateway-services"',
    BASE_APPAPI: '"https://app.leyou.com.cn"',
    BASE_WEBAPI: '"https://webapi.leyou.com.cn/leyou-gateway-services"',
    BASE_TEST:'"https://kanjia.leyou.com.cn/api"'
    //BASE_APPAPI: '"https://app.leyou.com.cn"',
    //BASE_WEBAPI: '"https://webapi.leyou.com.cn/leyou-gateway-services"',//'"http://115.182.12.249:8088/leyou-gateway-services"',
    // BASE_APPAPI: '"https://tsest1.ruiyunit.com.cn"', //'"http://115.182.12.249:81/"',
    // BASE_TEST:'"http://59.110.137.245:8081/api"'
});


