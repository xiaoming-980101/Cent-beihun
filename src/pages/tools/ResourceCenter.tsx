import { useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import { StorageAPI } from "@/api/storage";
import { showBookGuide } from "@/components/book/util";
import {
    DataManagerProvider,
    showDataManager,
} from "@/components/data-manager";
import {
    WeddingActionButton,
    WeddingPageShell,
    WeddingSectionTitle,
    WeddingStat,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { useWeddingStore } from "@/store/wedding";

export default function ResourceCenter() {
    const navigate = useNavigate();
    const currentBookName = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((book) => book.id === currentBookId)?.name;
        }),
    );
    const { sync } = useLedgerStore();
    const { weddingData } = useWeddingStore();
    const bookLabel = currentBookName || "当前账本";
    const taskCount = weddingData?.tasks.length || 0;
    const guestCount = weddingData?.guests.length || 0;
    const budgetCount = weddingData?.weddingBudgets.length || 0;

    return (
        <WeddingPageShell>
            <WeddingTopBar
                title="资料整理中心"
                subtitle={`${bookLabel} 的备份、同步与资料入口`}
                backTo="/tools"
            />

            <section className="overflow-hidden rounded-[28px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-5 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.2)]">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--wedding-text-soft)]">
                            Resource Hub
                        </div>
                        <div className="mt-2 text-[24px] font-bold text-[color:var(--wedding-text)]">
                            把婚礼资料集中放在一个入口里
                        </div>
                        <div className="mt-2 max-w-[460px] text-sm leading-6 text-[color:var(--wedding-text-soft)]">
                            这里把同步、导出备份、账本切换和设置入口统一起来，避免之前只有按钮却没有真正承接页面。
                        </div>
                    </div>
                    <WeddingActionButton
                        size="sm"
                        className="h-10 rounded-full px-4 text-sm"
                        onClick={() => showDataManager()}
                    >
                        打开数据管理
                    </WeddingActionButton>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2.5">
                    <WeddingStat
                        label="同步状态"
                        value={
                            sync === "success"
                                ? "已同步"
                                : sync === "syncing"
                                  ? "同步中"
                                  : sync === "wait"
                                    ? "待同步"
                                    : "异常"
                        }
                        hint="支持手动触发同步"
                        tone={sync === "failed" ? "danger" : "info"}
                    />
                    <WeddingStat
                        label="账本数据"
                        value={`${taskCount + guestCount + budgetCount} 项`}
                        hint={`${taskCount} 任务 · ${guestCount} 亲友`}
                    />
                    <WeddingStat
                        label="当前账本"
                        value={bookLabel}
                        hint="可随时切换或管理"
                    />
                </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => showDataManager()}
                    className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[linear-gradient(135deg,#eff6ff,#ffffff)] p-4 text-left shadow-[0_10px_24px_-24px_rgba(15,23,42,0.22)] dark:bg-[linear-gradient(135deg,rgba(15,43,74,0.48),rgba(30,18,25,0.95))]"
                >
                    <div className="text-[13px] font-semibold text-[color:var(--wedding-text)]">
                        导出与备份
                    </div>
                    <div className="mt-2 text-[11px] leading-5 text-[color:var(--wedding-text-soft)]">
                        直接调起现有的数据管理能力，处理导入、导出、备份和智能导入。
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => StorageAPI.toSync()}
                    className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[linear-gradient(135deg,#fff0f7,#ffffff)] p-4 text-left shadow-[0_10px_24px_-24px_rgba(15,23,42,0.22)] dark:bg-[linear-gradient(135deg,rgba(61,16,48,0.48),rgba(30,18,25,0.95))]"
                >
                    <div className="text-[13px] font-semibold text-[color:var(--wedding-text)]">
                        立即同步
                    </div>
                    <div className="mt-2 text-[11px] leading-5 text-[color:var(--wedding-text-soft)]">
                        保留原有同步逻辑，适合在你完成预算、任务或礼金更新后手动刷新。
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => showBookGuide()}
                    className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 text-left shadow-[0_10px_24px_-24px_rgba(15,23,42,0.22)]"
                >
                    <div className="text-[13px] font-semibold text-[color:var(--wedding-text)]">
                        管理账本
                    </div>
                    <div className="mt-2 text-[11px] leading-5 text-[color:var(--wedding-text-soft)]">
                        查看和切换当前账本，保持婚礼项目与日常记账分离。
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/settings")}
                    className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 text-left shadow-[0_10px_24px_-24px_rgba(15,23,42,0.22)]"
                >
                    <div className="text-[13px] font-semibold text-[color:var(--wedding-text)]">
                        打开设置
                    </div>
                    <div className="mt-2 text-[11px] leading-5 text-[color:var(--wedding-text-soft)]">
                        继续处理语音录入、AI 配置、标签和主题等细分能力。
                    </div>
                </button>
            </section>

            <section className="grid gap-3">
                <WeddingSectionTitle title="常用跳转" />
                <div className="grid gap-3 sm:grid-cols-3">
                    {[
                        ["任务日历", "/tasks/calendar"],
                        ["搜索筛选", "/search"],
                        ["统计分析", "/stat"],
                    ].map(([label, path]) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => navigate(path)}
                            className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-4 py-4 text-left text-[13px] font-medium text-[color:var(--wedding-text)] shadow-[0_10px_24px_-24px_rgba(15,23,42,0.22)]"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            <DataManagerProvider />
        </WeddingPageShell>
    );
}
