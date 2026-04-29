import { lazy, Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { BillEditorProvider } from "@/components/bill-editor";
import { TagListProvider } from "@/components/bill-tag";
import { BookConfirmProvider } from "@/components/book/util";
import { SortableListProvider } from "@/components/sortable";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { goBackOrNavigate } from "@/components/wedding-ui";
import { useInitPreset } from "@/hooks/use-preset";
import { useScheduled } from "@/hooks/use-scheduled";
import { useUrlHandler } from "@/hooks/use-url-handler";
import { cn } from "@/utils";
import { startBackgroundPredict } from "@/utils/predict";

// 使用 lazy 加载以打破可能的循环依赖
const Navigation = lazy(() => import("@/components/navigation"));
const BillInfoProvider = lazy(async () => {
    const m = await import("@/components/bill-info");
    return { default: m.BillInfoProvider };
});

// 直接定义逻辑，不再依赖 navigation 的导出
const TAB_PATHS = ["/", "/tasks", "/tools", "/settings"];
const isTabPath = (path: string) => TAB_PATHS.includes(path);

export default function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // 启动后台预测
        startBackgroundPredict();
    }, []);

    useUrlHandler();

    // 自动周期记账
    const { applyScheduled } = useScheduled();
    const applyScheduledRef = useRef(applyScheduled);
    applyScheduledRef.current = applyScheduled;
    useEffect(() => {
        applyScheduledRef.current();
    }, []);

    useInitPreset();

    const isTabChild = isTabPath(location.pathname);

    return (
        <TooltipProvider>
            <div className="flex h-full w-full flex-col overflow-hidden sm:pl-[100px]">
                <div
                    className={cn(
                        "min-h-0 flex-1 overflow-hidden sm:pb-0",
                        isTabChild
                            ? "pb-[calc(72px+env(safe-area-inset-bottom)+0.5rem)]"
                            : "pb-0",
                    )}
                >
                    <div
                        className={cn(
                            "h-full min-h-0",
                            !isTabChild &&
                                "flex flex-col bg-[color:var(--wedding-app-bg)]",
                        )}
                    >
                        {/* 移动端返回区 - 预留空间并与内容背景保持一致 */}
                        {!isTabChild && (
                            <div className="shrink-0 bg-[color:var(--wedding-app-bg)] px-4 pb-2 pt-[calc(env(safe-area-inset-top)+1rem)] sm:hidden">
                                <button
                                    type="button"
                                    onClick={() =>
                                        goBackOrNavigate(navigate, "/")
                                    }
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-full",
                                        "bg-[color:var(--wedding-surface-muted)] text-[color:var(--wedding-text)] backdrop-blur-md transition-all active:scale-90",
                                        "border border-[color:var(--wedding-line)] shadow-sm",
                                    )}
                                    aria-label="返回"
                                >
                                    <i className="icon-[mdi--chevron-left] size-6" />
                                </button>
                            </div>
                        )}
                        <div
                            className={cn(
                                "min-h-0 overflow-hidden",
                                isTabChild ? "h-full" : "flex-1",
                            )}
                        >
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

            <Suspense fallback={null}>
                <Navigation />
            </Suspense>

            <Suspense fallback={null}>
                <BillEditorProvider />
                <BillInfoProvider />
                <TagListProvider />
                <SortableListProvider />
                <BookConfirmProvider />
            </Suspense>

            <Toaster />
        </TooltipProvider>
    );
}
