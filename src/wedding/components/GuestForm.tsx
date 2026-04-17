/**
 * 亲友表单组件
 */

import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWeddingStore } from "@/store/wedding";
import { cn } from "@/utils";
import { INVITE_STATUS, RELATION_GROUPS } from "@/wedding/constants";

interface GuestFormProps {
    onClose?: () => void;
    editGuest?: {
        id: string;
        name: string;
        phone?: string;
        relation: string;
        group?: "groom" | "bride";
        inviteStatus: string;
        note?: string;
    };
}

export function GuestForm({ onClose, editGuest }: GuestFormProps) {
    const { addGuest, updateGuest } = useWeddingStore();
    const baseFieldClassName = "wedding-input";
    const nameInputId = useId();
    const phoneInputId = useId();
    const inviteStatusId = useId();
    const noteInputId = useId();

    const [name, setName] = useState(editGuest?.name || "");
    const [phone, setPhone] = useState(editGuest?.phone || "");
    const [relation, setRelation] = useState(editGuest?.relation || "friend");
    const [group, setGroup] = useState<"groom" | "bride" | undefined>(
        editGuest?.group,
    );
    const [inviteStatus, setInviteStatus] = useState(
        editGuest?.inviteStatus || "pending",
    );
    const [note, setNote] = useState(editGuest?.note || "");

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("请输入姓名");
            return;
        }

        const guestData = {
            name: name.trim(),
            phone: phone.trim() || undefined,
            relation: relation as any,
            group,
            inviteStatus: inviteStatus as any,
            note: note.trim() || undefined,
        };

        try {
            if (editGuest) {
                await updateGuest(editGuest.id, guestData);
                toast.success("更新成功");
            } else {
                await addGuest(guestData);
                toast.success("添加成功");
            }
            onClose?.();
        } catch (err) {
            toast.error("操作失败");
        }
    };

    return (
        <div className="space-y-5 px-1 pb-1">
            <div className="wedding-soft-card space-y-5 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor={nameInputId}
                            className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                        >
                            姓名
                        </label>
                        <input
                            id={nameInputId}
                            type="text"
                            className={baseFieldClassName}
                            placeholder="请输入姓名"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={phoneInputId}
                            className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                        >
                            电话
                        </label>
                        <input
                            id={phoneInputId}
                            type="tel"
                            className={baseFieldClassName}
                            placeholder="请输入电话号码"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                        关系
                    </span>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {RELATION_GROUPS.map((item) => (
                            <button
                                key={item.id}
                                data-active={relation === item.id}
                                type="button"
                                className="wedding-segment min-h-11 px-3 py-2 text-sm"
                                onClick={() => setRelation(item.id)}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="wedding-soft-card space-y-5 p-4">
                <div>
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                        所属方
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            {
                                label: "不指定",
                                value: undefined,
                                activeClassName:
                                    "border-transparent bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-sm dark:from-slate-500 dark:to-slate-600",
                            },
                            {
                                label: "男方",
                                value: "groom" as const,
                                activeClassName:
                                    "border-transparent bg-sky-500 text-white shadow-sm",
                            },
                            {
                                label: "女方",
                                value: "bride" as const,
                                activeClassName:
                                    "border-transparent bg-pink-500 text-white shadow-sm",
                            },
                        ].map((item) => {
                            const active = group === item.value;
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    className={cn(
                                        "rounded-[18px] border px-3 py-3 text-sm font-medium transition",
                                        active
                                            ? item.activeClassName
                                            : "border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] text-[color:var(--wedding-text-soft)]",
                                    )}
                                    onClick={() => setGroup(item.value)}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor={inviteStatusId}
                        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                    >
                        邀请状态
                    </label>
                    <select
                        id={inviteStatusId}
                        className={baseFieldClassName}
                        value={inviteStatus}
                        onChange={(e) => setInviteStatus(e.target.value)}
                    >
                        {INVITE_STATUS.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="wedding-soft-card space-y-4 p-4">
                <div>
                    <label
                        htmlFor={noteInputId}
                        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                    >
                        备注
                    </label>
                    <textarea
                        id={noteInputId}
                        className={cn(
                            baseFieldClassName,
                            "min-h-[112px] resize-none",
                        )}
                        placeholder="可记录桌位偏好、同行人数或提醒事项"
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-1">
                <Button
                    variant="outline"
                    className="h-12 flex-1 rounded-[18px] border-[color:var(--wedding-line)] bg-white/90 text-[color:var(--wedding-text)] hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                    onClick={onClose}
                >
                    关闭
                </Button>
                <Button
                    className="h-12 flex-1 rounded-[18px] bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-[0_18px_30px_-18px_rgba(217,70,150,0.9)] hover:opacity-95"
                    onClick={handleSubmit}
                >
                    {editGuest ? "保存更新" : "添加亲友"}
                </Button>
            </div>
        </div>
    );
}
