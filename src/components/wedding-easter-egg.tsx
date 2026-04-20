import dayjs from "dayjs";
import { useMemo } from "react";
import { calculateCountdown } from "@/wedding/utils";

type WeddingEasterEggProps = {
    kind: "engagement" | "wedding";
    title: string;
    target: number;
    partnerName?: string;
    nowTick: number;
    finalCountdownSeconds: number | null;
    onClose: () => void;
};

// 情话库
const LOVE_QUOTES = {
    engagement: [
        "从今天起，我们的故事正式开始，{name}，余生请多指教",
        "订婚这一天，是我们爱情的里程碑，{name}，谢谢你愿意陪我走下去",
        "今天我们许下承诺，{name}，未来的每一天都想和你一起度过",
        "订婚快乐！{name}，你是我最美好的决定",
        "从相识到相知，再到今天的订婚，{name}，感谢命运让我遇见你",
    ],
    wedding: [
        "今天，我娶你/嫁你，{name}，从此我们就是一家人了",
        "婚礼这一天，{name}，我想对全世界宣布：我爱你",
        "执子之手，与子偕老，{name}，这是我对你最郑重的承诺",
        "今天是我们人生中最重要的一天，{name}，让我们一起创造美好的未来",
        "婚礼快乐！{name}，余生有你，便是晴天",
        "从今天起，{name}就是我的家人，我会用一生去爱你、守护你",
    ],
};

