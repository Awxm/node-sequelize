const axios = require('axios');
const Config = require('../config/worker-wx');

if (typeof localStorage === 'undefined' || localStorage === null) {
  let { LocalStorage } = require('node-localstorage');
  // eslint-disable-next-line no-native-reassign, no-global-assign
  localStorage = new LocalStorage('./scratch');
}

// 判断 token 是否过期
let _isExpire = function (expire_time) {
  let isExpire = true;
  const current = Math.floor(Date.now() / 1000);
  isExpire = expire_time < current;
  console.log('access token 未过有效期');
  return isExpire;
};

let _getAccessToken = async function () {
  const { corp_id, app_secret } = Config;
  const corpsecret = app_secret;

  if (!corp_id || !corpsecret) {
    console.error('请在 configs/main.config.js 中填写 corp_id 和 corp_secret 信息');
    return;
  }

  let access_token;
  let expire_time;

  try {
    access_token = localStorage.getItem('access_token') || '';
    expire_time = localStorage.getItem('expire_time') || '';
  } catch (error) {
    console.error('Access token wat not set');
  }
  if (!access_token || _isExpire(expire_time)) {
    // 如果缓存中没有 token，或者 token 过期
    // 发起请求，获取 access_token
    let access_response = await axios.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken', {
      params: { corpid: corp_id, corpsecret: corpsecret }
    });
    let {
      data: { access_token, expires_in }
    } = access_response;

    if (access_token) {
      // 重新写入 access_token
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('expire_time', Math.floor(Date.now() / 1000) + expires_in);
      // 返回 access_token
      return access_token;
    } else {
      return false;
    }
  } else {
    return access_token;
  }
};

module.exports = {
  async getToken() {
    return await _getAccessToken();
  }
};
