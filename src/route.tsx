import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "@/pages/home";
import { LoadingSkeleton } from "./components/loading";
import MainLayout from "./layouts/main-layout";
import { useLedgerStore } from "./store/ledger";
import { lazyWithReload } from "./utils/lazy";

const Stat = lazyWithReload(
    async () => {
        return import("@/pages/stat");
    },
    async () => {
        // 加载stat页面前需要获取全部账单数据
        await useLedgerStore.getState().refreshBillList();
    },
);

const Search = lazyWithReload(() => import("@/pages/search"));
const SettingsPage = lazyWithReload(() => import("@/pages/settings"));

// 婚礼筹备助手页面
const Tasks = lazyWithReload(() => import("@/pages/tasks/Tasks"));
const TaskCalendar = lazyWithReload(() => import("@/pages/tasks/TaskCalendar"));
const Tools = lazyWithReload(() => import("@/pages/tools/Tools"));
const GiftBook = lazyWithReload(() => import("@/pages/tools/GiftBook"));
const GuestManagement = lazyWithReload(
    () => import("@/pages/tools/GuestManagement"),
);
const WeddingBudget = lazyWithReload(
    () => import("@/pages/tools/WeddingBudget"),
);

function RootRoute() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route
                    path="/search"
                    element={
                        <Suspense fallback={<LoadingSkeleton />}>
                            <Search />
                        </Suspense>
                    }
                />
                <Route
                    path="/stat/:id?"
                    element={
                        <Suspense fallback={<LoadingSkeleton />}>
                            <Stat />
                        </Suspense>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <Suspense fallback={<LoadingSkeleton />}>
                            <SettingsPage />
                        </Suspense>
                    }
                />
                {/* 婚礼筹备助手路由 */}
                <Route
                    path="/tasks"
                    element={
                        <Suspense fallback={<LoadingSkeleton />}>
                            <Tasks />
                        </Suspense>
                    }
                />
                <Route
                    path="/tasks/calendar"
                    element={
                        <Suspense fallback={<LoadingSkeleton />}>
                            <TaskCalendar />
                        </Suspense>
                    }
                />
                <Route
                    path="/tools"
                    element={
                        <Suspense fallback={<LoadingSkeleton />}>
                            <Tools />
                        </Suspense>
                    }
                />
                <Route
                    path="/tools/gift-book"
                    element={
                        <Suspense fallback={<LoadingSkeleton />}>
                            <GiftBook />
                        </Suspense>
                    }
                />
                <Route
                    path="/tools/guests"
                    element={
                        <Suspense fallback={<LoadingSkeleton />}>
                            <GuestManagement />
                        </Suspense>
                    }
                />
                <Route
                    path="/tools/wedding-budget"
                    element={
                        <Suspense fallback={<LoadingSkeleton />}>
                            <WeddingBudget />
                        </Suspense>
                    }
                />
            </Route>
        </Routes>
    );
}

export default function Rooot() {
    return (
        <BrowserRouter>
            <RootRoute />
        </BrowserRouter>
    );
}
