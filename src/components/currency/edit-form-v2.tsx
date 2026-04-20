/**
 * 币种编辑表单 - 新版本（使用ResponsiveDialog）
 *
 * 迁移说明：
 * 1. FormDialog → ResponsiveDialog
 * 2. 移除表单内部的按钮，使用统一的底部按钮
 * 3. 添加loading状态支持
 * 4. 移动端使用iOS风格Sheet，PC端保持Dialog
 */

import { useEffect, useState } from "react";
import type { CustomCurrency } from "@/ledger/type";
import { ResponsiveDialog } from "../ui/dialog/responsive-dialog";
import { EditCurrencyForm } from "./edit";

type CurrencyEdit = Omit<CustomCurrency, "id"> & { id?: string };
type CurrencyEditResult = CurrencyEdit | "delete" | undefined;
type EditResolve = (value?: CurrencyEditResult) => void;

export function EditCurrencyProviderV2() {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<CurrencyEdit | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [resolveRef, setResolveRef] = useState<{
        resolve: EditResolve;
    } | null>(null);

    useEffect(() => {
        const handleShow = ((e: CustomEvent<{ edit?: CurrencyEdit }>) => {
            setEdit(e.detail.edit);
            setOpen(true);
        }) as EventListener;

        const handleStoreResolve = ((
            e: CustomEvent<{ resolve: EditResolve }>,
        ) => {
            setResolveRef({ resolve: e.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-edit-currency-v2", handleShow);
        window.addEventListener(
            "store-edit-currency-resolve-v2",
            handleStoreResolve,
        );

        return () => {
            window.removeEventListener("show-edit-currency-v2", handleShow);
            window.removeEventListener(
                "store-edit-currency-resolve-v2",
                handleStoreResolve,
            );
        };
    }, []);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            // 这里应该调用表单的提交逻辑
            // 为了演示，我们模拟一个异步操作
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // 实际应用中，这里应该从表单组件获取数据
            const formData = edit; // 临时使用edit数据

            resolveRef?.resolve(formData);
            setOpen(false);
            setEdit(undefined);
            setResolveRef(null);
        } catch (error) {
            console.error("保存失败:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        resolveRef?.resolve(undefined);
        setOpen(false);
        setEdit(undefined);
        setResolveRef(null);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            handleCancel();
        }
    };

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="编辑币种"
            description="修改币种信息，保存后立即生效"
            fullScreenOnMobile={true}
            maxWidth="md"
            actions={{
                cancelText: "取消",
                confirmText: edit?.id ? "保存更改" : "添加币种",
                onConfirm: handleConfirm,
                loading: loading,
            }}
        >
            {/* 
                注意：这里的EditCurrencyForm需要修改，移除内部的按钮
                所有操作通过上面的actions配置统一处理
            */}
            <div className="p-6">
                <EditCurrencyForm
                    edit={edit}
                    onConfirm={() => {}} // 不再使用内部确认
                    onCancel={() => {}} // 不再使用内部取消
                    // hideButtons={true} // 需要修改EditCurrencyForm组件支持此属性
                />
            </div>
        </ResponsiveDialog>
    );
}

export function showEditCurrencyV2(
    edit?: CurrencyEdit,
): Promise<CurrencyEditResult> {
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("show-edit-currency-v2", { detail: { edit } }),
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("store-edit-currency-resolve-v2", {
                    detail: { resolve },
                }),
            );
        }, 0);
    });
}

/**
 * 迁移指南：
 *
 * 1. 替换组件导入：
 *    - FormDialog → ResponsiveDialog
 *
 * 2. 更新Props：
 *    - 添加 fullScreenOnMobile={true} （全屏弹窗）
 *    - 添加 maxWidth="md" （PC端宽度）
 *    - 添加 actions 配置替代 onSave
 *
 * 3. 修改表单组件：
 *    - 移除表单内部的提交/取消按钮
 *    - 通过 actions.onConfirm 处理提交逻辑
 *    - 添加 loading 状态支持
 *
 * 4. 用户体验提升：
 *    - 移动端：iOS风格Sheet，支持手势关闭
 *    - PC端：保持传统Dialog体验
 *    - 统一的底部按钮布局
 *    - 流畅的物理动画
 */
