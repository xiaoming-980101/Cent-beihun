import * as React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/utils/index";

/**
 * ConfirmDialog Props
 */
export interface ConfirmDialogProps {
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
}

/**
 * ConfirmDialog - 统一确认弹窗组件
 *
 * 用于操作确认的弹窗组件。基于 AlertDialog 实现，默认阻止点击遮罩层关闭。
 * 支持危险操作的视觉警示（红色确认按钮）和异步操作。
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="确认删除？"
 *   description="此操作无法撤销"
 *   variant="destructive"
 *   onConfirm={handleDelete}
 * />
 * ```
 *
 * **验收标准:**
 * - 需求 3.1: 基于 @radix-ui/react-alert-dialog 实现
 * - 需求 3.2: 包含标题、描述文本和操作按钮
 * - 需求 3.3: 提供"取消"和"确认"两个标准按钮
 * - 需求 3.4: 支持自定义按钮文本和样式
 * - 需求 3.5: 默认阻止点击遮罩层关闭
 * - 需求 3.6: 支持危险操作的视觉警示（红色确认按钮）
 * - 需求 3.7: 返回 Promise 以支持异步操作
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "确认",
    cancelText = "取消",
    variant = "default",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
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
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent
                className={cn(
                    // 统一样式 - 需求 9.3, 9.4, 9.5
                    "rounded-[30px]",
                    "border border-[#edd6df] dark:border-[#302631]",
                    "bg-[#fffdfd] dark:bg-[#181419]",
                    "shadow-[0_32px_60px_-28px_rgba(31,41,55,0.45)]",
                )}
            >
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[color:var(--wedding-text)]">
                        {title}
                    </AlertDialogTitle>
                    {description && (
                        <AlertDialogDescription className="text-[color:var(--wedding-text-mute)]">
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={loading}
                        className={cn(
                            variant === "destructive" &&
                                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                        )}
                    >
                        {loading ? "处理中..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
