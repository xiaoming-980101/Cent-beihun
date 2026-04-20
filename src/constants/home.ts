/**
 * 首页常量配置
 */

// 快捷入口配置
export const SHORTCUT_ITEMS = [
    {
        title: "任务",
        icon: "icon-[mdi--clipboard-text-outline]",
        path: "/tasks",
        tone: "bg-pink-500/12 text-pink-500",
    },
    {
        title: "礼金簿",
        icon: "icon-[mdi--gift-outline]",
        path: "/tools/gift-book",
        tone: "bg-violet-500/12 text-violet-500",
    },
    {
        title: "亲友",
        icon: "icon-[mdi--account-group-outline]",
        path: "/tools/guests",
        tone: "bg-blue-500/12 text-blue-500",
    },
    {
        title: "预算管理",
        icon: "icon-[mdi--wallet-outline]",
        path: "/tools/wedding-budget",
        tone: "bg-emerald-500/12 text-emerald-500",
    },
] as const;

// 心形粒子配置
export const HEART_PARTICLES = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    left: `${8 + ((index * 11) % 84)}%`,
    delay: `${(index % 7) * 0.36}s`,
    duration: `${3.4 + (index % 4) * 0.55}s`,
    scale: 0.86 + (index % 3) * 0.2,
    opacity: 0.26 + (index % 6) * 0.1,
}));

// 同步状态图标映射
export const SYNC_ICON_MAP = {
    wait: "icon-[mdi--cloud-minus-outline]",
    syncing: "icon-[line-md--cloud-alt-print-loop]",
    success: "icon-[mdi--cloud-check-outline]",
    failed: "icon-[mdi--cloud-remove-outline] text-red-600",
} as const;
