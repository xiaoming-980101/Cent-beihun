/**
 * 统一弹窗组件系统
 *
 * 提供一套统一的弹窗组件和工具函数，确保整个应用的弹窗样式和交互一致。
 *
 * @module dialog
 */

// 基础 Dialog 组件
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

// 专用弹窗组件
export { FormDialog, type FormDialogProps } from "./form-dialog";
export { ConfirmDialog, type ConfirmDialogProps } from "./confirm-dialog";

// 工具函数
export {
    confirm,
    prompt,
    alert,
    type ConfirmOptions,
    type PromptOptions,
    type AlertOptions,
} from "./utils";
