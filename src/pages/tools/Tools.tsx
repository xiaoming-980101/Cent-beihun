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
        <div className="flex flex-col h-full">
            <div className="p-4 border-b backdrop-blur-lg bg-white/70 dark:bg-stone-900/70">
                <h1 className="text-lg font-semibold">工具箱</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Gift Book - spans 2 columns */}
                    {/* biome-ignore lint/a11y/useSemanticElements: Task requires div for Bento Grid design */}
                    <div
                        className={`${TOOLS[0].gradient} rounded-xl shadow-lg p-4 col-span-2 text-white cursor-pointer transition-transform hover:scale-[1.02]`}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(TOOLS[0].path)}
                        onKeyDown={handleKeyDown(TOOLS[0].path)}
                    >
                        <div className="flex items-center gap-3">
                            <i className={`${TOOLS[0].icon} text-3xl`} />
                            <div>
                                <div className="font-medium text-lg">
                                    {TOOLS[0].name}
                                </div>
                                <div className="text-sm opacity-90">
                                    {TOOLS[0].description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guests - 1 column */}
                    {/* biome-ignore lint/a11y/useSemanticElements: Task requires div for Bento Grid design */}
                    <div
                        className={`${TOOLS[1].gradient} rounded-xl shadow-lg p-4 text-white cursor-pointer transition-transform hover:scale-[1.02]`}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(TOOLS[1].path)}
                        onKeyDown={handleKeyDown(TOOLS[1].path)}
                    >
                        <div className="flex items-center gap-3">
                            <i className={`${TOOLS[1].icon} text-2xl`} />
                            <div>
                                <div className="font-medium">
                                    {TOOLS[1].name}
                                </div>
                                <div className="text-xs opacity-90">
                                    {TOOLS[1].description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget - 1 column */}
                    {/* biome-ignore lint/a11y/useSemanticElements: Task requires div for Bento Grid design */}
                    <div
                        className={`${TOOLS[2].gradient} rounded-xl shadow-lg p-4 text-white cursor-pointer transition-transform hover:scale-[1.02]`}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(TOOLS[2].path)}
                        onKeyDown={handleKeyDown(TOOLS[2].path)}
                    >
                        <div className="flex items-center gap-3">
                            <i className={`${TOOLS[2].icon} text-2xl`} />
                            <div>
                                <div className="font-medium">
                                    {TOOLS[2].name}
                                </div>
                                <div className="text-xs opacity-90">
                                    {TOOLS[2].description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon - spans 2 columns */}
                    <div className="bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-xl shadow-lg p-4 col-span-2 text-white">
                        <div className="flex items-center gap-3">
                            <i className="icon-[mdi--clock-outline] text-3xl" />
                            <div>
                                <div className="font-medium text-lg">
                                    即将推出
                                </div>
                                <div className="text-sm opacity-90">
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
