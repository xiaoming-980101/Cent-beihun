/**
 * ResponsiveDialog - 响应式弹窗组件
 *
 * 自动根据屏幕尺寸选择最佳的弹窗模式：
 * - 移动端(<640px): 使用 MobileSheet (底部滑入)
 * - PC端(≥640px): 使用 Dialog (居中显示)
 *
 * 这是新弹窗系统的统一入口组件
 */

import type * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BREAKPOINTS } from "./animation-config";
import { FormDialog, type FormDialogProps } from "./form-dialog";
import { MobileSheet, type MobileSheetProps } from "./mobile-sheet";

// 合并两个组件的 Props，处理冲突
export interface ResponsiveDialogProps
    extends Omit<MobileSheetProps, "fullscreen" | "actions">,
        Omit<
            FormDialogProps,
            | "children"
            | "title"
            | "description"
            | "open"
            | "onOpenChange"
            | "hideClose"
        > {
    /** 弹窗内容 */
    children: React.ReactNode;

    /** 移动端是否使用全屏模式 */
    fullScreenOnMobile?: boolean;

    /** PC端最大宽度 */
    maxWidth?: FormDialogProps["maxWidth"];

    /** 底部按钮配置（移动端使用） */
    actions?: MobileSheetProps["actions"];

    /** 保存按钮配置（PC端使用，兼容旧API） */
    saveButtonText?: string;
    onSave?: () => void | Promise<void>;

    /** 是否禁用拖拽关闭（仅移动端） */
    disableDragClose?: boolean;

    /** 是否隐藏拖拽条（仅移动端） */
    hideDragHandle?: boolean;
}

/**
 * ResponsiveDialog - 响应式弹窗
 *
 * 根据屏幕尺寸自动选择最佳的弹窗实现：
 * - 移动端: iOS风格Sheet，从底部滑入，支持手势关闭
 * - PC端: 传统Dialog，居中显示，鼠标交互
 *
 * @example
 * ```tsx
 * <ResponsiveDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="编辑信息"
 *   fullScreenOnMobile={true}
 *   maxWidth="md"
 *   actions={{
 *     cancelText: "取消",
 *     confirmText: "保存",
 *     onConfirm: handleSave,
 *   }}
 * >
 *   <YourFormContent />
 * </ResponsiveDialog>
 * ```
 */
export function ResponsiveDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    fullScreenOnMobile = false,
    maxWidth = "md",
    className,
    bodyClassName,
    hideClose = false,
    actions,
    saveButtonText,
    onSave,
    disableDragClose = false,
    hideDragHandle = false,
    ...props
}: ResponsiveDialogProps) {
    // 检测是否为移动端
    const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);

    // 移动端使用 MobileSheet
    if (isMobile) {
        // 如果提供了旧的 saveButtonText/onSave API，转换为新的 actions 格式
        const mobileActions =
            actions ||
            (onSave
                ? {
                      cancelText: "取消",
                      confirmText: saveButtonText || "保存",
                      onConfirm: onSave,
                  }
                : undefined);

        return (
            <MobileSheet
                open={open}
                onOpenChange={onOpenChange}
                title={title}
                description={description}
                fullscreen={fullScreenOnMobile}
                className={className}
                bodyClassName={bodyClassName}
                hideClose={hideClose}
                hideDragHandle={hideDragHandle}
                actions={mobileActions}
                disableDragClose={disableDragClose}
            >
                {children}
            </MobileSheet>
        );
    }

    // PC端使用 FormDialog
    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={description}
            maxWidth={maxWidth}
            className={className}
            bodyClassName={bodyClassName}
            hideClose={hideClose}
            fullScreenOnMobile={false} // PC端不使用全屏
            saveButtonText={saveButtonText}
            onSave={onSave}
            {...props}
        >
            {children}
        </FormDialog>
    );
}

// 导出类型（避免重复导出）
