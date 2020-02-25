# cars_message_management_web_system
基于express MongoDB开发的小区车辆管理系统

## demo
![image](https://github.com/isCagedBird/cars_message_management_web_system/blob/master/img/1.png)
![image](https://github.com/isCagedBird/cars_message_management_web_system/blob/master/img/2.png)
![image](https://github.com/isCagedBird/cars_message_management_web_system/blob/master/img/3.png)

## 项目相关
- 有小区业主（车主），小区物业两种类型的管理员账号，小区物业账号唯一不可重复注册且拥有大部分权限
- 管理员账号可对车辆信息，自身信息修改更新包括车位分配
- 敏感信息统一使用post请求，异步操作使用ES6 promise，promise.all封装

## 运行相关
- 本地localhost 运行，需要具备node，MongoDB环境。数据库相关配置在根目录的 config.js文件内修改
```
终端打开文件 npm or cnpm install
```
```
开发环境 npm or cnpm run dev
```
```
运行环境 npm or cnpm run will 或者你也可以使用pm2
```

## 写在最后
这是本人帮助同学开发的毕业设计小项目，如果能帮助到你，期望你能点个 star，谢谢。
有什么问题可以 vogel_im_kafig2016@outlook.com 联系我。
