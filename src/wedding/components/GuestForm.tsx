/**
 * 亲友表单组件
 */

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWeddingStore } from "@/store/wedding";
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
        <div className="p-4 space-y-4">
            {/* 姓名 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    姓名 *
                </label>
                <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="请输入姓名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* 电话 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">电话</label>
                <input
                    type="tel"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="请输入电话号码"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>

            {/* 关系分组 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">关系</label>
                <div className="flex gap-1 overflow-x-auto">
                    {RELATION_GROUPS.map((g) => (
                        <button
                            key={g.id}
                            className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap ${
                                relation === g.id
                                    ? "bg-pink-500 text-white"
                                    : "bg-gray-100"
                            }`}
                            onClick={() => setRelation(g.id)}
                        >
                            {g.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* 所属方 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    所属方
                </label>
                <div className="flex gap-2">
                    <button
                        className={`px-4 py-1.5 text-sm rounded-lg ${
                            group === undefined ? "bg-gray-200" : "bg-gray-100"
                        }`}
                        onClick={() => setGroup(undefined)}
                    >
                        不指定
                    </button>
                    <button
                        className={`px-4 py-1.5 text-sm rounded-lg ${
                            group === "groom"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100"
                        }`}
                        onClick={() => setGroup("groom")}
                    >
                        男方
                    </button>
                    <button
                        className={`px-4 py-1.5 text-sm rounded-lg ${
                            group === "bride"
                                ? "bg-pink-500 text-white"
                                : "bg-gray-100"
                        }`}
                        onClick={() => setGroup("bride")}
                    >
                        女方
                    </button>
                </div>
            </div>

            {/* 邀请状态 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">
                    邀请状态
                </label>
                <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={inviteStatus}
                    onChange={(e) => setInviteStatus(e.target.value)}
                >
                    {INVITE_STATUS.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 备注 */}
            <div>
                <label className="text-sm text-gray-600 mb-1 block">备注</label>
                <textarea
                    className="w-full border rounded-lg px-3 py-2 resize-none"
                    placeholder="备注信息"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                    取消
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                    {editGuest ? "更新" : "添加"}
                </Button>
            </div>
        </div>
    );
}
