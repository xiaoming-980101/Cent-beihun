/**
 * 弹窗系统测试页面
 * 用于验证新的响应式弹窗组件是否正常工作
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    ResponsiveConfirmDialog,
    ResponsiveDialog,
    responsiveConfirm,
} from "@/components/ui/dialog/index";
import { Input } from "@/components/ui/input";
import { WeddingPageShell, WeddingTopBar } from "@/components/wedding-ui";

export default function ModalTest() {
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [showHalfScreen, setShowHalfScreen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async () => {
        setLoading(true);
        // 模拟异步操作
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        setShowForm(false);
    };

    const handleConfirmTest = async () => {
        const result = await responsiveConfirm({
            title: "确认删除",
            description: "此操作不可撤销，确定要删除这个项目吗？",
            confirmText: "删除",
            cancelText: "取消",
        });

        if (result) {
            alert("用户确认删除");
        } else {
            alert("用户取消操作");
        }
    };

    return (
        <WeddingPageShell>
            <WeddingTopBar title="弹窗系统测试" />

            <div className="space-y-6 p-6">
                <div className="wedding-soft-card p-6 space-y-4">
                    <h2 className="text-lg font-semibold">响应式弹窗测试</h2>
                    <p className="text-sm wedding-muted">
                        测试新的弹窗系统在移动端和PC端的表现
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Button
                            onClick={() => setShowFullScreen(true)}
                            className="w-full"
                        >
                            全屏弹窗测试
                        </Button>

                        <Button
                            onClick={() => setShowHalfScreen(true)}
                            variant="outline"
                            className="w-full"
                        >
                            半屏弹窗测试
                        </Button>

                        <Button
                            onClick={() => setShowForm(true)}
                            variant="secondary"
                            className="w-full"
                        >
                            表单弹窗测试
                        </Button>

                        <Button
                            onClick={handleConfirmTest}
                            variant="destructive"
                            className="w-full"
                        >
                            确认弹窗测试
                        </Button>
                    </div>
                </div>

                <div className="wedding-soft-card p-6 space-y-4">
                    <h3 className="font-semibold">测试说明</h3>
                    <ul className="text-sm wedding-muted space-y-2">
                        <li>
                            • <strong>移动端</strong>:
                            弹窗从底部滑入，支持下拉手势关闭
                        </li>
                        <li>
                            • <strong>PC端</strong>: 弹窗居中显示，缩放淡入动画
                        </li>
                        <li>
                            • <strong>全屏弹窗</strong>:
                            移动端占满屏幕，PC端最大宽度限制
                        </li>
                        <li>
                            • <strong>半屏弹窗</strong>:
                            移动端底部Sheet，PC端居中卡片
                        </li>
                        <li>
                            • <strong>统一按钮</strong>:
                            所有操作按钮在底部固定区域
                        </li>
                    </ul>
                </div>
            </div>

            {/* 全屏弹窗测试 */}
            <ResponsiveDialog
                open={showFullScreen}
                onOpenChange={setShowFullScreen}
                title="全屏弹窗测试"
                description="这是一个全屏弹窗，在移动端会占满整个屏幕"
                fullScreenOnMobile={true}
                maxWidth="md"
                actions={{
                    cancelText: "取消",
                    confirmText: "确认",
                    onConfirm: () => setShowFullScreen(false),
                }}
            >
                <div className="space-y-6 p-6">
                    <div className="wedding-soft-card p-4 space-y-4">
                        <h3 className="font-semibold">iOS风格设计</h3>
                        <p className="text-sm wedding-muted">
                            移动端使用iOS风格的Sheet设计，从底部滑入，支持手势关闭。
                            PC端使用传统的居中弹窗。
                        </p>
                    </div>

                    <div className="wedding-soft-card p-4 space-y-4">
                        <h3 className="font-semibold">动画效果</h3>
                        <p className="text-sm wedding-muted">
                            使用Framer Motion物理动画，提供流畅的弹性效果。
                            背景使用半透明模糊，营造层次感。
                        </p>
                    </div>

                    <div className="wedding-soft-card p-4 space-y-4">
                        <h3 className="font-semibold">统一按钮布局</h3>
                        <p className="text-sm wedding-muted">
                            所有操作按钮统一放在弹窗底部固定区域，
                            移动端适配安全区域，PC端保持一致的布局。
                        </p>
                    </div>
                </div>
            </ResponsiveDialog>

            {/* 半屏弹窗测试 */}
            <ResponsiveDialog
                open={showHalfScreen}
                onOpenChange={setShowHalfScreen}
                title="半屏弹窗测试"
                description="这是一个半屏弹窗，适合简单的内容展示"
                fullScreenOnMobile={false}
                maxWidth="sm"
                actions={{
                    cancelText: "关闭",
                    confirmText: "好的",
                    onConfirm: () => setShowHalfScreen(false),
                }}
            >
                <div className="space-y-4 p-4">
                    <p className="text-sm wedding-muted">
                        半屏弹窗在移动端使用底部Sheet设计，高度自适应内容。
                        在PC端使用居中卡片布局。
                    </p>
                    <p className="text-sm wedding-muted">
                        同样支持手势关闭和统一的按钮布局。
                    </p>
                </div>
            </ResponsiveDialog>

            {/* 表单弹窗测试 */}
            <ResponsiveDialog
                open={showForm}
                onOpenChange={setShowForm}
                title="表单弹窗测试"
                description="测试表单提交和loading状态"
                fullScreenOnMobile={true}
                maxWidth="md"
                actions={{
                    cancelText: "取消",
                    confirmText: "提交",
                    onConfirm: handleFormSubmit,
                    loading: loading,
                }}
            >
                <div className="space-y-6 p-6">
                    <div className="wedding-soft-card p-4 space-y-4">
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                姓名
                            </label>
                            <Input
                                type="text"
                                className="wedding-input"
                                placeholder="请输入姓名"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                                邮箱
                            </label>
                            <Input
                                type="email"
                                className="wedding-input"
                                placeholder="请输入邮箱"
                            />
                        </div>
                    </div>

                    <div className="wedding-soft-card p-4">
                        <p className="text-sm wedding-muted">
                            点击"提交"按钮会显示loading状态，
                            测试按钮的禁用和加载动画效果。
                        </p>
                    </div>
                </div>
            </ResponsiveDialog>
        </WeddingPageShell>
    );
}
