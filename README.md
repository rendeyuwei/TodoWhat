# 一日之计在于春 极简待办（ToDo）
一个待办事项微信小程序，添加待办的任务，随时随地在你的微信中查看

技术： Taro + Vue

模板来源于TaroMVC项目：https://github.com/NervJS/TodoMVC/tree/vue
**在此基础上不断迭代更新**

--------

更新计划（已完成/未完成）（main分支）：

- [x] 使用Taro UI或者其它UI框架
- [x] 删除计划弹窗提示
- [ ] 重要性（手动拖动顺序来体现）
- [x] 为项目更新Taro依赖的版本
- [ ] 添加回收站
- [x] 添加滑动删除
- [ ] 搜索任务
- [x] 存储（存储在微信云服务器中）
- [ ] 第一次登陆（登录提示）
- [ ] 优化加载速度（读取数据慢）
- [ ] 完善Wiki文档

-----

【问题】

1. 任务列表不展示，数据出现错误：

   因为微信云服务是免费账号，每日请求数据次数有限，因此可能会出现数据不显示的情况

2. `npm install`安装完依赖后微信小程序运行报错：

   尝试使用`yarn install`重新安装

----

main分支，主分支稳定版本；dev分支，开发版本，测试功能不稳定

若想要贡献优化小程序，fork到本地，修改后在pull request
