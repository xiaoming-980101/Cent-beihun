/**
 * 工具页入口
 */

import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const TOOLS = [
    {
        id: "gift-book",
        name: "礼金簿",
        icon: "icon-[mdi--gift]",
        path: "/tools/gift-book",
        description: "记录收礼送礼，统计礼金往来",
        iconColor: "text-purple-500",
    },
    {
        id: "guests",
        name: "亲友管理",
        icon: "icon-[mdi--account-group]",
        path: "/tools/guests",
        description: "管理宾客名单，跟踪邀请状态",
        iconColor: "text-blue-500",
    },
    {
        id: "wedding-budget",
        name: "婚礼预算",
        icon: "icon-[mdi--calculator-variant]",
        path: "/tools/wedding-budget",
        description: "预算管理，定金尾款跟踪",
        iconColor: "text-green-500",
    },
];

export default function Tools() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <h1 className="text-lg font-semibold">工具箱</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-20">
                <div className="grid gap-3">
                    {TOOLS.map((tool) => (
                        <Button
                            key={tool.id}
                            variant="outline"
                            className="h-auto py-4 px-4 justify-start"
                            onClick={() => navigate(tool.path)}
                        >
                            <div className="flex items-center gap-3">
                                <i
                                    className={`${tool.icon} text-2xl ${tool.iconColor}`}
                                />
                                <div className="text-left">
                                    <div className="font-medium">
                                        {tool.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {tool.description}
                                    </div>
                                </div>
                            </div>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
