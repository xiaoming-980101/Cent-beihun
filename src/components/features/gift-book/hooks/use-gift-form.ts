/**
 * 礼金表单业务逻辑 Hook
 * 从 GiftFormDialog 中提取的业务逻辑
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod/mini";
import { useWeddingStore } from "@/store/wedding";
import { RELATION_GROUPS } from "@/wedding/constants";
import type { GiftRecord } from "@/wedding/type";

const EMPTY_SELECT_VALUE = "__EMPTY__";

const giftFormSchema = z.object({
    type: z.enum(["received", "sent"]),
    guestId: z.optional(z.string()),
    guestName: z.string(),
    relation: z.enum(["relative", "friend", "colleague", "classmate", "other"]),
    amount: z.number().check(z.positive({ message: "金额必须大于 0" })),
    date: z
        .string()
        .check(z.minLength(1, { message: "请选择日期" }), z.maxLength(32)),
    event: z.enum(["engagement", "wedding", "other"]),
    method: z.string(),
    note: z.string(),
});

type GiftFormValues = z.infer<typeof giftFormSchema>;

export function useGiftForm(editRecord?: GiftRecord) {
    const { weddingData, addGiftRecord, updateGiftRecord } = useWeddingStore();
    const guests = weddingData?.guests || [];
    const [loading, setLoading] = useState(false);

    const defaultValues = useMemo<GiftFormValues>(() => {
        return {
            type: editRecord?.type || "received",
            guestId: editRecord?.guestId || "",
            guestName: editRecord?.guestName || "",
            relation: "friend",
            amount: editRecord?.amount || 0,
            date: editRecord?.date
                ? new Date(editRecord.date).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            event: editRecord?.event || "wedding",
            method: editRecord?.method || "",
            note: editRecord?.note || "",
        };
    }, [editRecord]);

    const form = useForm<GiftFormValues>({
        resolver: zodResolver(giftFormSchema) as Resolver<GiftFormValues>,
        defaultValues,
        values: defaultValues,
    });

    const { register, handleSubmit, watch, setValue, formState } = form;

    const onSubmit = async (values: GiftFormValues) => {
        setLoading(true);
        try {
            const selectedGuest = guests.find(
                (guest) => guest.id === values.guestId,
            );
            const relationLabel = RELATION_GROUPS.find(
                (item) => item.id === values.relation,
            )?.name;
            const relationNote =
                !selectedGuest && values.guestName.trim()
                    ? relationLabel
                        ? `关系：${relationLabel}`
                        : ""
                    : "";

            const nextNote = [relationNote, values.note.trim()]
                .filter(Boolean)
                .join(" · ");

            const payload = {
                type: values.type,
                guestId: values.guestId || undefined,
                guestName: values.guestId
                    ? undefined
                    : values.guestName.trim() || undefined,
                amount: values.amount,
                date: new Date(values.date).getTime(),
                event: values.event,
                method: (values.method || undefined) as GiftRecord["method"],
                note: nextNote || undefined,
            };

            if (editRecord) {
                await updateGiftRecord(editRecord.id, payload);
                toast.success("礼金记录已更新");
            } else {
                await addGiftRecord(payload);
                toast.success("礼金记录已添加");
            }

            return true; // 成功标志
        } catch {
            toast.error("操作失败，请稍后重试");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        guests,
        loading,
        register,
        handleSubmit,
        watch,
        setValue,
        formState,
        onSubmit,
        EMPTY_SELECT_VALUE,
    };
}

export type { GiftFormValues };
