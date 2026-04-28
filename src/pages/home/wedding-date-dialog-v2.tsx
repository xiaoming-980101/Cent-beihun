/**
 * 婚期设置弹窗 - 新版本（使用ResponsiveDialog）
 *
 * 迁移说明：
 * 1. FormDialog → ResponsiveDialog
 * 2. 移除内部按钮，使用统一的底部按钮
 * 3. 添加表单验证和loading状态
 * 4. 移动端使用iOS风格Sheet
 */

import * as React from "react";
import { ResponsiveDialog } from "@/components/ui/dialog/index";
import WeddingDatePicker from "@/components/ui/wedding-date-picker";

interface WeddingDateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    partnerName: string;
    weddingDate: number | null;
    onSave: (data: {
        partnerName: string;
        weddingDate: number;
    }) => Promise<void>;
}

export function WeddingDateDialogV2({
    open,
    onOpenChange,
    partnerName,
    weddingDate,
    onSave,
}: WeddingDateDialogProps) {
    const [partnerNameDraft, setPartnerNameDraft] = React.useState(partnerName);
    const [weddingDateDraft, setWeddingDateDraft] = React.useState(weddingDate);
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<{
        partnerName?: string;
        weddingDate?: string;
    }>({});

    // 重置表单数据
    React.useEffect(() => {
        if (open) {
            setPartnerNameDraft(partnerName);
            setWeddingDateDraft(weddingDate);
            setErrors({});
        }
    }, [open, partnerName, weddingDate]);

    // 表单验证
    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!partnerNameDraft.trim()) {
            newErrors.partnerName = "请输入伴侣昵称";
        } else if (partnerNameDraft.trim().length > 10) {
            newErrors.partnerName = "昵称不能超过10个字符";
        }

        if (!weddingDateDraft) {
            newErrors.weddingDate = "请选择婚礼日期";
        } else if (weddingDateDraft < Date.now()) {
            newErrors.weddingDate = "婚礼日期不能是过去的时间";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 处理保存
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await onSave({
                partnerName: partnerNameDraft.trim(),
                weddingDate: weddingDateDraft!,
            });
            onOpenChange(false);
        } catch (error) {
            console.error("保存失败:", error);
            // 这里可以显示错误提示
        } finally {
            setLoading(false);
        }
    };

    // 处理取消
    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title="设置婚礼信息"
            description="完善你们的婚礼信息，让应用更加个性化"
            fullScreenOnMobile={true} // 启用全屏，防止时间选择器被遮挡
            maxWidth="sm"
            actions={{
                cancelText: "取消",
                confirmText: "保存设置",
                onConfirm: handleSave,
                onCancel: handleCancel,
                loading: loading,
            }}
        >
            <div className="p-6 space-y-4">
                {/* 伴侣昵称设置 */}
                <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/12">
                            <i className="icon-[mdi--account-heart] size-4 text-rose-500" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                伴侣昵称
                            </div>
                            <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                用于彩蛋等个性化显示
                            </div>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={partnerNameDraft}
                        onChange={(e) => {
                            setPartnerNameDraft(e.target.value);
                            // 清除错误
                            if (errors.partnerName) {
                                setErrors((prev) => ({
                                    ...prev,
                                    partnerName: undefined,
                                }));
                            }
                        }}
                        placeholder="例如：宝贝、佳佳"
                        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                            errors.partnerName
                                ? "border-red-300 bg-red-50 text-red-700 focus:border-red-400 focus:ring-red-200"
                                : "border-rose-200/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,241,247,0.9))] text-rose-700 focus:border-rose-400 focus:ring-rose-200"
                        } dark:border-rose-800/50 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(244,114,182,0.08))] dark:text-rose-300`}
                    />
                    {errors.partnerName && (
                        <p className="mt-2 text-xs text-red-500">
                            {errors.partnerName}
                        </p>
                    )}
                </div>

                {/* 婚礼日期设置 */}
                <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/12">
                            <i className="icon-[mdi--ring] size-4 text-cyan-500" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                婚礼日期
                            </div>
                            <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                选择你们的大日子
                            </div>
                        </div>
                    </div>

                    <WeddingDatePicker
                        value={weddingDateDraft || undefined}
                        onChange={(date) => {
                            setWeddingDateDraft(date || null);
                            // 清除错误
                            if (errors.weddingDate) {
                                setErrors((prev) => ({
                                    ...prev,
                                    weddingDate: undefined,
                                }));
                            }
                        }}
                    />

                    {errors.weddingDate && (
                        <p className="mt-2 text-xs text-red-500">
                            {errors.weddingDate}
                        </p>
                    )}
                </div>

                {/* 提示信息 */}
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/30">
                    <div className="flex items-start gap-2">
                        <i className="icon-[mdi--information-outline] size-4 text-blue-500 mt-0.5" />
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                            <p className="font-medium mb-1">温馨提示</p>
                            <p>
                                设置后将启用倒计时功能，并在特殊日期显示个性化内容。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ResponsiveDialog>
    );
}

/**
 * 使用示例：
 *
 * ```tsx
 * const [showDatePicker, setShowDatePicker] = useState(false);
 * const [partnerName, setPartnerName] = useState("");
 * const [weddingDate, setWeddingDate] = useState<number | null>(null);
 *
 * const handleSave = async (data: { partnerName: string; weddingDate: number }) => {
 *   // 保存到状态管理或API
 *   setPartnerName(data.partnerName);
 *   setWeddingDate(data.weddingDate);
 * };
 *
 * return (
 *   <>
 *     <button onClick={() => setShowDatePicker(true)}>
 *       设置婚礼信息
 *     </button>
 *
 *     <WeddingDateDialogV2
 *       open={showDatePicker}
 *       onOpenChange={setShowDatePicker}
 *       partnerName={partnerName}
 *       weddingDate={weddingDate}
 *       onSave={handleSave}
 *     />
 *   </>
 * );
 * ```
 *
 * 迁移优势：
 * 1. 移动端使用底部Sheet，更符合移动端习惯
 * 2. 统一的底部按钮布局，操作更直观
 * 3. 表单验证和错误提示，用户体验更好
 * 4. Loading状态，异步操作反馈更及时
 * 5. 流畅的物理动画，视觉效果更优雅
 */
