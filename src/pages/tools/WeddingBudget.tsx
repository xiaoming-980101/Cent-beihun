/**
 * 婚礼预算页面
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import { useWeddingStore } from "@/store/wedding";
import { BudgetForm } from "@/wedding/components";
import { BUDGET_STATUSES } from "@/wedding/constants";
import { checkBudgetStatus, formatAmount } from "@/wedding/utils";

export default function WeddingBudget() {
    const navigate = useNavigate();
    const { weddingData, addBudget, updateBudget, deleteBudget } =
        useWeddingStore();
    const budgets = weddingData?.weddingBudgets || [];

    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [showForm, setShowForm] = useState(false);
    const [editingBudget, setEditingBudget] = useState<any>(null);

    const filteredBudgets =
        filterStatus === "all"
            ? budgets
            : budgets.filter((b) => b.status === filterStatus);

    // 统计
    const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
    const totalPaid = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalDeposit = budgets.reduce((sum, b) => sum + (b.deposit || 0), 0);
    const remaining = totalBudget - totalPaid;

    return (
        <div className="flex flex-col h-full">
            {/* 顶部返回栏 */}
            <div className="flex items-center p-3 border-b backdrop-blur-lg bg-white/70 dark:bg-stone-900/70">
                <button
                    onClick={() => navigate("/tools")}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                    <i className="icon-[mdi--chevron-left] size-6" />
                    <span className="ml-1">返回</span>
                </button>
                <h1 className="flex-1 text-center font-semibold text-lg pr-16 dark:text-white">
                    婚礼预算
                </h1>
            </div>
            {/* 统计概览 */}
            <div className="p-4 bg-gradient-to-br from-pink-400 to-purple-500 dark:from-pink-600 dark:to-purple-700 rounded-xl shadow-lg mx-4 mt-2">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-2">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <i className="icon-[mdi--wallet-outline] size-4 text-white/80" />
                            <div className="text-sm text-white/90">
                                预算总额
                            </div>
                        </div>
                        <div className="text-xl font-bold text-white">
                            {formatAmount(totalBudget)}
                        </div>
                    </div>
                    <div className="p-2">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <i className="icon-[mdi--check-circle-outline] size-4 text-white/80" />
                            <div className="text-sm text-white/90">已支付</div>
                        </div>
                        <div className="text-xl font-bold text-white">
                            {formatAmount(totalPaid)}
                        </div>
                    </div>
                    <div className="p-2">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <i className="icon-[mdi--cash-multiple] size-4 text-white/80" />
                            <div className="text-sm text-white/90">定金</div>
                        </div>
                        <div className="text-lg font-medium text-white">
                            {formatAmount(totalDeposit)}
                        </div>
                    </div>
                    <div className="p-2">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <i className="icon-[mdi--clock-outline] size-4 text-white/80" />
                            <div className="text-sm text-white/90">
                                待付尾款
                            </div>
                        </div>
                        <div
                            className={`text-lg font-medium text-white ${remaining > 0 ? "" : "text-white/70"}`}
                        >
                            {formatAmount(remaining)}
                        </div>
                    </div>
                </div>
            </div>

            {/* 状态筛选 */}
            <div className="px-4 py-3 flex gap-2 overflow-x-auto">
                {(["all", ...BUDGET_STATUSES.map((s) => s.id)] as const).map(
                    (status) => (
                        <button
                            key={status}
                            className={`px-4 py-1.5 text-sm whitespace-nowrap transition-all ${
                                filterStatus === status
                                    ? "bg-pink-500 dark:bg-pink-600 text-white rounded-full shadow-sm"
                                    : "bg-white/50 dark:bg-stone-800/50 text-gray-600 dark:text-gray-400 rounded-full"
                            }`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status === "all"
                                ? "全部"
                                : BUDGET_STATUSES.find((s) => s.id === status)
                                      ?.name || status}
                        </button>
                    ),
                )}
            </div>

            {/* 预算列表 */}
            <div className="flex-1 overflow-y-auto p-4">
                {filteredBudgets.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        暂无预算记录
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredBudgets.map((budget) => {
                            const statusInfo = BUDGET_STATUSES.find(
                                (s) => s.id === budget.status,
                            );
                            const budgetStatus = checkBudgetStatus(budget);
                            const progress =
                                budget.budget > 0
                                    ? Math.round(
                                          (budget.spent / budget.budget) * 100,
                                      )
                                    : 0;

                            return (
                                <div
                                    key={budget.id}
                                    className="backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 rounded-xl p-3 shadow-sm border border-white/20 dark:border-stone-700/30 active:bg-white/90 dark:active:bg-stone-900/90 cursor-pointer"
                                    onClick={() => {
                                        setEditingBudget(budget);
                                        setShowForm(true);
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-medium dark:text-white">
                                                {budget.category}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {budget.vendor &&
                                                    `${budget.vendor}`}
                                                {budget.vendorPhone &&
                                                    ` · ${budget.vendorPhone}`}
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                statusInfo?.color ||
                                                "bg-gray-100"
                                            }`}
                                        >
                                            {statusInfo?.name || budget.status}
                                        </span>
                                    </div>

                                    {/* 进度条 */}
                                    <div className="mb-2">
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            <span>
                                                已付:{" "}
                                                {formatAmount(budget.spent)}
                                            </span>
                                            <span>
                                                预算:{" "}
                                                {formatAmount(budget.budget)}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all rounded-full ${
                                                    budgetStatus.isOverBudget
                                                        ? "bg-red-500"
                                                        : budgetStatus.remaining <
                                                            budget.budget * 0.1
                                                          ? "bg-orange-500"
                                                          : "bg-green-500"
                                                }`}
                                                style={{
                                                    width: `${Math.min(progress, 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* 定金和尾款 */}
                                    <div className="flex gap-4 text-xs">
                                        {budget.deposit &&
                                            budget.deposit > 0 && (
                                                <span className="text-orange-500 dark:text-orange-400">
                                                    定金:{" "}
                                                    {formatAmount(
                                                        budget.deposit,
                                                    )}
                                                </span>
                                            )}
                                        {budget.balance &&
                                            budget.balance > 0 && (
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    尾款:{" "}
                                                    {formatAmount(
                                                        budget.balance,
                                                    )}
                                                </span>
                                            )}
                                        {budget.dueDate && (
                                            <span className="text-gray-400 dark:text-gray-500">
                                                截止:{" "}
                                                {new Date(
                                                    budget.dueDate,
                                                ).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 添加按钮 */}
            <div className="p-4">
                <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white rounded-xl shadow-lg hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700"
                    onClick={() => {
                        setEditingBudget(null);
                        setShowForm(true);
                    }}
                >
                    <i className="icon-[mdi--plus] mr-2" />
                    添加预算项目
                </Button>
            </div>

            {/* 表单弹窗 */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-black/50" />
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
                        <DialogContent
                            className="pointer-events-auto bg-background w-[90vw] max-w-[500px] rounded-md overflow-y-auto max-h-[80vh]"
                            onInteractOutside={() => setShowForm(false)}
                        >
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold border-b pb-3 mb-4 pt-2 pl-1">
                                    {editingBudget ? "编辑预算" : "添加预算"}
                                </DialogTitle>
                            </DialogHeader>
                            <BudgetForm
                                onClose={() => setShowForm(false)}
                                editBudget={editingBudget}
                            />
                        </DialogContent>
                    </div>
                </DialogPortal>
            </Dialog>
        </div>
    );
}
