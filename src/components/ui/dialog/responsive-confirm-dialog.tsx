/**
 * ResponsiveConfirmDialog - 响应式确认对话框
 *
 * 基于ResponsiveDialog实现的确认对话框，自动适配移动端和PC端：
 * - 移动端: 底部Sheet样式
 * - PC端: 居中Dialog样式
 *
 * 用于替代原有的ConfirmDialog
 */

import * as React from "react";
import { ResponsiveDialog } from "./responsive-dialog";

export interface ResponsiveConfirmDialogProps {
    /** 控制弹窗打开/关闭状态 */
    open: boolean;
    /** 状态变化回调 */
    onOpenChange: (open: boolean) => void;
    /** 弹窗标题 */
    title: string;
    /** 描述文本 */
    description?: string;
    /** 确认按钮文本 */
    confirmText?: string;
    /** 取消按钮文本 */
    cancelText?: string;
    /** 按钮变体 - default 或 destructive（危险操作） */
    variant?: "default" | "destructive";
    /** 确认回调（支持异步） */
    onConfirm: () => void | Promise<void>;
    /** 取消回调 */
    onCancel?: () => void;
    /** 自定义类名 */
    className?: string;
}

/**
 * ResponsiveConfirmDialog - 响应式确认对话框
 *
 * @example
 * ```tsx
 * <ResponsiveConfirmDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="确认删除？"
 *   description="此操作无法撤销"
 *   variant="destructive"
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export function ResponsiveConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "确认",
    cancelText = "取消",
    variant = "default",
    onConfirm,
    onCancel,
    className,
}: ResponsiveConfirmDialogProps) {
    const [loading, setLoading] = React.useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
            onOpenChange(false);
        } catch (error) {
            console.error("Confirm action failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            fullScreenOnMobile={false} // 确认对话框通常不需要全屏
            className={className}
            actions={{
                cancelText,
                confirmText,
                confirmVariant: variant,
                onConfirm: handleConfirm,
                onCancel: handleCancel,
                loading,
            }}
        >
            {/* 确认对话框通常只有文本内容，不需要额外的内容区域 */}
            {description && (
                <div className="px-6 py-4">
                    <p className="text-[color:var(--wedding-text-mute)]">
                        {description}
                    </p>
                </div>
            )}
        </ResponsiveDialog>
    );
}

// 导出类型（避免重复导出）
