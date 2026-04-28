import type { ReactNode } from "react";
import { cn } from "@/utils";
import { Avatar, AvatarFallback } from "./avatar";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";

export type TimelineItem = {
    id: string;
    icon?: ReactNode;
    iconColor?: string;
    iconBg?: string;
    title: string;
    description?: string;
    time?: string;
    amount?: string;
    amountColor?: string;
    onClick?: (e: React.MouseEvent) => void;
};

type TimelineProps = {
    items: TimelineItem[];
    className?: string;
    variant?: "default" | "compact" | "detailed";
    showScrollArea?: boolean;
    scrollHeight?: string;
};

export function Timeline({
    items,
    className,
    variant = "default",
    showScrollArea = false,
    scrollHeight = "420px",
}: TimelineProps) {
    const TimelineContent = () => {
        if (variant === "compact") {
            return (
                <div className={cn("space-y-3", className)}>
                    {items.map((item, index) => (
                        <div key={item.id} className="flex gap-3">
                            {/* 时间线左�?*/}
                            <div className="relative flex flex-col items-center">
                                {/* 节点 */}
                                <div
                                    className={cn(
                                        "z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background shadow-sm",
                                        item.iconBg || "bg-pink-500",
                                    )}
                                    style={
                                        item.iconColor
                                            ? { color: item.iconColor }
                                            : { color: "white" }
                                    }
                                >
                                    {item.icon || (
                                        <div className="h-2 w-2 rounded-full bg-current" />
                                    )}
                                </div>
                                {/* 连接�?*/}
                                {index < items.length - 1 && (
                                    <div className="h-full w-px flex-1 bg-gradient-to-b from-pink-300/70 via-violet-300/55 to-transparent dark:from-pink-500/35 dark:via-violet-500/25" />
                                )}
                            </div>

                            {/* 内容 */}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); item.onClick?.(e); }}
                                className="mb-3 flex flex-1 items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-foreground">
                                        {item.title}
                                    </p>
                                    {(item.time || item.description) && (
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {item.time}
                                            {item.time &&
                                                item.description &&
                                                " · "}
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                {item.amount && (
                                    <div
                                        className={cn(
                                            "shrink-0 text-right text-base font-semibold",
                                            item.amountColor || "text-pink-500",
                                        )}
                                    >
                                        {item.amount}
                                    </div>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            );
        }

        if (variant === "detailed") {
            return (
                <div className={cn("space-y-4", className)}>
                    {items.map((item, index) => (
                        <div key={item.id} className="flex gap-4">
                            {/* 时间线左�?*/}
                            <div className="relative flex flex-col items-center">
                                {/* 节点 */}
                                <Avatar className="h-10 w-10 border-2 border-background shadow-md">
                                    <AvatarFallback
                                        className={cn(
                                            "text-white",
                                            item.iconBg || "bg-pink-500",
                                        )}
                                        style={
                                            item.iconColor
                                                ? { color: item.iconColor }
                                                : undefined
                                        }
                                    >
                                        {item.icon || (
                                            <div className="h-3 w-3 rounded-full bg-current" />
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                {/* 连接�?*/}
                                {index < items.length - 1 && (
                                    <div className="h-full w-px flex-1 bg-gradient-to-b from-pink-400/80 via-violet-400/60 to-transparent dark:from-pink-500/40 dark:via-violet-500/30" />
                                )}
                            </div>

                            {/* 内容 */}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); item.onClick?.(e); }}
                                className="group mb-4 flex flex-1 flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-base font-semibold text-foreground">
                                            {item.title}
                                        </p>
                                        {item.time && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {item.time}
                                            </p>
                                        )}
                                    </div>
                                    {item.amount && (
                                        <div
                                            className={cn(
                                                "shrink-0 text-right text-lg font-bold",
                                                item.amountColor ||
                                                    "text-pink-500",
                                            )}
                                        >
                                            {item.amount}
                                        </div>
                                    )}
                                </div>
                                {item.description && (
                                    <>
                                        <Separator />
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            );
        }

        // default variant
        return (
            <div className={cn("space-y-3", className)}>
                {items.map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                        {/* 时间线左�?*/}
                        <div className="relative flex flex-col items-center pt-1">
                            {/* 节点 */}
                            <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[color:var(--wedding-surface)] bg-gradient-to-br from-pink-400 to-pink-500 shadow-sm dark:border-[color:var(--wedding-surface-muted)] dark:from-pink-500 dark:to-pink-600">
                                <div className="flex h-full w-full items-center justify-center text-white">
                                    {item.icon || (
                                        <div className="h-2 w-2 rounded-full bg-current" />
                                    )}
                                </div>
                            </div>
                            {/* 连接�?*/}
                            {index < items.length - 1 && (
                                <div className="mt-2 h-full w-[2px] flex-1 bg-gradient-to-b from-pink-300/50 via-pink-200/30 to-transparent dark:from-pink-500/30 dark:via-pink-500/15 dark:to-transparent" />
                            )}
                        </div>

                        {/* 内容 */}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); item.onClick?.(e); }}
                            className="mb-3 flex flex-1 items-start justify-between gap-4 rounded-2xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-4 py-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-pink-200/60 active:translate-y-0 dark:hover:border-pink-500/30"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[14px] font-semibold text-[color:var(--wedding-text)]">
                                    {item.title}
                                </p>
                                {(item.time || item.description) && (
                                    <p className="mt-1.5 text-[12px] text-[color:var(--wedding-text-mute)]">
                                        {item.time}
                                        {item.time && item.description && " · "}
                                        {item.description}
                                    </p>
                                )}
                            </div>
                            {item.amount && (
                                <div
                                    className={cn(
                                        "shrink-0 text-right text-[16px] font-bold",
                                        item.amountColor || "text-pink-500",
                                    )}
                                >
                                    {item.amount}
                                </div>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    if (showScrollArea) {
        return (
            <ScrollArea
                className="rounded-2xl bg-transparent p-2"
                style={{ height: scrollHeight }}
            >
                <TimelineContent />
            </ScrollArea>
        );
    }

    return <TimelineContent />;
}

