let ipLoacation;

// Load the existing Tencent JSONP endpoint without a jQuery dependency.
(() => {
    if (!document.getElementById('welcome-info')) return;

    const callbackName = '__blogLocation_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    const params = new URLSearchParams({
        key: '2DZBZ-VUF6V-HIQP2-57QCS-ABEBK-5ZFQV',
        output: 'jsonp',
        callback: callbackName,
    });
    let timer;
    let settled = false;

    const cleanup = timedOut => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        script.onerror = null;
        script.onload = null;
        script.remove();
        if (timedOut) {
            // A removed script may still finish; briefly absorb a late JSONP response.
            window[callbackName] = () => {};
            setTimeout(() => { delete window[callbackName]; }, 60000);
        } else {
            delete window[callbackName];
        }
    };

    window[callbackName] = res => {
        cleanup(false);
        ipLoacation = res;
        showWelcome();
    };
    script.async = true;
    script.src = 'https://apis.map.qq.com/ws/location/v1/ip' + '?' + params.toString();
    script.onerror = () => cleanup(false);
    script.onload = () => cleanup(false);
    timer = setTimeout(() => cleanup(true), 10000);
    document.head.appendChild(script);
})();

function getDistance(e1, n1, e2, n2) {
    const R = 6371
    const { sin, cos, asin, PI, hypot } = Math
    let getPoint = (e, n) => {
        e *= PI / 180
        n *= PI / 180
        return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
    }

    let a = getPoint(e1, n1)
    let b = getPoint(e2, n2)
    let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
    let r = asin(c / 2) * 2 * R
    return Math.round(r);
}

