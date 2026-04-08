/**
 * 礼金簿页面
 */

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    WeddingActionButton,
    WeddingEmptyState,
    WeddingFilterChip,
    WeddingPageShell,
    WeddingStat,
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useWeddingStore } from "@/store/wedding";
import { GiftForm } from "@/wedding/components";
import { PAYMENT_METHODS } from "@/wedding/constants";
import { calculateGiftStats, formatAmount } from "@/wedding/utils";

export default function GiftBook() {
    const { weddingData, deleteGiftRecord } = useWeddingStore();
    const records = weddingData?.giftRecords || [];
    const guests = weddingData?.guests || [];

    const [filterType, setFilterType] = useState<"all" | "received" | "sent">(
        "all",
    );
    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState<
        undefined | (typeof records)[number]
    >(undefined);

    const stats = calculateGiftStats(records);
    const filteredRecords =
        filterType === "all"
            ? records
            : records.filter((r) => r.type === filterType);

    return (
        <WeddingPageShell>
            <WeddingTopBar title="礼金簿" subtitle="记录收礼送礼与人情往来" backTo="/tools" />

            <section className="wedding-hero p-5">
                <div className="text-sm text-white/80">礼金往来概览</div>
                <div className="mt-2 text-4xl font-black tracking-tight text-white">
                    {formatAmount(stats.netIncome)}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                    <WeddingStat label="收礼总额" value={formatAmount(stats.receivedTotal)} />
                    <WeddingStat label="送礼总额" value={formatAmount(stats.sentTotal)} />
                    <WeddingStat label="净收入" value={formatAmount(stats.netIncome)} />
                </div>
            </section>

            <section className="wedding-surface-card p-3">
                <div className="flex flex-wrap gap-2">
                    {(["all", "received", "sent"] as const).map((type) => (
                        <WeddingFilterChip
                            key={type}
                            active={filterType === type}
                            onClick={() => setFilterType(type)}
                        >
                            {type === "all" ? "全部" : type === "received" ? "收礼" : "送礼"}
                        </WeddingFilterChip>
                    ))}
                </div>
            </section>

            <section className="space-y-3">
                {filteredRecords.length === 0 ? (
                    <WeddingEmptyState
                        icon="icon-[mdi--gift-outline]"
                        title="还没有礼金记录"
                        description="第一笔收礼或送礼记下来后，这里会自动汇总往来情况。"
                    />
                ) : (
                    filteredRecords.map((record) => {
                        const guest = record.guestId
                            ? guests.find((g) => g.id === record.guestId)
                            : null;
                        const guestName = guest?.name || record.guestName || "未知";

                        return (
                            <div
                                key={record.id}
                                className="wedding-surface-card cursor-pointer p-4"
                                onClick={() => {
                                    setEditingRecord(record);
                                    setShowForm(true);
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`mt-1 flex h-11 w-11 items-center justify-center rounded-2xl ${
                                            record.type === "received"
                                                ? "bg-emerald-100 text-emerald-500 dark:bg-emerald-500/10"
                                                : "bg-rose-100 text-rose-500 dark:bg-rose-500/10"
                                        }`}
                                    >
                                        <i className="icon-[mdi--hand-heart-outline] text-xl" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-lg font-semibold text-[color:var(--wedding-text)]">
                                                    {guestName}
                                                </div>
                                                <div className="mt-1 text-xs wedding-muted">
                                                    {new Date(record.date).toLocaleDateString()}
                                                    {record.method
                                                        ? ` · ${PAYMENT_METHODS.find((m) => m.id === record.method)?.name || ""}`
                                                        : ""}
                                                </div>
                                            </div>
                                            <div
                                                className={`text-xl font-bold ${
                                                    record.type === "received"
                                                        ? "text-emerald-500"
                                                        : "text-rose-500"
                                                }`}
                                            >
                                                {record.type === "received" ? "+" : "-"}
                                                {formatAmount(record.amount)}
                                            </div>
                                        </div>
                                        {record.note ? (
                                            <div className="mt-3 text-sm wedding-muted">
                                                {record.note}
                                            </div>
                                        ) : null}
                                        <div className="mt-3 flex justify-end">
                                            <button
                                                type="button"
                                                className="text-xs text-rose-400"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    deleteGiftRecord(record.id);
                                                }}
                                            >
                                                删除
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            <WeddingActionButton
                className="h-14 w-full rounded-[20px] text-base"
                onClick={() => {
                    setEditingRecord(undefined);
                    setShowForm(true);
                }}
            >
                <i className="icon-[mdi--plus] mr-1 size-5" />
                添加礼金记录
            </WeddingActionButton>

            {/* 表单弹窗 */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-black/50" />
                    <div className="fixed top-0 left-0 z-[61] flex h-full w-full items-center justify-center pointer-events-none">
                        <DialogContent
                            className="pointer-events-auto bg-background w-[90vw] max-w-[500px] rounded-md overflow-y-auto max-h-[80vh]"
                            onInteractOutside={() => setShowForm(false)}
                        >
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold border-b pb-3 mb-4 pt-2 pl-1">
                                    {editingRecord
                                        ? "编辑礼金记录"
                                        : "添加礼金记录"}
                                </DialogTitle>
                            </DialogHeader>
                            <GiftForm
                                onClose={() => setShowForm(false)}
                                editRecord={editingRecord}
                            />
                        </DialogContent>
                    </div>
                </DialogPortal>
            </Dialog>
        </WeddingPageShell>
    );
}
