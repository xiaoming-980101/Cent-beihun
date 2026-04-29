import { useEffect, useMemo, useRef, useState } from "react";
import { useSize } from "react-use";
import WordCloud from "wordcloud";
import { useTheme } from "@/lib/theme/use-theme";
import { useIntl } from "@/locale";
import { cn } from "@/utils";
import { processText } from "@/utils/word";
import { MysteryLoading } from "../loading/mystery";

type WordCut = Awaited<ReturnType<typeof processText>>;

const DPR = window.devicePixelRatio || 2;
const CLOUD_COLORS = [
    "#db2777",
    "#7c3aed",
    "#2563eb",
    "#059669",
    "#ea580c",
    "#be123c",
];

function TextCloud({ data, className }: { data: WordCut; className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    const [sized, { width, height }] = useSize(({ width, height }) => (
        <div
            ref={wrapperRef}
            className={cn("relative w-full h-full", className)}
        >
            <canvas
                ref={(el) => {
                    canvasRef.current = el;
                }}
                width={width * DPR}
                height={height * DPR}
                className="w-full h-full"
            />
        </div>
    ));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || width === 0 || height === 0) {
            return;
        }
        const list = data;
        const context = canvas.getContext("2d");
        context?.clearRect(0, 0, canvas.width, canvas.height);
        WordCloud(canvas, {
            list,
            gridSize: Math.round(12 * DPR),
            weightFactor: (size) => {
                const max = list[0][1];
                return Math.max((size / max) * 42, 12) * DPR;
            },
            fontFamily: "sans-serif",
            color: (_word, _weight, fontSize) => {
                const index = Math.floor(fontSize) % CLOUD_COLORS.length;
                return theme === "dark" ? "#f9a8d4" : CLOUD_COLORS[index];
            },
            backgroundColor: "transparent",
            rotateRatio: 0.08,
            shuffle: false,
            wait: 0,
            drawOutOfBound: false,
        });
    }, [data, width, height, theme]);
    return sized;
}

export function AnalysisCloud({ bills }: { bills?: { comment?: string }[] }) {
    const t = useIntl();
    const [wordCut, setWordCut] = useState<WordCut>();
    const textKey = useMemo(
        () =>
            bills
                ?.map((bill) => bill.comment?.trim())
                .filter(Boolean)
                .join("\n") ?? "",
        [bills],
    );

    useEffect(() => {
        const texts = textKey ? textKey.split("\n") : [];
        let alive = true;
        setWordCut(undefined);
        processText(texts).then((result) => {
            if (alive) {
                setWordCut(result);
            }
        });
        return () => {
            alive = false;
        };
    }, [textKey]);

    return (
        <div className="relative flex w-full flex-col">
            {wordCut === undefined ? (
                <MysteryLoading className="h-[220px] w-full rounded-2xl">
                    <div className="text-[white] text-sm">{t("loading")}</div>
                </MysteryLoading>
            ) : wordCut.length === 0 ? (
                <div className="flex h-[220px] items-center justify-center rounded-2xl bg-[color:var(--wedding-surface-muted)] text-center text-sm wedding-muted">
                    {t("no-comment-cloud")}
                </div>
            ) : (
                <div className="h-[220px] w-full overflow-hidden rounded-2xl bg-[color:var(--wedding-surface-muted)]">
                    <TextCloud data={wordCut} className="h-[220px]" />
                </div>
            )}
        </div>
    );
}
