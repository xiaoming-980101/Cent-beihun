import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { BillEditorProvider } from "@/components/bill-editor";
import { BillInfoProvider } from "@/components/bill-info";
import { TagListProvider } from "@/components/bill-tag";
import BookGuide from "@/components/book";
import { BookConfirmProvider } from "@/components/book/util";
import { BudgetEditProvider, BudgetProvider } from "@/components/budget";
import { BudgetDetailProvider } from "@/components/budget/detail";
import { CategoryListProvider } from "@/components/category";
import { CurrencyListProvider } from "@/components/currency";
import { ModalProvider } from "@/components/modal";
import Navigation, {
    isMobileTabPage,
    MobileTopBar,
} from "@/components/navigation";
import {
    ScheduledEditProvider,
    ScheduledProvider,
} from "@/components/scheduled";
import { Settings } from "@/components/settings";
import { ProfileEditorProvider } from "@/components/settings/profile-editor";
import { SortableListProvider } from "@/components/sortable";
import { SortableGroupProvider } from "@/components/sortable/group";
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
                <Toaster />
            </TooltipProvider>
        </ThemeProvider>
    );
}
