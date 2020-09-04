let id = 2119768;
let aaa = [
    `{"ids":"[${id}]","level":"standard","encodeType":"aac","csrf_token":""}`,
    "010001",
    "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7",
    "0CoJUm6Qyw8W8jud",
];
//asrsea 来自window对象
let a = asrsea(...aaa);

fetch("https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token=", {
    headers: {
        "content-type": "application/x-www-form-urlencoded",
    },
    referrer: "https://music.163.com/",
    body: `params=${encodeURIComponent(a.encText)}&encSecKey=${encodeURIComponent(a.encSecKey)}`,
    method: "POST",
})
    .then((res) => res.json())
    .then((res) => console.log(res));
