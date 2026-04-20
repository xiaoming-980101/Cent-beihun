import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/utils";

interface TopBarTab {
    label: string;
    value: string;
}

export interface TopAppBarProps {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
    actions?: ReactNode;
    tabs?: TopBarTab[];
    activeTab?: string;
    onTabChange?: (value: string) => void;
    className?: string;
}

export function TopAppBar({
    title,
    showBack = false,
    onBack,
    actions,
    tabs,
    activeTab,
    onTabChange,
    className,
}: TopAppBarProps) {
    return (
        <header
            className={cn(
                "fixed left-0 right-0 top-0 z-50 border-b border-border bg-card",
                className,
            )}
        >
            <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    {showBack ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className="-ml-2 rounded-lg p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            aria-label="返回"
                        >
                            <ChevronLeft
                                className="h-5 w-5 text-foreground"
                                aria-hidden="true"
                            />
                        </button>
                    ) : null}
                    <h1 className="text-lg font-bold text-foreground">
                        {title}
                    </h1>
                </div>
                {actions ? (
                    <div className="flex items-center gap-2">{actions}</div>
                ) : null}
            </div>

            {tabs && tabs.length > 0 ? (
                <div className="flex gap-6 border-t border-border px-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => onTabChange?.(tab.value)}
                            className={cn(
                                "border-b-2 py-3 text-sm font-medium transition-colors",
                                activeTab === tab.value
                                    ? "border-primary text-primary"
                                    : "border-transparent text-text-secondary hover:text-foreground",
                            )}
                            aria-pressed={activeTab === tab.value}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            ) : null}
        </header>
    );
}
