#### 介绍

配置化编码，单表 CRUD 只需少量配置;写更少的代码，实现更多的功能;简洁、高效、可扩展、高度解耦

#### 浏览器兼容性

支持所有符合 ES5 标准的浏览器(不支持 IE8 及以下版本）.

#### 在线社区

[传送门](https://bbs.cool-js.com/)

## 先决条件

请确保您的操作系统上安装了 Node.js（> = 8.9.0）、@vue/cli。

## 安装项目依赖

推荐使用 `yarn`：

```shell
yarn
```

解决 `node-sass` 网络慢的方法：

```shell
yarn config set sass-binary-site http://npm.taobao.org/mirrors/node-sass
```

## 安装扩展组件的依赖

安装 `cl-admin-cli` 脚手架：

```shell
npm install cl-admin-cli -g
```

安装扩展组件依赖：

```shell
cl install
```

## 运行应用程序

安装过程完成后，运行以下命令启动服务。您可以在浏览器中预览网站 [http://localhost:9000](http://localhost:9000)

```shell
yarn serve
```

## 分析包内容

```shell
yarn report
```
