import { getRanks } from "./B站全部区排行.js";
async function init() {
    // 爬虫的前置操作注入
    window.JSpider = (await import("https://cdn.jsdelivr.net/npm/js-spider/JSpider.js")).default;
    window.spider = new JSpider();
    await spider.Script("https://cdn.jsdelivr.net/gh/SheetJS/sheetjs/dist/xlsx.full.min.js");
    const baseURL = "https://cdn.jsdelivr.net/gh/KonhaYao/Music/b站系列/";
    window["_Bilibili"] = {
        getRanks,
    };
    console.log("初始化成功");
}
init();
export {};
