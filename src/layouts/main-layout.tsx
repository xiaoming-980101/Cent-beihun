import { lazy, Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { BillEditorProvider } from "@/components/bill-editor";
import { TagListProvider } from "@/components/bill-tag";
import { BookConfirmProvider } from "@/components/book/util";
import Navigation, {
    isMobileTabPage,
    MobileTopBar,
} from "@/components/navigation";
import { SortableListProvider } from "@/components/sortable";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useInitPreset } from "@/hooks/use-preset";
import {
    useQuickEntryByClipboard,
    useQuickEntryByRelayr,
    useQuickGoAdd,
} from "@/hooks/use-quick-entry";
import { useScheduled } from "@/hooks/use-scheduled";
import { ThemeProvider } from "@/hooks/use-theme";
import { useUrlHandler } from "@/hooks/use-url-handler";
import { usePreferenceStore } from "@/store/preference";
import { startBackgroundPredict } from "@/utils/predict";

const BillInfoProvider = lazy(async () => {
    const m = await import("@/components/bill-info");
    return { default: m.BillInfoProvider };
});
const SortableGroupProvider = lazy(async () => {
    const m = await import("@/components/sortable/group");
    return { default: m.SortableGroupProvider };
});
const CurrencyListProvider = lazy(async () => {
    const m = await import("@/components/currency");
    return { default: m.CurrencyListProvider };
});
const BookGuide = lazy(async () => {
    const m = await import("@/components/book");
    return { default: m.default };
});
const BudgetProvider = lazy(async () => {
    const m = await import("@/components/budget");
    return { default: m.BudgetProvider };
});
const BudgetEditProvider = lazy(async () => {
    const m = await import("@/components/budget");
    return { default: m.BudgetEditProvider };
});
const BudgetDetailProvider = lazy(async () => {
    const m = await import("@/components/budget/detail");
    return { default: m.BudgetDetailProvider };
});
const ScheduledProvider = lazy(async () => {
    const m = await import("@/components/scheduled");
    return { default: m.ScheduledProvider };
});
const ScheduledEditProvider = lazy(async () => {
    const m = await import("@/components/scheduled");
    return { default: m.ScheduledEditProvider };
});
const CategoryListProvider = lazy(async () => {
    const m = await import("@/components/category");
    return { default: m.CategoryListProvider };
});
const ModalProvider = lazy(async () => {
    const m = await import("@/components/modal");
    return { default: m.ModalProvider };
});
const Settings = lazy(async () => {
    const m = await import("@/components/settings");
    return { default: m.Settings };
});
const ProfileEditorProvider = lazy(async () => {
    const m = await import("@/components/settings/profile-editor");
    return { default: m.ProfileEditorProvider };
});

export default function MainLayout() {
    const location = useLocation();
    useQuickGoAdd();
    useQuickEntryByClipboard();
    useQuickEntryByRelayr();
    useUrlHandler(); // 处理标准 URL 链接唤起

    useEffect(() => {
        // predict
        if (usePreferenceStore.getState().smartPredict) {
            startBackgroundPredict();
        }
    }, []);

    // 自动周期记账
    const { applyScheduled } = useScheduled();
    const applyScheduledRef = useRef(applyScheduled);
    applyScheduledRef.current = applyScheduled;
    useEffect(() => {
        applyScheduledRef.current();
    }, []);

    useInitPreset();
    const showMobileBottomNav = isMobileTabPage(location.pathname);

    return (
        <ThemeProvider>
            <TooltipProvider>
                <div className="flex h-full w-full flex-col overflow-hidden sm:pl-[116px]">
                    <MobileTopBar />
                    <div
                        className={`min-h-0 flex-1 overflow-hidden sm:pb-0 ${
                            showMobileBottomNav
                                ? "pb-[calc(var(--mobile-bottombar-height)+env(safe-area-inset-bottom))]"
                                : "pb-0"
                        }`}
                    >
                        <div className="h-full min-h-0">
                            <Outlet />
                        </div>
                    </div>
                </div>
                <Navigation />
                <Suspense fallback={null}>
                    <BillEditorProvider />
                    <BillInfoProvider />
                    <SortableListProvider />
                    <SortableGroupProvider />
                    <CurrencyListProvider />
                    <BookGuide />
                    <BookConfirmProvider />
                    <BudgetProvider />
                    <BudgetEditProvider />
                    <BudgetDetailProvider />
                    <ScheduledProvider />
                    <ScheduledEditProvider />
                    <TagListProvider />
                    <CategoryListProvider />
                    <ModalProvider />
                    <Settings />
                    <ProfileEditorProvider />
                </Suspense>
                <Toaster />
            </TooltipProvider>
        </ThemeProvider>
    );
}
