const fetch = require("node-fetch");

fetch("http://music.taihe.com/v1/song/tracklink?TSID=T10049270827")
    .then((res) => res.json())
    .then((res) => console.log(res));
