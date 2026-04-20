import dayjs from "dayjs";

interface CountdownCardsProps {
    engagementDate?: number;
    weddingDate?: number;
    engagementDays: number | null;
    weddingDays: number | null;
    tapProgress: {
        engagement: number;
        wedding: number;
    };
    onCountdownTap: (
        kind: "engagement" | "wedding",
        title: string,
        target?: number,
    ) => void;
    onPreviewEgg: (kind: "engagement" | "wedding", target: number) => void;
}

export function CountdownCards({
    engagementDate,
    weddingDate,
    engagementDays,
    weddingDays,
    tapProgress,
    onCountdownTap,
    onPreviewEgg,
}: CountdownCardsProps) {
    return (
        <div className="grid grid-cols-2 gap-2.5">
            {/* 订婚倒计时 */}
            <div
                role="button"
                tabIndex={0}
                onClick={() =>
                    onCountdownTap("engagement", "订婚彩蛋", engagementDate)
                }
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onCountdownTap(
                            "engagement",
                            "订婚彩蛋",
                            engagementDate,
                        );
                    }
                }}
                className="cursor-pointer rounded-2xl border border-cyan-200/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.32),rgba(34,211,238,0.18))] px-3 py-2.5 text-left backdrop-blur transition-transform hover:-translate-y-0.5 active:translate-y-0 dark:border-cyan-200/45"
            >
                <div className="flex items-center gap-1 text-[10px] text-cyan-700 dark:text-cyan-50/90">
                    <i className="icon-[mdi--ring] size-3.5" />
                    订婚倒计时
                </div>
                <div className="mt-1 flex items-end gap-1">
                    <span className="text-2xl font-black leading-none text-cyan-800 dark:text-cyan-50">
                        {engagementDays ?? "--"}
                    </span>
                    <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-50/80">
                        天
                    </span>
                </div>
                <div className="mt-1 text-[10px] text-cyan-600 dark:text-cyan-50/75">
                    {engagementDate
                        ? dayjs(engagementDate).format("YYYY.MM.DD")
                        : "未设置"}
                </div>
                {engagementDate ? (
                    <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between text-[10px] text-cyan-700 dark:text-cyan-50/90">
                            <span>彩蛋进度 {tapProgress.engagement}/5</span>
                            <button
                                type="button"
                                className="rounded-full border border-cyan-300/60 bg-cyan-500/25 px-2 py-0.5 text-[10px] font-medium text-cyan-800 transition hover:bg-cyan-500/35 dark:border-cyan-100/35 dark:bg-cyan-500/18 dark:text-cyan-50 dark:hover:bg-cyan-500/28"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onPreviewEgg("engagement", engagementDate);
                                }}
                            >
                                预览彩蛋
                            </button>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-cyan-200/50 dark:bg-cyan-900/30">
                            <div
                                className="h-full rounded-full bg-[linear-gradient(90deg,#67e8f9,#22d3ee)] shadow-[0_0_14px_rgba(34,211,238,0.7)] transition-all duration-300"
                                style={{
                                    width: `${(tapProgress.engagement / 5) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ) : null}
            </div>

            {/* 结婚倒计时 */}
            <div
                role="button"
                tabIndex={0}
                onClick={() =>
                    onCountdownTap("wedding", "结婚彩蛋", weddingDate)
                }
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onCountdownTap("wedding", "结婚彩蛋", weddingDate);
                    }
                }}
                className="cursor-pointer rounded-2xl border border-pink-200/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.32),rgba(244,114,182,0.2))] px-3 py-2.5 text-left backdrop-blur transition-transform hover:-translate-y-0.5 active:translate-y-0 dark:border-pink-200/45"
            >
                <div className="flex items-center gap-1 text-[10px] text-pink-700 dark:text-pink-50/90">
                    <i className="icon-[mdi--heart] size-3.5" />
                    结婚倒计时
                </div>
                <div className="mt-1 flex items-end gap-1">
                    <span className="text-2xl font-black leading-none text-pink-800 dark:text-pink-50">
                        {weddingDays ?? "--"}
                    </span>
                    <span className="text-[11px] font-semibold text-pink-700 dark:text-pink-50/80">
                        天
                    </span>
                </div>
                <div className="mt-1 text-[10px] text-pink-600 dark:text-pink-50/75">
                    {weddingDate
                        ? dayjs(weddingDate).format("YYYY.MM.DD")
                        : "未设置"}
                </div>
                {weddingDate ? (
                    <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between text-[10px] text-pink-700 dark:text-pink-50/90">
                            <span>彩蛋进度 {tapProgress.wedding}/5</span>
                            <button
                                type="button"
                                className="rounded-full border border-pink-300/60 bg-pink-500/25 px-2 py-0.5 text-[10px] font-medium text-pink-800 transition hover:bg-pink-500/35 dark:border-pink-100/35 dark:bg-pink-500/18 dark:text-pink-50 dark:hover:bg-pink-500/28"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onPreviewEgg("wedding", weddingDate);
                                }}
                            >
                                预览彩蛋
                            </button>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-pink-200/50 dark:bg-pink-900/30">
                            <div
                                className="h-full rounded-full bg-[linear-gradient(90deg,#f9a8d4,#f472b6)] shadow-[0_0_14px_rgba(244,114,182,0.7)] transition-all duration-300"
                                style={{
                                    width: `${(tapProgress.wedding / 5) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
