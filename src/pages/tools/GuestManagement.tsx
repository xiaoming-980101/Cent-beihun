/**
 * 亲友管理页面
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
    WeddingTopBar,
} from "@/components/wedding-ui";
import { useWeddingStore } from "@/store/wedding";
import { GuestForm } from "@/wedding/components";
import { INVITE_STATUS, RELATION_GROUPS } from "@/wedding/constants";

export default function GuestManagement() {
    const { weddingData } = useWeddingStore();
    const guests = weddingData?.guests || [];

    const [filterRelation, setFilterRelation] = useState<string>("all");
    const [searchText, setSearchText] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingGuest, setEditingGuest] = useState<
        undefined | (typeof guests)[number]
    >(undefined);

    const filteredGuests = guests.filter((guest) => {
        if (filterRelation !== "all" && guest.relation !== filterRelation)
            return false;
        if (
            searchText &&
            !guest.name.includes(searchText) &&
            !guest.phone?.includes(searchText)
        )
            return false;
        return true;
    });

    // 统计
    const totalCount = guests.length;
    const confirmedCount = guests.filter(
        (g) => g.inviteStatus === "confirmed",
    ).length;

    return (
        <WeddingPageShell>
            <WeddingTopBar
                title="亲友管理"
                subtitle="管理宾客名单与邀请状态"
                backTo="/tools"
            />

            <section className="wedding-hero p-5">
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[20px] bg-white/12 p-4 backdrop-blur">
                        <div className="text-xs uppercase tracking-[0.16em] text-white/75">
                            总人数
                        </div>
                        <div className="mt-2 text-3xl font-black text-white">
                            {totalCount}
                        </div>
                    </div>
                    <div className="rounded-[20px] bg-white/12 p-4 backdrop-blur">
                        <div className="text-xs uppercase tracking-[0.16em] text-white/75">
                            已确认
                        </div>
                        <div className="mt-2 text-3xl font-black text-white">
                            {confirmedCount}
                        </div>
                    </div>
                </div>
            </section>

            <section className="wedding-surface-card p-4">
                <div className="rounded-full border border-[color:var(--wedding-line)] bg-white/70 px-4 py-3 dark:bg-white/6">
                    <input
                        type="text"
                        placeholder="搜索姓名或电话..."
                        className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--wedding-text-mute)]"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    <WeddingFilterChip
                        active={filterRelation === "all"}
                        onClick={() => setFilterRelation("all")}
                    >
                        全部
                    </WeddingFilterChip>
                    {RELATION_GROUPS.map((group) => (
                        <WeddingFilterChip
                            key={group.id}
                            active={filterRelation === group.id}
                            onClick={() => setFilterRelation(group.id)}
                        >
                            {group.name}
                        </WeddingFilterChip>
                    ))}
                </div>
            </section>

            <section className="space-y-3">
                {filteredGuests.length === 0 ? (
                    <WeddingEmptyState
                        icon="icon-[mdi--account-group-outline]"
                        title="还没有亲友记录"
                        description="添加亲友后，这里会展示宾客名单、所属关系和邀请状态。"
                    />
                ) : (
                    filteredGuests.map((guest) => {
                        const statusInfo = INVITE_STATUS.find(
                            (s) => s.id === guest.inviteStatus,
                        );
                        const relationInfo = RELATION_GROUPS.find(
                            (r) => r.id === guest.relation,
                        );

                        return (
                            <div
                                key={guest.id}
                                className="wedding-surface-card cursor-pointer p-4"
                                onClick={() => {
                                    setEditingGuest(guest);
                                    setShowForm(true);
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-500 dark:bg-sky-500/10">
                                        <i className="icon-[mdi--account-heart-outline] text-xl" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2 text-lg font-semibold text-[color:var(--wedding-text)]">
                                                    {guest.name}
                                                    {guest.group ? (
                                                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-500 dark:bg-pink-500/10">
                                                            {guest.group ===
                                                            "groom"
                                                                ? "男方"
                                                                : "女方"}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="mt-1 text-sm wedding-muted">
                                                    {relationInfo?.name ||
                                                        guest.relation}
                                                    {guest.phone
                                                        ? ` · ${guest.phone}`
                                                        : ""}
                                                </div>
                                            </div>
                                            <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-[color:var(--wedding-text-soft)] dark:bg-white/8">
                                                {statusInfo?.name ||
                                                    guest.inviteStatus}
                                            </span>
                                        </div>
                                        {guest.note ? (
                                            <div className="mt-3 text-sm wedding-muted">
                                                {guest.note}
                                            </div>
                                        ) : null}
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
                    setEditingGuest(undefined);
                    setShowForm(true);
                }}
            >
                <i className="icon-[mdi--plus] mr-1 size-5" />
                添加亲友
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
                                    {editingGuest ? "编辑亲友" : "添加亲友"}
                                </DialogTitle>
                            </DialogHeader>
                            <GuestForm
                                onClose={() => setShowForm(false)}
                                editGuest={editingGuest}
                            />
                        </DialogContent>
                    </div>
                </DialogPortal>
            </Dialog>
        </WeddingPageShell>
    );
}
