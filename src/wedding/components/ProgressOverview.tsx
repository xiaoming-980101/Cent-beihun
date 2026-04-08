/**
 * 进度概览组件
 */

import { useWeddingStore } from "@/store/wedding";
import { calculateTaskProgress } from "@/wedding/utils";

export function ProgressOverview() {
    const { weddingData } = useWeddingStore();
    const tasks = weddingData?.tasks || [];

    const progress = calculateTaskProgress(tasks);

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">筹备进度</span>
                <span className="text-sm font-medium text-foreground">
                    {progress.percentage}%
                </span>
            </div>

            {/* 进度条 */}
            <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden mb-3">
                <div
                    className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500 rounded-full"
                    style={{ width: `${progress.percentage}%` }}
                />
            </div>

            {/* 统计数字 */}
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                    已完成{" "}
                    <span className="text-green-500 font-medium">
                        {progress.completed}
                    </span>
                </span>
                <span>
                    进行中{" "}
                    <span className="text-blue-500 font-medium">
                        {progress.inProgress}
                    </span>
                </span>
                <span>
                    待开始{" "}
                    <span className="text-muted-foreground/60 font-medium">
                        {progress.pending}
                    </span>
                </span>
            </div>
        </div>
    );
}
