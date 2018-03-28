# 图书馆
## admin

图书馆后台管理界面, 技术为 vue + vue-router + vuex + sessionStorage, 采用<del> vuex </del>sessionStorage 存储用户状态,vuex 存储标签的添加与删除, 采用 mock.js 模拟数据

## mock-story-server

图书馆模拟小说数据, 技术为 nodejs + express4.x, 通过 http 模块对某小说网站进行请求,获其 base64格式数据,将其转换发送给前端