import { useMemo } from "react";

interface PaginationIndicatorProps {
    count: number;
    current: number;
    className?: string;
}

export const PaginationIndicator: React.FC<PaginationIndicatorProps> = ({
    count,
    current,
    className = "",
}) => {
    const indicatorKeys = useMemo(
        () => Array.from({ length: count }, (_, idx) => `indicator-${idx}`),
        [count],
    );

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            {indicatorKeys.map((key, i) => (
                <div
                    key={key}
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${
                        i === current
                            ? "bg-stone-800 scale-110"
                            : "bg-gray-300 opacity-70 hover:opacity-100"
                    }`}
                />
            ))}
        </div>
    );
};
