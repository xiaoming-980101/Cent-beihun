/**
 * 弹窗组件演示页面
 * 用于测试和展示新的响应式弹窗系统
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobileSheet, ResponsiveDialog } from "./index";

export function DialogDemo() {
    const [showFullscreen, setShowFullscreen] = React.useState(false);
    const [showHalfscreen, setShowHalfscreen] = React.useState(false);
    const [showForm, setShowForm] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleSave = async () => {
        setLoading(true);
        // 模拟异步操作
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        setShowForm(false);
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">弹窗组件演示</h1>

            <div className="grid gap-4 md:grid-cols-3">
                {/* 全屏弹窗 */}
                <Button onClick={() => setShowFullscreen(true)}>
                    全屏弹窗演示
                </Button>

                {/* 半屏弹窗 */}
                <Button onClick={() => setShowHalfscreen(true)}>
                    半屏弹窗演示
                </Button>

                {/* 表单弹窗 */}
                <Button onClick={() => setShowForm(true)}>表单弹窗演示</Button>
            </div>

            {/* 全屏弹窗 */}
            <ResponsiveDialog
                open={showFullscreen}
                onOpenChange={setShowFullscreen}
                title="全屏弹窗"
                description="这是一个全屏弹窗演示，在移动端从底部滑入，支持手势关闭"
                fullScreenOnMobile={true}
                maxWidth="lg"
                actions={{
                    cancelText: "取消",
                    confirmText: "确认",
                    onConfirm: () => {
                        console.log("全屏弹窗确认");
                        setShowFullscreen(false);
                    },
                }}
            >
                <div className="p-6 space-y-4">
                    <p>这是全屏弹窗的内容区域。</p>
                    <p>在移动端，你可以：</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                        <li>向下拖拽顶部的拖拽条来关闭弹窗</li>
                        <li>点击右上角的关闭按钮</li>
                        <li>点击底部的取消按钮</li>
                        <li>点击背景遮罩区域</li>
                    </ul>

                    {/* 模拟长内容 */}
                    {Array.from({ length: 20 }, (_, i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold">内容块 {i + 1}</h3>
                            <p className="text-sm text-gray-600">
                                这是一些示例内容，用于测试滚动效果。内容区域可以正常滚动，
                                而底部的按钮始终固定在底部。
                            </p>
                        </div>
                    ))}
                </div>
            </ResponsiveDialog>

            {/* 半屏弹窗 */}
            <ResponsiveDialog
                open={showHalfscreen}
                onOpenChange={setShowHalfscreen}
                title="半屏弹窗"
                description="这是一个半屏弹窗，适合简单的确认操作"
                fullScreenOnMobile={false}
                actions={{
                    cancelText: "取消",
                    confirmText: "确认",
                    confirmVariant: "destructive",
                    onConfirm: () => {
                        console.log("半屏弹窗确认");
                        setShowHalfscreen(false);
                    },
                }}
            >
                <div className="p-6">
                    <p>确定要删除这个项目吗？</p>
                    <p className="text-sm text-gray-600 mt-2">
                        此操作无法撤销，请谨慎操作。
                    </p>
                </div>
            </ResponsiveDialog>

            {/* 表单弹窗 */}
            <ResponsiveDialog
                open={showForm}
                onOpenChange={setShowForm}
                title="编辑信息"
                description="请填写以下信息"
                fullScreenOnMobile={true}
                actions={{
                    cancelText: "取消",
                    confirmText: "保存",
                    onConfirm: handleSave,
                    loading: loading,
                }}
            >
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">姓名</Label>
                        <Input id="name" placeholder="请输入姓名" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">邮箱</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="请输入邮箱"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">电话</Label>
                        <Input id="phone" placeholder="请输入电话号码" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">地址</Label>
                        <Input id="address" placeholder="请输入地址" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">备注</Label>
                        <textarea
                            id="note"
                            className="w-full p-3 border rounded-lg resize-none"
                            rows={4}
                            placeholder="请输入备注信息..."
                        />
                    </div>
                </div>
            </ResponsiveDialog>
        </div>
    );
}
