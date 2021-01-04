import { downloadSheet } from "./download.js";
// 到 b 站任意网页开启开发者工具
// 并在 console 中输入才有效
// 注意，爬取时的速度最好加以控制，访问过快会导致 爬虫失败
async function getUPPicbook(BID, delay = 100, limits = 1) {
    //limits:设置并发数为1，减小爬取的速度

    // 请求一次获取总页数
    let num = fetch("https://api.vc.bilibili.com/link_draw/v1/doc/upload_count?uid=" + BID)
        .then((res) => res.json())
        .then((res) => res.data.all_count);
    let res = await spider.Ajax({
        urls: [...Array(num).keys()].map((i) => "https://api.vc.bilibili.com/link_draw/v1/doc/doc_list?uid=" + BID + "&page_num=" + (i + 1) + "&page_size=30&biz=all"),
        returnType: "json",
        type: "start",
        limits,
        time: delay,
    });

    // 继续上面的代码
    let afterParse = res
        .map((res1) => {
            res1.data.items.map((i) => (i.pictures = JSON.stringify(i.pictures)));
            return res1.data.items;
        })
        .flat();
    console.log(afterParse);
    //打印结果

    // 通过 JSpider 的Script函数加载 sheetjs 方便我们保存为xlsx文件
    // 下面的部分为固定不变的部分，可以复用
    await downloadSheet(afterParse, "B站UP主" + BID + "的相簿信息");
}
export { getUPPicbook };
