import { useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import { WeddingPageShell, WeddingTopBar } from "@/components/wedding-ui";
import { useWeddingStore } from "@/store/wedding";
import { GiftForm } from "@/wedding/components";
import { calculateGiftStats } from "@/wedding/utils";
import {
    formatShortDate,
    getGiftTypeLabel,
    getGroupLabel,
    getGuestRelationLabel,
    getPaymentMethodLabel,
} from "@/wedding/utils";

export default function GiftBook() {
    const { weddingData, deleteGiftRecord } = useWeddingStore();
    const records = weddingData?.giftRecords || [];
    const guests = weddingData?.guests || [];
    const [activeTab, setActiveTab] = useState<"all" | "received" | "sent">(
        "all",
    );
    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState<
        undefined | (typeof records)[number]
    >(undefined);

    const stats = useMemo(() => calculateGiftStats(records), [records]);
    const filtered = useMemo(() => {
        if (activeTab === "all") return records;
        return records.filter((item) => item.type === activeTab);
    }, [activeTab, records]);

    return (
        <WeddingPageShell>
            <WeddingTopBar
                title="礼金簿"
                subtitle="人情往来台账"
                backTo="/tools"
            />

            <section className="rounded-[28px] bg-[linear-gradient(135deg,#fbbcdf,#ddb6f7)] p-5 text-[#3b0d29] shadow-[0_18px_36px_-28px_rgba(244,114,182,0.45)] dark:bg-[linear-gradient(135deg,#3d1030,#1e0d30)] dark:text-white">
                <div className="grid grid-cols-3 gap-3">
                    {[
                        ["收礼总额", stats.receivedTotal, "📈"],
                        ["送礼总额", stats.sentTotal, "📉"],
                        ["净收入", stats.netIncome, "➖"],
                    ].map(([label, amount, icon], index) => (
                        <div
                            key={label}
                            className={`text-center ${index === 1 ? "border-x border-white/30 dark:border-white/10" : ""}`}
                        >
                            <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/35 text-sm dark:bg-white/10">
                                {icon}
                            </div>
                            <div className="text-[18px] font-bold leading-none">
                                ¥{Number(amount).toLocaleString()}
                            </div>
                            <div className="mt-1 text-[10px] opacity-80">
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex gap-2">
                {[
                    ["all", "全部"],
                    ["received", "收礼"],
                    ["sent", "送礼"],
                ].map(([value, label]) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() =>
                            setActiveTab(value as "all" | "received" | "sent")
                        }
                        className="flex-1 rounded-2xl py-2 text-sm font-medium"
                        style={{
                            background:
                                activeTab === value
                                    ? "#F472B6"
                                    : "var(--wedding-surface-muted)",
                            color:
                                activeTab === value
                                    ? "#fff"
                                    : "var(--wedding-accent)",
                        }}
                    >
                        {label}
                    </button>
                ))}
            </section>

            <section className="space-y-2.5">
                {filtered.length === 0 ? (
                    <div className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-5 py-10 text-center">
                        <div className="text-lg font-semibold text-[color:var(--wedding-text)]">
                            还没有礼金记录
                        </div>
                        <div className="mt-2 text-sm wedding-muted">
                            添加第一笔收礼或送礼后，这里会自动汇总统计。
                        </div>
                    </div>
                ) : (
                    filtered
                        .slice()
                        .sort((a, b) => b.date - a.date)
                        .map((record) => {
                            const guest = record.guestId
                                ? guests.find((item) => item.id === record.guestId)
                                : undefined;
                            const guestName =
                                guest?.name || record.guestName || "未知";
                            const amountPrefix =
                                record.type === "received" ? "+" : "-";

                            return (
                                <div
                                    key={record.id}
                                    className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]"
                                >
                                    <button
                                        type="button"
                                        className="block w-full text-left"
                                        onClick={() => {
                                            setEditingRecord(record);
                                            setShowForm(true);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg"
                                                style={{
                                                    background:
                                                        record.type === "received"
                                                            ? "rgba(244,114,182,0.12)"
                                                            : "rgba(59,130,246,0.12)",
                                                }}
                                            >
                                                {record.type === "received"
                                                    ? "🎁"
                                                    : "🎀"}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="truncate text-sm font-semibold text-[color:var(--wedding-text)]">
                                                        {guestName}
                                                    </div>
                                                    <div
                                                        className="text-base font-bold"
                                                        style={{
                                                            color:
                                                                record.type ===
                                                                "received"
                                                                    ? "#22C55E"
                                                                    : "#F97316",
                                                        }}
                                                    >
                                                        {amountPrefix}¥
                                                        {record.amount.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-between gap-3">
                                                    <div className="flex min-w-0 flex-wrap gap-1.5">
                                                        <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-medium text-pink-500 dark:bg-pink-500/12">
                                                            {guest
                                                                ? getGuestRelationLabel(
                                                                      guest.relation,
                                                                  )
                                                                : "未关联"}
                                                        </span>
                                                        <span className="rounded-full border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-2 py-0.5 text-[10px] text-[color:var(--wedding-text-soft)]">
                                                            {getGroupLabel(
                                                                guest?.group,
                                                            )}
                                                        </span>
                                                        <span className="rounded-full border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-2 py-0.5 text-[10px] text-[color:var(--wedding-text-soft)]">
                                                            {getGiftTypeLabel(
                                                                record.type,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="shrink-0 text-[10px] text-[color:var(--wedding-text-mute)]">
                                                        {getPaymentMethodLabel(
                                                            record.method,
                                                        )}{" "}
                                                        · {formatShortDate(record.date)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {record.note ? (
                                            <div className="mt-3 rounded-2xl bg-[color:var(--wedding-surface-muted)] px-3 py-2 text-xs text-[color:var(--wedding-text-soft)]">
                                                {record.note}
                                            </div>
                                        ) : null}
                                    </button>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            className="text-xs text-[color:var(--wedding-danger)]"
                                            onClick={() => deleteGiftRecord(record.id)}
                                        >
                                            删除记录
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                )}
            </section>

            <button
                type="button"
                onClick={() => {
                    setEditingRecord(undefined);
                    setShowForm(true);
                }}
                className="fixed bottom-[calc(var(--mobile-bottombar-height)+1.25rem+env(safe-area-inset-bottom))] right-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#F472B6] to-[#A855F7] text-white shadow-[0_16px_28px_-16px_rgba(244,114,182,0.85)] sm:bottom-8"
                aria-label="新增礼金记录"
            >
                <i className="icon-[mdi--plus] size-6" />
            </button>

            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 z-[80] bg-[rgba(15,12,18,0.56)]" />
                    <div className="fixed inset-0 z-[81] flex items-end justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:px-4 sm:py-6">
                        <DialogContent className="z-[82] flex max-h-[calc(100dvh-1.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-[560px] flex-col overflow-hidden rounded-[30px] border border-[#edd6df] bg-[#fffdfd] shadow-[0_32px_60px_-28px_rgba(31,41,55,0.45)] dark:border-[#302631] dark:bg-[#181419] sm:max-h-[min(84vh,760px)]">
                            <DialogHeader className="border-b border-[color:var(--wedding-line)] px-5 pb-4 pt-5">
                                <DialogTitle className="wedding-topbar-title pl-1 text-[24px] text-[color:var(--wedding-text)]">
                                    {editingRecord ? "编辑礼金记录" : "添加礼金记录"}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4">
                                <GiftForm
                                    editRecord={editingRecord}
                                    onClose={() => setShowForm(false)}
                                />
                            </div>
                        </DialogContent>
                    </div>
                </DialogPortal>
            </Dialog>
        </WeddingPageShell>
    );
}
