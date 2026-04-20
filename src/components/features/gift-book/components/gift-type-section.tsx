/**
 * 礼金类型选择区块组件
 * 从 GiftFormDialog 中提取的 UI 组件
 */

interface GiftTypeSectionProps {
    value: "received" | "sent";
    onChange: (value: "received" | "sent") => void;
}

export function GiftTypeSection({ value, onChange }: GiftTypeSectionProps) {
    return (
        <div className="wedding-soft-card space-y-5 p-4">
            <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                    往来类型
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { key: "received", label: "收礼" },
                        { key: "sent", label: "送礼" },
                    ].map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className={`rounded-[18px] border px-3 py-3 text-sm font-medium transition ${
                                value === item.key
                                    ? "border-transparent bg-pink-500 text-white shadow-sm"
                                    : "border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] text-[color:var(--wedding-text-soft)]"
                            }`}
                            onClick={() =>
                                onChange(item.key as "received" | "sent")
                            }
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
