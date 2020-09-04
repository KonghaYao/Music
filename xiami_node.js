const fetch = require("node-fetch");
const o = require("./xiami.module");

async function init() {
    return await fetch("https://www.xiami.com/").then((res) => {
        let cookie = res.headers.raw()["set-cookie"];
        allCookie = cookie.map((i) => i.split(";")[0]).join(";");
        console.log();
        return [cookie.filter((i) => /xm_sg_tk=/.test(i))[0].match(/(?<=\=)[\s\S]+?(?=_)/)[0], allCookie];
    });
}
async function get() {
    let [r, cookie] = await init();
    let _q = `{"songIds":[1769961279]}`;
    let _url = "/api/song/getPlayInfo";
    let inner = "".concat(r, "_xmMain_").concat(_url, "_").concat(_q);
    console.log(inner);
    var _s = o()(inner);

    let result = await fetch(`https://www.xiami.com/api/song/getPlayInfo?_q=${encodeURIComponent(_q)}&_s=${encodeURIComponent(_s)}`, {
        headers: {
            cookie,
        },
    })
        .then((res) => res.json())
        .then((res) => res);
    console.log(result);
}
get();
