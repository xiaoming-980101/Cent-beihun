/**
 * 工具页入口 - 通用主题 Bento Grid 设计
 */

import { useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import {
    WeddingBadge,
    WeddingPageShell,
    WeddingSectionTitle,
    WeddingStat,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useBookStore } from "@/store/book";
import { useWeddingStore } from "@/store/wedding";

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
        name: "预算管理",
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
    const currentBookName = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((book) => book.id === currentBookId)?.name;
        }),
    );
    const bookLabel = currentBookName || "当前账本";
    const { weddingData } = useWeddingStore();
    const tasks = weddingData?.tasks || [];
    const guests = weddingData?.guests || [];
    const giftRecords = weddingData?.giftRecords || [];
    const budgets = weddingData?.weddingBudgets || [];
    const pendingTaskCount = tasks.filter(
        (item) => item.status !== "completed",
    ).length;

    return (
        <WeddingPageShell>
            <WeddingTopBar title="Cent" subtitle={`${bookLabel}常用工具`} />

            <section className="wedding-section-enter">
                <div className="px-1 pb-2 pt-2">
                    <h1 className="wedding-topbar-title text-[32px] text-[color:var(--wedding-text)]">
                        {bookLabel}工具箱
                    </h1>
                    <p className="mt-2 text-sm wedding-muted">
                        围绕当前账本整理常用功能和辅助工具
                    </p>
                </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-4">
                <WeddingStat
                    label="待推进任务"
                    value={`${pendingTaskCount} 项`}
                    hint="按优先级继续推进"
                    tone={pendingTaskCount > 0 ? "danger" : "success"}
                />
                <WeddingStat
                    label="亲友人数"
                    value={`${guests.length} 位`}
                    hint="邀请状态持续跟进"
                />
                <WeddingStat
                    label="礼金记录"
                    value={`${giftRecords.length} 笔`}
                    hint="收礼送礼都会汇总"
                />
                <WeddingStat
                    label="预算项目"
                    value={`${budgets.length} 项`}
                    hint="定金与尾款同步查看"
                />
            </section>

            <section className="grid gap-4">
                {TOOLS.map((tool, index) => (
                    <button
                        key={tool.id}
                        type="button"
                        className={`wedding-surface-card wedding-card-interactive wedding-section-enter cursor-pointer p-5 ${
                            index === 0 ? "min-h-[208px]" : "min-h-[186px]"
                        }`}
                        onClick={() => navigate(tool.path)}
                    >
                        <div className="flex h-full flex-col">
                            <div className="flex items-start justify-between">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tool.gradient}`}
                                >
                                    <i
                                        className={`${tool.icon} text-2xl text-white`}
                                    />
                                </div>
                                {index === 0 ? (
                                    <WeddingBadge tone="accent">
                                        优先推荐
                                    </WeddingBadge>
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
                            <div className="wedding-link mt-5 text-sm font-medium">
                                进入工具
                                <i className="icon-[mdi--arrow-right-thin] ml-1 inline-block size-4 align-[-2px]" />
                            </div>
                        </div>
                    </button>
                ))}
            </section>

            <section className="space-y-4 pb-4">
                <WeddingSectionTitle title="常用视图" trailing="快速入口" />
                <div className="grid grid-cols-3 gap-3">
                    {FEATURE_LINKS.map((item) => (
                        <button
                            key={item.path}
                            type="button"
                            className="wedding-surface-card wedding-card-interactive flex min-h-[112px] flex-col items-center justify-center gap-3 p-4 text-center"
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

                <WeddingSectionTitle title="更多工具" trailing="规划中" />
                <div className="grid grid-cols-2 gap-4">
                    {[
                        ["座次表", "icon-[mdi--seat-outline]"],
                        ["电子请柬", "icon-[mdi--email-outline]"],
                        ["行程安排", "icon-[mdi--calendar-blank-outline]"],
                        ["合同保险箱", "icon-[mdi--file-document-outline]"],
                    ].map(([name, icon]) => (
                        <div
                            key={name}
                            className="wedding-dashed-card wedding-section-enter flex min-h-[110px] flex-col items-center justify-center gap-3 p-4 opacity-80"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-white/8">
                                <i
                                    className={`${icon} text-xl text-[color:var(--wedding-text-soft)]`}
                                />
                            </div>
                            <div className="text-sm wedding-muted">{name}</div>
                        </div>
                    ))}
                </div>
                <div className="wedding-soft-card wedding-section-enter overflow-hidden px-8 py-8 text-center">
                    <p className="text-sm italic leading-7 text-[color:var(--wedding-accent)]">
                        “每一处细节的准备，都是对未来幸福的许诺。”
                    </p>
                </div>
            </section>
        </WeddingPageShell>
    );
}