export default function WeddingEasterEgg({
    kind,
    title,
    target,
    partnerName = "宝贝",
    nowTick,
    finalCountdownSeconds,
    onClose,
}: WeddingEasterEggProps) {
    const loveQuote = useMemo(() => {
        const quotes = LOVE_QUOTES[kind];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        return quote.replace("{name}", partnerName);
    }, [kind, partnerName]);

    const formatPreciseCountdown = (targetTime: number, tick: number) => {
        void tick;
        const countdown = calculateCountdown(targetTime);
        const dd = Math.abs(countdown.days);
        const hh = String(countdown.hours).padStart(2, "0");
        const mm = String(countdown.minutes).padStart(2, "0");
        const ss = String(countdown.seconds).padStart(2, "0");
        return countdown.days < 0
            ? `已过去 ${dd}天 ${hh}:${mm}:${ss}`
            : `剩余 ${dd}天 ${hh}:${mm}:${ss}`;
    };

    // 根据类型选择不同的主题色和图标
    const theme =
        kind === "engagement"
            ? {
                  gradient: "from-cyan-400 via-blue-400 to-purple-400",
                  bgGradient:
                      "bg-[linear-gradient(160deg,#e0f7ff,#e6f3ff,#f0e6ff)]",
                  darkBgGradient:
                      "dark:bg-[linear-gradient(160deg,rgba(34,56,84,0.98),rgba(33,35,67,0.96))]",
                  icon: "icon-[mdi--ring]",
                  iconColor: "text-cyan-400",
                  accentColor: "cyan",
                  particle: "star",
              }
            : {
                  gradient: "from-pink-400 via-rose-400 to-red-400",
                  bgGradient:
                      "bg-[linear-gradient(160deg,#fff7fc,#ffedf8,#ffe6f0)]",
                  darkBgGradient:
                      "dark:bg-[linear-gradient(160deg,rgba(56,35,64,0.98),rgba(53,25,47,0.96))]",
                  icon: "icon-[mdi--heart]",
                  iconColor: "text-pink-400",
                  accentColor: "pink",
                  particle: "heart",
              };

    // 生成粒子效果
    const particles = useMemo(() => {
        return Array.from({ length: 25 }, (_, index) => ({
            id: index,
            left: `${5 + ((index * 13) % 90)}%`,
            delay: `${(index % 8) * 0.4}s`,
            duration: `${3.2 + (index % 5) * 0.6}s`,
            scale: 0.8 + (index % 4) * 0.25,
            opacity: 0.3 + (index % 7) * 0.08,
        }));
    }, []);

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-6 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                className={`relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/40 ${theme.bgGradient} ${theme.darkBgGradient} px-7 py-8 shadow-2xl`}
                onClick={(event) => event.stopPropagation()}
            >
                {/* 背景光效 */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.8),transparent_50%),radial-gradient(circle_at_75%_85%,rgba(255,255,255,0.4),transparent_45%)] animate-eggGlow" />

                {/* 星星/月亮/太阳特效 */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {/* 大型装饰元素 */}
                    {kind === "engagement" ? (
                        <>
                            {/* 月亮 */}
                            <div className="absolute right-8 top-8 h-16 w-16 animate-eggFloat">
                                <div className="relative h-full w-full">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 opacity-90 blur-sm" />
                                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200" />
                                    <div className="absolute right-2 top-3 h-3 w-3 rounded-full bg-yellow-300/40" />
                                    <div className="absolute right-4 top-6 h-2 w-2 rounded-full bg-yellow-300/30" />
                                </div>
                            </div>
                            {/* 星星 */}
                            {particles.slice(0, 15).map((particle) => (
                                <span
                                    key={`star-${particle.id}`}
                                    className="absolute text-yellow-300"
                                    style={{
                                        left: particle.left,
                                        top: `${10 + (particle.id % 7) * 12}%`,
                                        opacity: particle.opacity,
                                        transform: `scale(${particle.scale})`,
                                        animation: `eggTwinkle ${particle.duration} ease-in-out ${particle.delay} infinite`,
                                    }}
                                >
                                    <i className="icon-[mdi--star] size-3" />
                                </span>
                            ))}
                        </>
                    ) : (
                        <>
                            {/* 太阳 */}
                            <div className="absolute left-8 top-8 h-20 w-20 animate-eggRotate">
                                <div className="relative h-full w-full">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300 to-red-400 opacity-80 blur-md" />
                                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300" />
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute left-1/2 top-1/2 h-1 w-6 origin-left bg-gradient-to-r from-yellow-300 to-transparent"
                                            style={{
                                                transform: `rotate(${i * 30}deg) translateX(-50%)`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* 爱心粒子 */}
                            {particles.map((particle) => (
                                <span
                                    key={`heart-${particle.id}`}
                                    className={`absolute ${theme.iconColor}`}
                                    style={{
                                        left: particle.left,
                                        bottom: `${-5 + (particle.id % 3) * 2}%`,
                                        opacity: particle.opacity,
                                        transform: `scale(${particle.scale})`,
                                        animation: `eggRise ${particle.duration} ease-in-out ${particle.delay} infinite`,
                                    }}
                                >
                                    <i className="icon-[mdi--heart] size-4" />
                                </span>
                            ))}
                        </>
                    )}
                </div>

                {/* 最后倒计时 */}
                {finalCountdownSeconds !== null && (
                    <div className="relative z-10 mb-5 rounded-[24px] border border-white/60 bg-white/90 p-6 text-center shadow-lg dark:border-white/20 dark:bg-white/10">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            最后一天 · 10秒全屏倒计时
                        </div>
                        <div
                            className={`mt-3 bg-gradient-to-r ${theme.gradient} bg-clip-text text-7xl font-black leading-none tracking-tight text-transparent animate-pulse`}
                        >
                            {finalCountdownSeconds}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {finalCountdownSeconds > 0
                                ? "准备迎接最重要的时刻 ✨"
                                : "彩蛋已点亮，幸福准时抵达 🎉"}
                        </div>
                    </div>
                )}

                {/* 主要内容 */}
                <div className="relative z-10 text-center">
                    <div
                        className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} shadow-[0_0_0_12px_rgba(255,255,255,0.3)] animate-eggPulse`}
                    >
                        <i
                            className={`${theme.icon} size-10 text-white animate-eggBeat`}
                        />
                    </div>

                    <h3 className="text-2xl font-black text-gray-800 dark:text-white">
                        {title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {dayjs(target).isSame(dayjs(), "day")
                            ? "今天就是特别的一天 🎊"
                            : "你触发了隐藏彩蛋 🎁"}
                    </p>

                    {/* 情话卡片 */}
                    <div className="mt-5 rounded-[20px] border border-white/60 bg-white/85 p-5 shadow-md dark:border-white/20 dark:bg-white/10">
                        <div className="mb-2 flex items-center justify-center gap-1.5">
                            <i className="icon-[mdi--heart-outline] size-4 text-rose-400" />
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                给你的情话
                            </span>
                            <i className="icon-[mdi--heart-outline] size-4 text-rose-400" />
                        </div>
                        <p className="text-base font-medium leading-relaxed text-gray-700 dark:text-gray-200">
                            {loveQuote}
                        </p>
                    </div>

                    {/* 精确倒计时 */}
                    <div className="mt-4 rounded-[20px] border border-white/60 bg-white/85 px-5 py-4 shadow-md dark:border-white/20 dark:bg-white/10">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            精确倒计时
                        </div>
                        <div
                            className={`mt-2 bg-gradient-to-r ${theme.gradient} bg-clip-text text-2xl font-black tracking-tight text-transparent`}
                        >
                            {formatPreciseCountdown(target, nowTick)}
                        </div>
                    </div>

                    <button
                        type="button"
                        className={`mt-6 rounded-full bg-gradient-to-r ${theme.gradient} px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.4)] transition hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)] active:scale-95`}
                        onClick={onClose}
                    >
                        <i className="icon-[mdi--gift] mr-1.5 inline-block size-4" />
                        收下这份彩蛋
                    </button>
                </div>
            </div>

            <style>
                {`
                @keyframes eggFloat {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(5deg); }
                }
                @keyframes eggRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes eggRise {
                    0% { transform: translateY(0) translateX(0) scale(0.8); opacity: 0; }
                    20% { opacity: 0.9; }
                    60% { transform: translateY(-80%) translateX(10px) scale(1); opacity: 0.7; }
                    100% { transform: translateY(-150%) translateX(-8px) scale(1.2); opacity: 0; }
                }
                @keyframes eggTwinkle {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes eggPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3), 0 0 32px rgba(255,255,255,0.4); }
                    50% { box-shadow: 0 0 0 12px rgba(255,255,255,0.1), 0 0 48px rgba(255,255,255,0.6); }
                }
                @keyframes eggBeat {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.1); }
                    50% { transform: scale(0.95); }
                    75% { transform: scale(1.12); }
                }
                @keyframes eggGlow {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }
                `}
            </style>
        </div>
    );
}
