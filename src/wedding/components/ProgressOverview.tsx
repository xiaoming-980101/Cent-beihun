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
        <div className="wedding-surface-card wedding-card-interactive wedding-section-enter p-4">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm wedding-muted">筹备进度</span>
                <span className="text-sm font-medium text-[color:var(--wedding-text)]">
                    {progress.percentage}%
                </span>
            </div>

            {/* 进度条 */}
            <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-[color:var(--wedding-surface-muted)]">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-500 to-violet-500 transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                />
            </div>

            {/* 统计数字 */}
            <div className="grid grid-cols-3 gap-2 text-xs">
                <span>
                    <span className="wedding-muted">已完成 </span>
                    <span className="font-medium text-[color:var(--wedding-success)]">
                        {progress.completed}
                    </span>
                </span>
                <span>
                    <span className="wedding-muted">进行中 </span>
                    <span className="font-medium text-[color:var(--wedding-info)]">
                        {progress.inProgress}
                    </span>
                </span>
                <span>
                    <span className="wedding-muted">待开始 </span>
                    <span className="font-medium text-[color:var(--wedding-text-soft)]">
                        {progress.pending}
                    </span>
                </span>
            </div>
        </div>
    );
}
