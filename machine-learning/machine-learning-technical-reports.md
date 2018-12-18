# 技术报告
主要介绍常用机器学习算法以及优缺点、使用场景，能解决什么问题

<!-- more -->

机器学习算法可以分为三类：
- 监督学习
- 无监督学习
- 强化学习

基本的机器学习算法：线性回归、支持向量机、最近邻、逻辑回归、决策树、K means、随机森林、朴素贝叶斯、降维、

### 线性回归
快速简单的。

### 逻辑回归
解决二分问题。
### 支持向量机
SVM，这是线性分类器

需要对输入数据进行完全标记，仅直接适用于两类任务，

### KNN 
给定测试样本，基于某种距离读量找出训练集中与其最靠近的k个训练样本，然后基于这k个邻居的信息进行预测。在分类任务中使用投票法，在回归任务中使用平均法。
这是典型的懒惰学习法

可用于分类和回归
缺点：对数据的局部结构非常敏感。计算量大，需要对数据进行规范化处理。

### 逻辑回归算法

### 决策树算法
决策树（decision tree）是一个树结构（可以是二叉树或非二叉树）。其每个非叶节点表示一个特征属性上的测试，每个分支代表这个特征属性在某个值域上的输出，而每个叶节点存放一个类别。使用决策树进行决策的过程就是从根节点开始，测试待分类项中相应的特征属性，并按照其值选择输出分支，直到到达叶子节点，将叶子节点存放的类别作为决策结果。

适用于小数据集。

#### 优点
计算量简单，可解释性强，比较适合处理有缺失属性值的样本，能够处理不相关的特征；
学习速度和预测速度快
擅长对人、地点、事物的一系列不同特征、品质、特性进行评估

#### 缺点
在实际构造决策树时，通常要进行剪枝，这时为了处理由于数据中的噪声和离群点导致的过分拟合问题。剪枝分为先剪枝和后剪枝

### k-MEANS
把 n 个点划分到k个集群，使得每个点都属于离他最近的均值对应的集群。

#### 优点：简单快速
#### 缺点：不适合发现大小差别很大的簇，对噪声、孤立点敏感
无监督学习算法

### 随机森林
随机森林是一个包含多个决策树的分类器，其输出的的类别是由个别树输出的类别的众数决定，
在大规模数据集和存在大量且有时不相关特征的项时比较有用。

#### 优点：不易过拟合
#### 缺点
### 朴素贝叶斯算法
适用于特征相互独立的场景。

### 人工神经网络
- CNN：卷积神经网络

- RNN：循环神经网络
- DNN：深度神经网络


感知器神经网络
反向传递
自组织映射

### logistic 回归
这个用于分类，快速而简单，逻辑回归提供线性类边界。

### 线性判别分析

### 主成分分析
是重要的降维方法分析

### 概率图模型
分为有向图和无向图。
有向图：贝叶斯网 
很多经典的机器学习模型可以使用有向图模型来描述，比如朴素贝叶斯分类器、隐式马尔可夫模型、深度信念网络等。
#### 隐式马尔可夫 HMM，主要用于时序建模。
#### 马尔可夫随机场：是典型的马尔可夫网
无向图模型也成为马尔可夫随机场或马尔可夫网络。
隐马尔可夫模型
#### 高斯混合模型


推荐一些实操网站：
1. https://studio.azureml.net/
2. http://ufldl.stanford.edu/wiki/index.php/