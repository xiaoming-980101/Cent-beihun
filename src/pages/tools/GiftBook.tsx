import { useMemo, useState } from "react";
import { GiftFormDialog } from "@/components/features/gift-book/gift-form-dialog";
import { EmptyState, FloatingActionButton } from "@/components/shared";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { confirm } from "@/components/ui/dialog/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { WeddingPageShell, WeddingTopBar } from "@/components/wedding-ui";
import { useWeddingStore } from "@/store/wedding";
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
                rightSlot={
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full text-[color:var(--wedding-text-soft)] hover:bg-[color:var(--wedding-surface-muted)]"
                                aria-label="筛选礼金记录"
                            >
                                <i className="icon-[mdi--filter-variant] size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setActiveTab("all")}>
                                全部记录
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveTab("received")}>
                                仅看收礼
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveTab("sent")}>
                                仅看送礼
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
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

            <section>
                {filtered.length === 0 ? (
                    <EmptyState
                        title="还没有礼金记录"
                        description="添加第一笔收礼或送礼后，这里会自动汇总统计。"
                        action={{
                            label: "添加礼金",
                            onClick: () => {
                                setEditingRecord(undefined);
                                setShowForm(true);
                            },
                        }}
                    />
                ) : (
                    <Accordion type="single" collapsible className="space-y-2.5">
                        {filtered
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
                                    <AccordionItem
                                        key={record.id}
                                        value={record.id}
                                        className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]"
                                    >
                                        <AccordionTrigger className="px-4 py-4 hover:no-underline [&[data-state=open]]:pb-2">
                                            <div className="flex w-full items-center gap-3">
                                                <div
                                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg"
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
                                                <div className="min-w-0 flex-1 text-left">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="truncate text-sm font-semibold text-[color:var(--wedding-text)]">
                                                            {guestName}
                                                        </div>
                                                        <div
                                                            className="shrink-0 text-base font-bold"
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
                                                    <div className="mt-1.5 flex items-center gap-1.5">
                                                        <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-medium text-pink-500 dark:bg-pink-500/12">
                                                            {guest
                                                                ? getGuestRelationLabel(
                                                                      guest.relation,
                                                                  )
                                                                : "未关联"}
                                                        </span>
                                                        <span className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                                            {formatShortDate(record.date)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4 pt-2">
                                            <Separator className="mb-3" />
                                            <div className="space-y-3">
                                                {/* 详细信息 */}
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">
                                                            所属方
                                                        </div>
                                                        <div className="mt-1 font-medium">
                                                            {getGroupLabel(guest?.group)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">
                                                            类型
                                                        </div>
                                                        <div className="mt-1 font-medium">
                                                            {getGiftTypeLabel(record.type)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">
                                                            支付方式
                                                        </div>
                                                        <div className="mt-1 font-medium">
                                                            {getPaymentMethodLabel(
                                                                record.method,
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">
                                                            日期
                                                        </div>
                                                        <div className="mt-1 font-medium">
                                                            {formatShortDate(record.date)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 备注 */}
                                                {record.note && (
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">
                                                            备注
                                                        </div>
                                                        <div className="mt-1 rounded-xl bg-muted px-3 py-2 text-sm">
                                                            {record.note}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 操作按钮 */}
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => {
                                                            setEditingRecord(record);
                                                            setShowForm(true);
                                                        }}
                                                    >
                                                        <i className="icon-[mdi--pencil] mr-1.5 size-4" />
                                                        编辑
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={async () => {
                                                            const confirmed = await confirm({
                                                                title: "确认删除礼金记录？",
                                                                description: "此操作无法撤销，删除后将永久移除该礼金记录。",
                                                                variant: "destructive",
                                                                confirmText: "确认删除",
                                                                cancelText: "取消",
                                                            });
                                                            
                                                            if (confirmed) {
                                                                deleteGiftRecord(record.id);
                                                            }
                                                        }}
                                                    >
                                                        <i className="icon-[mdi--delete-outline] mr-1.5 size-4" />
                                                        删除
                                                    </Button>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                    </Accordion>
                )}
            </section>

            <FloatingActionButton
                onClick={() => {
                    setEditingRecord(undefined);
                    setShowForm(true);
                }}
                className="bg-gradient-to-r from-[#F472B6] to-[#A855F7] text-white"
                aria-label="新增礼金记录"
            >
                <i className="icon-[mdi--plus] size-6" />
            </FloatingActionButton>

            <GiftFormDialog
                open={showForm}
                onOpenChange={(open) => {
                    setShowForm(open);
                    if (!open) {
                        setEditingRecord(undefined);
                    }
                }}
                editRecord={editingRecord}
            />
        </WeddingPageShell>
    );
}
