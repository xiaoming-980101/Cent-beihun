/**
 * 亲友表单弹窗组件 - 使用统一 FormDialog
 */

import { useId, useState } from "react";
import { toast } from "sonner";
import type { Guest } from "@/wedding/type";
import { FormDialog } from "@/components/ui/dialog/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWeddingStore } from "@/store/wedding";
import { cn } from "@/utils";
import { INVITE_STATUS, RELATION_GROUPS } from "@/wedding/constants";

export function GuestFormDialog({
    open,
    onOpenChange,
    editGuest,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editGuest?: Guest;
}) {
    const { addGuest, updateGuest } = useWeddingStore();
    const nameInputId = useId();
    const phoneInputId = useId();
    const inviteStatusId = useId();
    const noteInputId = useId();

    const [name, setName] = useState(editGuest?.name || "");
    const [phone, setPhone] = useState(editGuest?.phone || "");
    const [relation, setRelation] = useState<Guest["relation"]>(
        editGuest?.relation ?? "friend",
    );
    const [group, setGroup] = useState<"groom" | "bride" | undefined>(
        editGuest?.group,
    );
    const [inviteStatus, setInviteStatus] = useState<Guest["inviteStatus"]>(
        editGuest?.inviteStatus ?? "pending",
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
            relation,
            group,
            inviteStatus,
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
            onOpenChange(false);
        } catch (err) {
            toast.error("操作失败");
        }
    };

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={editGuest ? "编辑亲友" : "添加亲友"}
            maxWidth="md"
            fullScreenOnMobile={true}
            saveButtonText={editGuest ? "保存更新" : "添加亲友"}
            onSave={handleSubmit}
        >
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
                            <Input
                                id={nameInputId}
                                type="text"
                                className="wedding-input"
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
                            <Input
                                id={phoneInputId}
                                type="tel"
                                className="wedding-input"
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
                        <Select
                            value={inviteStatus}
                            onValueChange={(value) =>
                                setInviteStatus(value as typeof inviteStatus)
                            }
                        >
                            <SelectTrigger id={inviteStatusId} className="wedding-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {INVITE_STATUS.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                        <Textarea
                            id={noteInputId}
                            className={cn(
                                "wedding-input",
                                "min-h-[112px] resize-none",
                            )}
                            placeholder="可记录桌位偏好、同行人数或提醒事项"
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </FormDialog>
    );
}
