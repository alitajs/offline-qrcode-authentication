# Offline QRCode Authentication

离线二维码认证。

[![Alita](https://img.shields.io/badge/alitajs-oqa-blue.svg)](https://github.com/alitajs/offline-qrcode-authentication)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/alitajs/offline-qrcode-authentication)
[![NPM version](https://img.shields.io/npm/v/oqa.svg?style=flat)](https://npmjs.org/package/oqa)
[![NPM downloads](http://img.shields.io/npm/dm/oqa.svg?style=flat)](https://npmjs.org/package/oqa)
[![Build Status](https://img.shields.io/travis/alitajs/oqa.svg?style=flat)](https://travis-ci.com/alitajs/oqa)
[![Coverage Status](https://coveralls.io/repos/github/alitajs/oqa/badge.svg?branch=master)](https://coveralls.io/github/alitajs/oqa?branch=master)
[![License](https://img.shields.io/npm/l/oqa.svg)](https://npmjs.org/package/oqa)

## 使用

### javascript

```bash
$ npm install oqa --save
or
$ yarn add oqa
```

## 原理

用户端定期更新 token ，根据用户 id 、 token 与当前时间戳生成指定长度的签名，服务端可根据签名找到签名所对应的用户。

## 应用场景

付款、取货等。

## 安全性

可自由配置签名各个字段的长度，默认是 18 位 0 ~ 9 的数字构成的字符串。

## 相关问题

- 用户 id 不是整型或是 0 ~ 9 构成的字符串，或者 id 过长怎么办？

  可以为每个用户按一定规则分配数字，比如随机数，允许少量重复，也可以定期更新这串数字，避免非活跃用户长期占用 id 。由于每个用户的 token 极大概率不相同，少量重复也能通过签名后几位校验码找到对应用户，如果觉得不够安全，那就修改配置加长签名长度吧。

- 时间戳只取用后几位（例如默认取用 6 位），会不会有人在一定时间之后（例如 `pow(10, 6)` 秒后）拿过来冒用？

  后几位校验码来自 `hash(id, token, timestamp)` ，这里签名所用到的时间戳是完整的 10 位时间戳，所以可以保证签名的有效期是一个闭区间。
