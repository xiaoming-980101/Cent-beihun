import { useMemo, useState } from "react";
import { GuestFormDialog } from "@/components/features/guests/guest-form-dialog";
import { EmptyState, FloatingActionButton } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { WeddingPageShell, WeddingTopBar } from "@/components/wedding-ui";
import { useWeddingStore } from "@/store/wedding";
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
                    <EmptyState
                        title="还没有亲友记录"
                        description="添加亲友后，这里会展示所属关系、邀请状态和联系方式。"
                        action={{
                            label: "添加亲友",
                            onClick: () => {
                                setEditingGuest(undefined);
                                setShowForm(true);
                            },
                        }}
                    />
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
                                                <Badge
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium"
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
                                                </Badge>
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

            <FloatingActionButton
                onClick={() => {
                    setEditingGuest(undefined);
                    setShowForm(true);
                }}
                className="bg-[#3B82F6] text-white"
                aria-label="新增亲友"
            >
                <i className="icon-[mdi--plus] size-6" />
            </FloatingActionButton>

            <GuestFormDialog
                open={showForm}
                onOpenChange={(open) => {
                    setShowForm(open);
                    if (!open) {
                        setEditingGuest(undefined);
                    }
                }}
                editGuest={editingGuest}
            />
        </WeddingPageShell>
    );
}
