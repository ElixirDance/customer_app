import Mock from 'mockjs';

const baseUrl = `https://shop.terracecapital.xyz`;

// 模拟获取用户信息接口，请求地址、请求方式按需改
Mock.mock(baseUrl+'/api/child/child', 'get', {
  'code': 0,
  'message': 'success',
  'data': {
    'id': '@id', // 随机生成 ID
    'name': '@cname', // 随机生成中文姓名
    'birthDate': '@date("yyyy-MM-dd")', // 随机生成日期
    'gender|1': ['male', 'female'], // 随机性别
    'region': '@province()@city()@county()', // 随机生成地区
    'hobbies|1-5': ['painting', 'music', 'reading', 'sports', 'handicraft', 'technology', 'dance', 'other'], // 随机选择1-5个兴趣爱好
    'remark': '@cparagraph(1, 3)' // 随机生成1-3句话的备注
  }
});

Mock.mock(baseUrl+'/api/child/childs', 'get', {
  'code': 0,
  'message': 'success',
  'data|2-5': [ // 随机生成2-5个孩子数据
    {
      'id': '@id', // 随机生成ID
      'name': '@cname', // 随机生成中文姓名
      'birthDate': '@date("yyyy-MM-dd")', // 随机生成日期
      'gender|1': ['male', 'female'], // 随机性别
      'region': '@province()@city()@county()', // 随机生成地区
      'hobbies|1-5': ['painting', 'music', 'reading', 'sports', 'handicraft', 'technology', 'dance', 'other'], // 随机兴趣爱好
      'remark': '@cparagraph(1, 3)', // 随机备注
      'avatar': '@image("200x200", "@color", "@cname")', // 随机生成头像URL
      'isCurrent|1': true, // 随机标记是否为当前选中的孩子
    }
  ]
});

// 添加孩子接口
Mock.mock(baseUrl+'/api/child/add', 'post', function(options) {
  // 获取请求参数
  const params = JSON.parse(options.body);
  
  // 模拟接口返回
  return {
    'code': 0,
    'message': '添加成功',
    'data': {
      'id': Mock.Random.id(), // 生成新ID
      ...params // 保留请求中的其他参数
    }
  };
});

// 更新孩子接口
Mock.mock(baseUrl+'/api/child/update', 'post', function(options) {
  // 获取请求参数
  const params = JSON.parse(options.body);
  
  // 模拟接口返回
  return {
    'code': 0,
    'message': '更新成功',
    'data': params // 返回更新后的完整数据
  };
});