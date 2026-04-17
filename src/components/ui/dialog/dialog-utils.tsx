import * as React from "react";
import { createRoot } from "react-dom/client";
import { ConfirmDialog } from "./confirm-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/index";

/**
 * Confirm Options
 */
export interface ConfirmOptions {
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
}

/**
 * confirm() - 确认对话框工具函数
 *
 * 显示一个确认对话框，返回 Promise<boolean>。
 * 用户点击确认返回 true，点击取消或关闭返回 false。
 *
 * @example
 * ```tsx
 * const confirmed = await confirm({
 *   title: '确认删除？',
 *   description: '此操作无法撤销',
 *   variant: 'destructive'
 * });
 *
 * if (confirmed) {
 *   // 执行删除操作
 * }
 * ```
 *
 * **验收标准:**
 * - 需求 3.7: 返回 Promise 以支持异步操作
 */
export function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const root = createRoot(container);

        const cleanup = () => {
            root.unmount();
            document.body.removeChild(container);
        };

        const handleConfirm = () => {
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            cleanup();
            resolve(false);
        };

        root.render(
            <ConfirmDialog
                open={true}
                onOpenChange={(open) => {
                    if (!open) handleCancel();
                }}
                title={options.title}
                description={options.description}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                variant={options.variant}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
    });
}

/**
 * Prompt Options
 */
export interface PromptOptions {
    /** 弹窗标题 */
    title: string;
    /** 描述文本 */
    description?: string;
    /** 默认值 */
    defaultValue?: string;
    /** 占位符 */
    placeholder?: string;
    /** 输入类型 */
    inputType?: "text" | "number" | "email" | "password";
    /** 确认按钮文本 */
    confirmText?: string;
    /** 取消按钮文本 */
    cancelText?: string;
    /** 验证函数 - 返回 true 表示通过，返回字符串表示错误信息 */
    validate?: (value: string) => boolean | string;
}

/**
 * prompt() - 输入对话框工具函数
 *
 * 显示一个输入对话框，返回 Promise<string | null>。
 * 用户点击确认返回输入值，点击取消或关闭返回 null。
 *
 * @example
 * ```tsx
 * const bookName = await prompt({
 *   title: '请输入账本名称',
 *   placeholder: '我的账本',
 *   validate: (value) => value.length > 0 || '名称不能为空'
 * });
 *
 * if (bookName) {
 *   // 创建账本
 * }
 * ```
 *
 * **验收标准:**
 * - 需求 8.1: 提供 prompt 函数替代现有 modal.prompt
 * - 需求 8.2: 支持文本输入类型的 prompt
 * - 需求 8.3: 返回 Promise 以支持异步操作
 * - 需求 8.4: 用户取消时 reject Promise
 * - 需求 8.5: 用户确认时 resolve Promise 并返回输入值
 * - 需求 8.6: 确保 prompt 弹窗使用统一的样式
 */
export function prompt(options: PromptOptions): Promise<string | null> {
    return new Promise((resolve) => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const root = createRoot(container);

        const PromptDialog = () => {
            const [value, setValue] = React.useState(options.defaultValue || "");
            const [error, setError] = React.useState<string>("");

            const cleanup = () => {
                root.unmount();
                document.body.removeChild(container);
            };

            const handleConfirm = () => {
                if (options.validate) {
                    const result = options.validate(value);
                    if (result !== true) {
                        setError(typeof result === "string" ? result : "输入无效");
                        return;
                    }
                }
                cleanup();
                resolve(value);
            };

            const handleCancel = () => {
                cleanup();
                resolve(null);
            };

            return (
                <Dialog
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) handleCancel();
                    }}
                >
                    <DialogContent
                        className={cn(
                            "rounded-[30px]",
                            "border border-[#edd6df] dark:border-[#302631]",
                            "bg-[#fffdfd] dark:bg-[#181419]",
                            "shadow-[0_32px_60px_-28px_rgba(31,41,55,0.45)]"
                        )}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-[color:var(--wedding-text)]">
                                {options.title}
                            </DialogTitle>
                            {options.description && (
                                <DialogDescription className="text-[color:var(--wedding-text-mute)]">
                                    {options.description}
                                </DialogDescription>
                            )}
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                type={options.inputType || "text"}
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    setError("");
                                }}
                                placeholder={options.placeholder}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleConfirm();
                                    }
                                }}
                                autoFocus
                            />
                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleCancel}>
                                {options.cancelText || "取消"}
                            </Button>
                            <Button onClick={handleConfirm}>
                                {options.confirmText || "确认"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        };

        root.render(<PromptDialog />);
    });
}

/**
 * Alert Options
 */
export interface AlertOptions {
    /** 弹窗标题 */
    title: string;
    /** 描述文本 */
    description?: string;
    /** 确认按钮文本 */
    confirmText?: string;
}

/**
 * alert() - 警告对话框工具函数
 *
 * 显示一个警告对话框，返回 Promise<void>。
 * 用户点击确认后自动关闭。
 *
 * @example
 * ```tsx
 * await alert({
 *   title: '操作成功',
 *   description: '数据已保存'
 * });
 * ```
 *
 * **验收标准:**
 * - 需求 3.7: 返回 Promise 以支持异步操作
 */
export function alert(options: AlertOptions): Promise<void> {
    return new Promise((resolve) => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const root = createRoot(container);

        const cleanup = () => {
            root.unmount();
            document.body.removeChild(container);
            resolve();
        };

        root.render(
            <AlertDialog open={true} onOpenChange={(open) => !open && cleanup()}>
                <AlertDialogContent
                    className={cn(
                        "rounded-[30px]",
                        "border border-[#edd6df] dark:border-[#302631]",
                        "bg-[#fffdfd] dark:bg-[#181419]",
                        "shadow-[0_32px_60px_-28px_rgba(31,41,55,0.45)]"
                    )}
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[color:var(--wedding-text)]">
                            {options.title}
                        </AlertDialogTitle>
                        {options.description && (
                            <AlertDialogDescription className="text-[color:var(--wedding-text-mute)]">
                                {options.description}
                            </AlertDialogDescription>
                        )}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={cleanup}>
                            {options.confirmText || "确认"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    });
}
