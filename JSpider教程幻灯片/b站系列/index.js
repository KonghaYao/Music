// 爬虫的前置操作注入
window.JSpider = (await import("https://cdn.jsdelivr.net/npm/js-spider@2.0.7/JSpider.js")).default;
window.spider = new JSpider();
await spider.Script("https://cdn.jsdelivr.net/gh/SheetJS/sheetjs/dist/xlsx.full.min.js");
