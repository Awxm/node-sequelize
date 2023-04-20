module.exports = {
  //可选类型
  types: [
    { value: ':tada: init', name: '🎉 init:     初始化' },
    { value: ':sparkles: feat', name: '✨ feat:     新功能' },
    { value: ':bug: fix', name: '🐛 fix:      修复bug' },
    { value: ':art: format', name: '🥚 format:      格式化代码' },
    { value: ':lipstick: style', name: '💄 style:    更新 UI 样式' },
    { value: ':speech_balloon: correspondence', name: '💬 correspondence:    文案修改' },
    { value: ':zap: perf', name: '⚡️ perf:     性能优化' },
    { value: ':white_check_mark: test', name: '✅ test:     测试' },
    { value: ':rewind: revert', name: '⏪️ revert:   回退' },
    { value: ':package: build', name: '📦️ build:    打包' },
    { value: ':recycle: refactor', name: '♻️  refactor: 重构(既不是增加feature)，也不是修复bug' },
    { value: ':wrench: config', name: '🔧 config:    修改配置文件' },
    { value: ':rocket: chore', name: '🚀 chore:    构建/工程依赖/工具' },
    { value: ':fire: fire', name: '🔥 fire:    移除代码或文件' },
    { value: ':wastebasket: wastebasket', name: '🗑️ wastebasket:    废弃或删除' },
    { value: ':construction_worker: ci', name: '👷 ci:       CI related changes' },
  ],
  //消息步骤
  messages: {
    type: '请选择提交类型(必填)',
    customScope: '请输入修改范围(可选)',
    subject: '请简要描述提交(必填)',
    body: '请输入详细描述(可选)',
    footer: '请输入要关闭的issue(可选)',
    confirmCommit: '确认以上信息提交?(y/n)',
  },
  allowCustomScopes: true,
  //跳过问题
  skipQuestion: ['body', 'footer'],
  //subject文字长度默认是
  subjectLimit: 72,
};
