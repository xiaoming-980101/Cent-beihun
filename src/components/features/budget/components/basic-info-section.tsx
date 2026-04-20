/**
 * 预算基本信息区块组件
 * 从 BudgetFormDialog 中提取的 UI 组件
 */

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { formatAmount } from "@/wedding/utils";

interface BasicInfoSectionProps {
    category: string;
    budget: string;
    onCategoryChange: (category: string) => void;
    onBudgetChange: (budget: string) => void;
}

export function BasicInfoSection({
    category,
    budget,
    onCategoryChange,
    onBudgetChange,
}: BasicInfoSectionProps) {
    const categoryInputId = useId();
    const totalInputId = useId();

    return (
        <div className="wedding-soft-card space-y-5 p-4">
            <div>
                <label
                    htmlFor={categoryInputId}
                    className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                >
                    分类名称
                </label>
                <Input
                    id={categoryInputId}
                    type="text"
                    className="wedding-input"
                    placeholder="如：婚纱摄影、婚宴场地"
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                />
            </div>

            <div>
                <label
                    htmlFor={totalInputId}
                    className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                >
                    预算金额
                </label>
                <Input
                    id={totalInputId}
                    type="number"
                    className="wedding-input"
                    placeholder="请输入预算金额"
                    value={budget}
                    onChange={(e) => onBudgetChange(e.target.value)}
                />
                {budget ? (
                    <div className="mt-2 text-xs wedding-muted">
                        预算总额：{formatAmount(parseFloat(budget))}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
