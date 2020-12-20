// 到 b 站任意网页开启开发者工具
// 并在 console 中输入才有效
// 注意，爬取时的速度最好加以控制，访问过快会导致 爬虫失败
async function getSearchResult(keyword, delay = 1000, limits = 1) {
    //limits:设置并发数为1，减小爬取的速度

    window.JSpider = (await import("https://cdn.jsdelivr.net/npm/js-spider@2.0.7/JSpider.js")).default;
    window.a = new JSpider();

    // 请求一次获取总页数
    let num = await fetch(
        "https://api.bilibili.com/x/web-interface/search/type?context=&page=1&order=&keyword=" +
            keyword +
            "&duration=0&tids_2=&__refresh__=true&_extra=&search_type=video&tids=0&highlight=1&single_column=0"
    )
        .then((res) => res.json())
        .then((res) => res.data.numPages);

    let res = await a.Ajax({
        urls: [...Array(num).keys()].map(
            (i) =>
                "https://api.bilibili.com/x/web-interface/search/type?context=&page=" +
                (i + 1) +
                "&order=&keyword=" +
                keyword +
                "&duration=0&tids_2=&__refresh__=true&_extra=&search_type=video&tids=0&highlight=1&single_column=0"
        ),
        returnType: "json",
        type: "start",
        limits,
        time: delay,
    });

    // 继续上面的代码
    let afterParse = res
        .map((res1) => {
            return res1.data.result;
        })
        .flat();
    console.log(afterParse);
    //打印结果

    // 通过 JSpider 的Script函数加载 sheetjs 方便我们保存为xlsx文件
    // 下面的部分为固定不变的部分，可以复用
    await a.Script("https://cdn.jsdelivr.net/gh/SheetJS/sheetjs/dist/xlsx.full.min.js");

    let newbook = XLSX.utils.book_new();
    let sheet = XLSX.utils.json_to_sheet(afterParse);

    XLSX.utils.book_append_sheet(newbook, sheet);
    console.log(newbook);
    XLSX.writeFile(newbook, "搜索" + keyword + "的信息.xlsx");
}
