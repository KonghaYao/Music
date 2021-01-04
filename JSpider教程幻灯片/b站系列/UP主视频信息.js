import { downloadSheet } from "./download.js";
// 到 b 站任意网页开启开发者工具
// 并在 console 中输入才有效
// 注意，爬取时的速度最好加以控制，访问过快会导致 爬虫失败
async function getUPVideo(BID, delay = 100, limits = 1) {
    //limits:设置并发数为1，减小爬取的速度

    // 请求一次获取总页数
    let num = await fetch("https://api.bilibili.com/x/space/arc/search?mid=" + BID + "&ps=30&tid=0&pn=1&keyword=&order=pubdate&jsonp=jsonp")
        .then((res) => res.json())
        .then((res) => Math.ceil(res.data.page.count / 30));

    let res = await spider.Ajax({
        urls: [...Array(num).keys()].map((i) => "https://api.bilibili.com/x/space/arc/search?mid=" + BID + "&ps=30&tid=0&pn=" + (i + 1) + "&keyword=&order=pubdate&jsonp=jsonp"),
        returnType: "json",
        type: "start",
        limits,
        time: delay,
    });

    // 继续上面的代码
    let afterParse = res.map((res1) => res1.data.list.vlist).flat();
    console.log(afterParse);
    //打印结果

    // 通过 JSpider 的Script函数加载 sheetjs 方便我们保存为xlsx文件
    // 下面的部分为固定不变的部分，可以复用
    await downloadSheet(afterParse, "B站UP主" + BID + "的视频信息");
}
export { getUPVideo };
