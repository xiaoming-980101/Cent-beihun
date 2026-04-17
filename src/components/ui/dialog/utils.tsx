import * as React from "react";
import { createRoot } from "react-dom/client";
import { ConfirmDialog, type ConfirmDialogProps } from "./confirm-dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    /** 验证函数 */
    validate?: (value: string) => boolean | string;
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
 * - 需求 3.1-3.7: 基于 ConfirmDialog 实现
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

        const handleOpenChange = (open: boolean) => {
            if (!open) {
                handleCancel();
            }
        };

        root.render(
            <ConfirmDialog
                open={true}
                onOpenChange={handleOpenChange}
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
 * PromptDialog Component (Internal)
 */
interface PromptDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    defaultValue?: string;
    placeholder?: string;
    inputType?: "text" | "number" | "email" | "password";
    confirmText?: string;
    cancelText?: string;
    validate?: (value: string) => boolean | string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
}

function PromptDialog({
    open,
    onOpenChange,
    title,
    description,
    defaultValue = "",
    placeholder,
    inputType = "text",
    confirmText = "确认",
    cancelText = "取消",
    validate,
    onConfirm,
    onCancel,
}: PromptDialogProps) {
    const [value, setValue] = React.useState(defaultValue);
    const [error, setError] = React.useState<string>("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (open && inputRef.current) {
            // 延迟聚焦以确保弹窗动画完成
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 100);
        }
    }, [open]);

    const handleConfirm = () => {
        if (validate) {
            const result = validate(value);
            if (result !== true) {
                setError(typeof result === "string" ? result : "输入无效");
                return;
            }
        }
        onConfirm(value);
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleConfirm();
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
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
                        {title}
                    </AlertDialogTitle>
                    {description && (
                        <AlertDialogDescription className="text-[color:var(--wedding-text-mute)]">
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <div className="space-y-2">
                    <Input
                        ref={inputRef}
                        type={inputType}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setError("");
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className={cn(error && "border-destructive")}
                    />
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

/**
 * prompt() - 输入对话框工具函数
 *
 * 显示一个带输入框的对话框，返回 Promise<string | null>。
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

        const cleanup = () => {
            root.unmount();
            document.body.removeChild(container);
        };

        const handleConfirm = (value: string) => {
            cleanup();
            resolve(value);
        };

        const handleCancel = () => {
            cleanup();
            resolve(null);
        };

        const handleOpenChange = (open: boolean) => {
            if (!open) {
                handleCancel();
            }
        };

        root.render(
            <PromptDialog
                open={true}
                onOpenChange={handleOpenChange}
                title={options.title}
                description={options.description}
                defaultValue={options.defaultValue}
                placeholder={options.placeholder}
                inputType={options.inputType}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                validate={options.validate}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );
    });
}

/**
 * alert() - 警告对话框工具函数
 *
 * 显示一个简单的警告对话框，返回 Promise<void>。
 * 用户点击确认后 resolve。
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
 * - 需求 3.1-3.7: 基于 AlertDialog 实现
 * - 单个确认按钮
 * - 确认后自动关闭
 */
export function alert(options: AlertOptions): Promise<void> {
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
            resolve();
        };

        const handleOpenChange = (open: boolean) => {
            if (!open) {
                handleConfirm();
            }
        };

        root.render(
            <AlertDialog open={true} onOpenChange={handleOpenChange}>
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
                        <AlertDialogAction onClick={handleConfirm}>
                            {options.confirmText || "确定"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    });
}
