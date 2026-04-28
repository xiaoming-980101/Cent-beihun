import type { ComponentProps, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

// 简单的全局滚动位置缓存
const scrollCache: Record<string, number> = {};

type ShellProps = {
    children: ReactNode;
    className?: string;
    contentClassName?: string;
};

export function WeddingPageShell({
    children,
    className,
    contentClassName,
}: ShellProps) {
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);

    // 恢复滚动位置
    useLayoutEffect(() => {
        const path = location.pathname;
        const container = containerRef.current;
        if (!container) return;

        // 恢复之前保存的位置
        if (scrollCache[path]) {
            container.scrollTop = scrollCache[path];
        } else {
            container.scrollTop = 0;
        }

        // 监听滚动并保存
        const handleScroll = () => {
            scrollCache[path] = container.scrollTop;
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [location.pathname]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "wedding-app-shell h-full min-h-0 overflow-y-auto scroll-smooth",
                className,
            )}
        >
            <div className={cn("wedding-page", contentClassName)}>
                {children}
            </div>
        </div>
    );
}

type HeaderProps = {
    title?: string;
    subtitle?: string;
    backTo?: string;
    rightSlot?: ReactNode;
    className?: string;
};

export function goBackOrNavigate(
    navigate: ReturnType<typeof useNavigate>,
    fallback: string,
) {
    const historyState = window.history.state as { idx?: number } | null;
    if ((historyState?.idx ?? 0) > 0) {
        navigate(-1);
        return;
    }
    navigate(fallback, { replace: true });
}

export function WeddingTopBar({
    title = "Cent",
    subtitle,
    backTo,
    rightSlot,
    className,
}: HeaderProps) {
    const navigate = useNavigate();

    return (
        <div
            className={cn(
                "hidden sm:flex items-center justify-between px-4 py-4 sticky top-0 z-30 transition-all",
                "bg-[color:var(--wedding-app-bg)]/80 backdrop-blur-xl",
                className,
            )}
        >
            <div className="flex min-w-0 items-center gap-4">
                {backTo ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-[color:var(--wedding-surface-muted)] text-[color:var(--wedding-text)] transition-all active:scale-90"
                        onClick={() => goBackOrNavigate(navigate, backTo)}
                    >
                        <i className="icon-[mdi--chevron-left] size-6" />
                    </Button>
                ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/10 to-violet-500/10 text-pink-500 shadow-sm border border-pink-500/10">
                        <i className="icon-[mdi--account] size-5" />
                    </div>
                )}
                <div className="min-w-0">
                    <h1
                        className={cn(
                            "truncate font-bold tracking-tight",
                            backTo
                                ? "text-[24px] text-[color:var(--wedding-text)]"
                                : "wedding-brand text-[28px]",
                        )}
                    >
                        {title}
                    </h1>
                    {subtitle ? (
                        <p className="mt-0.5 truncate text-[11px] font-medium opacity-60">
                            {subtitle}
                        </p>
                    ) : null}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {rightSlot ?? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-[color:var(--wedding-surface-muted)] text-[color:var(--wedding-text-soft)] transition-all active:scale-90"
                    >
                        <i className="icon-[mdi--bell-outline] size-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}

export function WeddingSectionTitle({
    title,
    trailing,
}: {
    title: string;
    trailing?: ReactNode;
}) {
    return (
        <div className="flex items-center justify-between px-1">
            <h2 className="wedding-topbar-title text-xl text-[color:var(--wedding-text)]">
                {title}
            </h2>
            {trailing ? (
                <div className="wedding-link text-sm font-medium">
                    {trailing}
                </div>
            ) : null}
        </div>
    );
}

export function WeddingStat({
    label,
    value,
    hint,
    tone = "default",
}: {
    label: string;
    value: ReactNode;
    hint?: ReactNode;
    tone?: "default" | "success" | "danger" | "warning" | "info";
}) {
    return (
        <div className="wedding-soft-card flex min-w-0 flex-col gap-1 px-3 py-2.5">
            <span className="text-[11px] uppercase tracking-[0.12em] wedding-muted">
                {label}
            </span>
            <span
                className={cn(
                    "truncate text-lg font-semibold",
                    tone === "success" && "text-[color:var(--wedding-success)]",
                    tone === "danger" && "text-[color:var(--wedding-danger)]",
                    tone === "warning" && "text-[color:var(--wedding-warning)]",
                    tone === "info" && "text-[color:var(--wedding-info)]",
                    tone === "default" && "text-[color:var(--wedding-text)]",
                )}
            >
                {value}
            </span>
            {hint ? (
                <span className="text-xs wedding-muted">{hint}</span>
            ) : null}
        </div>
    );
}

export function WeddingEmptyState({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="wedding-soft-card wedding-section-enter flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="flex h-18 w-18 items-center justify-center rounded-full border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] text-3xl text-pink-400">
                <i className={icon} />
            </div>
            <div className="space-y-2">
                <h3 className="wedding-topbar-title text-2xl text-[color:var(--wedding-text)]">
                    {title}
                </h3>
                <p className="mx-auto max-w-xs text-sm leading-6 wedding-muted">
                    {description}
                </p>
            </div>
        </div>
    );
}

export function WeddingActionButton({
    children,
    className,
    ...props
}: ComponentProps<typeof Button>) {
    return (
        <Button
            className={cn(
                "rounded-[16px] bg-gradient-to-r from-[#f05cab] to-[#d64dc8] text-white shadow-[0_12px_24px_-14px_rgba(240,92,171,0.9)] hover:opacity-95",
                className,
            )}
            {...props}
        >
            {children}
        </Button>
    );
}

export function WeddingBadge({
    children,
    tone = "neutral",
    className,
}: {
    children: ReactNode;
    tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
    className?: string;
}) {
    return (
        <span
            className={cn("wedding-badge", className)}
            data-tone={tone === "neutral" ? undefined : tone}
        >
            {children}
        </span>
    );
}

export function WeddingFloatingActionButton({
    children,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn("wedding-fab", className)}
            type="button"
            {...props}
        >
            {children}
        </button>
    );
}

export function WeddingFilterChip({
    active,
    children,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
}) {
    return (
        <button
            data-active={active ? "true" : "false"}
            className={cn(
                "wedding-pill h-10 px-4 text-sm font-medium transition-all",
                className,
            )}
            type="button"
            {...props}
        >
            {children}
        </button>
    );
}
