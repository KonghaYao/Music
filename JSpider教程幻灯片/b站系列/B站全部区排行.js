import { downloadExcel } from "./download.js";
async function getRanks() {
    // 这是同一类的api下的URL的构建
    let urls = [
        "douga",
        "bangumi",
        "guochan",
        "guochuang",
        "music",
        "dance",
        "game",
        "technology",
        "digital",
        "life",
        "food",
        "kichiku",
        "fashion",
        "ent",
        "movie",
        "tv",
        "cinephile",
        "documentary",
    ].map((i) => "https://www.bilibili.com/v/popular/rank/" + i);

    let resArray = await spider.Ajax({
        urls,
        returnType: "text",
        type: "start",
        options: {},
    });

    // B站这个排名的数据全部使用 JS 代码中直接注入的方式导入
    // 所以我们直接正则表达式匹配加转对象即可获取
    let afterParse = resArray.map((i) => JSON.parse(i.match(/INITIAL_STATE__=([\s\S]*?});\(function/)[1]));

    // 把上面抽取到的每一个作为 Excel 中的一页进行构建对象
    // result 的形状 = {
    //    专栏:[{...},{...},]
    //}
    let sheetName = ["动画", "番剧", "国产动画", "国创相关", "音乐", "舞蹈", "游戏", "知识", "数码", "生活", "美食", "鬼畜", "时尚", "娱乐", "电影", "电视剧", "影视", "纪录片"];
    let result = sheetName.reduce((all, i, index) => {
        all[i] = afterParse[index].rankList; // 只有rankList字段是保存了有效数据的
        return all;
    }, {});

    // 专栏的数据不是同一种api，所以单独获取一下
    let Text = await fetch("https://api.bilibili.com/x/article/rank/list?cid=3&jsonp=jsonp", {
        cache: "force-cache",
    }).then((res) => res.json());
    result["专栏"] = Text.data;

    // 直接进行下载
    await downloadExcel(result, "B站全区排行-" + new Date().getTime());
}
