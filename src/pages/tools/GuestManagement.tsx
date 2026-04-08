/**
 * 亲友管理页面
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
import { GuestForm } from "@/wedding/components";
import { INVITE_STATUS, RELATION_GROUPS } from "@/wedding/constants";

export default function GuestManagement() {
    const navigate = useNavigate();
    const { weddingData, addGuest, updateGuest, deleteGuest } =
        useWeddingStore();
    const guests = weddingData?.guests || [];

    const [filterRelation, setFilterRelation] = useState<string>("all");
    const [searchText, setSearchText] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingGuest, setEditingGuest] = useState<any>(null);

    const filteredGuests = guests.filter((guest) => {
        if (filterRelation !== "all" && guest.relation !== filterRelation)
            return false;
        if (
            searchText &&
            !guest.name.includes(searchText) &&
            !guest.phone?.includes(searchText)
        )
            return false;
        return true;
    });

    // 统计
    const totalCount = guests.length;
    const confirmedCount = guests.filter(
        (g) => g.inviteStatus === "confirmed",
    ).length;

    return (
        <div className="flex flex-col h-full bg-background">
            {/* 顶部返回栏 */}
            <div className="flex items-center p-3 border-b border-pink-100/50 dark:border-white/10 bg-card">
                <button
                    onClick={() => navigate("/tools")}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                    <i className="icon-[mdi--chevron-left] size-6" />
                    <span className="ml-1">返回</span>
                </button>
                <h1 className="flex-1 text-center font-semibold text-lg pr-16 text-[#544249] dark:text-white">
                    亲友管理
                </h1>
            </div>
            {/* 统计概览 */}
            <div className="p-4 bg-gradient-to-br from-pink-400 to-purple-500 dark:from-pink-600 dark:to-purple-700 rounded-xl shadow-lg mx-4 mt-2">
                <div className="flex justify-around items-center">
                    <div className="text-center">
                        <i className="icon-[mdi--account-group] size-6 text-white/80 mb-1" />
                        <div className="text-white/80 text-xs">总人数</div>
                        <div className="text-white font-bold text-xl">
                            {totalCount}
                        </div>
                    </div>
                    <div className="text-center">
                        <i className="icon-[mdi--check-circle] size-6 text-white/80 mb-1" />
                        <div className="text-white/80 text-xs">已确认</div>
                        <div className="text-white font-bold text-xl">
                            {confirmedCount}
                        </div>
                    </div>
                </div>
            </div>

            {/* 筛选和搜索 */}
            <div className="px-4 py-3 flex gap-2 overflow-x-auto">
                <input
                    type="text"
                    placeholder="搜索姓名或电话..."
                    className="flex-1 min-w-0 bg-white dark:bg-stone-900/70 rounded-full px-4 py-2 text-sm border border-pink-100/50 dark:border-stone-700/30 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
                <button
                    className={`px-4 py-1.5 text-sm whitespace-nowrap transition-all ${
                        filterRelation === "all"
                            ? "bg-pink-500 dark:bg-pink-600 text-white rounded-full shadow-sm"
                            : "bg-white/50 dark:bg-stone-800/50 text-gray-600 dark:text-gray-400 rounded-full"
                    }`}
                    onClick={() => setFilterRelation("all")}
                >
                    全部
                </button>
                {RELATION_GROUPS.map((group) => (
                    <button
                        key={group.id}
                        className={`px-4 py-1.5 text-sm whitespace-nowrap transition-all ${
                            filterRelation === group.id
                                ? "bg-pink-500 dark:bg-pink-600 text-white rounded-full shadow-sm"
                                : "bg-white/50 dark:bg-stone-800/50 text-gray-600 dark:text-gray-400 rounded-full"
                        }`}
                        onClick={() => setFilterRelation(group.id)}
                    >
                        {group.name}
                    </button>
                ))}
            </div>

            {/* 亲友列表 */}
            <div className="flex-1 overflow-y-auto p-4">
                {filteredGuests.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        暂无亲友记录
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredGuests.map((guest) => {
                            const statusInfo = INVITE_STATUS.find(
                                (s) => s.id === guest.inviteStatus,
                            );
                            const relationInfo = RELATION_GROUPS.find(
                                (r) => r.id === guest.relation,
                            );

                            return (
                                <div
                                    key={guest.id}
                                    className="bg-white dark:bg-stone-900/70 rounded-xl p-3 shadow-sm border border-pink-100/50 dark:border-stone-700/30 active:bg-gray-50 dark:active:bg-stone-800/70 cursor-pointer"
                                    onClick={() => {
                                        setEditingGuest(guest);
                                        setShowForm(true);
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium flex items-center gap-2 text-[#544249] dark:text-white">
                                                {guest.name}
                                                {guest.group && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300">
                                                        {guest.group === "groom"
                                                            ? "男方"
                                                            : "女方"}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {relationInfo?.name ||
                                                    guest.relation}
                                                {guest.phone &&
                                                    ` · ${guest.phone}`}
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${statusInfo?.color || ""} bg-opacity-20`}
                                            style={{
                                                backgroundColor:
                                                    statusInfo?.color
                                                        ? `${statusInfo.color}20`
                                                        : undefined,
                                            }}
                                        >
                                            {statusInfo?.name ||
                                                guest.inviteStatus}
                                        </span>
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
                        setEditingGuest(null);
                        setShowForm(true);
                    }}
                >
                    <i className="icon-[mdi--plus] mr-2" />
                    添加亲友
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
                                    {editingGuest ? "编辑亲友" : "添加亲友"}
                                </DialogTitle>
                            </DialogHeader>
                            <GuestForm
                                onClose={() => setShowForm(false)}
                                editGuest={editingGuest}
                            />
                        </DialogContent>
                    </div>
                </DialogPortal>
            </Dialog>
        </div>
    );
}
