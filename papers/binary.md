
# 二进制论文阅读
### [EnFuzz: From Ensemble Learning to Ensemble Fuzzing](https://arxiv.org/pdf/1807.00182.pdf)
overview： 使用集成学习，结合多种 fuzzer 进行 fuzz

从三个维度定义基本 fuzzer 的多样性：1. 覆盖信息的粒度  2. 输入生成策略 3. 种子选择，变异策略

尽量选择多样的 base fuzzer，设计种子同步和结果集成机制。使用集成架构将base fuzzer 的结果综合，单一的 fuzzer 对不同的应用程序表现不同，评价指标：1. 路径执行 2. 分支覆盖 3. 独一的crash . enfuzzer 更好

##### introduction

先要解决的两个问题

- base fuzzer selection
- ensemble 架构设计

contribution:

- 对现有的 fuzzer 的泛化局限做出评估
- 提出 enfuzz 并实现
- 使用 enfuzz 在真实 app 上进行测试
- 测试 libpng libjpeg 等在安全比较重要的

集成学习与集成 fuzz 的区别

#### 具体方法

base fuzzer 的选择：根据提出的三个指标，尽可能多样

集成架构

- 种子同步机制

  sync线程

- 结果集成机制

  取各个结果的并集

  







## 代码相似性检测

### [Neural Network-based Graph Embedding for Cross-Platform Binary Code Similarity Detection](https://arxiv.org/pdf/1708.06525.pdf)

overview: 基于神经网络图嵌入的跨平台二进制代码相似性检测，现有的方法基于图匹配，速度慢且不准确，本文提出新的思路，使用神经网络计算嵌入，实现了 Gemini 

目前存在的问题：图匹配的缺陷

contributions:

- 提出神经网络的图嵌入，每个函数都是控制流图，使用神经网络将其转化为嵌入，
- 并且提出了根据嵌入确定代码相似性的新方法，使用了 Siamese 网络。设计了新的训练和数据集创建方法，使用默认策略来预训练任务独立型的图嵌入网络。

- 提出重训练的方法，调整预训练的模型
- 实现 Gemini
- 评估 Gemini
- 在真实固件上进行测试

### Binary code clone

overview: 提出基于语义的方法来检测相似性，首先识别二进制函数的参数和间接跳转的目标，模拟执行，提取出语义特征，进行比较。实现了 CACOMPARE 模型。支持不同主流架构上的相似性比较。

目前相似性检测面对的两个问题：

- 指令集的多样性
- 不同编译配置的结构 gaps

contribution:

- 提出基于语义的跨平台的相似性检测，使用IR统一二进制代码的表示，并从模拟执行中提取函数的语义特征
- 引入函数参数识别和switch 间接跳转目标检测，细粒度的语义特征，使用通用策略，使特征更 general and adaptive
- 实现 CACOMPARE 系统，在跨平台和编译配置的二进制代码检测中效果比较好，准确率优于目前先进的方法

#### 具体架构

##### 函数参数的识别

##### Switch间接分支目标

##### 语义特征生成

- 使用的语义特征
  - 输入输出
  - 比较操作符和条件
  - 库函数调用
- 模拟执行
  - 参数值分发
  - 控制流 Arrangement
- 特征标准化
  - Pointer value
  - 比较条件
- 特征比较



模型缺陷：

- 混淆
- 特征序列的长度
- 库函数内联
- 绕过函数检查



#### [BinSim: Trace-based Semantic Binary Diffing via System Call Sliced Segment Equivalence Checking](https://www.usenix.org/system/files/conference/usenixsecurity17/sec17-ming.pdf)



overview：提出了通过系统调用切分段等价检查的 Trace-based 语义二进制 diff，一种混合的方法，识别细粒度的语义相似性或执行 traces。通过动态切分和符号执行比较指令的逻辑。从两个方面提高了 基于语义的 binary diff: 1. 判断两个可执行文件是否条件等价 2. 检测影响多个基本块的相似或不同点，开发了 BinSim, 可以有效地识别在细粒度上识别两个混淆的 binary, 并且有不错的弹性和准确率。



#### introduction

目前基于语义比较的两类方法：

- 比较两者运行时执行的行为，对于混淆比较有效
- 比较代码的语义片段，通常基于基本块语义建模

