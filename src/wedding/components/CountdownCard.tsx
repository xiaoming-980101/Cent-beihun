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
            <div className="bg-card rounded-xl border border-border shadow-sm p-5">
                <div className="text-center text-muted-foreground">
                    请先设置婚礼日期
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
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            {/* 订婚倒计时 */}
            {engagementCountdown && engagementCountdown.days >= 0 && (
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-sm text-muted-foreground font-medium">
                            订婚倒计时
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-primary drop-shadow-sm">
                                {engagementCountdown.days}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                天
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-semibold text-primary/80 drop-shadow-sm">
                                {engagementCountdown.hours}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                时
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-medium text-primary/60 drop-shadow-sm">
                                {engagementCountdown.minutes}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                分
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-medium text-primary/40 drop-shadow-sm">
                                {engagementCountdown.seconds}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                秒
                            </span>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 text-center">
                        {new Date(
                            weddingData.engagementDate,
                        ).toLocaleDateString()}
                    </div>
                </div>
            )}

            {/* 结婚倒计时 */}
            {weddingCountdown && weddingCountdown.days >= 0 && (
                <div className="border-t border-border pt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                            <Heart className="w-4 h-4 text-primary fill-primary" />
                            <Heart className="w-4 h-4 text-primary fill-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">
                            婚礼倒计时
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-primary drop-shadow-sm">
                                {weddingCountdown.days}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                天
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-semibold text-primary/80 drop-shadow-sm">
                                {weddingCountdown.hours}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                时
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-medium text-primary/60 drop-shadow-sm">
                                {weddingCountdown.minutes}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                分
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-medium text-primary/40 drop-shadow-sm">
                                {weddingCountdown.seconds}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                秒
                            </span>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 text-center">
                        {new Date(weddingData.weddingDate).toLocaleDateString()}
                    </div>
                </div>
            )}

            {/* 已过期的提示 */}
            {weddingCountdown && weddingCountdown.days < 0 && (
                <div className="text-center py-3">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-primary fill-primary" />
                        <span className="text-lg text-primary font-medium">
                            新婚快乐！🎉
                        </span>
                        <Heart className="w-5 h-5 text-primary fill-primary" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                        已步入婚姻 {Math.abs(weddingCountdown.days)} 天
                    </div>
                </div>
            )}
        </div>
    );
}
