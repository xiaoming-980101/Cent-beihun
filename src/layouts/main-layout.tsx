import { lazy, Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { BillEditorProvider } from "@/components/bill-editor";
import { TagListProvider } from "@/components/bill-tag";
import { BookConfirmProvider } from "@/components/book/util";
import { SortableListProvider } from "@/components/sortable";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useInitPreset } from "@/hooks/use-preset";
import { useScheduled } from "@/hooks/use-scheduled";
import { useUrlHandler } from "@/hooks/use-url-handler";
import { startBackgroundPredict } from "@/utils/predict";
import { goBackOrNavigate } from "@/components/wedding-ui";
import { cn } from "@/utils";

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
                {/* 移动端悬浮返回按钮 - 仅在二级页面显示 */}
                {!isTabChild && (
                    <button
                        type="button"
                        onClick={() => goBackOrNavigate(navigate, "/")}
                        className={cn(
                            "fixed left-4 top-[calc(env(safe-area-inset-top)+1rem)] z-20 flex h-10 w-10 items-center justify-center rounded-full",
                            "bg-black/10 text-white backdrop-blur-md transition-all active:scale-90 sm:hidden",
                            "shadow-sm border border-white/10"
                        )}
                        aria-label="返回"
                    >
                        <i className="icon-[mdi--chevron-left] size-6" />
                    </button>
                )}

                <div
                    className={cn(
                        "min-h-0 flex-1 overflow-hidden sm:pb-0",
                        isTabChild ? "pb-[calc(72px+env(safe-area-inset-bottom)+0.5rem)]" : "pb-0"
                    )}
                >
                    <div className={cn("h-full min-h-0", !isTabChild && "sm:mt-0 mt-14")}>
                        <Outlet />
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
