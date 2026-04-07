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
            <div className="bg-gradient-to-br from-pink-100 via-purple-50 to-purple-100 dark:from-pink-900/30 dark:via-purple-900/20 dark:to-purple-900/30 rounded-xl p-5 shadow-lg">
                <div className="text-center text-gray-500 dark:text-gray-400">
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
        <div className="bg-gradient-to-br from-pink-100 via-purple-50 to-purple-100 dark:from-pink-900/30 dark:via-purple-900/20 dark:to-purple-900/30 rounded-xl p-5 shadow-lg">
            {/* 订婚倒计时 */}
            {engagementCountdown && engagementCountdown.days >= 0 && (
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-pink-400 dark:text-pink-300 fill-pink-400 dark:fill-pink-300" />
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            订婚倒计时
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-pink-500 dark:text-pink-400 drop-shadow-sm">
                                {engagementCountdown.days}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                天
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-semibold text-pink-400 dark:text-pink-300 drop-shadow-sm">
                                {engagementCountdown.hours}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                时
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-medium text-pink-300 dark:text-pink-200 drop-shadow-sm">
                                {engagementCountdown.minutes}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                分
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-medium text-pink-200 dark:text-pink-100 drop-shadow-sm">
                                {engagementCountdown.seconds}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                秒
                            </span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                        {new Date(
                            weddingData.engagementDate,
                        ).toLocaleDateString()}
                    </div>
                </div>
            )}

            {/* 结婚倒计时 */}
            {weddingCountdown && weddingCountdown.days >= 0 && (
                <div className="border-t border-pink-200 dark:border-pink-800/50 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                            <Heart className="w-4 h-4 text-purple-400 dark:text-purple-300 fill-purple-400 dark:fill-purple-300" />
                            <Heart className="w-4 h-4 text-purple-500 dark:text-purple-400 fill-purple-500 dark:fill-purple-400" />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            婚礼倒计时
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-purple-500 dark:text-purple-400 drop-shadow-sm">
                                {weddingCountdown.days}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                天
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-semibold text-purple-400 dark:text-purple-300 drop-shadow-sm">
                                {weddingCountdown.hours}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                时
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-medium text-purple-300 dark:text-purple-200 drop-shadow-sm">
                                {weddingCountdown.minutes}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                分
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-medium text-purple-200 dark:text-purple-100 drop-shadow-sm">
                                {weddingCountdown.seconds}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                秒
                            </span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                        {new Date(weddingData.weddingDate).toLocaleDateString()}
                    </div>
                </div>
            )}

            {/* 已过期的提示 */}
            {weddingCountdown && weddingCountdown.days < 0 && (
                <div className="text-center py-3">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-purple-400 dark:text-purple-300 fill-purple-400 dark:fill-purple-300" />
                        <span className="text-lg text-purple-500 dark:text-purple-400 font-medium">
                            新婚快乐！🎉
                        </span>
                        <Heart className="w-5 h-5 text-purple-400 dark:text-purple-300 fill-purple-400 dark:fill-purple-300" />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        已步入婚姻 {Math.abs(weddingCountdown.days)} 天
                    </div>
                </div>
            )}
        </div>
    );
}
