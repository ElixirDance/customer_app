import Mock from 'mockjs';

const baseUrl = `https://shop.terracecapital.xyz`;


/**
 * 生成带星号的电话号码
 * @param {number} hideCount - 要隐藏的数字个数，默认为4
 * @param {number} startPos - 开始隐藏的位置，默认为3
 * @returns {string} 带星号的电话号码
 */
Mock.Random.extend({
  // 自定义生成电话号码的方法
  customPhone() {
    // 生成以1开头的11位数字
    return '1' + Mock.Random.natural(1000000000, 9999999999);
  },
  
  // 生成带星号的电话号码
  phoneWithAsterisk(hideCount = 4, startPos = 3) {
    const fullPhone = this.customPhone();
    const digits = fullPhone.split('');
    
    // 确保参数在有效范围内
    hideCount = Math.min(hideCount, digits.length - startPos);
    hideCount = Math.max(hideCount, 0);
    
    // 替换指定位置的数字为星号
    for (let i = startPos; i < startPos + hideCount; i++) {
      digits[i] = '*';
    }
    
    return digits.join('');
  }
});

Mock.mock(baseUrl+'/api/parent/parents', 'get', {
  'code': 0,
  'message': 'success',
  'data|1-2': [ // 随机生成2-5个孩子数据
    {
      'id': '@id', // 随机生成ID
      'name': '@cname', // 随机生成中文姓名
      'birthDate': '@date("yyyy-MM-dd")', // 随机生成日期
	  'phone': '@phoneWithAsterisk(4, 3)', // 隐藏4个数字，从第3位开始
      'gender|1': ['male', 'female'], // 随机性别
      'region': '@province()@city()@county()', // 随机生成地区
      'remark': '@cparagraph(1, 3)', // 随机备注
      'avatar': '@image("200x200", "@color", "@cname")', // 随机生成头像URL
      'isAdmin|1': true, // 随机标记是否为当前选中的孩子
    }
  ]
});