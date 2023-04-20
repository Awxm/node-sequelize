const AccessToken = require('../utils/utils.workwx-token');
const { agent_id: agentid } = require('../config/worker-wx');
const axios = require('axios');
exports.send = async (request_data) => {
  // 获取 Access Token
  try {
    const access_token = await AccessToken.getToken();
    // 向消息推送的 Api 发送对应的数据结构体
    const { data } = await axios.post(
      'https://qyapi.weixin.qq.com/cgi-bin/message/send',
      {
        touser: 'axm',
        toparty: null,
        totag: null,
        ...request_data,
        safe: 0,
        enable_id_trans: 0,
        enable_duplicate_check: 0,
        duplicate_check_interval: 1800,
        agentid
      },
      {
        params: { access_token }
      }
    );
    return data;
  } catch (error) {
    return null;
  }
};
