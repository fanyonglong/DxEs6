GitHub中README.MD的使用
[转载自]:http://blogread.cn/it/article/7333?f=hot1&utm_source=tuicool&utm_medium=referral

GitHub中的README文件，使用markdown格式的文件。这种文件语法比较简单，特别容易上手。

Markdown的语法简洁明了、学习容易，而且功能比纯文本更强，因此有很多人用它写博客。世界上最流行的博客平台WordPress和大型CMS如joomla、drupal都能很好的支持Markdown。

下面简单介绍下相关语法：

大标题：
====

大标题一般显示工程名,你只要在标题下面跟上=====即可（“=”个数无限制）

中标题：
---

中标题一般显示重点项,你只要在标题下面输入——即可（“-”个数无限制）

小标题：

小标题的格式如下 ### 小标题，注意#和标题字符中间要有空格

也可以使用1到6个“#”来表示六级标题：

# 这是 H1
## 这是 H2
### 这是 H3
#### 这是 H4
##### 这是 H5
###### 这是 H6

斜体：

可以使用* 或 _ 包围文字，例如*Hello World*

加粗：

用两个 * 或 _ 包起来的话，达到加粗字体的左右，例如**Hello Markdown**

如果你的 * 和 _ 两边都有空白的话，它们就只会被当成普通的符号

单行文本框：

只要两个Tab再输入文字即可                               
        
    单行      

多行文本框：

你可以写入代码等,每行文字只要输入两个Tab再输入文字即可

    多行
    多行

引用：

> 这是一个有两段文字的引用,
> 无意义的占行文字1.
> 无意义的占行文字2.
> 
> 无意义的占行文字3.
> 无意义的占行文字4.

多层引用
>>> 请问 Markdwon 怎么用？ - 小白

>> 自己看教程！ - 愤青

> 教程在哪？ - 小白

### 列表：

无序列表
使用 *，+，- 表示无序列表。

- 无序列表项 一
- 无序列表项 二
- 无序列表项 三

有序列表

1. 有序列表项 一
2. 有序列表项 二
3. 有序列表项 三


定义型列表

Markdown
:   轻量级文本标记语言，可以转换成html，pdf等格式（左侧有一个可见的冒号和四个不可见的空格

代码块 2
:   这是代码块的定义（左侧有一个可见的冒号和四个不可见的空格）
        代码块（左侧有八个不可见的空格）

列表缩进

*   轻轻的我走了， 正如我轻轻的来； 我轻轻的招手， 作别西天的云彩。
那河畔的金柳， 是夕阳中的新娘； 波光里的艳影， 在我的心头荡漾。 
软泥上的青荇， 油油的在水底招摇； 在康河的柔波里， 我甘心做一条水草！ 
*   那榆荫下的一潭， 不是清泉， 是天上虹； 揉碎在浮藻间， 沉淀着彩虹似的梦。 
寻梦？撑一支长篙， 向青草更青处漫溯； 满载一船星辉， 在星辉斑斓里放歌。 
但我不能放歌， 悄悄是别离的笙箫； 夏虫也为我沉默， 沉默是今晚的康桥！ 
悄悄的我走了， 正如我悄悄的来； 我挥一挥衣袖， 不带走一片云彩。

### 超链接：

