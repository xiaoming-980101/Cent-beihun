import * as React from "react";
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
    /** 最大宽度变体 */
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
 *
 * 用于显示表单输入界面的弹窗。在移动端从底部滑入，在桌面端居中显示。
 * 提供标准化的布局、样式和交互行为。
 *
 * **移动端响应式布局:**
 * - 使用 `fullScreenOnMobile=true` 适合内容较多的表单(账单编辑器、任务表单、亲友管理等)
 * - 使用 `fullScreenOnMobile=false` (默认)适合内容较少的表单(简单确认框、单字段输入等)
 *
 * @example
 * 基础用法 - 内容较少的表单(默认85%宽度)
 * ```tsx
 * <FormDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="添加预算"
 * >
 *   <BudgetForm onSubmit={handleSubmit} />
 * </FormDialog>
 * ```
 *
 * @example
 * 内容较多的表单 - 移动端全屏显示
 * ```tsx
 * <FormDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="编辑账单"
 *   fullScreenOnMobile={true}
 * >
 *   <GiftForm onSubmit={handleSubmit} />
 * </FormDialog>
 * ```
 *
 * @example
 * 自定义最大宽度 - 桌面端使用大尺寸
 * ```tsx
 * <FormDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="任务详情"
 *   maxWidth="lg"
 *   fullScreenOnMobile={true}
 * >
 *   <TaskForm onSubmit={handleSubmit} />
 * </FormDialog>
 * ```
 *
 * **何时使用 fullScreenOnMobile:**
 * - `true`: 表单包含多个字段、复杂布局、或需要更多空间的内容
 *   - 示例: 账单编辑器(多个输入字段)、任务表单(日期选择器+描述)、亲友管理(多个联系信息字段)
 * - `false` (默认): 表单内容简单、字段较少、或希望保持紧凑布局
 *   - 示例: 简单确认框、单字段输入、快速操作弹窗
 *
 * **验收标准:**
 * - 需求 2.1: 继承 Unified_Dialog 的所有特性
 * - 需求 2.2: 包含标准化的表单容器布局
 * - 需求 2.3: 支持滚动内容区域
 * - 需求 2.4: 在移动端从底部滑入，在桌面端居中显示
 * - 需求 2.5: 支持自定义标题文本
 * - 需求 2.6: 支持编辑模式和新建模式的标题切换
 * - 需求 2.7: 提供标准化的内边距和间距
 * - 需求 2.8: 支持移动端响应式布局(fullScreenOnMobile)
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
                    "fixed left-[50%] top-[50%] z-[81] -translate-x-1/2 -translate-y-1/2",
                    "flex max-h-[calc(100dvh-1.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full flex-col overflow-hidden",
                    "rounded-[30px]",
                    "border border-[#edd6df] dark:border-[#302631]",
                    "bg-[#fffdfd] dark:bg-[#181419]",
                    "shadow-[0_32px_60px_-28px_rgba(31,41,55,0.45)]",
                    "sm:max-h-[min(84vh,760px)]",
                    maxWidthClasses[maxWidth],
                    fullScreenOnMobile
                        ? "max-sm:inset-0 max-sm:left-0 max-sm:top-0 max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:border-0 max-sm:bg-[color:var(--wedding-app-bg)] max-sm:shadow-none"
                        : "max-sm:w-[min(92vw,32rem)] max-sm:max-w-[92vw] max-sm:max-h-[min(86dvh,760px)] max-sm:rounded-[28px]",
                    className
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
                        <span className="sr-only">Close</span>
                    </button>
                ) : null}

                {showHeader ? (
                    <DialogHeader className="border-b border-[color:var(--wedding-line)] px-5 pb-4 pt-5">
                        <DialogTitle className="wedding-topbar-title pl-1 text-[24px] text-[color:var(--wedding-text)]">
                            {title}
                        </DialogTitle>
                        {description ? (
                            <DialogDescription className="pl-1 text-sm leading-6 text-[color:var(--wedding-text-mute)]">
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
                            ? "pt-4"
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
                            className="h-12 flex-1 rounded-full border-[color:var(--wedding-line)] bg-white/90 text-[color:var(--wedding-text)] hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                        >
                            关闭
                        </Button>
                        {onSave ? (
                            <Button
                                type="button"
                                onClick={onSave}
                                className="h-12 flex-1 rounded-full bg-gradient-to-r from-[color:var(--wedding-accent)] to-[color:var(--wedding-accent-strong)] text-white shadow-[0_14px_30px_-20px_rgba(15,23,42,0.8)] hover:brightness-105"
                            >
                                {saveButtonText}
                            </Button>
                        ) : null}
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
