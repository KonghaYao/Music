import { downloadSheet } from "./download.js";
async function getAnimes(limits = 1, delay = 0) {
    // 这是同一类的api下的URL的构建
    let total = await fetch(
        "https://api.bilibili.com/pgc/season/index/result?season_version=-1&area=-1&is_finish=-1&copyright=-1&season_status=-1&season_month=-1&year=-1&style_id=-1&order=3&st=1&sort=0&page=2&season_type=1&pagesize=20&type=1"
    )
        .then((res) => res.json())
        .then((res) => res.data.total);
    console.log(total);
    let resArray = await spider.Ajax({
        urls: [...Array(Math.ceil(total / 20)).keys()].map(
            (i) =>
                "https://api.bilibili.com/pgc/season/index/result?season_version=-1&area=-1&is_finish=-1&copyright=-1&season_status=-1&season_month=-1&year=-1&style_id=-1&order=3&st=1&sort=0&page=" +
                (i + 1) +
                "&season_type=1&pagesize=20&type=1"
        ),
        returnType: "json",
        type: "start",
        options: {
            cache: "force-cache",
        },
        limits,
        time: delay,
    });
    console.log(resArray);

    let afterParse = resArray.map((i) => i.data.list).flat();

    // 直接进行下载
    await downloadSheet(afterParse, "B站番剧情况-" + new Date().getTime());
}
export { getAnimes };
