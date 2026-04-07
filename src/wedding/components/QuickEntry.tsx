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
        bgColor: "bg-pink-100 dark:bg-pink-900/30",
        textColor: "text-pink-500 dark:text-pink-400",
    },
    {
        id: "gift-book",
        icon: "icon-[mdi--gift]",
        label: "礼金簿",
        path: "/tools/gift-book",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        textColor: "text-purple-500 dark:text-purple-400",
    },
    {
        id: "guests",
        icon: "icon-[mdi--account-group]",
        label: "亲友",
        path: "/tools/guests",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-500 dark:text-blue-400",
    },
    {
        id: "budget",
        icon: "icon-[mdi--calculator]",
        label: "预算",
        path: "/tools/wedding-budget",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-500 dark:text-green-400",
    },
];

export function QuickEntry() {
    const navigate = useNavigate();

    return (
        <div className="backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 rounded-xl p-4 shadow-sm border">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                快捷入口
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                {QUICK_ENTRIES.map((entry) => (
                    <button
                        key={entry.id}
                        type="button"
                        className="flex flex-col items-center gap-2 rounded-xl p-4 shadow-sm hover:bg-gray-50 dark:hover:bg-stone-800/50 active:bg-gray-100 dark:active:bg-stone-800 transition-all hover:scale-[1.02]"
                        onClick={() => navigate(entry.path)}
                    >
                        <div className={`${entry.bgColor} rounded-full p-3`}>
                            <i
                                className={`${entry.icon} text-2xl ${entry.textColor}`}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {entry.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
