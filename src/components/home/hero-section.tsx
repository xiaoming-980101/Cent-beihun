import dayjs from "dayjs";
import { useNavigate } from "react-router";
import AnimatedNumber from "@/components/animated-number";
import { showBookGuide } from "@/components/book/util";
import { denseDate } from "@/utils/time";

interface Book {
    id: string;
    name: string;
}

interface HeroSectionProps {
    bookLabel: string;
    heroAmount: number;
    weddingDate?: number;
    currentBook?: Book;
    onSetDateClick: () => void;
    taskStats: {
        completed: number;
        total: number;
    };
    guestCount: number;
    giftCount: number;
}

export function HeroSection({
    bookLabel,
    heroAmount,
    weddingDate,
    currentBook,
    onSetDateClick,
    taskStats,
    guestCount,
    giftCount,
}: HeroSectionProps) {
    const navigate = useNavigate();

    const stats = [
        {
            label: "任务完成",
            value: `${taskStats.completed}/${taskStats.total || 0}`,
            sub: "已完成",
            bgClass: "bg-purple-50 dark:bg-purple-500/10",
            textClass: "text-purple-600 dark:text-purple-400",
            iconClass: "icon-[mdi--checkbox-marked-circle-outline]",
        },
        {
            label: "宾客人数",
            value: `${guestCount}`,
            sub: "已登记",
            bgClass: "bg-blue-50 dark:bg-blue-500/10",
            textClass: "text-blue-600 dark:text-blue-400",
            iconClass: "icon-[mdi--account-group-outline]",
        },
        {
            label: "礼金记录",
            value: `${giftCount}`,
            sub: "当前记录",
            bgClass: "bg-pink-50 dark:bg-pink-500/10",
            textClass: "text-pink-600 dark:text-pink-400",
            iconClass: "icon-[mdi--gift-outline]",
        },
    ];

    return (
        <section className="wedding-hero relative overflow-hidden rounded-[28px] p-6 shadow-[0_22px_44px_-30px_rgba(236,72,153,0.38)] transition-shadow hover:shadow-[0_28px_52px_-30px_rgba(236,72,153,0.45)]">
            {/* 背景装饰 - 响应式优化 */}
            <div className="absolute inset-y-0 right-[-15%] w-[45%] rounded-full bg-white/8 blur-3xl" />
            <div className="absolute -bottom-8 -right-3 h-24 w-24 rounded-full bg-white/8 blur-2xl" />
            <div className="absolute -top-8 -left-3 h-20 w-20 rounded-full bg-white/6 blur-xl" />

            <div className="relative space-y-4">
                {/* 顶部栏 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                            <i className="icon-[mdi--heart] size-4 text-white" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                            YueWed
                        </span>
                    </div>
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-all hover:bg-white/25 hover:scale-105 active:scale-95"
                        onClick={() => navigate("/settings")}
                        aria-label="打开设置"
                    >
                        <i className="icon-[mdi--bell-outline] size-5" />
                    </button>
                </div>

                {/* 欢迎信息和金额 */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-xs font-medium text-white/70">
                            你好，欢迎回来
                        </p>
                        <p className="mt-0.5 text-sm text-white/85">
                            {denseDate(dayjs())}
                        </p>
                        <AnimatedNumber
                            value={heroAmount}
                            className="mt-3 text-[48px] font-black leading-none tracking-[-0.04em] text-white drop-shadow-sm dark:text-white"
                        />
                    </div>
                    <button
                        type="button"
                        className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition-all hover:bg-white/30 hover:scale-105 active:scale-95"
                        onClick={onSetDateClick}
                    >
                        {weddingDate
                            ? `${dayjs(weddingDate).format("YYYY.MM.DD")}`
                            : "设置婚期"}
                    </button>
                </div>

                {/* 统计卡片 - 优化版 */}
                <div className="grid grid-cols-3 gap-2.5">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`group rounded-2xl ${stat.bgClass} px-3 py-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-md`}
                        >
                            <div className="flex items-center justify-center gap-1">
                                <i
                                    className={`${stat.iconClass} size-3 ${stat.textClass} opacity-70`}
                                />
                                <div className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                            <div
                                className={`mt-1.5 text-xl font-bold leading-none ${stat.textClass}`}
                            >
                                {stat.value}
                            </div>
                            <div className="mt-1 text-[10px] text-gray-500 dark:text-gray-500">
                                {stat.sub}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 账本标签 */}
                <div className="flex flex-wrap items-center gap-2">
                    {currentBook ? (
                        <button
                            type="button"
                            className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur transition-all hover:bg-white/25"
                            onClick={() => {
                                showBookGuide();
                            }}
                        >
                            <i className="icon-[mdi--book-open-page-variant-outline] mr-1.5 inline-block size-3.5 align-[-2px]" />
                            {currentBook.name}
                        </button>
                    ) : null}
                    <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
                        {bookLabel}
                    </span>
                </div>
            </div>
        </section>
    );
}
