/**
 * 统一弹窗组件系统
 *
 * 提供基于 shadcn/ui Dialog 的统一弹窗组件和工具函数。
 * 确保整个应用中弹窗的样式、交互和行为保持一致。
 */

// 导出基础 Dialog 组件
export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "../dialog";

// 导出专用弹窗组件
export { FormDialog, type FormDialogProps } from "./form-dialog";
export { ConfirmDialog, type ConfirmDialogProps } from "./confirm-dialog";

// 导出工具函数
export {
    confirm,
    prompt,
    alert,
    type ConfirmOptions,
    type PromptOptions,
    type AlertOptions,
} from "./dialog-utils";
