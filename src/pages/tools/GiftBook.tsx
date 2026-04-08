/**
 * 礼金簿页面
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
import { GiftForm } from "@/wedding/components";
import { GIFT_EVENTS, PAYMENT_METHODS } from "@/wedding/constants";
import { calculateGiftStats, formatAmount } from "@/wedding/utils";

export default function GiftBook() {
    const navigate = useNavigate();
    const { weddingData, addGiftRecord, deleteGiftRecord } = useWeddingStore();
    const records = weddingData?.giftRecords || [];
    const guests = weddingData?.guests || [];

    const [filterType, setFilterType] = useState<"all" | "received" | "sent">(
        "all",
    );
    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState<any>(null);

    const stats = calculateGiftStats(records);
    const filteredRecords =
        filterType === "all"
            ? records
            : records.filter((r) => r.type === filterType);

    return (
        <div className="flex flex-col h-full bg-[#f9f9f9] dark:bg-[#0c0e0e]">
            {/* 顶部返回栏 */}
            <div className="flex items-center p-3 border-b border-[#fdf2f8] dark:border-stone-700 bg-white dark:bg-stone-900">
                <button
                    type="button"
                    onClick={() => navigate("/tools")}
                    className="flex items-center text-[#544249] hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                    <i className="icon-[mdi--chevron-left] size-6" />
                    <span className="ml-1">返回</span>
                </button>
                <h1 className="flex-1 text-center font-semibold text-lg pr-16 text-[#544249] dark:text-white">
                    礼金簿
                </h1>
            </div>
            {/* 统计概览 */}
            <div className="p-4 bg-gradient-to-br from-pink-400 to-purple-500 dark:from-pink-600 dark:to-purple-700 rounded-xl shadow-lg mx-4 mt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-sm text-white/80">收礼总额</div>
                        <div className="text-xl text-white font-bold">
                            {formatAmount(stats.receivedTotal)}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-white/80">送礼总额</div>
                        <div className="text-xl text-white font-bold">
                            {formatAmount(stats.sentTotal)}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-white/80">净收入</div>
                        <div className="text-xl text-white font-bold">
                            {formatAmount(stats.netIncome)}
                        </div>
                    </div>
                </div>
            </div>

            {/* 类型切换 */}
            <div className="p-4">
                <div className="bg-white dark:bg-stone-800 rounded-xl p-1 flex gap-1 border border-[#fdf2f8] dark:border-stone-700">
                    {(["all", "received", "sent"] as const).map((type) => (
                        <button
                            key={type}
                            type="button"
                            className={`flex-1 py-2 text-sm rounded-lg transition-colors
              ${
                  filterType === type
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                      : "text-[#544249] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-700"
              }`}
                            onClick={() => setFilterType(type)}
                        >
                            {type === "all"
                                ? "全部"
                                : type === "received"
                                  ? "收礼"
                                  : "送礼"}
                        </button>
                    ))}
                </div>
            </div>

            {/* 记录列表 */}
            <div className="flex-1 overflow-y-auto p-4">
                {filteredRecords.length === 0 ? (
                    <div className="text-center text-[#6b7280] dark:text-gray-400 py-8 bg-white dark:bg-stone-800 rounded-xl border border-[#fdf2f8] dark:border-stone-700">
                        暂无礼金记录
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredRecords.map((record) => {
                            const guest = record.guestId
                                ? guests.find((g) => g.id === record.guestId)
                                : null;
                            const guestName =
                                guest?.name || record.guestName || "未知";

                            return (
                                <div
                                    key={record.id}
                                    className="bg-white dark:bg-stone-800 rounded-xl p-3 shadow-sm border border-[#fdf2f8] dark:border-stone-700"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium text-[#544249] dark:text-white">
                                                {guestName}
                                            </div>
                                            <div className="text-xs text-[#6b7280] dark:text-gray-400 mt-1">
                                                {new Date(
                                                    record.date,
                                                ).toLocaleDateString()}
                                                {record.method &&
                                                    ` · ${PAYMENT_METHODS.find((m) => m.id === record.method)?.name || ""}`}
                                            </div>
                                        </div>
                                        <div
                                            className={`text-lg font-bold ${record.type === "received" ? "text-green-600" : "text-red-500"}`}
                                        >
                                            {record.type === "received"
                                                ? "+"
                                                : "-"}
                                            {formatAmount(record.amount)}
                                        </div>
                                    </div>
                                    {record.note && (
                                        <div className="text-xs text-[#6b7280] dark:text-gray-500 mt-2">
                                            {record.note}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 添加按钮 */}
            <div className="p-4">
                <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white rounded-xl shadow-lg"
                    onClick={() => {
                        setEditingRecord(null);
                        setShowForm(true);
                    }}
                >
                    <i className="icon-[mdi--plus] mr-2" />
                    添加礼金记录
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
                                    {editingRecord
                                        ? "编辑礼金记录"
                                        : "添加礼金记录"}
                                </DialogTitle>
                            </DialogHeader>
                            <GiftForm
                                onClose={() => setShowForm(false)}
                                editRecord={editingRecord}
                            />
                        </DialogContent>
                    </div>
                </DialogPortal>
            </Dialog>
        </div>
    );
}
