# 网络测量论文阅读相关

## [An HTTP web traffic model based on the top one million visited web pages](https://ieeexplore.ieee.org/document/6252145)



基于前百万最常访问的网页的 HTTP web 流量模型

overview: 其实也就是分析一下数据，得出目前包括多媒体内容大型网页的趋势，以及提出新的web 流量模型。

introduction:

网络在发展，已有的模型已经过时，新的模型对于分析至关重要。

关注是如何获取数据的：

先从 alexa 获取网站，使用集群来访问网页，获取统计数据。使用的是火狐流量器，插件使用到了 WebDeveloper 和 Chickenfoot

分析数据：

查看内联对象的数目，images,scripts, 内联对象的大小

好像也没什么，按照文章所说，亮点在于数据是 Top million website 而不是校园网之类。发现网站的趋势：内联数量增加，从多个服务器获取内容而不是单一服务器...



## [An Empirical Model of HTTP Network Traffic](http://www.kitchenlab.org/www/bmah/Papers/Http-Infocom.pdf)

HTTP 网络流量的 Empirical 模型

overview: 基于HTTP会话packet traces ，而不是客户端和服务器的 log.  然后分析一些高层的指标，比如 HTTP 文件大小，文件数量，用户流量行为。

目前有两种方法来刻画 Internet 应用程序的特征：

1. server logs and client logs
2. traffic traces

本文采用的方法/工具

packet trace-based：更好地捕获单个用户的行为

tcpdump

测试的网络是桩网络

就先看到这吧。



## [Internet 测量与分析综述](http://www.jos.org.cn/1000-9825/14/110.pdf)

主要有三个研究领域

- 测量
- 模型化
- 控制

分类：

- 主动测量和被动测量
- 单点测量和多点测量



## Internet 流量模型分析与评述

