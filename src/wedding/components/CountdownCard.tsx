/**
 * 倒计时卡片组件
 */

import dayjs from "dayjs";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useWeddingStore } from "@/store/wedding";
import { calculateCountdown } from "@/wedding/utils";

type CountdownKind = "engagement" | "wedding";

function formatPreciseCountdown(target: number) {
    const countdown = calculateCountdown(target);
    const absDays = Math.abs(countdown.days);
    const hh = String(countdown.hours).padStart(2, "0");
    const mm = String(countdown.minutes).padStart(2, "0");
    const ss = String(countdown.seconds).padStart(2, "0");
    const text = `${absDays}天 ${hh}:${mm}:${ss}`;
    return {
        isPast: countdown.days < 0,
        text: countdown.days < 0 ? `已过去 ${text}` : `剩余 ${text}`,
    };
}

export function CountdownCard() {
    const { weddingData } = useWeddingStore();
    const [nowTick, setNowTick] = useState(Date.now());
    const [tapCount, setTapCount] = useState<Record<CountdownKind, number>>({
        engagement: 0,
        wedding: 0,
    });
    const [eggOpen, setEggOpen] = useState<{
        kind: CountdownKind;
        title: string;
        target: number;
    } | null>(null);

    if (!weddingData) {
        return (
            <div className="wedding-surface-card wedding-section-enter p-5">
                <div className="text-center wedding-muted">
                    请先设置订婚或婚礼日期
                </div>
            </div>
        );
    }

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNowTick(Date.now());
        }, 1000);
        return () => {
            window.clearInterval(timer);
        };
    }, []);

    const engagementCountdown = weddingData.engagementDate
        ? calculateCountdown(weddingData.engagementDate)
        : null;
    const weddingCountdown = weddingData.weddingDate
        ? calculateCountdown(weddingData.weddingDate)
        : null;
    const heartParticles = useMemo(() => {
        return Array.from({ length: 16 }, (_, index) => ({
            id: index,
            left: `${8 + ((index * 13) % 84)}%`,
            delay: `${(index % 7) * 0.38}s`,
            duration: `${3.4 + (index % 4) * 0.6}s`,
            scale: 0.9 + (index % 3) * 0.18,
            opacity: 0.28 + (index % 5) * 0.12,
        }));
    }, []);

    useEffect(() => {
        const openIfToday = (
            kind: CountdownKind,
            title: string,
            target?: number,
        ) => {
            if (!target) return;
            const isToday = dayjs(target).isSame(dayjs(), "day");
            if (!isToday) return;
            const key = `wedding-egg-auto-${kind}-${dayjs().format("YYYY-MM-DD")}`;
            if (localStorage.getItem(key) === "1") return;
            localStorage.setItem(key, "1");
            setEggOpen({ kind, title, target });
        };
        openIfToday("engagement", "订婚彩蛋", weddingData.engagementDate);
        openIfToday("wedding", "结婚彩蛋", weddingData.weddingDate);
    }, [weddingData.engagementDate, weddingData.weddingDate]);

    const openEggByTap = (
        kind: CountdownKind,
        title: string,
        target: number,
    ) => {
        setTapCount((prev) => {
            const next = (prev[kind] ?? 0) + 1;
            if (next >= 5) {
                setEggOpen({ kind, title, target });
                return { ...prev, [kind]: 0 };
            }
            return { ...prev, [kind]: next };
        });
    };

    const renderCountdown = (
        kind: CountdownKind,
        title: string,
        target?: number,
        countdown?: ReturnType<typeof calculateCountdown> | null,
    ) => {
        if (!target || !countdown) {
            return null;
        }

        const isPast = countdown.days < 0;
        const days = Math.abs(countdown.days);

        return (
            <button
                type="button"
                onClick={() => openEggByTap(kind, `${title}彩蛋`, target)}
                className="w-full rounded-[22px] border border-[color:var(--wedding-line)] bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(255,244,250,0.88))] p-4 text-left shadow-[0_16px_34px_-26px_rgba(236,72,153,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-24px_rgba(236,72,153,0.45)] dark:bg-[linear-gradient(160deg,rgba(39,26,47,0.9),rgba(30,23,41,0.86))]"
            >
                <div className="mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4 fill-[color:var(--wedding-accent)] text-[color:var(--wedding-accent)]" />
                    <span className="text-sm font-medium text-[color:var(--wedding-text)]">
                        {title}
                    </span>
                    <span className="ml-auto text-[10px] text-[color:var(--wedding-text-mute)]">
                        连点 5 次有彩蛋
                    </span>
                </div>
                {isPast ? (
                    <div className="rounded-2xl bg-white/85 px-4 py-3 text-sm text-[color:var(--wedding-text-soft)] dark:bg-white/8">
                        已过去{" "}
                        <span className="mx-1 text-3xl font-black tracking-tight text-[color:var(--wedding-accent)]">
                            {days}
                        </span>
                        天
                    </div>
                ) : (
                    <div className="rounded-2xl bg-white/85 px-4 py-4 dark:bg-white/8">
                        <div className="text-[11px] text-[color:var(--wedding-text-mute)]">
                            剩余天数
                        </div>
                        <div className="mt-1 flex items-end gap-2">
                            <span className="text-5xl font-black leading-none tracking-[-0.03em] text-[color:var(--wedding-accent)]">
                                {days}
                            </span>
                            <span className="pb-1 text-sm font-semibold text-[color:var(--wedding-text-soft)]">
                                天
                            </span>
                        </div>
                    </div>
                )}
                <div className="mt-2 text-xs text-[color:var(--wedding-text-mute)]">
                    目标日期：{dayjs(target).format("YYYY-MM-DD")}
                </div>
            </button>
        );
    };

    return (
        <div
            className="wedding-surface-card wedding-card-interactive wedding-section-enter overflow-hidden p-5"
            data-now={nowTick}
        >
            <div className="space-y-3">
                {renderCountdown(
                    "engagement",
                    "订婚倒计时",
                    weddingData.engagementDate,
                    engagementCountdown,
                )}
                {renderCountdown(
                    "wedding",
                    "婚礼倒计时",
                    weddingData.weddingDate,
                    weddingCountdown,
                )}
                {!weddingData.engagementDate && !weddingData.weddingDate && (
                    <div className="rounded-[18px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-soft)] px-4 py-5 text-center text-sm wedding-muted">
                        还没有设置日期，先在右上角设置婚期吧。
                    </div>
                )}
            </div>
            {eggOpen && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-6 backdrop-blur-sm"
                    onClick={() => setEggOpen(null)}
                >
                    <div
                        className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/30 bg-[linear-gradient(160deg,#fff6fb,#ffeef7)] px-6 py-7 shadow-2xl dark:bg-[linear-gradient(160deg,rgba(56,35,64,0.98),rgba(33,25,47,0.96))]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="pointer-events-none absolute inset-0">
                            {heartParticles.map((particle) => (
                                <span
                                    key={particle.id}
                                    className="absolute top-[105%] block text-pink-400"
                                    style={{
                                        left: particle.left,
                                        opacity: particle.opacity,
                                        transform: `scale(${particle.scale})`,
                                        animation: `weddingEggFloat ${particle.duration} ease-in-out ${particle.delay} infinite`,
                                    }}
                                >
                                    <Heart className="h-4 w-4 fill-current" />
                                </span>
                            ))}
                        </div>

                        <div className="relative z-10 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/12 text-pink-500">
                                <Heart className="h-7 w-7 fill-current animate-pulse" />
                            </div>
                            <h3 className="text-xl font-bold text-[color:var(--wedding-text)]">
                                {eggOpen.title}
                            </h3>
                            <p className="mt-2 text-sm text-[color:var(--wedding-text-soft)]">
                                {dayjs(eggOpen.target).isSame(dayjs(), "day")
                                    ? "今天就是重要的日子，祝你们幸福满满。"
                                    : "你发现了隐藏彩蛋，送你一份甜甜的仪式感。"}
                            </p>
                            <div className="mt-5 rounded-2xl border border-pink-200/60 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-white/8">
                                <div className="text-[11px] text-[color:var(--wedding-text-mute)]">
                                    精确倒计时
                                </div>
                                <div className="mt-2 text-2xl font-black tracking-tight text-pink-500">
                                    {
                                        formatPreciseCountdown(eggOpen.target)
                                            .text
                                    }
                                </div>
                            </div>
                            <button
                                type="button"
                                className="mt-5 rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_22px_-14px_rgba(236,72,153,0.75)]"
                                onClick={() => setEggOpen(null)}
                            >
                                收下这份彩蛋
                            </button>
                        </div>
                    </div>
                    <style>
                        {`@keyframes weddingEggFloat {
                            0% { transform: translateY(0) scale(0.85); opacity: 0; }
                            20% { opacity: 0.85; }
                            100% { transform: translateY(-128%) scale(1.1); opacity: 0; }
                        }`}
                    </style>
                </div>
            )}
        </div>
    );
}
