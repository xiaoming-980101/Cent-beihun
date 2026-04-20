import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { calculateCountdown } from "@/wedding/utils";

/**
 * 婚礼倒计时 Hook
 * 负责管理订婚和结婚倒计时的状态和计算
 */
export function useWeddingCountdown(
    engagementDate?: number,
    weddingDate?: number,
) {
    const [nowTick, setNowTick] = useState(Date.now());

    // 每秒更新时间
    useEffect(() => {
        const timer = window.setInterval(() => {
            setNowTick(Date.now());
        }, 1000);
        return () => {
            window.clearInterval(timer);
        };
    }, []);

    // 订婚倒计时天数
    const engagementDays = useMemo(() => {
        if (!engagementDate) return null;
        return Math.abs(
            dayjs(engagementDate)
                .startOf("day")
                .diff(dayjs().startOf("day"), "day"),
        );
    }, [engagementDate]);

    // 结婚倒计时天数
    const weddingDays = useMemo(() => {
        if (!weddingDate) return null;
        return Math.abs(
            dayjs(weddingDate)
                .startOf("day")
                .diff(dayjs().startOf("day"), "day"),
        );
    }, [weddingDate]);

    // 格式化精确倒计时
    const formatPreciseCountdown = (target: number) => {
        const countdown = calculateCountdown(target);
        const dd = Math.abs(countdown.days);
        const hh = String(countdown.hours).padStart(2, "0");
        const mm = String(countdown.minutes).padStart(2, "0");
        const ss = String(countdown.seconds).padStart(2, "0");
        return countdown.days < 0
            ? `已过去 ${dd}天 ${hh}:${mm}:${ss}`
            : `剩余 ${dd}天 ${hh}:${mm}:${ss}`;
    };

    return {
        nowTick,
        engagementDays,
        weddingDays,
        formatPreciseCountdown,
    };
}
