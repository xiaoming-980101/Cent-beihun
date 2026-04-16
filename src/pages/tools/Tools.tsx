import { useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import { FeatureCard, ThemeToggle } from "@/components/shared";
import { WeddingPageShell, WeddingTopBar } from "@/components/wedding-ui";
import { useBookStore } from "@/store/book";
import { useWeddingStore } from "@/store/wedding";
import { Gift, Users, Wallet } from "lucide-react";

const MAIN_TOOLS = [
    {
        key: "gift-book",
        label: "礼金簿",
        desc: "人情往来台账",
        icon: <Gift className="h-6 w-6 text-purple-600 dark:text-purple-300" />,
        iconVariant: "purple" as const,
        badge: "Essential",
        path: "/tools/gift-book",
    },
    {
        key: "guests",
        label: "亲友管理",
        desc: "宾客名单与邀请",
        icon: <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />,
        iconVariant: "blue" as const,
        path: "/tools/guests",
    },
    {
        key: "wedding-budget",
        label: "婚礼预算",
        desc: "花销与付款管理",
        icon: <Wallet className="h-6 w-6 text-green-600 dark:text-green-300" />,
        iconVariant: "green" as const,
        path: "/tools/wedding-budget",
    },
];

const SECONDARY_TOOLS = [
    {
        label: "任务日历",
        path: "/tasks/calendar",
        icon: "icon-[mdi--calendar-month-outline]",
        color: "#F97316",
        desc: "排期与里程碑",
    },
    {
        label: "统计分析",
        path: "/stat",
        icon: "icon-[mdi--chart-donut]",
        color: "#22C55E",
        desc: "婚礼数据报表",
    },
    {
        label: "搜索筛选",
        path: "/search",
        icon: "icon-[mdi--text-box-search-outline]",
        color: "#EC4899",
        desc: "快速检索记录",
    },
    {
        label: "语音记录",
        path: "/settings",
        icon: "icon-[mdi--microphone-outline]",
        color: "#F472B6",
        desc: "AI 语音转录",
    },
    {
        label: "标签管理",
        path: "/settings",
        icon: "icon-[mdi--tag-outline]",
        color: "#A855F7",
        desc: "自定义分类标签",
    },
    {
        label: "AI 助手",
        path: "/tools/planner-assistant",
        icon: "icon-[mdi--sparkles]",
        color: "#3B82F6",
        desc: "智能筹备建议",
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
    const { weddingData } = useWeddingStore();
    const bookLabel = currentBookName || "当前账本";
    const tasks = weddingData?.tasks || [];
    const guests = weddingData?.guests || [];
    const giftRecords = weddingData?.giftRecords || [];
    const budgets = weddingData?.weddingBudgets || [];
    const totalGiftAmount = giftRecords.reduce((sum, item) => {
        return sum + (item.type === "received" ? item.amount : 0);
    }, 0);
    const totalBudget = budgets.reduce((sum, item) => sum + item.budget, 0);
    const paidBudget = budgets.reduce((sum, item) => sum + item.spent, 0);
    const secondaryMeta = {
        "任务日历": `${tasks.filter((item) => item.deadline).length} 个排期日`,
        "统计分析": `${giftRecords.length + budgets.length + tasks.length} 条婚礼数据`,
        "搜索筛选": `${tasks.length + guests.length + giftRecords.length} 条可检索`,
        语音记录: "设置中启用",
        标签管理: "分类与标签维护",
        "AI 助手": "智能摘要与建议",
    } as const;

    const subMap = {
        "gift-book": `收 ¥${totalGiftAmount.toLocaleString()} · ${giftRecords.length} 笔记录`,
        guests: `${guests.length} 位亲友 · ${guests.filter((item) => item.inviteStatus === "confirmed").length} 已确认`,
        "wedding-budget": `总 ¥${totalBudget.toLocaleString()} · ${totalBudget > 0 ? Math.round((paidBudget / totalBudget) * 100) : 0}% 已付`,
    } as const;

    return (
        <WeddingPageShell>
            <WeddingTopBar
                title="Cent"
                subtitle={`${bookLabel}常用工具`}
                backTo="/"
                rightSlot={<ThemeToggle />}
            />

            <section className="px-1 pb-1 pt-1">
                <h1 className="wedding-topbar-title text-[20px] font-bold text-[color:var(--wedding-text)]">
                    {bookLabel}工具箱
                </h1>
                <p className="mt-1 text-xs wedding-muted">
                    婚礼筹备核心功能与常用入口
                </p>
            </section>

            <section className="grid grid-cols-4 gap-2">
                {[
                    ["待推进任务", `${tasks.filter((item) => item.status !== "completed").length} 项`, "进行中", "#FFF7ED", "#F97316"],
                    ["亲友人数", `${guests.length} 位`, "已登记", "#EFF6FF", "#3B82F6"],
                    ["礼金记录", `${giftRecords.length} 笔`, "台账", "#FDE7F3", "#F472B6"],
                    ["预算项目", `${budgets.length} 项`, "管理中", "#F3E8FF", "#A855F7"],
                ].map(([label, value, sub, bg, color]) => (
                    <div
                        key={label}
                        className="rounded-[18px] px-2.5 py-3 text-center"
                        style={{ background: bg }}
                    >
                        <div
                            className="text-[20px] font-bold leading-none"
                            style={{ color }}
                        >
                            {value}
                        </div>
                        <div className="mt-1 text-[10px] text-[color:var(--wedding-text-soft)]">
                            {label}
                        </div>
                        <div className="mt-0.5 text-[10px] text-[color:var(--wedding-text-mute)]">
                            {sub}
                        </div>
                    </div>
                ))}
            </section>

            <section className="grid gap-3">
                {MAIN_TOOLS.map((tool) => (
                    <FeatureCard
                        key={tool.key}
                        icon={tool.icon}
                        iconVariant={tool.iconVariant}
                        title={tool.label}
                        description={`${tool.desc} · ${subMap[tool.key as keyof typeof subMap]}`}
                        badge={tool.badge}
                        onAction={() => navigate(tool.path)}
                    />
                ))}
            </section>

            <section className="space-y-4 pb-3">
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-[color:var(--wedding-line)]" />
                    <span className="text-[11px] text-[color:var(--wedding-text-mute)]">
                        更多工具
                    </span>
                    <div className="h-px flex-1 bg-[color:var(--wedding-line)]" />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                    {SECONDARY_TOOLS.map((tool) => (
                        <button
                            key={tool.label}
                            type="button"
                            onClick={() => navigate(tool.path)}
                            className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-3 py-4 text-center shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)] transition-transform hover:-translate-y-0.5"
                        >
                            <div
                                className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl"
                                style={{ background: `${tool.color}16` }}
                            >
                                <i
                                    className={`${tool.icon} size-5`}
                                    style={{ color: tool.color }}
                                />
                            </div>
                            <div className="mt-2 text-[12px] font-medium text-[color:var(--wedding-text)]">
                                {tool.label}
                            </div>
                            <div className="mt-1 text-[10px] text-[color:var(--wedding-text-mute)]">
                                {tool.desc}
                            </div>
                            <div className="mt-1 text-[10px] text-[color:var(--wedding-text-soft)]">
                                {
                                    secondaryMeta[
                                        tool.label as keyof typeof secondaryMeta
                                    ]
                                }
                            </div>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        {
                            title: "快捷筹备建议",
                            desc: "结合当前任务、预算和亲友数据生成下一步建议",
                            action: "查看建议",
                            path: "/tools/planner-assistant",
                        },
                        {
                            title: "资料整理中心",
                            desc: "导出、备份、同步与账本资料管理入口",
                            action: "打开中心",
                            path: "/tools/resource-center",
                        },
                    ].map((card) => (
                        <button
                            key={card.title}
                            type="button"
                            onClick={() => navigate(card.path)}
                            className="rounded-[22px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 text-left shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]"
                        >
                            <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                {card.title}
                            </div>
                            <div className="mt-2 text-[11px] leading-5 text-[color:var(--wedding-text-soft)]">
                                {card.desc}
                            </div>
                            <div className="mt-3 text-[11px] font-medium text-pink-500">
                                {card.action}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="rounded-[24px] border border-fuchsia-200 bg-[linear-gradient(135deg,#fde7f3,#f3e8ff)] p-4 dark:border-fuchsia-900/70 dark:bg-[linear-gradient(135deg,rgba(61,16,48,0.95),rgba(30,13,48,0.95))]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/50 text-pink-500 dark:bg-white/10">
                            <i className="icon-[mdi--sparkles] size-5" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                AI 婚礼助手
                            </div>
                            <div className="mt-1 text-xs wedding-muted">
                                结合当前账本与婚礼数据，补足搜索、预算和筹备建议。
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/tools/planner-assistant")}
                            className="rounded-full bg-gradient-to-r from-[#f472b6] to-[#a855f7] px-3 py-1.5 text-[11px] font-semibold text-white"
                        >
                            体验
                        </button>
                    </div>
                </div>
            </section>
        </WeddingPageShell>
    );
}
