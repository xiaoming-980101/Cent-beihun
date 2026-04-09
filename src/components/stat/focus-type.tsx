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
        "min-w-[92px] flex items-center justify-center rounded-[14px] px-3 py-2 cursor-pointer transition-all duration-200";
    return (
        <div className="wedding-surface-card flex items-center gap-2 p-2">
            <button
                type="button"
                className={cn(
                    btnClass,
                    focusType === "income" &&
                        "bg-[color:var(--wedding-surface-muted)] text-[color:var(--wedding-text)]",
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
                        "bg-[color:var(--wedding-surface-muted)] text-[color:var(--wedding-text)]",
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
                        "bg-[color:var(--wedding-surface-muted)] text-[color:var(--wedding-text)]",
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
