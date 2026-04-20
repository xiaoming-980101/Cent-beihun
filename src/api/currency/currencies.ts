export const DefaultCurrencyId = "CNY";

export const DefaultCurrencies = [
    {
        id: "CNY",
        labelKey: "c-rmb", //t('c-rmb') => 人民币
        symbol: "¥",
        icon: "🇨🇳",
    },
    {
        id: "USD",
        labelKey: "c-usd",
        symbol: "$",
        icon: "🇺🇸",
    },
    {
        id: "EUR",
        labelKey: "c-eur", // 欧元
        symbol: "€",
        icon: "🇪🇺",
    },
    {
        id: "JPY",
        labelKey: "c-jpy", // 日元
        symbol: "¥",
        icon: "🇯🇵",
    },
    {
        id: "GBP",
        labelKey: "c-gbp", // 英镑
        symbol: "£",
        icon: "🇬🇧",
    },
    {
        id: "AUD",
        labelKey: "c-aud", // 澳大利亚元
        symbol: "$",
        icon: "🇦🇺",
    },
    {
        id: "CAD",
        labelKey: "c-cad", // 加拿大元
        symbol: "$",
        icon: "🇨🇦",
    },
    {
        id: "CHF",
        labelKey: "c-chf", // 瑞士法郎
        symbol: "Fr",
        icon: "🇨🇭",
    },
    {
        id: "HKD",
        labelKey: "c-hkd", // 港元
        symbol: "$",
        icon: "🇭🇰",
    },
    {
        id: "NZD",
        labelKey: "c-nzd", // 新西兰元
        symbol: "$",
        icon: "🇳🇿",
    },
    {
        id: "SGD",
        labelKey: "c-sgd", // 新加坡元
        symbol: "$",
        icon: "🇸🇬",
    },
    {
        id: "KRW",
        labelKey: "c-krw", // 韩元
        symbol: "₩",
        icon: "🇰🇷",
    },
    {
        id: "INR",
        labelKey: "c-inr", // 印度卢比
        symbol: "₹",
        icon: "🇮🇳",
    },
    {
        id: "BRL",
        labelKey: "c-brl", // 巴西雷亚尔
        symbol: "R$",
        icon: "🇧🇷",
    },
    {
        id: "MXN",
        labelKey: "c-mxn", // 墨西哥比索
        symbol: "$",
        icon: "🇲🇽",
    },
    {
        id: "ZAR",
        labelKey: "c-zar", // 南非兰特
        symbol: "R",
        icon: "🇿🇦",
    },
    {
        id: "SEK",
        labelKey: "c-sek", // 瑞典克朗
        symbol: "kr",
        icon: "🇸🇪",
    },
    {
        id: "NOK",
        labelKey: "c-nok", // 挪威克朗
        symbol: "kr",
        icon: "🇳🇴",
    },
    {
        id: "DKK",
        labelKey: "c-dkk", // 丹麦克朗
        symbol: "kr",
        icon: "🇩🇰",
    },
    {
        id: "TRY",
        labelKey: "c-try", // 土耳其里拉
        symbol: "₺",
        icon: "🇹🇷",
    },
    {
        id: "BGN",
        labelKey: "c-bgn", // 保加利亚列弗
        symbol: "лв",
        icon: "🇧🇬",
    },
    {
        id: "CZK",
        labelKey: "c-czk", // 捷克克朗
        symbol: "Kč",
        icon: "🇨🇿",
    },
    {
        id: "HUF",
        labelKey: "c-huf", // 匈牙利福林
        symbol: "Ft",
        icon: "🇭🇺",
    },
    {
        id: "PLN",
        labelKey: "c-pln", // 波兰兹罗提
        symbol: "zł",
        icon: "🇵🇱",
    },
    {
        id: "RON",
        labelKey: "c-ron", // 罗马尼亚列伊
        symbol: "lei",
        icon: "🇷🇴",
    },
    {
        id: "ISK",
        labelKey: "c-isk", // 冰岛克朗
        symbol: "kr",
        icon: "🇮🇸",
    },
    {
        id: "IDR",
        labelKey: "c-idr", // 印度尼西亚盾
        symbol: "Rp",
        icon: "🇮🇩",
    },
    {
        id: "ILS",
        labelKey: "c-ils", // 以色列新谢克尔
        symbol: "₪",
        icon: "🇮🇱",
    },
    {
        id: "MYR",
        labelKey: "c-myr", // 马来西亚林吉特
        symbol: "RM",
        icon: "🇲🇾",
    },
    {
        id: "PHP",
        labelKey: "c-php", // 菲律宾比索
        symbol: "₱",
        icon: "🇵🇭",
    },
    {
        id: "THB",
        labelKey: "c-thb", // 泰铢
        symbol: "฿",
        icon: "🇹🇭",
    },
    // --- 新增货币结束 ---
];

export type Currency = {
    label: string;
    id: string;
    labelKey: string;
    symbol: string;
    icon: string;
};
