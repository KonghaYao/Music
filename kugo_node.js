const fetch = require("node-fetch");

let cookie = `kg_mid=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx; Hm_lvt_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=; kg_dfid=; kg_dfid_collect=; kg_mid_temp=; Hm_lpvt_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=`;

let hash = "C54E83A449F69C87B306DF8FEB1903D2";
fetch("https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=" + hash + "&_=" + new Date().getTime(), {
    headers: {
        cookie,
        referrer: "https://www.kugou.com/song/",
    },
})
    .then((res) => res.json())
    .then((res) => console.log(res));
