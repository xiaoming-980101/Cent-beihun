/**
 * 工具页入口 - 婚礼主题 Bento Grid 设计
 */

import { useNavigate } from "react-router";

const TOOLS = [
    {
        id: "gift-book",
        name: "礼金簿",
        icon: "icon-[mdi--gift]",
        path: "/tools/gift-book",
        description: "记录收礼送礼，统计礼金往来",
        gradient:
            "bg-gradient-to-br from-pink-400 to-purple-500 dark:from-pink-600 dark:to-purple-700",
    },
    {
        id: "guests",
        name: "亲友管理",
        icon: "icon-[mdi--account-group]",
        path: "/tools/guests",
        description: "管理宾客名单，跟踪邀请状态",
        gradient:
            "bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700",
    },
    {
        id: "wedding-budget",
        name: "婚礼预算",
        icon: "icon-[mdi--calculator-variant]",
        path: "/tools/wedding-budget",
        description: "预算管理，定金尾款跟踪",
        gradient:
            "bg-gradient-to-br from-green-400 to-green-500 dark:from-green-600 dark:to-green-700",
    },
];

export default function Tools() {
    const navigate = useNavigate();

    const handleKeyDown = (path: string) => (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(path);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="p-4 border-b border-pink-100/50 dark:border-white/10 bg-card">
                <h1 className="text-lg font-bold text-foreground">工具箱</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-5 pb-20">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Gift Book - spans 2 columns */}
                    {/* biome-ignore lint/a11y/useSemanticElements: Task requires div for Bento Grid design */}
                    <div
                        className="bg-card rounded-xl border border-pink-100/50 dark:border-white/10 shadow-sm p-5 col-span-2 cursor-pointer transition-all hover:shadow-md hover:border-pink-200/60 dark:hover:border-white/20"
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(TOOLS[0].path)}
                        onKeyDown={handleKeyDown(TOOLS[0].path)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 dark:from-pink-600 dark:to-purple-700 flex items-center justify-center">
                                <i
                                    className={`${TOOLS[0].icon} text-2xl text-white`}
                                />
                            </div>
                            <div>
                                <div className="font-bold text-lg text-foreground">
                                    {TOOLS[0].name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {TOOLS[0].description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guests - 1 column */}
                    {/* biome-ignore lint/a11y/useSemanticElements: Task requires div for Bento Grid design */}
                    <div
                        className="bg-card rounded-xl border border-pink-100/50 dark:border-white/10 shadow-sm p-5 cursor-pointer transition-all hover:shadow-md hover:border-pink-200/60 dark:hover:border-white/20"
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(TOOLS[1].path)}
                        onKeyDown={handleKeyDown(TOOLS[1].path)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center">
                                <i
                                    className={`${TOOLS[1].icon} text-xl text-white`}
                                />
                            </div>
                            <div>
                                <div className="font-bold text-foreground">
                                    {TOOLS[1].name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {TOOLS[1].description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget - 1 column */}
                    {/* biome-ignore lint/a11y/useSemanticElements: Task requires div for Bento Grid design */}
                    <div
                        className="bg-card rounded-xl border border-pink-100/50 dark:border-white/10 shadow-sm p-5 cursor-pointer transition-all hover:shadow-md hover:border-pink-200/60 dark:hover:border-white/20"
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(TOOLS[2].path)}
                        onKeyDown={handleKeyDown(TOOLS[2].path)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-500 dark:from-green-600 dark:to-green-700 flex items-center justify-center">
                                <i
                                    className={`${TOOLS[2].icon} text-xl text-white`}
                                />
                            </div>
                            <div>
                                <div className="font-bold text-foreground">
                                    {TOOLS[2].name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {TOOLS[2].description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon - spans 2 columns */}
                    <div className="bg-card rounded-xl border border-pink-100/50 dark:border-white/10 shadow-sm p-5 col-span-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                                <i className="icon-[mdi--clock-outline] text-2xl text-white" />
                            </div>
                            <div>
                                <div className="font-bold text-lg text-foreground">
                                    即将推出
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    更多婚礼筹备工具即将推出...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
