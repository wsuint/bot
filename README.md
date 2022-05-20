# jsbot

#### 介绍
QQ机器人

#### 软件架构
1. 本项目基于mirai-console-loader
2. 采用Mirai-js连接mirai-api-http插件所提供的接口
3. Node 12 +

#### 安装教程

1.  安装好mirai-console-loader,和他的插件mirai-api-http,并登录成功 
2.  根目录下创建config.json并添加以下内容
```
{
    "masterQQ":"机器人管理员QQ号",
    "qq":"机器人QQ号",
    "password":"机器人密码",
    "verifyKey":"mirai-api-http的verifyKey",
    "baseUrl":"mirai-api-http的服务器地址",
    "ruyi_appKey":"在ruyi.ai 申请的APIKEY",
    "ruyi_baseUrl":"http://api.ruyi.ai/v1/message",
    "name":"机器人名字",
    "sname":"机器人小名"
}
```
3.  npm install
4.  node index.js

#### 使用说明

1.  建议采用pm2来管理JS进程
2.  npm install pm2 -g
3.  pm2 start index.js --name Bot

