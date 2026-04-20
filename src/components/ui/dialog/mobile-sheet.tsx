/**
 * MobileSheet - iOS风格移动端弹窗组件
 *
 * 核心特性：
 * - 从底部滑入，支持手势拖拽关闭
 * - 顶部圆角 + 拖拽条设计
 * - 背景半透明模糊
 * - 物理动画（弹性效果）
 * - 自适应高度（全屏/半屏）
 * - 底部按钮固定布局
 */

import { X } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/index";
import {
    BUTTON_VARIANTS,
    getSafeAreaInsets,
    MODAL_VARIANTS,
    SPRING_CONFIG,
    shouldCloseOnDrag,
} from "./animation-config";

export interface MobileSheetProps {
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
    /** 是否全屏显示 */
    fullscreen?: boolean;
    /** 自定义类名 */
    className?: string;
    /** 内容容器类名 */
    bodyClassName?: string;
    /** 是否隐藏关闭按钮 */
    hideClose?: boolean;
    /** 是否隐藏拖拽条 */
    hideDragHandle?: boolean;
    /** 底部按钮配置 */
    actions?: {
        /** 取消按钮文本 */
        cancelText?: string;
        /** 确认按钮文本 */
        confirmText?: string;
        /** 确认按钮点击回调 */
        onConfirm?: () => void | Promise<void>;
        /** 取消按钮点击回调 */
        onCancel?: () => void;
        /** 确认按钮变体 */
        confirmVariant?: "default" | "destructive";
        /** 是否显示加载状态 */
        loading?: boolean;
    };
    /** 是否禁用拖拽关闭 */
    disableDragClose?: boolean;
}

/**
 * MobileSheet 组件
 *
 * @example
 * ```tsx
 * <MobileSheet
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="编辑信息"
 *   fullscreen={true}
 *   actions={{
 *     cancelText: "取消",
 *     confirmText: "保存",
 *     onConfirm: handleSave,
 *   }}
 * >
 *   <YourFormContent />
 * </MobileSheet>
 * ```
 */
