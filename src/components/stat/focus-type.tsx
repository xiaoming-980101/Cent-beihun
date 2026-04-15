import { useIntl } from "@/locale";
import { cn } from "@/utils";
import Money from "../money";

export const FocusTypes = ["income", "expense", "balance"] as const;
export type FocusType = (typeof FocusTypes)[number];

export function FocusTypeSelector({
    value: focusType,
    onValueChange: setFocusType,
    money,
}: {
    value: FocusType;
    onValueChange: (v: FocusType) => void;
    money: number[];
}) {
    const t = useIntl();
    const btnClass =
        "min-w-[92px] flex items-center justify-center rounded-[16px] px-3 py-2.5 cursor-pointer transition-all duration-200";
    return (
        <div className="flex items-center gap-2 rounded-[22px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-2 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]">
            <button
                type="button"
                className={cn(
                    btnClass,
                    focusType === "income" &&
                        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
                )}
                onClick={() => {
                    setFocusType("income");
                }}
            >
                <div className="flex flex-col items-center justify-center">
                    <span className="text-semantic-income font-semibold">
                        +<Money value={money[0]} />
                    </span>
                    <div className="text-[10px] opacity-60"> {t("income")}</div>
                </div>
            </button>
            <button
                type="button"
                className={cn(
                    btnClass,
                    focusType === "expense" &&
                        "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
                )}
                onClick={() => setFocusType("expense")}
            >
                <div className="flex flex-col items-center justify-center">
                    <span className="text-semantic-expense font-semibold">
                        -<Money value={money[1]} />
                    </span>
                    <div className="text-[10px] opacity-60">{t("expense")}</div>
                </div>
            </button>
            <button
                type="button"
                className={cn(
                    btnClass,
                    focusType === "balance" &&
                        "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
                )}
                onClick={() => setFocusType("balance")}
            >
                <div className="flex flex-col items-center justify-center">
                    <span>
                        <Money value={money[2]} />
                    </span>
                    <div className="text-[10px] opacity-60">{t("Balance")}</div>
                </div>
            </button>
        </div>
    );
}
