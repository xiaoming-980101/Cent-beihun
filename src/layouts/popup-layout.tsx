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
}: {
    title?: string | ReactNode;
    children?: ReactNode;
    onBack?: () => void;
    className?: string;
    hideBack?: boolean;
    hideHeaderOnMobile?: boolean;
    right?: ReactNode;
}) {
    const t = useIntl();
    return (
        <div
            className={cn(
                "flex-1 flex flex-col overflow-hidden bg-[color:var(--wedding-app-bg)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
                className,
            )}
        >
            <div
                className={cn(
                    "relative flex w-full flex-shrink-0 items-center justify-center px-4 pt-4 pb-2",
                    hideHeaderOnMobile && "hidden sm:flex",
                )}
            >
                {!hideBack && onBack && (
                    <button
                        type="button"
                        className="absolute left-4 flex cursor-pointer items-center rounded-full bg-[color:var(--wedding-surface-muted)] py-1 pl-1 pr-3 text-[color:var(--wedding-text)] shadow-sm"
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
                <div className="flex min-h-4 w-full items-center justify-center text-[color:var(--wedding-text)]">
                    {title}
                </div>
            </div>
            {children}
        </div>
    );
}
