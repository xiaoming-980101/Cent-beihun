import { useMemo } from "react";
import useCategory from "@/hooks/use-category";
import { useCreators } from "@/hooks/use-creator";
import { useCurrency } from "@/hooks/use-currency";
import { useTag } from "@/hooks/use-tag";
import { amountToNumber } from "@/ledger/bill";
import type { Bill } from "@/ledger/type";
import { useIntl } from "@/locale";
import { useUserStore } from "@/store/user";
import { cn } from "@/utils";
import { denseTime } from "@/utils/time";
import CategoryIcon from "../category/icon";
import SmartImage from "../image";
import Money from "../money";

interface BillItemProps {
    bill: Bill;
    onClick?: () => void;
    className?: string;
    showTime?: boolean;
    showAssets?: boolean;
}

export default function BillItem({
    bill,
    className,
    onClick,
    showTime,
    showAssets,
}: BillItemProps) {
    const t = useIntl();
    const { categories } = useCategory();
    const { tags: allTags } = useTag();
    const category = useMemo(
        () => categories.find((c) => c.id === bill.categoryId),
        [bill.categoryId, categories],
    );

    const { id: selfId } = useUserStore();
    const creators = useCreators();
    const creator = creators.find((c) => c.id === bill.creatorId);
    const isMe = creator?.id === selfId;
    const tags = bill.tagIds
        ?.map((id) => allTags.find((t) => t.id === id))
        .filter((v) => v !== undefined);

    const { baseCurrency, allCurrencies } = useCurrency();
    const currency =
        bill.currency?.target === baseCurrency.id
            ? undefined
            : allCurrencies.find((c) => c.id === bill.currency?.target);
    return (
        <button
            type="button"
            className={cn(
                "bill-item flex items-center justify-between gap-3 rounded-[18px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-4 py-3 text-left transition hover:bg-[color:var(--wedding-surface-soft)]",
                className,
            )}
            data-bill-tags={tags?.map((v) => v.name).join(" ")}
            onClick={onClick}
        >
            {/* 左侧图标 + 信息 */}
            <div className="flex min-w-0 items-center overflow-hidden">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--wedding-surface-muted)] text-[color:var(--wedding-text-soft)]">
                    {category?.icon && <CategoryIcon icon={category.icon} />}
                </div>
                <div className="flex min-w-0 flex-col px-3 overflow-hidden">
                    <div className="flex min-h-6 items-center gap-1">
                        <div className="truncate text-[15px] font-semibold text-[color:var(--wedding-text)]">
                            {bill.comment || category?.name || ""}
                        </div>
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {tags?.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="flex h-4 items-center rounded-full bg-[color:var(--wedding-surface-muted)] px-1.5 text-[10px] text-[color:var(--wedding-text-mute)]"
                                >
                                    {tag.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-[color:var(--wedding-text-soft)]">
                        <div>{denseTime(bill.time)}</div>
                        <div>·</div>
                        <div className="truncate">
                            {category ? category.name : ""}
                        </div>
                        <div>·</div>
                        <div className="truncate">
                            {isMe ? t("me") : (creator?.name ?? "unknown-user")}
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex gap-2">
                    {showAssets &&
                        bill.images?.map((img) => {
                            const imageKey =
                                typeof img === "string"
                                    ? img
                                    : `${img.name}-${img.lastModified}-${img.size}`;
                            return (
                                <SmartImage
                                    key={imageKey}
                                    source={img}
                                    alt=""
                                    className="w-8 h-8 object-cover rounded data-[state=loading]:animate-pulse bg-primary/10"
                                />
                            );
                        })}
                </div>
            </div>

            {/* 金额 */}
            <div className="bill-item-tail shrink-0 text-right">
                <div
                    className={`flex flex-col items-end truncate text-lg font-bold ${
                        bill.type === "expense"
                            ? "text-semantic-expense"
                            : bill.type === "income"
                              ? "text-semantic-income"
                              : ""
                    }`}
                >
                    <Money value={amountToNumber(bill.amount)} accurate />

                    {currency && (
                        <div className="text-xs">
                            {currency.symbol}
                            <Money
                                value={amountToNumber(
                                    bill.currency?.amount ?? 0,
                                )}
                                accurate
                            />
                        </div>
                    )}
                </div>

                {showTime && (
                    <div className="mt-1 text-[10px] text-[color:var(--wedding-text-mute)]">
                        {denseTime(bill.time)}
                    </div>
                )}
            </div>
        </button>
    );
}
