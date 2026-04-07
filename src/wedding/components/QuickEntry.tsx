/**
 * 快捷入口组件
 */

import { useNavigate } from "react-router";

const QUICK_ENTRIES = [
    {
        id: "tasks",
        icon: "icon-[mdi--format-list-bulleted]",
        label: "任务",
        path: "/tasks",
        color: "text-pink-500",
    },
    {
        id: "gift-book",
        icon: "icon-[mdi--gift]",
        label: "礼金簿",
        path: "/tools/gift-book",
        color: "text-purple-500",
    },
    {
        id: "guests",
        icon: "icon-[mdi--account-group]",
        label: "亲友",
        path: "/tools/guests",
        color: "text-blue-500",
    },
    {
        id: "budget",
        icon: "icon-[mdi--calculator]",
        label: "预算",
        path: "/tools/wedding-budget",
        color: "text-green-500",
    },
];

export function QuickEntry() {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-sm text-gray-600 mb-3">快捷入口</div>
            <div className="grid grid-cols-4 gap-2">
                {QUICK_ENTRIES.map((entry) => (
                    <button
                        key={entry.id}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        onClick={() => navigate(entry.path)}
                    >
                        <i
                            className={`${entry.icon} text-2xl ${entry.color}`}
                        />
                        <span className="text-xs text-gray-600">
                            {entry.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