Markdown 支持两种形式的链接语法： 行内式和参考式两种形式。
欢迎来到[梵居闹市](http://blog.leanote.com/freewalk)
欢迎来到[梵居闹市](http://blog.leanote.com/freewalk "梵居闹市")

参考式链接：

我经常去的几个网站[Google][1]、[Leanote][2]以及[自己的博客][3]
[Leanote 笔记][2]是一个不错的[网站][]。

[1]:http://www.google.com "Google"
[2]:http://www.leanote.com "Leanote"
[3]:http://blog.leanote.com/freewalk "梵居闹市"
[网站]:http://blog.leanote.com/freewalk

### 自动链接:

<http://example.com/>
<address@example.com>

### 锚点:{#index}

跳转到[目录](#index)

### 图片：

图片的语法和超链接非常相似。只显示图片：

![github](http://p1.img.cctvpic.com/xiyou/userimage/2009/11/02/16383412571511144836026.jpgcropped.jpg "gu")

点击图片进入另一个网页：

[![image]](http://www.example.com/)

[image]: http://p1.img.cctvpic.com/xiyou/userimage/2009/11/02/16383412571511144836026.jpgcropped.jpg "example"

### 插入图片

行内式

美丽花儿： 
![美丽花儿](http://p1.img.cctvpic.com/xiyou/userimage/2009/11/02/16383412571511144836026.jpgcropped.jpg "美丽花儿")

参考式

美丽花儿：

![美丽花儿][flower]

[flower]:http://p1.img.cctvpic.com/xiyou/userimage/2009/11/02/16383412571511144836026.jpgcropped.jpg  "美丽花儿"


### 注脚

使用 Markdown[^1]可以效率的书写文档, 直接转换成 HTML[^2], 你可以使用 Leanote[^Le] 编辑器进行书写。

[^1]:Markdown是一种纯文本标记语言

[^2]:HyperText Markup Language 超文本标记语言

[^Le]:开源笔记平台，支持Markdown和笔记直接发为博文


### 表格

学号|姓名|分数
-|-|-
小明|男|75
小红|女|79
小陆|男|92

|学号|姓名|分数|
|-|-|-|
|小明|男|75|
|小红|女|79|
|小陆|男|92|

产品|价格
-|-:
Leanote 高级账号|60元/年
Leanote 超级账号|120元/年

分隔线

* * *
***
*****
- - -
---------------------------------------

### 代码
对于程序员来说这个功能是必不可少的，插入程序代码的方式有两种，一种是利用缩进(Tab), 另一种是利用”`”符号（一般在ESC键下方）包裹代码。

语法说明：

插入行内代码，即插入一个单词或者一句代码的情况，使用`code`这样的形式插入。
插入多行代码，可以使用缩进或者“` code “`,具体看示例。
注意： 缩进式插入前方必须有空行

行内式

C语言里的函数 `scanf()` 怎么使用？

缩进式多行代码
缩进 4 个空格或是 1 个制表符

一个代码区块会一直持续到没有缩进的那一行（或是文件结尾）。

    #include <stdio.h>
    int main(void)
    {
        printf("Hello world\n");
    }

用六个`包裹多行代码

```
#include <stdio.h>
int main(void)
{
    printf("Hello world\n");
}
```

HTML 原始码

<div class="footer" style="color:red">
   © 2004 Foo Corporation
</div>


README
===========================
该文件用来测试和展示书写README的各种markdown语法。GitHub的markdown语法在标准的markdown语法基础上做了扩充，称之为`GitHub Flavored Markdown`。简称`GFM`，GFM在GitHub上有广泛应用，除了README文件外，issues和wiki均支持markdown语法。

****
	
|Author|果冻虾仁|
|---|---
|E-mail|Jelly.K.Wang@qq.com


****
## 目录
* [横线](#横线)
* [标题](#标题)
* [文本](#文本)
    * 普通文本
    * 单行文本
    * 多行文本
    * 文字高亮
    * 换行
    * 斜体
    * 粗体
    * 删除线
* [图片](#图片)
    * 来源于网络的图片
    * GitHub仓库中的图片
* [链接](#链接) 
    * 文字超链接
        *  链接外部URL
        *  链接本仓库里的URL
    *  锚点
    * [图片链接](#图片链接)
* [列表](#列表)
    * 无序列表
    * 有序列表
    * 复选框列表
* [块引用](#块引用)
* [代码高亮](#代码高亮)
* [表格](#表格) 
* [表情](#表情)
* [diff语法](#diff语法)

### 横线
-----------
***、---、___可以显示横线效果

***
---
___



标题
------

# 一级标题  
## 二级标题  
### 三级标题  
#### 四级标题  
##### 五级标题  
###### 六级标题  


文本
------
### 普通文本
这是一段普通的文本
### 单行文本
    Hello,大家好，我是果冻虾仁。
在一行开头加入1个Tab或者4个空格。
### 文本块
#### 语法1
在连续几行的文本开头加入1个Tab或者4个空格。

    欢迎到访
    很高兴见到您
    祝您，早上好，中午好，下午好，晚安

#### 语法2
使用一对各三个的反引号：
```
欢迎到访
我是C++码农
你可以在知乎、CSDN、简书搜索【果冻虾仁】找到我
```
该语法也可以实现代码高亮，见[代码高亮](#代码高亮)
### 文字高亮
文字高亮功能能使行内部分文字高亮，使用一对反引号。
语法：
```
`linux` `网络编程` `socket` `epoll` 
```
效果：`linux` `网络编程` `socket` `epoll`

也适合做一篇文章的tag
#### 换行
直接回车不能换行，  
可以在上一行文本后面补两个空格，  
这样下一行的文本就换行了。

或者就是在两行文本直接加一个空行。

也能实现换行效果，不过这个行间距有点大。
#### 斜体、粗体、删除线

|语法|效果|
|----|-----|
|`*斜体1*`|*斜体1*|
|`_斜体2_`| _斜体2_|
|`**粗体1**`|**粗体1**|
|`__粗体2__`|__粗体2__|
|`这是一个 ~~删除线~~`|这是一个 ~~删除线~~|
|`***斜粗体1***`|***斜粗体1***|
|`___斜粗体2___`|___斜粗体2___|
|`***~~斜粗体删除线1~~***`|***~~斜粗体删除线1~~***|
|`~~***斜粗体删除线2***~~`|~~***斜粗体删除线2***~~|

    斜体、粗体、删除线可混合使用

图片
------
基本格式：
```
![alt](URL title)
```
alt和title即对应HTML中的alt和title属性（都可省略）：
- alt表示图片显示失败时的替换文本
- title表示鼠标悬停在图片时的显示文本（注意这里要加引号）

URL即图片的url地址，如果引用本仓库中的图片，直接使用**相对路径**就可了，如果引用其他github仓库中的图片要注意格式，即：`仓库地址/raw/分支名/图片路径`，如：
```
https://github.com/guodongxiaren/ImageCache/raw/master/Logo/foryou.gif
```

|#|语法|效果|
|---|---|----
|1|`![baidu](http://www.baidu.com/img/bdlogo.gif "百度logo")`|![baidu](http://www.baidu.com/img/bdlogo.gif "百度logo")
|2|`![][foryou]`|![][foryou]

注意例2的写法使用了**URL标识符**的形式，在[链接](#链接)一节有介绍。
>在文末有foryou的定义：
```
[foryou]:https://github.com/guodongxiaren/ImageCache/raw/master/Logo/foryou.gif
```

链接
------
### 链接外部URL

|#|语法|效果|
|---|----|-----|
|1|`[我的博客](http://blog.csdn.net/guodongxiaren "悬停显示")`|[我的博客](http://blog.csdn.net/guodongxiaren "悬停显示")|
|2|`[我的知乎][zhihu] `|[我的知乎][zhihu] |

语法2由两部分组成：
- 第一部分使用两个中括号，[ ]里的标识符（本例中zhihu），可以是数字，字母等的组合，标识符上下对应就行了（**姑且称之为URL标识符**）
- 第二部分标记实际URL。

>使用URL标识符能达到复用的目的，一般把全文所有的URL标识符统一放在文章末尾，这样看起来比较干净。
>>URL标识符是我起的名字，不知道是否准确。囧。。

### 链接本仓库里的URL

|语法|效果|
|----|-----|
|`[我的简介](/example/profile.md)`|[我的简介](/example/profile.md)|
|`[Book](./Book)`|[Book](/Book)|

### 图片链接
给图片加链接的本质是混合图片显示语法和普通的链接语法。普通的链接中[ ]内部是链接要显示的文本，而图片链接[ ]里面则是要显示的图片。  
直接混合两种语法当然可以，但是十分啰嗦，为此我们可以使用URL标识符的形式。

|#|语法|效果|
|---|----|:---:|
|1|`[![weibo-logo]](http://weibo.com/linpiaochen)`|[![weibo-logo]](http://weibo.com/linpiaochen)|
|2|`[![](/img/zhihu.png "我的知乎，欢迎关注")][zhihu]`|[![](/img/zhihu.png "我的知乎，欢迎关注")][zhihu]|
|3|`[![csdn-logo]][csdn]`|[![csdn-logo]][csdn]|

因为图片本身和链接本身都支持URL标识符的形式，所以图片链接也可以很简洁（见例3）。  
注意，此时鼠标悬停时显示的文字是图片的title，而非链接本身的title了。
> 本文URL标识符都放置于文末

### 锚点
其实呢，每一个标题都是一个锚点，和HTML的锚点（`#`）类似，比如我们 

|语法|效果|
|---|---|
|`[回到顶部](#readme)`|[回到顶部](#readme)|

不过要注意，标题中的英文字母都被转化为**小写字母**了。
> 以前GitHub对中文支持的不好，所以中文标题不能正确识别为锚点，但是现在已经没问题啦！

## 列表
### 无序列表
* 昵称：果冻虾仁
- 别名：隔壁老王
* 英文名：Jelly

### 多级无序列表
* 编程语言
    * 脚本语言
        * Python

### 有序列表
#### 一般效果
就是在数字后面加一个点，再加一个空格。不过看起来起来可能不够明显。    
面向对象的三个基本特征：

1. 封装
2. 继承
3. 多态


#### 多级有序列表
和无序列表一样，有序列表也有多级结构：  

1. 这是一级的有序列表，数字1还是1
   1. 这是二级的有序列表，阿拉伯数字在显示的时候变成了罗马数字
      1. 这是三级的有序列表，数字在显示的时候变成了英文字母
	 

### 复选框列表
- [x] 需求分析
- [x] 系统设计
- [x] 详细设计
- [ ] 编码
- [ ] 测试
- [ ] 交付

您可以使用这个功能来标注某个项目各项任务的完成情况。
> Tip:
>> 在GitHub的**issue**中使用该语法是可以实时点击复选框来勾选或解除勾选的，而无需修改issue原文。

## 块引用

### 常用于引用文本
#### 文本摘自《深入理解计算机系统》P27
　令人吃惊的是，在哪种字节顺序是合适的这个问题上，人们表现得非常情绪化。实际上术语“little endian”（小端）和“big endian”（大端）出自Jonathan Swift的《格利佛游记》一书，其中交战的两个派别无法就应该从哪一端打开一个半熟的鸡蛋达成一致。因此，争论沦为关于社会政治的争论。只要选择了一种规则并且始终如一的坚持，其实对于哪种字节排序的选择都是任意的。
> **“端”（endian）的起源**  
以下是Jonathan Swift在1726年关于大小端之争历史的描述：  
“……下面我要告诉你的是，Lilliput和Blefuscu这两大强国在过去36个月里一直在苦战。战争开始是由于以下的原因：我们大家都认为，吃鸡蛋前，原始的方法是打破鸡蛋较大的一端，可是当今的皇帝的祖父小时候吃鸡蛋，一次按古法打鸡蛋时碰巧将一个手指弄破了，因此他的父亲，当时的皇帝，就下了一道敕令，命令全体臣民吃鸡蛋时打破较小的一端，违令者重罚。”

### 块引用有多级结构
> 数据结构
>> 树
>>> 二叉树
>>>> 平衡二叉树
>>>>> 满二叉树

代码高亮
----------
在三个反引号后面加上编程语言的名字，另起一行开始写代码，最后一行再加上三个反引号。
```Java
public static void main(String[]args){} //Java
```
```c
int main(int argc, char *argv[]) //C
```
```Bash
echo "hello GitHub" #Bash
```
```javascript
document.getElementById("myH1").innerHTML="Welcome to my Homepage"; //javascipt
```
```cpp
string &operator+(const string& A,const string& B) //cpp
```
表格
--------

表头1  | 表头2|
--------- | --------|
表格单元  | 表格单元 |
表格单元  | 表格单元 |

| 表头1  | 表头2|
| ---------- | -----------|
| 表格单元   | 表格单元   |
| 表格单元   | 表格单元   |

### 对齐
表格可以指定对齐方式

| 左对齐 | 居中  | 右对齐 |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |

### 混合其他语法
表格单元中的内容可以和其他大多数GFM语法配合使用，如：  
#### 使用普通文本的删除线，斜体等效果

| 名字 | 描述 |
| ------------- | ----------- |
| Help      | ~~Display the~~ help window.|
| Close     | _Closes_ a window     |

#### 表格中嵌入图片（链接）
其实前面介绍图片显示、图片链接的时候为了清晰就是放在在表格中显示的。

| 图片 | 描述 |
| ---- | ---- |
|![baidu][baidu-logo] | 百度|

表情
----------
Github的Markdown语法支持添加emoji表情，输入不同的符号码（两个冒号包围的字符）可以显示出不同的表情。

比如`:blush:`，可以显示:blush:。

具体每一个表情的符号码，可以查询GitHub的官方网页[http://www.emoji-cheat-sheet.com](http://www.emoji-cheat-sheet.com)。

但是这个网页每次都打开**奇慢**。。所以我整理到了本repo中，大家可以直接在此查看[emoji](./emoji.md)。

diff语法
---------
版本控制的系统中都少不了diff的功能，即展示一个文件内容的增加与删除。
GFM中可以显示的展示diff效果。使用绿色表示新增，红色表示删除。

其语法与代码高亮类似，只是在三个反引号后面写diff，
并且其内容中，以 `+ `开头表示新增，`- `开头表示删除。

效果如下：

```diff
+ 鸟宿池边树，僧敲月下门
- 鸟宿池边树，僧推月下门
```



--------------------------------
[csdn]:http://blog.csdn.net/guodongxiaren "我的博客"
[zhihu]:https://www.zhihu.com/people/jellywong "我的知乎，欢迎关注"
[weibo]:http://weibo.com/linpiaochen
[baidu-logo]:http://www.baidu.com/img/bdlogo.gif "百度logo"
[weibo-logo]:/img/weibo.png "点击图片进入我的微博"
[csdn-logo]:/img/csdn.png "我的CSDN博客"
[foryou]:https://github.com/guodongxiaren/ImageCache/raw/master/Logo/foryou.gif