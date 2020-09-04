const fetch = require("node-fetch");
let id = 27841234;
fetch("https://www.kuwo.cn/url?format=mp3&rid=" + id + "&response=url&type=convert_url3&br=128kmp3&from=web&httpsStatus=1")
    .then((res) => res.json())
    .then((res) => console.log(res));
