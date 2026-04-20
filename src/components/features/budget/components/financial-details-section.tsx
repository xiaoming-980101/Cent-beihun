/**
 * 预算财务详情区块组件
 * 从 BudgetFormDialog 中提取的 UI 组件
 */

import { useId } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BUDGET_STATUSES } from "@/wedding/constants";
import type { BudgetStatus } from "@/wedding/type";

interface FinancialDetailsSectionProps {
    spent: string;
    status: BudgetStatus;
    deposit: string;
    balance: string;
    onSpentChange: (spent: string) => void;
    onStatusChange: (status: BudgetStatus) => void;
    onDepositChange: (deposit: string) => void;
    onBalanceChange: (balance: string) => void;
}

export function FinancialDetailsSection({
    spent,
    status,
    deposit,
    balance,
    onSpentChange,
    onStatusChange,
    onDepositChange,
    onBalanceChange,
}: FinancialDetailsSectionProps) {
    const spentInputId = useId();
    const statusSelectId = useId();
    const depositInputId = useId();
    const balanceInputId = useId();

    return (
        <div className="wedding-soft-card space-y-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor={spentInputId}
                        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                    >
                        已花费
                    </label>
                    <Input
                        id={spentInputId}
                        type="number"
                        className="wedding-input"
                        placeholder="已花费金额"
                        value={spent}
                        onChange={(e) => onSpentChange(e.target.value)}
                    />
                </div>
                <div>
                    <label
                        htmlFor={statusSelectId}
                        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                    >
                        状态
                    </label>
                    <Select
                        value={status}
                        onValueChange={(value) =>
                            onStatusChange(value as BudgetStatus)
                        }
                    >
                        <SelectTrigger
                            id={statusSelectId}
                            className="wedding-input"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {BUDGET_STATUSES.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor={depositInputId}
                        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                    >
                        定金
                    </label>
                    <Input
                        id={depositInputId}
                        type="number"
                        className="wedding-input"
                        placeholder="定金金额"
                        value={deposit}
                        onChange={(e) => onDepositChange(e.target.value)}
                    />
                </div>
                <div>
                    <label
                        htmlFor={balanceInputId}
                        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                    >
                        尾款
                    </label>
                    <Input
                        id={balanceInputId}
                        type="number"
                        className="wedding-input"
                        placeholder="待付尾款"
                        value={balance}
                        onChange={(e) => onBalanceChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
