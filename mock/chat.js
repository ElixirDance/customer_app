import Mock from 'mockjs';

const baseUrl = `https://shop.terracecapital.xyz`;


Mock.mock(baseUrl+'/api/chat/message/list', 'get', {
  'code': 0,
  'message': 'success',
  'data|1-3': [ // 随机生成2-5个孩子数据
    {
      'id': '@id', // 随机生成ID
      // 'name': '@cname', // 随机生成中文姓名
      'time': '@date("yyyy-MM-dd hh:mm")', // 随机生成日期
      'role|1': ['parent', 'child'], // 随机性别
      // 'avatar': '@image("200x200", "@color", "@cname")', // 随机生成头像URL
      'playing|1': false, // 随机标记是否为当前选中的孩子
      'url|1': '@url',
      'duration|1': '@natural(1,12)'
    }
  ]
});