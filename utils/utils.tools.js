// 各种通用工具类

const utilsTools = {
  // 生成永不重复的id
  //   createRandomId: () => {
  //     return md5(new Date().getTime() + '-' + Math.random().toString().substr(2, 5)).toString();
  //   },
  // 获取实时时间
  getDate: () => {
    return new Date().Format('yyyy-MM-dd hh:mm:ss');
  },
  // 对象参数为空就删除该属性
  deleteNullObj: (keywords) => {
    if (!keywords) {
      return keywords;
    }
    for (let key in keywords) {
      if ((keywords[key] ?? '') === '') {
        delete keywords[key];
      }
    }
    return keywords;
  },
  // 扁平数组转换为树形结构
  listToTree: (list) => {
    let map = {};
    let node;
    let tree = [];
    let i;
    for (i = 0; i < list.length; i++) {
      map[list[i].id] = list[i];
      list[i].children = [];
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.pid !== 1) {
        map[node.pid].children.push(node);
      } else {
        tree.push(node);
      }
    }
    return tree;
  },

  // 树形结构转换为扁平数组
  treeToList: (tree) => {
    let queen = [];
    let out = [];
    queen = queen.concat(tree);
    while (queen.length) {
      let first = queen.shift();
      if (first.children) {
        queen = queen.concat(first.children);
        delete first['children'];
      }
      out.push(first);
    }
    return out;
  },
  // 参数转换
  queryConditions: (condition, count) => {
    const { where, page: offset, pageSize: limit, sortBy, order, attributes, include, raw, group } = condition;

    let queryCon = { where: {}, order: [[sortBy || 'createTime', order || 'DESC']] };

    if (where) queryCon.where = where;
    // 分页
    if (offset && limit) {
      // 每页条数
      if (limit) queryCon.limit = parseInt(limit) || 10;
      // 当前页
      if (offset || offset === 0) queryCon.offset = limit * (offset - 1) || 0;
    }
    // 需要输出的数组
    if (attributes && !count) queryCon.attributes = attributes;
    if (include && !count) queryCon.include = include;
    if (group) queryCon.group = group;
    if (raw && !count) queryCon.raw = raw;
    return queryCon;
  }
};
module.exports = utilsTools;
