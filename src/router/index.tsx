import { type ReactNode, Suspense, useEffect, useMemo, useState } from "react";
import {
    BrowserRouter,
    matchPath,
    Route,
    Routes,
    useLocation,
} from "react-router";
import { PageTransition } from "@/components/layout/page-transition";
import { LoadingSpinner } from "@/components/shared";
import MainLayout from "@/layouts/main-layout";
import { useLedgerStore } from "@/store/ledger";
import { lazyWithReload } from "@/utils/lazy";

const Home = lazyWithReload(() => import("@/pages/home"));
const Stat = lazyWithReload(
    async () => {
        return import("@/pages/stat");
    },
    async () => {
        await useLedgerStore.getState().refreshBillList();
    },
);

const Search = lazyWithReload(() => import("@/pages/search"));
const SettingsPage = lazyWithReload(() => import("@/pages/settings"));
const Tasks = lazyWithReload(() => import("@/pages/tasks/Tasks"));
const TaskCalendar = lazyWithReload(() => import("@/pages/tasks/TaskCalendar"));
const Tools = lazyWithReload(() => import("@/pages/tools/Tools"));
const GiftBook = lazyWithReload(() => import("@/pages/tools/GiftBook"));
const PlannerAssistant = lazyWithReload(
    () => import("@/pages/tools/PlannerAssistant"),
);
const ResourceCenter = lazyWithReload(
    () => import("@/pages/tools/ResourceCenter"),
);
const GuestManagement = lazyWithReload(
    () => import("@/pages/tools/GuestManagement"),
);
const WeddingBudget = lazyWithReload(
    () => import("@/pages/tools/WeddingBudget"),
);

type CachedRouteEntry = {
    key: string;
    match: (pathname: string) => boolean;
    render: () => ReactNode;
};

const cachedRouteEntries: CachedRouteEntry[] = [
    {
        key: "/",
        match: (pathname) => pathname === "/",
        render: () => <Home />,
    },
    {
        key: "/tasks",
        match: (pathname) => pathname === "/tasks",
        render: () => <Tasks />,
    },
    {
        key: "/tasks/calendar",
        match: (pathname) => pathname === "/tasks/calendar",
        render: () => <TaskCalendar />,
    },
    {
        key: "/tools",
        match: (pathname) => pathname === "/tools",
        render: () => <Tools />,
    },
    {
        key: "/tools/gift-book",
        match: (pathname) => pathname === "/tools/gift-book",
        render: () => <GiftBook />,
    },
    {
        key: "/tools/planner-assistant",
        match: (pathname) => pathname === "/tools/planner-assistant",
        render: () => <PlannerAssistant />,
    },
    {
        key: "/tools/resource-center",
        match: (pathname) => pathname === "/tools/resource-center",
        render: () => <ResourceCenter />,
    },
    {
        key: "/tools/guests",
        match: (pathname) => pathname === "/tools/guests",
        render: () => <GuestManagement />,
    },
    {
        key: "/tools/wedding-budget",
        match: (pathname) => pathname === "/tools/wedding-budget",
        render: () => <WeddingBudget />,
    },
];

function CachedPageLayer({
    active,
    pageKey,
    children,
}: {
    active: boolean;
    pageKey: string;
    children: ReactNode;
}) {
    if (!active) {
        return (
            <div aria-hidden className="hidden h-full min-h-0">
                {children}
            </div>
        );
    }

    return <PageTransition pageKey={pageKey}>{children}</PageTransition>;
}

function AppContent() {
    const location = useLocation();
    const pathname = location.pathname;

    const activeCachedEntry = useMemo(() => {
        return cachedRouteEntries.find((entry) => entry.match(pathname));
    }, [pathname]);

    const [visitedCachedKeys, setVisitedCachedKeys] = useState<string[]>(() => {
        return activeCachedEntry ? [activeCachedEntry.key] : [];
    });

    useEffect(() => {
        if (!activeCachedEntry) {
            return;
        }
        setVisitedCachedKeys((current) => {
            if (current.includes(activeCachedEntry.key)) {
                return current;
            }
            return [...current, activeCachedEntry.key];
        });
    }, [activeCachedEntry]);

    let activeNonCachedPage: ReactNode = null;

    if (pathname.startsWith("/search")) {
        activeNonCachedPage = (
            <Suspense fallback={<LoadingSpinner />}>
                <Search />
            </Suspense>
        );
    } else if (matchPath("/stat/:id", pathname) || pathname === "/stat") {
        activeNonCachedPage = (
            <Suspense fallback={<LoadingSpinner />}>
                <Stat />
            </Suspense>
        );
    } else if (pathname === "/settings") {
        activeNonCachedPage = (
            <Suspense fallback={<LoadingSpinner />}>
                <SettingsPage />
            </Suspense>
        );
    } else if (!activeCachedEntry) {
        activeNonCachedPage = (
            <Suspense fallback={<LoadingSpinner />}>
                <Home />
            </Suspense>
        );
    }

    return (
        <>
            {visitedCachedKeys.map((key) => {
                const entry = cachedRouteEntries.find(
                    (routeEntry) => routeEntry.key === key,
                );
                if (!entry) {
                    return null;
                }

                return (
                    <CachedPageLayer
                        key={entry.key}
                        pageKey={pathname}
                        active={entry.key === activeCachedEntry?.key}
                    >
                        <Suspense
                            fallback={
                                entry.key === activeCachedEntry?.key ? (
                                    <LoadingSpinner />
                                ) : null
                            }
                        >
                            {entry.render()}
                        </Suspense>
                    </CachedPageLayer>
                );
            })}

            {activeNonCachedPage ? (
                <CachedPageLayer pageKey={pathname} active>
                    {activeNonCachedPage}
                </CachedPageLayer>
            ) : null}
        </>
    );
}

function RootRoute() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="*" element={<AppContent />} />
            </Route>
        </Routes>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <RootRoute />
        </BrowserRouter>
    );
}
