/**
 * 倒计时卡片组件
 */

import { Heart } from "lucide-react";
import { useWeddingStore } from "@/store/wedding";
import { calculateCountdown } from "@/wedding/utils";

export function CountdownCard() {
    const { weddingData } = useWeddingStore();

    if (!weddingData) {
        return (
            <div className="wedding-surface-card wedding-section-enter p-5">
                <div className="text-center wedding-muted">
                    请先设置订婚或婚礼日期
                </div>
            </div>
        );
    }

    const engagementCountdown = weddingData.engagementDate
        ? calculateCountdown(weddingData.engagementDate)
        : null;
    const weddingCountdown = weddingData.weddingDate
        ? calculateCountdown(weddingData.weddingDate)
        : null;

    return (
        <div className="wedding-surface-card wedding-card-interactive wedding-section-enter overflow-hidden p-5">
            {/* 订婚倒计时 */}
            {engagementCountdown && engagementCountdown.days >= 0 && (
                <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 fill-[color:var(--wedding-accent)] text-[color:var(--wedding-accent)]" />
                        <span className="text-sm font-medium wedding-muted">
                            订婚倒计时
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-[color:var(--wedding-accent)] drop-shadow-sm">
                                {engagementCountdown.days}
                            </span>
                            <span className="mt-1 text-xs wedding-muted">
                                天
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-semibold text-[color:var(--wedding-accent)]/80 drop-shadow-sm">
                                {engagementCountdown.hours}
                            </span>
                            <span className="mt-1 text-xs wedding-muted">
                                时
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-medium text-[color:var(--wedding-accent)]/60 drop-shadow-sm">
                                {engagementCountdown.minutes}
                            </span>
                            <span className="mt-1 text-xs wedding-muted">
                                分
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-medium text-[color:var(--wedding-accent)]/40 drop-shadow-sm">
                                {engagementCountdown.seconds}
                            </span>
                            <span className="mt-1 text-xs wedding-muted">
                                秒
                            </span>
                        </div>
                    </div>
                    <div className="mt-2 text-center text-xs wedding-muted">
                        {new Date(
                            weddingData.engagementDate,
                        ).toLocaleDateString()}
                    </div>
                </div>
            )}

            {/* 结婚倒计时 */}
            {weddingCountdown && weddingCountdown.days >= 0 && (
                <div className="border-t border-[color:var(--wedding-line)] pt-4">
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex gap-1">
                            <Heart className="h-4 w-4 fill-[color:var(--wedding-accent)] text-[color:var(--wedding-accent)]" />
                            <Heart className="h-4 w-4 fill-[color:var(--wedding-accent)] text-[color:var(--wedding-accent)]" />
                        </div>
                        <span className="text-sm font-medium wedding-muted">
                            婚礼倒计时
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-[color:var(--wedding-accent)] drop-shadow-sm">
                                {weddingCountdown.days}
                            </span>
                            <span className="mt-1 text-xs wedding-muted">
                                天
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-semibold text-[color:var(--wedding-accent)]/80 drop-shadow-sm">
                                {weddingCountdown.hours}
                            </span>
                            <span className="mt-1 text-xs wedding-muted">
                                时
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-medium text-[color:var(--wedding-accent)]/60 drop-shadow-sm">
                                {weddingCountdown.minutes}
                            </span>
                            <span className="mt-1 text-xs wedding-muted">
                                分
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-medium text-[color:var(--wedding-accent)]/40 drop-shadow-sm">
                                {weddingCountdown.seconds}
                            </span>
                            <span className="mt-1 text-xs wedding-muted">
                                秒
                            </span>
                        </div>
                    </div>
                    <div className="mt-2 text-center text-xs wedding-muted">
                        {new Date(weddingData.weddingDate).toLocaleDateString()}
                    </div>
                </div>
            )}

            {/* 已过期的提示 */}
            {weddingCountdown && weddingCountdown.days < 0 && (
                <div className="py-3 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                        <Heart className="h-5 w-5 fill-[color:var(--wedding-accent)] text-[color:var(--wedding-accent)]" />
                        <span className="text-lg font-medium text-[color:var(--wedding-accent)]">
                            新婚快乐！🎉
                        </span>
                        <Heart className="h-5 w-5 fill-[color:var(--wedding-accent)] text-[color:var(--wedding-accent)]" />
                    </div>
                    <div className="text-xs wedding-muted">
                        已步入婚姻 {Math.abs(weddingCountdown.days)} 天
                    </div>
                </div>
            )}
        </div>
    );
}
