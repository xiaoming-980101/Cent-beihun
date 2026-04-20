/**
 * 统一弹窗组件系统 v2.0
 *
 * 提供响应式弹窗组件，自动适配移动端和PC端：
 * - 移动端: iOS风格Sheet，底部滑入，支持手势关闭
 * - PC端: 传统Dialog，居中显示
 *
 * 新架构：
 * - ResponsiveDialog: 推荐使用的统一入口
 * - MobileSheet: 移动端专用组件
 * - FormDialog: PC端专用组件（保持兼容）
 */

// 导出基础 Dialog 组件
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
// 导出动画配置
export * from "./animation-config";
export { ConfirmDialog, type ConfirmDialogProps } from "./confirm-dialog";
// 导出传统弹窗组件（兼容性）
export { FormDialog, type FormDialogProps } from "./form-dialog";
export { MobileSheet, type MobileSheetProps } from "./mobile-sheet";
export {
    ResponsiveConfirmDialog,
    type ResponsiveConfirmDialogProps,
} from "./responsive-confirm-dialog";
// 导出新的响应式弹窗组件（推荐）
export {
    ResponsiveDialog,
    type ResponsiveDialogProps,
} from "./responsive-dialog";

// 导出工具函数
export {
    type AlertOptions,
    alert,
    type ConfirmOptions,
    confirm,
    type PromptOptions,
    prompt,
    responsiveConfirm,
} from "./utils";
