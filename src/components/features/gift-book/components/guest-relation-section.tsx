/**
 * 亲友关系选择区块组件
 * 从 GiftFormDialog 中提取的 UI 组件
 */

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RELATION_GROUPS } from "@/wedding/constants";
import type { Guest } from "@/wedding/type";
import type { GiftFormValues } from "../hooks/use-gift-form";

interface GuestRelationSectionProps {
    guests: Guest[];
    selectedGuestId: string;
    guestName: string;
    relation: GiftFormValues["relation"];
    onGuestIdChange: (guestId: string) => void;
    onGuestNameChange: (name: string) => void;
    onRelationChange: (relation: GiftFormValues["relation"]) => void;
    emptySelectValue: string;
}

export function GuestRelationSection({
    guests,
    selectedGuestId,
    guestName,
    relation,
    onGuestIdChange,
    onGuestNameChange,
    onRelationChange,
    emptySelectValue,
}: GuestRelationSectionProps) {
    return (
        <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                关联亲友
            </label>
            <Select
                value={selectedGuestId || ""}
                onValueChange={(value) =>
                    onGuestIdChange(value === emptySelectValue ? "" : value)
                }
            >
                <SelectTrigger className="wedding-input">
                    <SelectValue placeholder="选择亲友（可选）" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={emptySelectValue}>
                        选择亲友（可选）
                    </SelectItem>
                    {guests.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {!selectedGuestId ? (
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <Input
                        type="text"
                        className="wedding-input"
                        placeholder="未关联亲友时，输入姓名"
                        value={guestName}
                        onChange={(e) => onGuestNameChange(e.target.value)}
                    />
                    <Select
                        value={relation}
                        onValueChange={(value: GiftFormValues["relation"]) =>
                            onRelationChange(value)
                        }
                    >
                        <SelectTrigger className="wedding-input">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {RELATION_GROUPS.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ) : null}
        </div>
    );
}
