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
import { GuestForm } from "@/wedding/components";
import {
    getGroupLabel,
    getGuestRelationLabel,
    getInviteStatusLabel,
} from "@/wedding/utils";

const STATUS_STYLE = {
    confirmed: {
        color: "#22C55E",
        bg: "rgba(34,197,94,0.12)",
        icon: "icon-[mdi--check-circle]",
    },
    invited: {
        color: "#3B82F6",
        bg: "rgba(59,130,246,0.12)",
        icon: "icon-[mdi--clock-outline]",
    },
    pending: {
        color: "#F97316",
        bg: "rgba(249,115,22,0.12)",
        icon: "icon-[mdi--help-circle-outline]",
    },
    declined: {
        color: "#EF4444",
        bg: "rgba(239,68,68,0.12)",
        icon: "icon-[mdi--close-circle-outline]",
    },
} as const;

export default function GuestManagement() {
    const { weddingData, deleteGuest } = useWeddingStore();
    const guests = weddingData?.guests || [];
    const [searchText, setSearchText] = useState("");
    const [activeSide, setActiveSide] = useState("全部");
    const [showForm, setShowForm] = useState(false);
    const [editingGuest, setEditingGuest] = useState<
        undefined | (typeof guests)[number]
    >(undefined);

    const filtered = useMemo(() => {
        return guests.filter((guest) => {
            const searchOk =
                !searchText ||
                guest.name.includes(searchText) ||
                guest.phone?.includes(searchText);
            const groupLabel = getGroupLabel(guest.group);
            const sideOk = activeSide === "全部" || groupLabel === activeSide;
            return searchOk && sideOk;
        });
    }, [activeSide, guests, searchText]);

    const seatEstimate = guests.reduce((sum) => sum + 1, 0);
    const confirmedSeats = guests.filter(
        (item) => item.inviteStatus === "confirmed",
    ).length;

    return (
        <WeddingPageShell>
            <WeddingTopBar
                title="亲友管理"
                subtitle="宾客名单与邀请状态"
                backTo="/tools"
            />

            <section className="grid grid-cols-4 gap-2">
                {[
                    ["总人数", seatEstimate, "#3B82F6"],
                    ["已确认", confirmedSeats, "#22C55E"],
                    [
                        "已邀请",
                        guests.filter((item) => item.inviteStatus === "invited")
                            .length,
                        "#A855F7",
                    ],
                    [
                        "待回复",
                        guests.filter((item) => item.inviteStatus === "pending")
                            .length,
                        "#F97316",
                    ],
                ].map(([label, value, color]) => (
                    <div
                        key={label}
                        className="rounded-[18px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-2.5 py-3 text-center shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]"
                    >
                        <div
                            className="text-[20px] font-bold leading-none"
                            style={{ color }}
                        >
                            {value}
                        </div>
                        <div className="mt-1 text-[10px] wedding-muted">
                            {label}
                        </div>
                    </div>
                ))}
            </section>

            <section className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                <div className="flex items-center gap-2 rounded-2xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-3 py-2.5">
                    <i className="icon-[mdi--magnify] size-4 text-[color:var(--wedding-text-mute)]" />
                    <input
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        placeholder="搜索亲友姓名或电话..."
                        className="w-full bg-transparent text-sm text-[color:var(--wedding-text)] outline-none placeholder:text-[color:var(--wedding-text-mute)]"
                    />
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {["全部", "男方", "女方", "共同"].map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setActiveSide(item)}
                            className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium"
                            style={{
                                background:
                                    activeSide === item
                                        ? "#3B82F6"
                                        : "var(--wedding-surface-muted)",
                                color:
                                    activeSide === item
                                        ? "#fff"
                                        : "#3B82F6",
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </section>

            <section className="space-y-2.5">
                {filtered.length === 0 ? (
                    <div className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-5 py-10 text-center">
                        <div className="text-lg font-semibold text-[color:var(--wedding-text)]">
                            还没有亲友记录
                        </div>
                        <div className="mt-2 text-sm wedding-muted">
                            添加亲友后，这里会展示所属关系、邀请状态和联系方式。
                        </div>
                    </div>
                ) : (
                    filtered.map((guest) => {
                        const statusStyle = STATUS_STYLE[guest.inviteStatus];
                        return (
                            <div
                                key={guest.id}
                                className="rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]"
                            >
                                <button
                                    type="button"
                                    className="block w-full text-left"
                                    onClick={() => {
                                        setEditingGuest(guest);
                                        setShowForm(true);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-base font-bold text-blue-500 dark:bg-blue-500/12">
                                            {guest.name.slice(0, 1)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                                        {guest.name}
                                                    </div>
                                                    <span className="text-[10px] text-[color:var(--wedding-text-soft)]">
                                                        · 1位
                                                    </span>
                                                </div>
                                                <span
                                                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                                                    style={{
                                                        background: statusStyle.bg,
                                                        color: statusStyle.color,
                                                    }}
                                                >
                                                    <i
                                                        className={`${statusStyle.icon} size-3`}
                                                    />
                                                    {getInviteStatusLabel(
                                                        guest.inviteStatus,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="mt-1.5 flex items-center gap-1.5">
                                                <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-medium text-pink-500 dark:bg-pink-500/12">
                                                    {getGuestRelationLabel(
                                                        guest.relation,
                                                    )}
                                                </span>
                                                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] text-blue-500 dark:border-blue-900 dark:bg-blue-500/12">
                                                    {getGroupLabel(guest.group)}
                                                </span>
                                                {guest.phone ? (
                                                    <span className="ml-auto text-[10px] text-[color:var(--wedding-text-mute)]">
                                                        {guest.phone}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    {guest.note ? (
                                        <div className="mt-3 rounded-2xl bg-[color:var(--wedding-surface-muted)] px-3 py-2 text-xs text-[color:var(--wedding-text-soft)]">
                                            {guest.note}
                                        </div>
                                    ) : null}
                                </button>
                                <div className="mt-3 flex justify-end">
                                    <button
                                        type="button"
                                        className="text-xs text-[color:var(--wedding-danger)]"
                                        onClick={() => deleteGuest(guest.id)}
                                    >
                                        删除亲友
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
                    setEditingGuest(undefined);
                    setShowForm(true);
                }}
                className="fixed bottom-[calc(var(--mobile-bottombar-height)+1.25rem+env(safe-area-inset-bottom))] right-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#3B82F6] text-white shadow-[0_16px_28px_-16px_rgba(59,130,246,0.85)] sm:bottom-8"
                aria-label="新增亲友"
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
                                    {editingGuest ? "编辑亲友" : "添加亲友"}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4">
                                <GuestForm
                                    editGuest={editingGuest}
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
