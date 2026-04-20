import type { ReactNode } from "react";
import { cn } from "@/utils";
import { toFixed } from "@/utils/number";
import Money from "../money";
import { Progress } from "../ui/progress";
import type { FocusType } from "./focus-type";

export function StaticItem({
    children,
    money,
    percent,
    type,
    onClick,
    onMoneyClick,
    className,
}: {
    children: ReactNode;
    money: number;
    percent: number;
    type: FocusType;
    onClick?: () => void;
    onMoneyClick?: () => void;
    className?: string;
}) {
    return (
        <div
            role="button"
            tabIndex={0}
            className={cn(
                "table-row h-14 w-full cursor-pointer rounded-[14px] transition-all hover:bg-[color:var(--wedding-surface-muted)]",
                className,
            )}
            onClick={onClick}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onClick?.();
                }
            }}
        >
            <div className="table-cell w-[1px] truncate pl-2 text-left align-middle text-sm text-[color:var(--wedding-text)]">
                {children}
            </div>
            <div className="table-cell w-auto px-2 align-middle">
                <Progress
                    value={percent * 100}
                    className="h-2.5 min-w-[1px] [&_[data-state=indeterminate]]:hidden"
                >
                    <div
                        className={cn(
                            "absolute top-0 flex h-full min-w-min items-center justify-end rounded-full px-2 text-[8px] text-white",
                            type === "expense"
                                ? "bg-semantic-expense"
                                : type === "income"
                                  ? "bg-semantic-income"
                                  : "bg-stone-700",
                        )}
                        style={{ width: `${percent * 100}%` }}
                    >
                        {toFixed(percent * 100, 2)}%
                    </div>
                </Progress>
            </div>
            <div
                role="button"
                tabIndex={0}
                className="table-cell w-[1px] truncate pr-2 text-right align-middle text-[color:var(--wedding-text)]"
                onClick={() => {
                    onMoneyClick?.();
                }}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onMoneyClick?.();
                    }
                }}
            >
                <div className="flex items-center w-full">
                    <div className="flex-1 gap-1">
                        {type === "expense"
                            ? "-"
                            : type === "income"
                              ? "+"
                              : ""}
                        <Money value={money} />
                    </div>
                    <i className="icon-[mdi--arrow-up-right]"></i>
                </div>
            </div>
        </div>
    );
}

export function TagItem({
    name,
    total,
    ...props
}: {
    name: string;
    money: number;
    total: number;
    type: FocusType;
    onClick?: () => void;
}) {
    const percent = total === 0 ? 0 : props.money / total;
    return (
        <StaticItem percent={percent} {...props}>
            #{name}
        </StaticItem>
    );
}
