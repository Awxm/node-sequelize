// 获取getInfo的消息

const AccessToken = require('../utils/utils.workwx-token');
const { agent_id: agentid } = require('../config/worker-wx');
const axios = require('axios');

exports.send = async (req, res) => {
  try {
    // 从前端请求中获取对应的参数
    let request_data = {
      touser: 'axm',
      toparty: null,
      totag: null,
      msgtype: 'text',
      text: {
        content: '募随的通知。\n请登录<a href="http://192.168.31.74:8888/">募随系统管理后台</a>'
      },
      safe: 0,
      enable_id_trans: 0,
      enable_duplicate_check: 0,
      duplicate_check_interval: 1800,
      agentid
    };
    // 获取 Access Token
    const access_token = await AccessToken.getToken();
    // 向消息推送的 Api 发送对应的数据结构体
    const { data } = await axios.post('https://qyapi.weixin.qq.com/cgi-bin/message/send', request_data, {
      params: { access_token }
    });
    res.sendExtraResult(data, 'Success');
    // 返回请求的结果
  } catch (error) {
    return res.sendExtraResult(error, 'Error', '出问题了');
  }
};
