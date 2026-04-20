import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface EasterEggState {
    kind: "engagement" | "wedding";
    title: string;
    target: number;
}

/**
 * 彩蛋管理 Hook
 * 负责管理订婚和结婚彩蛋的显示状态和进度
 */
export function useEasterEgg(engagementDate?: number, weddingDate?: number) {
    const [eggOpen, setEggOpen] = useState<EasterEggState | null>(null);
    const [tapProgress, setTapProgress] = useState({
        engagement: 0,
        wedding: 0,
    });
    const [finalCountdownSeconds, setFinalCountdownSeconds] = useState<
        number | null
    >(null);

    // 自动打开彩蛋（当天）
    useEffect(() => {
        const tryAutoOpenEgg = (
            kind: "engagement" | "wedding",
            title: string,
            target?: number,
        ) => {
            if (!target || !dayjs(target).isSame(dayjs(), "day")) {
                return;
            }
            const key = `wedding-egg-auto-${kind}-${dayjs().format("YYYY-MM-DD")}`;
            if (localStorage.getItem(key) === "1") {
                return;
            }
            localStorage.setItem(key, "1");
            setEggOpen({ kind, title, target });
        };

        tryAutoOpenEgg("engagement", "订婚彩蛋", engagementDate);
        tryAutoOpenEgg("wedding", "结婚彩蛋", weddingDate);
    }, [engagementDate, weddingDate]);

    // 最终倒计时（彩蛋打开时）
    useEffect(() => {
        if (!eggOpen) {
            setFinalCountdownSeconds(null);
            return;
        }
        if (!dayjs(eggOpen.target).isSame(dayjs(), "day")) {
            setFinalCountdownSeconds(null);
            return;
        }

        setFinalCountdownSeconds(10);
        const timer = window.setInterval(() => {
            setFinalCountdownSeconds((prev) => {
                if (prev === null) {
                    return null;
                }
                if (prev <= 1) {
                    window.clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [eggOpen]);

    // 点击倒计时卡片触发彩蛋
    const onCountdownTap = (
        kind: "engagement" | "wedding",
        title: string,
        target?: number,
    ) => {
        if (!target) {
            return;
        }
        setTapProgress((prev) => {
            const next = prev[kind] + 1;
            if (next >= 5) {
                setEggOpen({ kind, title, target });
                return { ...prev, [kind]: 0 };
            }
            return { ...prev, [kind]: next };
        });
    };

    return {
        eggOpen,
        setEggOpen,
        tapProgress,
        finalCountdownSeconds,
        onCountdownTap,
    };
}