export function MobileSheet({
    open,
    onOpenChange,
    title,
    description,
    children,
    fullscreen = false,
    className,
    bodyClassName,
    hideClose = false,
    hideDragHandle = false,
    actions,
    disableDragClose = false,
}: MobileSheetProps) {
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState(0);
    const safeAreaInsets = getSafeAreaInsets();

    // 处理拖拽开始
    const handleDragStart = () => {
        setIsDragging(true);
    };

    // 处理拖拽中
    const handleDrag = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo,
    ) => {
        // 只允许向下拖拽
        if (info.offset.y > 0) {
            setDragOffset(info.offset.y);
        }
    };

    // 处理拖拽结束
    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo,
    ) => {
        setIsDragging(false);
        setDragOffset(0);

        // 判断是否应该关闭
        if (
            !disableDragClose &&
            shouldCloseOnDrag(info.offset, info.velocity)
        ) {
            onOpenChange(false);
        }
    };

    // 处理关闭
    const handleClose = () => {
        onOpenChange(false);
    };

    // 处理确认
    const handleConfirm = async () => {
        if (actions?.onConfirm) {
            await actions.onConfirm();
        }
    };

    // 处理取消
    const handleCancel = () => {
        if (actions?.onCancel) {
            actions.onCancel();
        } else {
            handleClose();
        }
    };

    // 阻止背景滚动
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = "";
            };
        }
    }, [open]);

    // 如果在服务端渲染或者弹窗未打开，不渲染任何内容
    if (typeof document === "undefined" || !open) {
        return null;
    }

    return createPortal(
        <AnimatePresence mode="wait">
            {open && (
                <>
                    {/* 背景遮罩 */}
                    <motion.div
                        className="fixed inset-0 z-[110] bg-black/60"
                        variants={MODAL_VARIANTS.backdrop}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={SPRING_CONFIG.gentle}
                        onClick={handleClose}
                    />

                    {/* 弹窗内容 */}
                    <motion.div
                        className={cn(
                            "fixed inset-x-0 bottom-0 z-[111] flex flex-col overflow-hidden",
                            "rounded-t-[20px] border-t border-[color:var(--wedding-line)]",
                            "bg-[color:var(--wedding-surface)] shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.3)]",
                            fullscreen
                                ? "h-[100dvh] max-h-[100dvh]"
                                : "max-h-[70vh]",
                            className,
                        )}
                        variants={
                            fullscreen
                                ? MODAL_VARIANTS.fullscreenMobile
                                : MODAL_VARIANTS.halfscreen
                        }
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={
                            fullscreen
                                ? SPRING_CONFIG.gentle
                                : SPRING_CONFIG.snappy
                        }
                        drag={disableDragClose ? false : "y"}
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.1}
                        onDragStart={handleDragStart}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                        style={{
                            y: isDragging ? dragOffset : 0,
                        }}
                    >
                        {/* 拖拽条 */}
                        {!hideDragHandle && (
                            <div className="flex justify-center py-3">
                                <div className="h-1 w-12 rounded-full bg-[color:var(--wedding-text-mute)]/30" />
                            </div>
                        )}

                        {/* 顶部导航栏 */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--wedding-line)]">
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-[color:var(--wedding-text)]">
                                    {title}
                                </h2>
                                {description && (
                                    <p className="mt-1 text-sm text-[color:var(--wedding-text-mute)]">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {!hideClose && (
                                <motion.button
                                    type="button"
                                    onClick={handleClose}
                                    className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--wedding-surface-muted)] text-[color:var(--wedding-text-mute)] transition-colors hover:bg-[color:var(--wedding-surface-muted)]/80 hover:text-[color:var(--wedding-text)]"
                                    whileTap={BUTTON_VARIANTS.tap}
                                    whileHover={BUTTON_VARIANTS.hover}
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">关闭</span>
                                </motion.button>
                            )}
                        </div>

                        {/* 内容区域 */}
                        <div
                            className={cn(
                                "flex-1 overflow-y-auto scrollbar-hidden",
                                fullscreen ? "px-4" : "", // 全屏时添加左右内边距
                                bodyClassName,
                            )}
                        >
                            {children}
                        </div>

                        {/* 底部按钮区域 */}
                        {actions && (
                            <div
                                className="flex gap-3 border-t border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)]/95 p-4 backdrop-blur-sm"
                                style={{
                                    paddingBottom: `max(1rem, ${safeAreaInsets.bottom}px)`,
                                }}
                            >
                                {/* 取消按钮 */}
                                <motion.div
                                    className="flex-1"
                                    whileTap={BUTTON_VARIANTS.tap}
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={actions.loading}
                                        className="h-12 w-full rounded-full border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] text-[color:var(--wedding-text)] hover:bg-[color:var(--wedding-surface-muted)]"
                                    >
                                        {actions.cancelText || "取消"}
                                    </Button>
                                </motion.div>

                                {/* 确认按钮 */}
                                {actions.onConfirm && (
                                    <motion.div
                                        className="flex-1"
                                        whileTap={BUTTON_VARIANTS.tap}
                                    >
                                        <Button
                                            type="button"
                                            onClick={handleConfirm}
                                            disabled={actions.loading}
                                            className={cn(
                                                "h-12 w-full rounded-full text-white shadow-lg",
                                                actions.confirmVariant ===
                                                    "destructive"
                                                    ? "bg-red-500 hover:bg-red-600"
                                                    : "bg-gradient-to-r from-[color:var(--wedding-accent)] to-[color:var(--wedding-accent-strong)] hover:brightness-105",
                                            )}
                                        >
                                            {actions.loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                    处理中...
                                                </div>
                                            ) : (
                                                actions.confirmText || "确认"
                                            )}
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body,
    );
}

// 导出类型（避免重复导出）
