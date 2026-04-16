import type { MouseEventHandler } from "react";
import type { BillCategory } from "@/ledger/type";
import { cn } from "@/utils";
import CategoryIcon from "./icon";

export function CategoryItem({
    category,
    selected,
    onMouseDown,
    onClick,
    className,
}: {
    category: BillCategory;
    selected?: boolean;
    onMouseDown?: MouseEventHandler<HTMLButtonElement>;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    className?: string;
}) {
    // 定义分类颜色映射
    const getCategoryColor = (categoryName: string) => {
        const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
            // 餐饮 - 橙色系
            餐饮: { bg: "bg-orange-100 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", icon: "text-orange-600 dark:text-orange-500" },
            // 交通 - 蓝色系
            交通: { bg: "bg-blue-100 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-400", icon: "text-blue-600 dark:text-blue-500" },
            // 购物 - 紫色系
            购物: { bg: "bg-purple-100 dark:bg-purple-950/30", text: "text-purple-700 dark:text-purple-400", icon: "text-purple-600 dark:text-purple-500" },
            // 居住 - 绿色系
            居住: { bg: "bg-green-100 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", icon: "text-green-600 dark:text-green-500" },
            // 娱乐 - 粉色系
            娱乐: { bg: "bg-pink-100 dark:bg-pink-950/30", text: "text-pink-700 dark:text-pink-400", icon: "text-pink-600 dark:text-pink-500" },
            // 医疗 - 红色系
            医疗: { bg: "bg-red-100 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", icon: "text-red-600 dark:text-red-500" },
            // 教育 - 青色系
            教育: { bg: "bg-cyan-100 dark:bg-cyan-950/30", text: "text-cyan-700 dark:text-cyan-400", icon: "text-cyan-600 dark:text-cyan-500" },
            // 人情 - 玫瑰色系
            人情: { bg: "bg-rose-100 dark:bg-rose-950/30", text: "text-rose-700 dark:text-rose-400", icon: "text-rose-600 dark:text-rose-500" },
            // 其他 - 灰色系
            其他: { bg: "bg-gray-100 dark:bg-gray-950/30", text: "text-gray-700 dark:text-gray-400", icon: "text-gray-600 dark:text-gray-500" },
            // 工资 - 翠绿色系
            工资: { bg: "bg-emerald-100 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", icon: "text-emerald-600 dark:text-emerald-500" },
            // 兼职 - 黄色系
            兼职: { bg: "bg-yellow-100 dark:bg-yellow-950/30", text: "text-yellow-700 dark:text-yellow-400", icon: "text-yellow-600 dark:text-yellow-500" },
            // 理财 - 靛蓝色系
            理财: { bg: "bg-indigo-100 dark:bg-indigo-950/30", text: "text-indigo-700 dark:text-indigo-400", icon: "text-indigo-600 dark:text-indigo-500" },
        };
        
        return colorMap[category.name] || { bg: "bg-slate-100 dark:bg-slate-950/30", text: "text-slate-700 dark:text-slate-400", icon: "text-slate-600 dark:text-slate-500" };
    };

    const colors = getCategoryColor(category.name);

    return (
        <button
            type="button"
            className={cn(
                "flex h-9 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-3 py-1.5 transition-all",
                selected
                    ? "scale-105 border-pink-400 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md dark:from-pink-600 dark:to-purple-600"
                    : `${colors.bg} ${colors.text} border-transparent hover:scale-105 hover:shadow-sm`,
                className,
            )}
            onMouseDown={onMouseDown}
            onClick={onClick}
        >
            <CategoryIcon
                icon={category.icon}
                className={cn(
                    "size-5 flex-shrink-0",
                    selected ? "text-white" : colors.icon
                )}
            />
            <div className="truncate text-sm font-medium">{category.name}</div>
        </button>
    );
}
