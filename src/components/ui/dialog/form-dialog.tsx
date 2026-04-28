import { X } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/utils/index";

/**
 * FormDialog Props
 */
export interface FormDialogProps {
    /** 控制弹窗打开/关闭状态 */
    open: boolean;
    /** 状态变化回调 */
    onOpenChange: (open: boolean) => void;
    /** 弹窗标题 */
    title: string;
    /** 弹窗说明文本 */
    description?: React.ReactNode;
    /** 弹窗内容 */
    children: React.ReactNode;
    /** 最大宽度变量 */
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
    /** 自定义类名 */
    className?: string;
    /** 内容容器类名（半屏与桌面通用） */
    bodyClassName?: string;
    /** 移动端全屏内容容器类名（仅在 fullScreenOnMobile=true 时生效） */
    fullscreenBodyClassName?: string;
    /** 是否隐藏关闭按钮 */
    hideClose?: boolean;
    /** 是否显示顶部标题栏 */
    showHeader?: boolean;
    /**
     * 移动端是否使用全屏布局
     * - true: 移动端(<640px)使用全屏布局,适合内容较多的表单(如账单编辑器、任务表单)
     * - false: 移动端(<640px)使用85%宽度布局,适合内容较少的表单(如简单确认框)
     * @default false
     */
    fullScreenOnMobile?: boolean;
    /** 保存按钮文本 */
    saveButtonText?: string;
    /** 保存按钮点击回调 */
    onSave?: () => void;
}

const maxWidthClasses = {
    xs: "max-w-[360px]",
    sm: "max-w-[400px]",
    md: "max-w-[560px]",
    lg: "max-w-[720px]",
    xl: "max-w-[960px]",
};

/**
 * FormDialog - 统一表单弹窗组件
 */
export function FormDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    maxWidth = "md",
    className,
    bodyClassName,
    fullscreenBodyClassName,
    hideClose = false,
    showHeader = false,
    fullScreenOnMobile = false,
    saveButtonText = "保存",
    onSave,
}: FormDialogProps) {
    const shouldShowTopClose = !hideClose;
    const showBottomCloseOnMobileFullScreen = fullScreenOnMobile && !hideClose;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                hideClose={true}
                {...(!description ? { "aria-describedby": undefined } : {})}
                className={cn(
                    "fixed left-[50%] top-[50%] z-[1001] -translate-x-1/2 -translate-y-1/2",
                    "flex max-h-[calc(100dvh-1.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full flex-col overflow-hidden",
                    "rounded-[30px] border-none",
                    "bg-[color:var(--wedding-surface)] shadow-2xl",
                    "sm:max-h-[min(84vh,760px)]",
                    maxWidthClasses[maxWidth],
                    fullScreenOnMobile
                        ? "max-sm:inset-0 max-sm:left-0 max-sm:top-0 max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:bg-[color:var(--wedding-app-bg)] max-sm:shadow-none"
                        : "max-sm:w-[min(92vw,32rem)] max-sm:max-w-[92vw] max-sm:max-h-[min(86dvh,760px)] max-sm:rounded-[28px]",
                    className,
                )}
            >
                {shouldShowTopClose ? (
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={() => onOpenChange(false)}
                        className={cn(
                            "absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-20 items-center justify-center rounded-full border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] text-[color:var(--wedding-text-mute)] transition hover:bg-[color:var(--wedding-surface-muted)] hover:text-[color:var(--wedding-text)]",
                            "h-10 w-10",
                            fullScreenOnMobile ? "hidden sm:flex" : "flex",
                        )}
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">关闭</span>
                    </button>
                ) : null}

                {showHeader ? (
                    <DialogHeader className="px-5 pb-2 pt-6">
                        <DialogTitle className="wedding-topbar-title pl-1 text-[color:var(--wedding-text)]">
                            {title}
                        </DialogTitle>
                        {description ? (
                            <DialogDescription className="pl-1 text-xs leading-6 text-[color:var(--wedding-text-mute)]">
                                {description}
                            </DialogDescription>
                        ) : null}
                    </DialogHeader>
                ) : (
                    <DialogHeader className="sr-only">
                        <DialogTitle>{title}</DialogTitle>
                        {description ? (
                            <DialogDescription>{description}</DialogDescription>
                        ) : null}
                    </DialogHeader>
                )}

                <div
                    className={cn(
                        "min-h-0 flex-1 overflow-y-auto scrollbar-hidden",
                        fullScreenOnMobile
                            ? "px-5 py-5 max-sm:px-4 max-sm:py-4"
                            : "px-5 py-5",
                        showHeader
                            ? "pt-2"
                            : shouldShowTopClose && fullScreenOnMobile
                              ? "max-sm:pt-4 sm:pt-14"
                              : shouldShowTopClose
                                ? "pt-14"
                                : "pt-5",
                        bodyClassName,
                        fullScreenOnMobile && fullscreenBodyClassName,
                    )}
                >
                    {children}
                </div>

                {showBottomCloseOnMobileFullScreen ? (
                    <div className="flex gap-3 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 sm:hidden">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-12 flex-1 rounded-full border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] text-[color:var(--wedding-text-soft)] hover:bg-[color:var(--wedding-surface-muted)]" 
                        >
                            关闭
                        </Button>
                        {onSave ? (
                            <Button
                                type="button"
                                onClick={handleSave}
                                className="h-12 flex-1 rounded-full bg-gradient-to-r from-[color:var(--wedding-accent)] to-[color:var(--wedding-accent-strong)] text-white shadow-[0_12px_24px_-10px_rgba(236,72,153,0.4)] hover:brightness-105"
                            >
                                {saveButtonText}
                            </Button>
                        ) : null}
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );

    async function handleSave() {
        if (onSave) {
            await onSave();
        }
    }
}
