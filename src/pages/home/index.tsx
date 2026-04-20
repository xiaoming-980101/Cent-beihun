import dayjs from "dayjs";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { StorageAPI } from "@/api/storage";
import CloudLoopIcon from "@/assets/icons/cloud-loop.svg?react";
import { HintTooltip } from "@/components/hint";
import {
    ActivitiesSection,
    BillsTimelineSection,
    BudgetSection,
    CountdownCards,
    HeroSection,
    ShortcutGrid,
} from "@/components/home";
import { Promotion } from "@/components/promotion";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/dialog/index";
import WeddingDatePicker from "@/components/ui/wedding-date-picker";
import WeddingEasterEgg from "@/components/wedding-easter-egg";
import {
    WeddingPageShell,
    WeddingSectionTitle,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { SYNC_ICON_MAP } from "@/constants/home";
import { useEasterEgg } from "@/hooks/use-easter-egg";
import { useHomeData } from "@/hooks/use-home-data";
import { useWeddingActivities } from "@/hooks/use-wedding-activities";
import { useWeddingCountdown } from "@/hooks/use-wedding-countdown";
import { useLedgerStore } from "@/store/ledger";
import { useWeddingStore } from "@/store/wedding";
import { cn } from "@/utils";
import {
    ProgressOverview,
    QuickStatsGrid,
    TodayTasksCard,
    UpcomingTasks,
} from "@/wedding/components";
import { formatAmount } from "@/wedding/utils";

export default function Page() {
    const navigate = useNavigate();

    // 使用自定义 hooks 获取数据
    const {
        currentBook,
        bookLabel,
        latestBills,
        loading,
        sync,
        heroAmount,
        recentIncomeExpense,
        categoryById,
        budgets,
        weddingData,
        weddingStats,
    } = useHomeData();

    const {
        init: initWedding,
        initialized: weddingInitialized,
        updateWeddingInfo,
    } = useWeddingStore();

    // 婚礼倒计时
    const { nowTick, engagementDays, weddingDays } = useWeddingCountdown(
        weddingData?.engagementDate,
        weddingData?.weddingDate,
    );

    // 彩蛋管理
    const {
        eggOpen,
        setEggOpen,
        tapProgress,
        finalCountdownSeconds,
        onCountdownTap,
    } = useEasterEgg(weddingData?.engagementDate, weddingData?.weddingDate);

    // 婚礼活动
    const { homeActivities, giftSummary } = useWeddingActivities(
        weddingData || undefined,
    );

    // 本地状态
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerLoading, setDatePickerLoading] = useState(false);

    // 处理婚期设置保存
    const handleDatePickerSave = async () => {
        setDatePickerLoading(true);
        try {
            // 批量更新，避免并发冲突
            const updates: {
                engagementDate?: number;
                weddingDate?: number;
                partnerName?: string;
            } = {};

            if (partnerNameDraft.trim()) {
                updates.partnerName = partnerNameDraft.trim();
            }
            if (engagementDateDraft) {
                updates.engagementDate = engagementDateDraft;
            }
            if (weddingDateDraft) {
                updates.weddingDate = weddingDateDraft;
            }

            if (Object.keys(updates).length > 0) {
                await updateWeddingInfo(updates);
            }

            setShowDatePicker(false);
        } catch (error) {
            console.error("Failed to update wedding data:", error);
            // 即使出错也关闭弹窗，因为本地状态已更新
            setShowDatePicker(false);
        } finally {
            setDatePickerLoading(false);
        }
    };
    const [engagementDateDraft, setEngagementDateDraft] = useState<
        number | undefined
    >(undefined);
    const [weddingDateDraft, setWeddingDateDraft] = useState<
        number | undefined
    >(undefined);
    const [partnerNameDraft, setPartnerNameDraft] = useState("");

    // 初始化和副作用
    const allLoaded = useRef(false);
    useLayoutEffect(() => {
        if (!allLoaded.current && budgets.length > 0) {
            useLedgerStore.getState().refreshBillList();
            allLoaded.current = true;
        }
    }, [budgets.length]);

    useLayoutEffect(() => {
        const shell = document.querySelector<HTMLElement>(".wedding-app-shell");
        if (!shell) {
            return;
        }

        const resetScroll = () => {
            shell.scrollTop = 0;
        };

        resetScroll();
        const frame = window.requestAnimationFrame(resetScroll);
        const timer = window.setTimeout(resetScroll, 450);

        return () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (!weddingInitialized) {
            initWedding();
        }
    }, [weddingInitialized, initWedding]);

    useEffect(() => {
        if (!showDatePicker) {
            return;
        }
        setEngagementDateDraft(weddingData?.engagementDate || undefined);
        setWeddingDateDraft(weddingData?.weddingDate || undefined);
        setPartnerNameDraft(weddingData?.partnerName || "");
    }, [
        showDatePicker,
        weddingData?.engagementDate,
        weddingData?.weddingDate,
        weddingData?.partnerName,
    ]);

    // 计算值
    const showWeddingSection =
        weddingData && (weddingData.engagementDate || weddingData.weddingDate);
    const syncIconClassName = SYNC_ICON_MAP[sync] || SYNC_ICON_MAP.wait;
    const weddingBudgets = weddingData?.weddingBudgets ?? [];

    return (
        <WeddingPageShell contentClassName="wedding-home-page">
            <WeddingTopBar subtitle={`${bookLabel}账本与工具中心`} />

            {/* Hero Section */}
            <HeroSection
                bookLabel={bookLabel}
                heroAmount={heroAmount}
                weddingDate={weddingData?.weddingDate}
                currentBook={currentBook}
                onSetDateClick={() => setShowDatePicker(true)}
                taskStats={{
                    completed: weddingStats?.completedTaskCount || 0,
                    total: weddingStats?.taskCount || 0,
                }}
                guestCount={weddingStats?.guestCount || 0}
                giftCount={weddingStats?.giftCount || 0}
            />

            {/* 倒计时卡片 */}
            <CountdownCards
                engagementDate={weddingData?.engagementDate}
                weddingDate={weddingData?.weddingDate}
                engagementDays={engagementDays}
                weddingDays={weddingDays}
                tapProgress={tapProgress}
                onCountdownTap={onCountdownTap}
                onPreviewEgg={(kind, target) =>
                    setEggOpen({
                        kind,
                        title: kind === "engagement" ? "订婚彩蛋" : "结婚彩蛋",
                        target,
                    })
                }
            />

            {/* 快捷入口 */}
            {showWeddingSection ? <ShortcutGrid /> : null}

            {/* 婚礼数据概览 */}
            {showWeddingSection ? (
                <section className="grid gap-3">
                    <QuickStatsGrid />
                    <ProgressOverview />
                    <TodayTasksCard />
                    <UpcomingTasks />
                </section>
            ) : (
                <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="wedding-surface-card p-5">
                        <WeddingSectionTitle title="欢迎回来" />
                        <p className="mt-3 text-sm leading-7 wedding-muted">
                            这里保留了原项目的账本能力，并把任务、礼金与预算工具整合到同一套视觉系统里。
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <ShortcutGrid />
                        </div>
                    </div>
                    <Promotion />
                </section>
            )}

            {/* 收支明细 */}
            <BillsTimelineSection
                latestBills={latestBills}
                loading={loading}
                categoryById={categoryById}
                recentIncomeExpense={recentIncomeExpense}
            />

            {/* 活动动态 */}
            <ActivitiesSection activities={homeActivities} />

            {/* 预算与同步 */}
            <BudgetSection
                budgets={budgets}
                weddingBudgets={weddingBudgets}
                bookLabel={bookLabel}
                syncStatus={sync}
            />

            {/* 彩蛋弹窗 */}
            {eggOpen ? (
                <WeddingEasterEgg
                    kind={eggOpen.kind}
                    title={eggOpen.title}
                    target={eggOpen.target}
                    partnerName={weddingData?.partnerName}
                    nowTick={nowTick}
                    finalCountdownSeconds={finalCountdownSeconds}
                    onClose={() => setEggOpen(null)}
                />
            ) : null}

            {/* 婚期设置弹窗 */}
            <ResponsiveDialog
                open={showDatePicker}
                onOpenChange={setShowDatePicker}
                title="设置婚礼信息"
                description="完善你们的婚礼信息，让应用更加个性化"
                fullScreenOnMobile={false} // 简单表单，不需要全屏
                maxWidth="sm"
                actions={{
                    cancelText: "取消",
                    confirmText: "保存设置",
                    onConfirm: handleDatePickerSave,
                    loading: datePickerLoading,
                }}
            >
                <div className="p-6 space-y-4">
                    <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/12">
                                <i className="icon-[mdi--account-heart] size-4 text-rose-500" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                    伴侣昵称
                                </div>
                                <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                    用于彩蛋等个性化显示
                                </div>
                            </div>
                        </div>
                        <input
                            type="text"
                            value={partnerNameDraft}
                            onChange={(e) =>
                                setPartnerNameDraft(e.target.value)
                            }
                            placeholder="例如：宝贝、佳佳"
                            className="w-full rounded-xl border border-rose-200/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,241,247,0.9))] px-3 py-2 text-sm text-rose-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-rose-800/50 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(244,114,182,0.08))] dark:text-rose-300"
                        />
                    </div>

                    <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/12">
                                <i className="icon-[mdi--ring] size-4 text-cyan-500" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                    订婚日期
                                </div>
                                <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                    记录订婚的美好时刻
                                </div>
                            </div>
                        </div>
                        <WeddingDatePicker
                            value={engagementDateDraft}
                            onChange={setEngagementDateDraft}
                            tone="cyan"
                        />
                    </div>

                    <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/12">
                                <i className="icon-[mdi--heart] size-4 text-pink-500" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                    婚礼日期
                                </div>
                                <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                    设定人生中最重要的一天
                                </div>
                            </div>
                        </div>
                        <WeddingDatePicker
                            value={weddingDateDraft}
                            onChange={setWeddingDateDraft}
                            tone="pink"
                        />
                    </div>
                </div>
            </ResponsiveDialog>
        </WeddingPageShell>
    );
}
