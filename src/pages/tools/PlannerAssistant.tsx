import dayjs from "dayjs";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import {
    WeddingActionButton,
    WeddingBadge,
    WeddingPageShell,
    WeddingStat,
    WeddingTopBar,
} from "@/components/wedding-ui";
import {
    AssistantProvider,
    showAssistant,
} from "@/components/settings/assistant";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { useUserStore } from "@/store/user";
import { useWeddingStore } from "@/store/wedding";
import { getPlannerSuggestions, getWeddingReadiness } from "@/wedding/planner";

export default function PlannerAssistant() {
    const navigate = useNavigate();
    const { weddingData } = useWeddingStore();
    const { id: userId } = useUserStore();
    const currentBookName = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((book) => book.id === currentBookId)?.name;
        }),
    );
    const assistantMeta = useLedgerStore(
        useShallow((state) => state.infos?.meta.personal?.[userId]?.assistant),
    );
    const suggestions = useMemo(() => {
        return getPlannerSuggestions(weddingData);
    }, [weddingData]);
    const readiness = useMemo(() => {
        return getWeddingReadiness(weddingData);
    }, [weddingData]);
    const bookLabel = currentBookName || "当前账本";
    const upcomingCount = (weddingData?.tasks || []).filter((task) => {
        return (
            task.deadline &&
            task.status !== "completed" &&
            dayjs(task.deadline).diff(dayjs(), "day") >= 0 &&
            dayjs(task.deadline).diff(dayjs(), "day") <= 14
        );
    }).length;
    const assistantConfigCount = assistantMeta?.configs?.length || 0;
    const defaultConfig = assistantMeta?.configs?.find(
        (item) => item.id === assistantMeta?.defaultConfigId,
    );

    return (
        <WeddingPageShell>
            <WeddingTopBar
                title="智能筹备建议"
                subtitle={`${bookLabel} 的婚礼进度分析`}
                backTo="/tools"
            />

            <section className="overflow-hidden rounded-[28px] border border-[color:var(--wedding-line)] bg-[linear-gradient(135deg,#fde7f3,#f3e8ff)] p-5 shadow-[0_18px_36px_-28px_rgba(236,72,153,0.32)] dark:border-fuchsia-900/70 dark:bg-[linear-gradient(135deg,rgba(61,16,48,0.95),rgba(30,13,48,0.95))]">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--wedding-text-soft)]">
                            Planner
                        </div>
                        <div className="mt-2 text-[24px] font-bold text-[color:var(--wedding-text)]">
                            当前筹备完成度 {readiness}%
                        </div>
                        <div className="mt-2 max-w-[420px] text-sm leading-6 text-[color:var(--wedding-text-soft)]">
                            结合任务、预算、亲友和礼金数据，给你一份更接近设计稿产品感的下一步建议。
                        </div>
                    </div>
                    <div className="rounded-full bg-white/55 px-3 py-1.5 text-[11px] font-semibold text-pink-500 dark:bg-white/10">
                        {weddingData?.weddingDate
                            ? dayjs(weddingData.weddingDate).format("YYYY.MM.DD")
                            : "未设置婚期"}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2.5">
                    <WeddingStat
                        label="建议数量"
                        value={`${suggestions.length} 条`}
                        hint="基于当前婚礼数据"
                        tone="info"
                    />
                    <WeddingStat
                        label="近期待办"
                        value={`${upcomingCount} 项`}
                        hint="14 天内截止"
                        tone={upcomingCount > 0 ? "warning" : "success"}
                    />
                    <WeddingStat
                        label="AI 配置"
                        value={
                            assistantConfigCount > 0
                                ? `${assistantConfigCount} 个`
                                : "未配置"
                        }
                        hint={defaultConfig?.model || "可随时补充模型服务"}
                        tone={assistantConfigCount > 0 ? "info" : "default"}
                    />
                </div>
            </section>

            <section className="grid gap-3">
                <div className="flex items-center justify-between px-1">
                    <div className="text-xl font-semibold text-[color:var(--wedding-text)]">
                        下一步建议
                    </div>
                    <WeddingActionButton
                        size="sm"
                        className="h-10 rounded-full px-4 text-sm"
                        onClick={() => showAssistant()}
                    >
                        配置 AI
                    </WeddingActionButton>
                </div>

                <div className="space-y-3">
                    {suggestions.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.22)]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2">
                                    <WeddingBadge tone={item.tone}>
                                        {item.actionLabel}
                                    </WeddingBadge>
                                    <div className="text-[15px] font-semibold text-[color:var(--wedding-text)]">
                                        {item.title}
                                    </div>
                                    <div className="text-[12px] leading-6 text-[color:var(--wedding-text-soft)]">
                                        {item.detail}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate(item.actionPath)}
                                    className="rounded-full bg-[color:var(--wedding-surface-muted)] px-3 py-1.5 text-[11px] font-semibold text-pink-500"
                                >
                                    前往
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => navigate("/tasks/calendar")}
                    className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 text-left shadow-[0_10px_24px_-24px_rgba(15,23,42,0.22)]"
                >
                    <div className="text-[13px] font-semibold text-[color:var(--wedding-text)]">
                        查看时间线
                    </div>
                    <div className="mt-2 text-[11px] leading-5 text-[color:var(--wedding-text-soft)]">
                        把近期待办直接放进日历视角，方便你判断节奏是否拥挤。
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/tools/resource-center")}
                    className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 text-left shadow-[0_10px_24px_-24px_rgba(15,23,42,0.22)]"
                >
                    <div className="text-[13px] font-semibold text-[color:var(--wedding-text)]">
                        打开资料整理中心
                    </div>
                    <div className="mt-2 text-[11px] leading-5 text-[color:var(--wedding-text-soft)]">
                        继续处理导出备份、同步和账本资料，避免数据分散。
                    </div>
                </button>
            </section>

            <AssistantProvider />
        </WeddingPageShell>
    );
}