function showWelcome() {
    const isEnglish = /^en(?:-|$)/i.test(document.documentElement.lang || '');
    const localize = (zh, en) => isEnglish ? en : zh;
    if (!ipLoacation || !ipLoacation.result || !ipLoacation.result.location || !ipLoacation.result.ad_info || !document.getElementById("welcome-info")) return;

    let dist = getDistance(103.7662335, 1.3191422, ipLoacation.result.location.lng, ipLoacation.result.location.lat); // 新加坡 Clementi Avenue 4 街道参考点：先经度，后纬度
    let pos = ipLoacation.result.ad_info.nation;
    let ip;
    let posdesc;
    //根据国家、省份、城市信息自定义欢迎语
    switch (ipLoacation.result.ad_info.nation) {
        case "日本":
            posdesc = localize("よろしく，一起去看樱花吗", "Nice to meet you! Shall we go see the cherry blossoms?");
            break;
        case "美国":
            posdesc = localize("Let us live in peace!", "Let us live in peace!");
            break;
        case "英国":
            posdesc = localize("想同你一起夜乘伦敦眼", "I'd love to ride the London Eye with you at night.");
            break;
        case "俄罗斯":
            posdesc = localize("干了这瓶伏特加！", "Cheers to a bottle of vodka!");
            break;
        case "法国":
            posdesc = localize("C'est La Vie", "That's life!");
            break;
        case "德国":
            posdesc = localize("Die Zeit verging im Fluge.", "Time flew by.");
            break;
        case "澳大利亚":
            posdesc = localize("一起去大堡礁吧！", "Let's visit the Great Barrier Reef!");
            break;
        case "加拿大":
            posdesc = localize("拾起一片枫叶赠予你", "Here's a maple leaf I picked for you.");
            break;
        case "中国":
            pos = ipLoacation.result.ad_info.province + " " + ipLoacation.result.ad_info.city + " " + ipLoacation.result.ad_info.district;
            ip = ipLoacation.result.ip;
            switch (ipLoacation.result.ad_info.province) {
                case "北京市":
                    posdesc = localize("北——京——欢迎你~~~", "Bei—jing—welcomes you~~~");
                    break;
                case "天津市":
                    posdesc = localize("讲段相声吧。", "How about a little crosstalk comedy?");
                    break;
                case "河北省":
                    posdesc = localize("山势巍巍成壁垒，天下雄关。铁马金戈由此向，无限江山。", "Towering mountains form a mighty pass; armoured horses once rode from here into boundless lands.");
                    break;
                case "山西省":
                    posdesc = localize("展开坐具长三尺，已占山河五百余。", "A three-foot meditation mat unfolds, embracing five hundred miles of hills and rivers.");
                    break;
                case "内蒙古自治区":
                    posdesc = localize("天苍苍，野茫茫，风吹草低见牛羊。", "Beneath the vast sky, wind bends the grass to reveal cattle and sheep.");
                    break;
                case "辽宁省":
                    posdesc = localize("我想吃烤鸡架！", "I'm craving grilled chicken frames!");
                    break;
                case "吉林省":
                    posdesc = localize("状元阁就是东北烧烤之王。", "Zhuangyuange is the king of northeastern barbecue.");
                    break;
                case "黑龙江省":
                    posdesc = localize("很喜欢哈尔滨大剧院。", "I really like the Harbin Grand Theatre.");
                    break;
                case "上海市":
                    posdesc = localize("众所周知，中国只有两个城市。", "As the joke goes, China has only two cities.");
                    break;
                case "江苏省":
                    switch (ipLoacation.result.ad_info.city) {
                        case "南京市":
                            posdesc = localize("这是我挺想去的城市啦。", "This is a city I'd really like to visit.");
                            break;
                        case "苏州市":
                            posdesc = localize("上有天堂，下有苏杭。", "Paradise above; Suzhou and Hangzhou below.");
                            break;
                        default:
                            posdesc = localize("散装是必须要散装的。", "Jiangsu has to keep its cities proudly independent.");
                            break;
                    }
                    break;
                case "浙江省":
                    posdesc = localize("东风渐绿西湖柳，雁已还人未南归。", "The east wind greens the willows of West Lake; the geese return, but I have yet to travel south.");
                    break;
                case "河南省":
                    switch (ipLoacation.result.ad_info.city) {
                        case "郑州市":
                            posdesc = localize("豫州之域，天地之中。", "In the lands of Yuzhou, at the centre of heaven and earth.");
                            break;
                        case "南阳市":
                            posdesc = localize("臣本布衣，躬耕于南阳。此南阳非彼南阳！", "I was a commoner, farming in Nanyang. Though this Nanyang is not that Nanyang!");
                            break;
                        case "驻马店市":
                            posdesc = localize("峰峰有奇石，石石挟仙气。嵖岈山的花很美哦！", "Every peak has wondrous rocks, each touched by magic. The flowers of Chaya Mountain are beautiful!");
                            break;
                        case "开封市":
                            posdesc = localize("刚正不阿包青天。", "The upright and incorruptible Judge Bao.");
                            break;
                        case "洛阳市":
                            posdesc = localize("洛阳牡丹甲天下。", "Luoyang's peonies are the finest in the world.");
                            break;
                        default:
                            posdesc = localize("可否带我品尝河南烩面啦？", "Could you take me to try Henan braised noodles?");
                            break;
                    }
                    break;
                case "安徽省":
                    posdesc = localize("蚌埠住了，芜湖起飞。", "Can't hold it together—Bengbu! Taking off—Wuhu!");
                    break;
                case "福建省":
                    posdesc = localize("井邑白云间，岩城远带山。", "Towns among white clouds; the rocky city stretches towards the mountains.");
                    break;
                case "江西省":
                    posdesc = localize("落霞与孤鹜齐飞，秋水共长天一色。", "Sunset clouds and a lone duck fly together; autumn waters share the colour of the endless sky.");
                    break;
                case "山东省":
                    posdesc = localize("遥望齐州九点烟，一泓海水杯中泻。", "From afar, the nine lands are wisps of mist, and the sea pours like water from a cup.");
                    break;
                case "湖北省":
                    posdesc = localize("来碗热干面！", "A bowl of hot dry noodles, please!");
                    break;
                case "湖南省":
                    posdesc = localize("74751，长沙斯塔克。", "74751, Changsha Stark.");
                    break;
                case "广东省":
                    posdesc = localize("老板来两斤福建人。", "Boss, two jin of Fujian folks, please.");
                    break;
                case "广西壮族自治区":
                    posdesc = localize("桂林山水甲天下。", "Guilin's scenery is the finest in the world.");
                    break;
                case "海南省":
                    posdesc = localize("朝观日出逐白浪，夕看云起收霞光。", "Watch the sunrise chase white waves, then evening clouds gather the sunset glow.");
                    break;
                case "四川省":
                    posdesc = localize("康康川妹子。", "Say hello to the girls of Sichuan.");
                    break;
                case "贵州省":
                    posdesc = localize("茅台，学生，再塞200。", "Maotai, I'm a student—throw in another 200.");
                    break;
                case "云南省":
                    posdesc = localize("玉龙飞舞云缠绕，万仞冰川直耸天。", "Jade Dragon dances through clouds, its towering glaciers reaching the sky.");
                    break;
                case "西藏自治区":
                    posdesc = localize("躺在茫茫草原上，仰望蓝天。", "Lie on the endless grasslands and gaze at the blue sky.");
                    break;
                case "陕西省":
                    posdesc = localize("来份臊子面加馍。", "Some saozi noodles and flatbread, please.");
                    break;
                case "甘肃省":
                    posdesc = localize("羌笛何须怨杨柳，春风不度玉门关。", "Why should the Qiang flute lament the willows? The spring breeze never crosses Yumen Pass.");
                    break;
                case "青海省":
                    posdesc = localize("牛肉干和老酸奶都好好吃。", "The beef jerky and traditional yogurt are both delicious.");
                    break;
                case "宁夏回族自治区":
                    posdesc = localize("大漠孤烟直，长河落日圆。", "A lone plume rises straight above the desert; the setting sun is round over the long river.");
                    break;
                case "新疆维吾尔自治区":
                    posdesc = localize("驼铃古道丝绸路，胡马犹闻唐汉风。", "Camel bells ring along the ancient Silk Road; the horses still carry echoes of Han and Tang.");
                    break;
                case "台湾省":
                    posdesc = localize("我在这头，大陆在那头。", "I'm on this side, and the mainland is on the other.");
                    break;
                case "香港特别行政区":
                    posdesc = localize("永定贼有残留地鬼嚎，迎击光非岁玉。", "Still holding on, still howling in freedom—greeting the glorious years.");
                    break;
                case "澳门特别行政区":
                    posdesc = localize("性感荷官，在线发牌。", "A glamorous dealer is dealing cards online.");
                    break;
                default:
                    posdesc = localize("带我去你的城市逛逛吧！", "Show me around your city!");
                    break;
            }
            break;
        default:
            posdesc = localize("带我去你的国家逛逛吧。", "Show me around your country.");
            break;
    }

    if (isEnglish) {
        // Keep the location detail supplied by the service; localize known place names.
        const placeNames = {
            "日本": "Japan",
            "美国": "United States",
            "英国": "United Kingdom",
            "俄罗斯": "Russia",
            "法国": "France",
            "德国": "Germany",
            "澳大利亚": "Australia",
            "加拿大": "Canada",
            "中国": "China",
            "新加坡": "Singapore",
            "北京市": "Beijing",
            "天津市": "Tianjin",
            "河北省": "Hebei",
            "山西省": "Shanxi",
            "内蒙古自治区": "Inner Mongolia",
            "辽宁省": "Liaoning",
            "吉林省": "Jilin",
            "黑龙江省": "Heilongjiang",
            "上海市": "Shanghai",
            "江苏省": "Jiangsu",
            "南京市": "Nanjing",
            "苏州市": "Suzhou",
            "浙江省": "Zhejiang",
            "河南省": "Henan",
            "郑州市": "Zhengzhou",
            "南阳市": "Nanyang",
            "驻马店市": "Zhumadian",
            "开封市": "Kaifeng",
            "洛阳市": "Luoyang",
            "安徽省": "Anhui",
            "福建省": "Fujian",
            "江西省": "Jiangxi",
            "山东省": "Shandong",
            "湖北省": "Hubei",
            "湖南省": "Hunan",
            "广东省": "Guangdong",
            "广西壮族自治区": "Guangxi",
            "海南省": "Hainan",
            "四川省": "Sichuan",
            "贵州省": "Guizhou",
            "云南省": "Yunnan",
            "西藏自治区": "Tibet",
            "陕西省": "Shaanxi",
            "甘肃省": "Gansu",
            "青海省": "Qinghai",
            "宁夏回族自治区": "Ningxia",
            "新疆维吾尔自治区": "Xinjiang",
            "台湾省": "Taiwan",
            "香港特别行政区": "Hong Kong",
            "澳门特别行政区": "Macao"
        };
        pos = pos.split(' ').map(part => placeNames[part] || part).join(' ');
    }

    //根据本地时间切换欢迎语
    let timeChange;
    let date = new Date();
    if (date.getHours() >= 5 && date.getHours() < 11) timeChange = localize("<span>上午好</span>，一日之计在于晨！", "<span>Good morning</span>! A fresh start to the day!");
    else if (date.getHours() >= 11 && date.getHours() < 13) timeChange = localize("<span>中午好</span>，该摸鱼吃午饭了。", "<span>Good afternoon</span>! Time for a lunch break.");
    else if (date.getHours() >= 13 && date.getHours() < 15) timeChange = localize("<span>下午好</span>，懒懒地睡个午觉吧！", "<span>Good afternoon</span>! How about a lazy nap?");
    else if (date.getHours() >= 15 && date.getHours() < 16) timeChange = localize("<span>三点几啦</span>，一起饮茶呀！", "<span>It's past three</span>—let's have some tea!");
    else if (date.getHours() >= 16 && date.getHours() < 19) timeChange = localize("<span>夕阳无限好！</span>", "<span>What a beautiful sunset!</span>");
    else if (date.getHours() >= 19 && date.getHours() < 24) timeChange = localize("<span>晚上好</span>，夜生活嗨起来！", "<span>Good evening</span>! Enjoy the night!");
    else timeChange = localize("夜深了，早点休息，少熬夜。", "It's late. Get some rest and don't stay up too long.");

    try {
        //自定义文本和需要放的位置
        document.getElementById("welcome-info").innerHTML =
            isEnglish
                ? `<b><center>🎉 Tsurumaki Group Location Service 🎉</center>&emsp;&emsp;Welcome from <span style="color:var(--theme-color)">${pos}</span>! ${timeChange} You are about <span style="color:var(--theme-color)">${dist}</span> km from the blog author. ${posdesc}</b>`
                : `<b><center>🎉 弦卷财团定位服务 🎉</center>&emsp;&emsp;欢迎来自 <span style="color:var(--theme-color)">${pos}</span> 的小伙伴，${timeChange}您现在距离站长约 <span style="color:var(--theme-color)">${dist}</span> 公里，</span> ${posdesc}</b>`;
    } catch (err) {
        // console.log("Pjax无法获取#welcome-info元素🙄🙄🙄")
    }
}
window.addEventListener('load', showWelcome);
// 如果使用了pjax在加上下面这行代码
document.addEventListener('pjax:complete', showWelcome);