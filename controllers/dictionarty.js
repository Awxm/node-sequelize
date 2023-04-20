const dictionarty = require('../dictionarty/data.json');
const Models = require('../models');
const { CancerSubType, CancerTypeGroup } = Models;
// 查询所有
exports.list = async (req, res) => {
  try {
    const cancerSubTypeResult = await CancerSubType.findAll({
      attributes: [
        'code',
        ['cancer_type_group_id', 'cancerTypeGroupId'],
        ['cn_name', 'itemText'],
        ['cancer_sub_type_id', 'itemValue']
      ]
    });
    const cancerTypeGroupResult = await CancerTypeGroup.findAll({
      attributes: [
        ['cn_name', 'itemText'],
        ['cancer_type_group_id', 'itemValue']
      ]
    });
    const cancerTypeGroup = {
      dictName: '癌种分组',
      dictCode: 'cancerTypeGroup',
      items: cancerTypeGroupResult
    };
    const cancerSubType = {
      dictName: '癌种',
      dictCode: 'cancerSubType',
      items: cancerSubTypeResult
    };
    let data = [].concat(dictionarty);
    data.splice(1, 0, cancerSubType, cancerTypeGroup);
    return res.sendExtraResult(data, 'Success');
  } catch (error) {
    return res.sendExtraResult(null, 'Unify', '字典异常');
  }
};
