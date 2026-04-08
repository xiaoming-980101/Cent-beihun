/**
 * 工具页入口 - 婚礼主题 Bento Grid 设计
 */

import { useNavigate } from "react-router";
import {
    WeddingPageShell,
    WeddingSectionTitle,
    WeddingTopBar,
} from "@/components/wedding-ui";

const TOOLS = [
    {
        id: "gift-book",
        name: "礼金簿",
        icon: "icon-[mdi--gift]",
        path: "/tools/gift-book",
        description: "精准记录每一份礼金，收礼送礼一目了然",
        gradient:
            "bg-gradient-to-br from-pink-400 to-purple-500 dark:from-pink-600 dark:to-purple-700",
    },
    {
        id: "guests",
        name: "亲友管理",
        icon: "icon-[mdi--account-group]",
        path: "/tools/guests",
        description: "管理宾客名单，跟踪邀请状态与桌位安排",
        gradient:
            "bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700",
    },
    {
        id: "wedding-budget",
        name: "婚礼预算",
        icon: "icon-[mdi--calculator-variant]",
        path: "/tools/wedding-budget",
        description: "全程跟踪定金、尾款及预算执行情况",
        gradient:
            "bg-gradient-to-br from-green-400 to-green-500 dark:from-green-600 dark:to-green-700",
    },
];

const FEATURE_LINKS = [
    {
        name: "任务日历",
        icon: "icon-[mdi--calendar-month-outline]",
        path: "/tasks/calendar",
    },
    {
        name: "搜索记录",
        icon: "icon-[mdi--text-box-search-outline]",
        path: "/search",
    },
    {
        name: "统计分析",
        icon: "icon-[mdi--chart-donut]",
        path: "/stat",
    },
];

export default function Tools() {
    const navigate = useNavigate();

    const handleKeyDown = (path: string) => (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(path);
        }
    };

    return (
        <WeddingPageShell>
            <WeddingTopBar title="Cent" subtitle="高效备婚，从这里开始" />

            <section>
                <div className="px-1 pb-2 pt-2">
                    <h1 className="wedding-topbar-title text-[32px] text-[color:var(--wedding-text)]">
                        婚礼工具箱
                    </h1>
                    <p className="mt-2 text-sm wedding-muted">高效备婚，从这里开始</p>
                </div>
            </section>

            <section className="grid gap-4">
                {TOOLS.map((tool, index) => (
                    <div
                        key={tool.id}
                        className={`wedding-surface-card cursor-pointer p-5 transition-transform hover:scale-[1.01] ${
                            index === 0 ? "min-h-[208px]" : "min-h-[186px]"
                        }`}
                        /* biome-ignore lint/a11y/useSemanticElements: card layout keeps flexible inner content */
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(tool.path)}
                        onKeyDown={handleKeyDown(tool.path)}
                    >
                        <div className="flex h-full flex-col">
                            <div className="flex items-start justify-between">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tool.gradient}`}
                                >
                                    <i className={`${tool.icon} text-2xl text-white`} />
                                </div>
                                {index === 0 ? (
                                    <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-fuchsia-500 dark:bg-fuchsia-500/10">
                                        Essential
                                    </span>
                                ) : null}
                            </div>
                            <div className="mt-6 flex-1">
                                <div className="text-[28px] font-semibold leading-none text-[color:var(--wedding-text)]">
                                    {tool.name}
                                </div>
                                <div className="mt-4 text-sm leading-7 wedding-muted">
                                    {tool.description}
                                </div>
                            </div>
                            <div className="mt-5 text-sm font-medium text-pink-500">
                                进入工具
                                <i className="icon-[mdi--arrow-right-thin] ml-1 inline-block size-4 align-[-2px]" />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <section className="space-y-4 pb-4">
                <WeddingSectionTitle title="常用视图" trailing="Quick Access" />
                <div className="grid grid-cols-3 gap-3">
                    {FEATURE_LINKS.map((item) => (
                        <button
                            key={item.path}
                            type="button"
                            className="wedding-surface-card flex min-h-[112px] flex-col items-center justify-center gap-3 p-4 text-center transition-transform hover:scale-[1.01]"
                            onClick={() => navigate(item.path)}
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-xl text-pink-500 shadow-sm dark:bg-white/8">
                                <i className={item.icon} />
                            </div>
                            <div className="text-sm font-medium text-[color:var(--wedding-text)]">
                                {item.name}
                            </div>
                        </button>
                    ))}
                </div>

                <WeddingSectionTitle title="更多工具" trailing="Coming Soon" />
                <div className="grid grid-cols-2 gap-4">
                    {[
                        ["座次表", "icon-[mdi--seat-outline]"],
                        ["电子请柬", "icon-[mdi--email-outline]"],
                        ["婚礼行程", "icon-[mdi--calendar-blank-outline]"],
                        ["合同保险箱", "icon-[mdi--file-document-outline]"],
                    ].map(([name, icon]) => (
                        <div key={name} className="wedding-dashed-card flex min-h-[110px] flex-col items-center justify-center gap-3 p-4 opacity-80">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-white/8">
                                <i className={`${icon} text-xl text-[color:var(--wedding-text-soft)]`} />
                            </div>
                            <div className="text-sm wedding-muted">{name}</div>
                        </div>
                    ))}
                </div>
                <div className="overflow-hidden rounded-[22px] border border-[color:var(--wedding-line)] bg-gradient-to-r from-[#f8e7ee] to-[#efe2ec] px-8 py-10 text-center dark:from-[#2d1626] dark:to-[#1d1523]">
                    <p className="text-sm italic leading-7 text-pink-400">
                        “每一处细节的准备，都是对未来幸福的许诺。”
                    </p>
                </div>
            </section>
        </WeddingPageShell>
    );
}
