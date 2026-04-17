import type { ReactNode } from "react";
import { useIntl } from "@/locale";
import { cn } from "@/utils";

export default function PopupLayout({
    title,
    children,
    onBack,
    className,
    hideBack,
    hideHeaderOnMobile,
    right,
    dialogMode = false,
}: {
    title?: string | ReactNode;
    children?: ReactNode;
    onBack?: () => void;
    className?: string;
    hideBack?: boolean;
    hideHeaderOnMobile?: boolean;
    right?: ReactNode;
    dialogMode?: boolean;
}) {
    const t = useIntl();
    const shouldShowBack = !hideBack && onBack && !dialogMode;
    return (
        <div
            className={cn(
                "flex-1 flex flex-col overflow-hidden",
                dialogMode
                    ? "bg-transparent pt-0 pb-0"
                    : "bg-[color:var(--wedding-app-bg)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
                className,
            )}
        >
            <div
                className={cn(
                    dialogMode
                        ? "relative flex w-full flex-shrink-0 items-center justify-center px-4 pt-2 pb-2"
                        : "relative flex w-full flex-shrink-0 items-center justify-center px-4 pt-4 pb-2",
                    hideHeaderOnMobile && "hidden sm:flex",
                )}
            >
                {shouldShowBack && (
                    <button
                        type="button"
                        className="absolute left-4 flex cursor-pointer items-center rounded-full border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] py-1 pl-1 pr-3 text-sm text-[color:var(--wedding-text-soft)] shadow-sm transition-colors hover:text-[color:var(--wedding-text)]"
                        onClick={(e) => {
                            onBack?.();
                            e.stopPropagation();
                        }}
                    >
                        <div className="flex items-center justify-center">
                            <i className="icon-[mdi--chevron-left] size-5"></i>
                        </div>
                        {t("back")}
                    </button>
                )}
                {right && <div className="absolute right-4 pr-1">{right}</div>}
                <div className="flex min-h-4 w-full items-center justify-center text-sm font-medium text-[color:var(--wedding-text-soft)]">
                    {title}
                </div>
            </div>
            {children}
        </div>
    );
}
