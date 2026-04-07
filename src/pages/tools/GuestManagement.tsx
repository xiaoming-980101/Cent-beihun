/**
 * 亲友管理页面
 */

import { useWeddingStore } from "@/store/wedding";
import { RELATION_GROUPS, INVITE_STATUS } from "@/wedding/constants";
import { GuestForm } from "@/wedding/components";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogPortal,
    DialogOverlay,
} from "@/components/ui/dialog";

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
        <div className="flex flex-col h-full">
            {/* 顶部返回栏 */}
            <div className="flex items-center p-3 border-b bg-white">
                <button
                    onClick={() => navigate("/tools")}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <i className="icon-[mdi--chevron-left] size-6" />
                    <span className="ml-1">返回</span>
                </button>
                <h1 className="flex-1 text-center font-semibold text-lg pr-16">亲友管理</h1>
            </div>
            {/* 统计概览 */}
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                        总人数: {totalCount} | 已确认: {confirmedCount}
                    </span>
                </div>
            </div>

            {/* 筛选和搜索 */}
            <div className="p-2 border-b space-y-2">
                <input
                    type="text"
                    placeholder="搜索姓名或电话..."
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <div className="flex gap-1 overflow-x-auto">
                    <button
                        className={`px-3 py-1 text-sm rounded-full whitespace-nowrap
              ${filterRelation === "all" ? "bg-pink-500 text-white" : "bg-gray-100"}`}
                        onClick={() => setFilterRelation("all")}
                    >
                        全部
                    </button>
                    {RELATION_GROUPS.map((group) => (
                        <button
                            key={group.id}
                            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap
                ${filterRelation === group.id ? "bg-pink-500 text-white" : "bg-gray-100"}`}
                            onClick={() => setFilterRelation(group.id)}
                        >
                            {group.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* 亲友列表 */}
            <div className="flex-1 overflow-y-auto p-4">
                {filteredGuests.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
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
                                    className="border rounded-lg p-3 bg-white shadow-sm"
                                    onClick={() => {
                                        setEditingGuest(guest);
                                        setShowForm(true);
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium flex items-center gap-2">
                                                {guest.name}
                                                {guest.group && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100">
                                                        {guest.group === "groom"
                                                            ? "男方"
                                                            : "女方"}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
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
            <div className="p-4 border-t">
                <Button
                    className="w-full"
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
