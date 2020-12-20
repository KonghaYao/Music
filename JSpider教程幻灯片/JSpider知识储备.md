# JSpider 知识储备

## 爬虫知识前奏


#### 开发者工具抓包
在任何一个网页中**右键->查看**（或 **按F12**）可以打开浏览器开发者工具。

在Network面板中，重新刷新页面，就可以看到该网站在某一时刻接收到的数据，这些数据会经过浏览器渲染，变成我们看到的网页。

在这个面板中最重要的是**搜索功能**。 一般而言，我们爬取的都是文字数据，文字数据可以直接从搜索中找到，非常方便我们分析网页。

！！！ 注意：开发者工具中的 Javascript 数据会在网页刷新时清空！
![Network 场景](https://cdn.delivr.net/gh/KonghaYao/notuse/Network.png)


## 爬虫流程
既然能够看到数据，那就需要进行数据的分析了。

#### 1. 分析
分析阶段是通过分析网页中的 **数据加载方式（HTML或 JSON）** 来进行为后面的请求提供依据的一个阶段。

主要的操作就是在**Network 搜索你所需要内容的一部分**，然后查看它的数据格式即可。

![搜索数据来源并查看](https://cdn.delivr.net/gh/KonghaYao/notuse/catch.png)

我们下载的数据一般是从很多页面获取的，但我们一般只在第一页中使用 JSpider 请求并收集这些数据。所以在 Network 面板只有第一或第二页的数据。所以我们要**构造一个从 1 到 n 的数组**，并创建这些 URL 进行请求。

![页码](https://cdn.delivr.net/gh/KonghaYao/notuse/number.png)

在开发者工具的 Console 面板中输入下面的公式看看能够有什么效果吧
``` js
[...Array(100).keys()].map(i=>'这是'+i)
```
通过这种方式可以批量生成有规律的请求网址。

#### 2. 请求
下面的阶段是以 爬取B站我的账户的所有视频信息为例子的，但是更改一个B站id号 也可以爬取另外的UP主的信息。

请求这一阶段是将数据从服务器中下载到浏览器的过程，因为每个网站的数据是搭配网站使用的，所以格式都是不一样的，所以需要进一步解析数据。

``` js
// 到 b 站开启开发者工具
// 并在 console 中输入才有效
let JSpider = (await import('https://cdn.jsdelivr.net/npm/js-spider@2.0.7/JSpider.js')).default 
let a = new JSpider()
let res = await a.Ajax({
    urls:[...Array(1).keys()].map(i=>'https://api.bilibili.com/x/space/arc/search?mid=179754625&ps=30&tid=0&pn='+(i+1)+'&keyword=&order=pubdate&jsonp=jsonp'),
returnType:'json',
    type:'start'
})
console.log(res[0].data.list.vlist)
// 在 res 里面即可请求到结果 这是爬取一个up主的所有视频的情况的方式
```

#### 3. 解析
解析阶段是将请求到的数据处理成希望得到的数据，比如表格，json等常见的格式。

类似上面请求到的数据，包含很多字段，有些我们读得懂，有些读不懂，但是我们只需要抽取这些数据存放到对象结构中即可。

``` js
// 继续上面的代码
// 因为是只有一页，所以这里直接抽取结果的第一个
let afterParse = res[0].data.list.vlist.map(video=>{

    // 抽取信息
    return {
        作者:video.author,
        标题:video.title,
        视频描述:video.description,
        // ... 这里仅仅抽取一部分
    }
})
console.log(afterParse)//打印结果，都是这些字段
```

#### 4. 保存
在浏览器的控制台中的数据是临时的，所以保存数据的手段有两种，下载或放置到浏览器自带的网页数据库中。JSpider 2.0 采用的是第一种方式，而未来的 3.0 版本将会提供数据库的存储方式。

当然，最常见的保存格式为 csv 或 xlsx 格式，所以我们需要自己导入一个处理表格的库—— sheetjs。



``` js

await a.Script('https://cdn.jsdelivr.net/gh/SheetJS/sheetjs/dist/xlsx.full.min.js')// a 是 JSpider 的一个实例

// 下面是固定的操作
let excel = XLSX.utils.json_to_sheet(afterParse)
let newbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(newbook,excel)
XLSX.writeFile(newbook,'这是我的文件.xlsx')
```

### 修改为可以重复使用的函数
下面的函数都是从上面的函数修改而来，基本都一致，只是修改为批量操作而已。
``` js
// 到 b 站任意网页开启开发者工具
// 并在 console 中输入才有效
// getUPVideo(b站id)即可开启爬取
async function getUPVideo(BID, limits=1) {
    //limits:设置并发数为1，减小爬取的速度

    window.JSpider = (await import('https://cdn.jsdelivr.net/npm/js-spider@2.0.7/JSpider.js')).default
    window. a = new JSpider()

    // 请求一次获取总页数
    let num = await fetch("https://api.bilibili.com/x/space/arc/search?mid="+BID+"&ps=30&tid=0&pn=1&keyword=&order=pubdate&jsonp=jsonp").then(res=>res.json()).then(res=>Math.ceil(res.data.page.count / 30))

    let res = await a.Ajax({
        urls: [...Array(num).keys()].map(i=>'https://api.bilibili.com/x/space/arc/search?mid=' + BID + '&ps=30&tid=0&pn=' + (i + 1) + '&keyword=&order=pubdate&jsonp=jsonp'),
        returnType: 'json',
        type: 'start',
        limits,
    })

    // 继续上面的代码
    let afterParse = res.map(res1=>res1.data.list.vlist.map(video=>{
        // 抽取信息
        return {
            作者: video.author,
            标题: video.title,
            视频描述: video.description,
            // ... 这里仅仅抽取一部分
        }
    }
    ))
    console.log(afterParse)
    //打印结果

    // 通过 JSpider 的Script函数加载 sheetjs 方便我们保存为xlsx文件
    // 下面的部分为固定不变的部分，可以复用
    await a.Script('https://cdn.jsdelivr.net/gh/SheetJS/sheetjs/dist/xlsx.full.min.js')
    
    let newbook = XLSX.utils.book_new()
    let sheet = XLSX.utils.json_to_sheet(afterParse.flat())

    XLSX.utils.book_append_sheet(newbook, sheet)
    console.log(newbook)
    XLSX.writeFile(newbook, 'B站UP主' + BID + '的视频信息.xlsx')

}
```

## 总结
浏览器端其实是一个很好的爬虫入手点。

爬取网页时，能够看到数据，说明你是有权限进行查看的，所以完全不需要像 Python 那样去取一下 cookies 或者换一下 UA 来通过权限。

而且 Javascript 的库很多，能够处理很多部分的操作，Console 交互式的操作也更便于我们测试代码，JSpider 基本上将代码的注意力转移到分析阶段，更有利于开发者快速爬取数据。
