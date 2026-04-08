import type { ComponentProps, ReactNode } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

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
    return (
        <div
            className={cn(
                "wedding-app-shell min-h-full overflow-y-auto",
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
                "hidden wedding-surface-card items-center justify-between rounded-[22px] px-4 py-3 sm:flex",
                "bg-[color:var(--wedding-surface)]/95 supports-[backdrop-filter]:bg-[color:var(--wedding-surface)]/82",
                className,
            )}
        >
            <div className="flex min-w-0 items-center gap-3">
                {backTo ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full text-[color:var(--wedding-text)] hover:bg-white/60 dark:hover:bg-white/6"
                        onClick={() => navigate(backTo)}
                    >
                        <i className="icon-[mdi--chevron-left] size-5" />
                    </Button>
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-bold text-white shadow-sm">
                        <i className="icon-[mdi--account] size-4" />
                    </div>
                )}
                <div className="min-w-0">
                    <div
                        className={cn(
                            "truncate text-[26px] leading-none",
                            backTo
                                ? "wedding-topbar-title text-[color:var(--wedding-text)]"
                                : "wedding-brand",
                        )}
                    >
                        {title}
                    </div>
                    {subtitle ? (
                        <div className="mt-1 truncate text-xs wedding-muted">
                            {subtitle}
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {rightSlot ?? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full text-[color:var(--wedding-text-soft)] hover:bg-white/60 dark:hover:bg-white/6"
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
                <div className="text-sm font-medium text-pink-500">
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
    tone?: "default" | "success" | "danger";
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
        <div className="wedding-soft-card flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-3xl text-pink-400 dark:bg-white/6">
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
                "rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white wedding-fab-shadow hover:opacity-95",
                className,
            )}
            {...props}
        >
            {children}
        </Button>
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
