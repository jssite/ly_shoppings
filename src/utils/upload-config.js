
const Crypto = require('crypto');


const uploadFile = function (config,params) {
    if (!params.filePath || params.filePath.length < 9) {
        wx.showModal({
            title: '图片错误',
            content: '请重试',
            showCancel: false,
        })
        return;
    }
    const aliyunFileKey = params.dir + params.filePath.replace('wxfile://', '');

    const aliyunServerURL = config.endpoint;
    const accessid = config.access_key_id;
    const policyBase64 = getPolicyBase64(config);
    const signature = getSignature(config,policyBase64);

    console.log('aliyunFileKey=', aliyunFileKey);
    console.log('aliyunServerURL', aliyunServerURL);
    wx.uploadFile({
        url: 'https://oss-cn-beijing.aliyuncs.com/leyoutest1/',
        filePath: params.filePath,
        name: 'file',
        formData: {
            'key': aliyunFileKey,
            'policy': policyBase64,
            'OSSAccessKeyId': accessid,
            'signature': signature,
            'success_action_status': '200',

        },
        success: function (res) {
            if (res.statusCode != 200) {
                if(params.fail){
                    params.fail(res)
                }
                return;
            }
            if(params.success){
                params.success(aliyunFileKey);
            }
        },
        fail: function (err) {
            err.wxaddinfo = aliyunServerURL;
            if (params.fail) {
                params.fail(err)
            }
        },
    })
}

const getPolicyBase64 = function (config) {
    let date = new Date();
    date.setHours(date.getHours() + 87600 );
    let srcT = date.toISOString();
    const policyText = {
        "expiration": srcT, //设置该Policy的失效时间
        "conditions": [
            ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
        ]
    };
    const policyBase64 = new Buffer(JSON.stringify(policyText));
    return policyBase64.toString('base64');
    // const policyBase64 = Base64.encode(JSON.stringify(policyText));
    // return policyBase64;
}

const getSignature = function(config,policy) {
    return Crypto.createHmac('sha1', config.access_key_secret).update(policy).digest().toString('base64');
}

export default uploadFile;
