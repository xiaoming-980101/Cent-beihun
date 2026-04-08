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
        bgColor: "bg-primary/10",
        textColor: "text-primary",
    },
    {
        id: "gift-book",
        icon: "icon-[mdi--gift]",
        label: "礼金簿",
        path: "/tools/gift-book",
        bgColor: "bg-primary/10",
        textColor: "text-primary",
    },
    {
        id: "guests",
        icon: "icon-[mdi--account-group]",
        label: "亲友",
        path: "/tools/guests",
        bgColor: "bg-primary/10",
        textColor: "text-primary",
    },
    {
        id: "budget",
        icon: "icon-[mdi--calculator]",
        label: "预算",
        path: "/tools/wedding-budget",
        bgColor: "bg-primary/10",
        textColor: "text-primary",
    },
];

export function QuickEntry() {
    const navigate = useNavigate();

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
            <div className="text-sm text-muted-foreground mb-3">快捷入口</div>
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                {QUICK_ENTRIES.map((entry) => (
                    <button
                        key={entry.id}
                        type="button"
                        className="flex flex-col items-center gap-2 rounded-xl p-4 shadow-sm hover:bg-muted/50 active:bg-muted transition-all hover:scale-[1.02]"
                        onClick={() => navigate(entry.path)}
                    >
                        <div className={`${entry.bgColor} rounded-full p-3`}>
                            <i
                                className={`${entry.icon} text-2xl ${entry.textColor}`}
                            />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                            {entry.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
