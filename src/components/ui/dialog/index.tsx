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
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "../dialog";
export { ConfirmDialog, type ConfirmDialogProps } from "./confirm-dialog";
// 专用弹窗组件
export { FormDialog, type FormDialogProps } from "./form-dialog";

// 工具函数
export {
    type AlertOptions,
    alert,
    type ConfirmOptions,
    confirm,
    type PromptOptions,
    prompt,
} from "./utils";