但都有相应的缺陷

本文提出了一种混合的方法来解决这个问题，提出 System call sliced segments 的概念以及 Equivalence checking 的技术。依赖系统和API调用来切分代码段，并且使用符号执行和约束求解比较两者的相似性。

contribution:

- 新的概念，System Call Sliced Segment Equivalence
- BinSim检测多个基本块间的相似性以及不同
- 针对混淆的二进制代码对算法做出改进
- 在复杂的混淆和最近的恶意软件中测试

































## 嵌入式固件测试

### [Avatar: A Framework to Support Dynamic SecurityAnalysis of Embedded Systems’ Firmwares](http://www.syssec-project.eu/m/page-media/3/ndss14_zaddach.pdf)



[源码](http://www.s3.eurecom.fr/tools/avatar/)



总的来说，这篇论文提出了 avatar 框架，将模拟器和真实硬件设备连接，提供动态分析支持。

PS：在阅读该文章时，发现已经有后续改进版本 

- [Paper](http://s3.eurecom.fr/docs/bar18_muench.pdf) - [Code](https://github.com/avatartwo/bar18_avatar2)

首先分析嵌入设备调试的必要性和目前存在的问题。

现有的硬件调试接口：Background Debug Mode 和 ARM CoreSight 和 trace. 也有独立于设备的嵌入式调试的标准 例如IEEE NEXUS标准 。

但是很局限，无法执行复杂的操作，如污点传播和符号执行。	、

先前的工作提出了一些解决方案：

- 完全的硬件仿真
- 硬件近似
- 固件调整

因此提出一种混合技术，将实际硬件和CPU模拟器结合，提供对动态分析更高级的支持。

#### avatar

##### 系统架构

固件代码运行在修改的模拟器内部，截获IO访问给物理设备，信号和中断再返回给模拟器。

基于事件。

avatar 开发了一个简单的后端，与模拟器和目标系统沟通。S2E 通过三个不同的控制接口与它连接。

1. 使用 GDB 串行协议的GDB调试连接
2. Qemu 的管理协议（QMP）接口
3. S2E 的一个插件

在目标设备端，建立三个后端

- 使用GDB串行协议与GDB服务器通信
- 对OpenOCD的JTAG调试接口进行底层访问
- 优化的二进制协议

##### 完全分离模式

初次运行，代码和内存完全分离。Avatar 连接两者。

主要缺点：1. 执行速度慢  2. 受限于设备的执行时间，导致系统 crash



##### 上下文切换

相当于对于代码的执行做灵活的调整，可以运行在设备上。

##### 中断处理

硬件中断和软件中断

分三种情况

- 表明任务完成的硬件中断
- 定期硬件中断
- 通知外部设备的硬件中断



嵌入式设备经常使用一个中断多路复用器，需要中断解复用



##### 重现硬件交互

由 avatar 重现已有的硬件交互



### [IOTFUZZER: Discovering Memory Corruptions in IoT Through App-based Fuzzing](http://web.cse.ohio-state.edu/~lin.3021/file/NDSS18b.pdf)

base : 用户通过移动 app 控制 IOT 设备，app 通常包括关于设备协议的丰富信息，我们可以识别并重用程序的逻辑，生成一些测试样例。

目前存在的问题

- 固件映像

- 调试端口

- 多样性

  该paper从 app 入手

#### UI  分析

#### 控制流分析

- 污点源
- 污点传播
- 污点 sink

#### 运行时变异

- function hook
- fuzz 调度
- fuzz 策略

#### 监控响应

- expected 
- unexpected
- no response
- disconnection



#### [Towards Automated Dynamic Analysis for Linux-based Embedded Firmware](https://www.dcddcc.com/docs/2016_paper_firmadyne.pdf)



该论文提出 FIRMADYNE，基于linux 的嵌入式设备的自动化动态分析系统



基于软件的全系统模拟

构成：

##### 爬取固件

获取固件 images

##### 提取固件文件系统

##### 初始模拟

QEMU 全系统模拟

##### 动态分析

#### Motivation

动态分析的不同方式

- 应用程序级

- Process 级

  低模拟保真度

- 系统级

FIRMADYNE 使用全系统模拟，利用修改后的内核，结合自定义的用户空间 NVRAM 实现

#### Concept

架构、获取、提取、模拟