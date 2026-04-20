import type { ReactNode } from "react";

import { cn } from "@/utils";

import {
    BottomNavBar,
    type BottomNavBarProps,
    defaultBottomNavItems,
} from "./bottom-nav-bar";
import { TopAppBar, type TopAppBarProps } from "./top-app-bar";

export interface MainLayoutProps {
    children: ReactNode;
    showTopBar?: boolean;
    showBottomNav?: boolean;
    topBarProps?: TopAppBarProps;
    navBarProps?: Omit<BottomNavBarProps, "items"> & {
        items?: BottomNavBarProps["items"];
    };
    contentClassName?: string;
}

export function MainLayout({
    children,
    showTopBar = true,
    showBottomNav = true,
    topBarProps,
    navBarProps,
    contentClassName,
}: MainLayoutProps) {
    const hasTabs = (topBarProps?.tabs?.length ?? 0) > 0;
    const topPadding = showTopBar ? (hasTabs ? "pt-28" : "pt-16") : "";
    const bottomPadding = showBottomNav ? "pb-20" : "";

    return (
        <div className="min-h-screen bg-background">
            {showTopBar && topBarProps ? <TopAppBar {...topBarProps} /> : null}

            <main className={cn(topPadding, bottomPadding)}>
                <div className={cn("px-4 py-6", contentClassName)}>
                    {children}
                </div>
            </main>

            {showBottomNav ? (
                <BottomNavBar
                    items={navBarProps?.items ?? defaultBottomNavItems}
                    activeId={navBarProps?.activeId ?? "home"}
                    onNavigate={navBarProps?.onNavigate ?? (() => {})}
                    className={navBarProps?.className}
                />
            ) : null}
        </div>
    );
}
