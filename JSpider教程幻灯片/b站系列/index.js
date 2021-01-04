import { getRanks } from "./B站全部区排行.js";
import { getAnimes } from "./B站番剧信息.js";
import { getSearchResult } from "./B站搜索信息.js";
import { getUPPicbook } from "./UP主相簿信息.js";
import { getUPVideo } from "./UP主视频信息.js";
async function init() {
    // 爬虫的前置操作注入
    window.JSpider = (await import("https://cdn.jsdelivr.net/npm/js-spider/JSpider.js")).default;
    window.spider = new JSpider();
    await spider.Script("https://cdn.jsdelivr.net/gh/SheetJS/sheetjs/dist/xlsx.full.min.js");
    const baseURL = "https://cdn.jsdelivr.net/gh/KonhaYao/Music/b站系列/";

    window["_Bilibili"] = {
        全站排名获取: getRanks,
        全部番剧信息收集: getAnimes,
        在站内搜索: getSearchResult,
        UP主相簿信息: getUPPicbook,
        UP主视频信息: getUPVideo,
    };
    Object.assign(window["_Bilibili"], { getRanks, getAnimes, getSearchResult, getUPPicbook, getUPVideo });
    console.log("初始化成功");
}
init();
export {};
