/**
 * 倒计时卡片组件
 */

import { useWeddingStore } from "@/store/wedding";
import { calculateCountdown } from "@/wedding/utils";

export function CountdownCard() {
    const { weddingData } = useWeddingStore();

    if (!weddingData) {
        return (
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 shadow-sm">
                <div className="text-center text-gray-500">
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
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 shadow-sm">
            {/* 订婚倒计时 */}
            {engagementCountdown && engagementCountdown.days >= 0 && (
                <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">订婚倒计时</div>
                    <div className="flex items-center gap-1">
                        <span className="text-3xl font-bold text-pink-500">
                            {engagementCountdown.days}
                        </span>
                        <span className="text-sm text-gray-500">天</span>
                        <span className="text-xl font-semibold text-pink-400">
                            {engagementCountdown.hours}
                        </span>
                        <span className="text-xs text-gray-500">时</span>
                        <span className="text-lg font-medium text-pink-300">
                            {engagementCountdown.minutes}
                        </span>
                        <span className="text-xs text-gray-500">分</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        {new Date(
                            weddingData.engagementDate,
                        ).toLocaleDateString()}
                    </div>
                </div>
            )}

            {/* 结婚倒计时 */}
            {weddingCountdown && weddingCountdown.days >= 0 && (
                <div className="border-t border-pink-200 pt-3">
                    <div className="text-sm text-gray-600 mb-1">婚礼倒计时</div>
                    <div className="flex items-center gap-1">
                        <span className="text-3xl font-bold text-purple-500">
                            {weddingCountdown.days}
                        </span>
                        <span className="text-sm text-gray-500">天</span>
                        <span className="text-xl font-semibold text-purple-400">
                            {weddingCountdown.hours}
                        </span>
                        <span className="text-xs text-gray-500">时</span>
                        <span className="text-lg font-medium text-purple-300">
                            {weddingCountdown.minutes}
                        </span>
                        <span className="text-xs text-gray-500">分</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        {new Date(weddingData.weddingDate).toLocaleDateString()}
                    </div>
                </div>
            )}

            {/* 已过期的提示 */}
            {weddingCountdown && weddingCountdown.days < 0 && (
                <div className="text-center py-2">
                    <div className="text-lg text-purple-500">新婚快乐！🎉</div>
                    <div className="text-xs text-gray-500 mt-1">
                        已步入婚姻 {Math.abs(weddingCountdown.days)} 天
                    </div>
                </div>
            )}
        </div>
    );
}
