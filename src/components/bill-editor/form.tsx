import * as Switch from "@radix-ui/react-switch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useCategory from "@/hooks/use-category";
import { useCurrency } from "@/hooks/use-currency";
import { useWheelScrollX } from "@/hooks/use-wheel-scroll";
import PopupLayout from "@/layouts/popup-layout";
import { amountToNumber, numberToAmount } from "@/ledger/bill";
import { ExpenseBillCategories, IncomeBillCategories } from "@/ledger/category";
import type { Bill } from "@/ledger/type";
import { categoriesGridClassName } from "@/ledger/utils";
import { useIntl } from "@/locale";
import type { EditBill } from "@/store/ledger";
import { usePreferenceStore } from "@/store/preference";
import { cn } from "@/utils";
import { getPredictNow } from "@/utils/predict";
import { showTagList } from "../bill-tag";
import { showCategoryList } from "../category";
import { CategoryItem } from "../category/item";
import { DatePicker } from "../date-picker";
import Deletable from "../deletable";
import { FORMAT_IMAGE_SUPPORTED, showFilePicker } from "../file-picker";
import SmartImage from "../image";
import IOSUnscrolledInput from "../input";
import Calculator from "../keyboard";
import CurrentLocation from "../simple-location";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { goAddBill } from ".";
import { RemarkHint } from "./remark";
import ResizeHandle from "./resize";
import TagGroupSelector from "./tag-group";

const defaultBill = {
    type: "expense" as Bill["type"],
    comment: "",
    amount: 0,
    categoryId: ExpenseBillCategories[0].id,
};

export default function EditorForm({
    edit,
    onCancel,
    onConfirm,
}: {
    edit?: EditBill;
    onConfirm?: (v: Omit<Bill, "id" | "creatorId">) => void;
    onCancel?: () => void;
}) {
    const t = useIntl();
    const goBack = () => {
        onCancel?.();
    };

    const { baseCurrency, convert, quickCurrencies, allCurrencies } =
        useCurrency();

    const { incomes, expenses, categories: allCategories } = useCategory();

    const isCreate = edit === undefined;

    const predictCategory = useMemo(() => {
        if (!isCreate) {
            return;
        }
        const predict = getPredictNow();
        const pc = predict?.category?.[0];
        if (!pc) {
            return;
        }
        const category = allCategories.find((v) => v.id === pc);
        return category;
    }, [isCreate, allCategories]);

    const predictComments = useMemo(() => {
        if (!isCreate) {
            return;
        }
        const predict = getPredictNow();
        const pc = predict?.comment;
        return pc;
    }, [isCreate]);

    const getMatchDefaultCategory = (categoryId: string) => {
        const category = [...incomes, ...expenses].find(
            (c) => c.id === categoryId,
        );
        if (!category) {
            return categoryId;
        }
        const defaultSub = category.children.find((v) => v.defaultSelect);
        if (!defaultSub) {
            return categoryId;
        }
        return defaultSub.id;
    };
    const [billState, setBillState] = useState(() => {
        const init = {
            ...defaultBill,
            time: Date.now(),
            ...edit,
            categoryId:
                predictCategory?.id ??
                getMatchDefaultCategory(
                    edit?.categoryId ?? defaultBill.categoryId,
                ),
        };
        if (edit?.currency?.target === baseCurrency.id) {
            delete init.currency;
        }
        return init;
    });

    const handleParentCategoryClick = (parentCategoryId: string) => {
        setBillState((prev) => {
            const parentCategory = [...incomes, ...expenses].find(
                (c) => c.id === parentCategoryId,
            );
            const isPrevParentsChild = parentCategory?.children.some(
                (c) => c.id === prev.categoryId,
            );
            if (isPrevParentsChild) {
                return {
                    ...prev,
                    categoryId: parentCategoryId,
                };
            }
            return {
                ...prev,
                categoryId: getMatchDefaultCategory(parentCategoryId),
            };
        });
    };

    const categories = billState.type === "expense" ? expenses : incomes;

    const subCategories = useMemo(() => {
        const selected = categories.find(
            (c) =>
                c.id === billState.categoryId ||
                c.children.some((s) => s.id === billState.categoryId),
        );
        if (selected?.children) {
            return selected.children;
        }
        return categories.find((c) => c.id === selected?.parent)?.children;
    }, [billState.categoryId, categories]);

    const toConfirm = useCallback(() => {
        onConfirm?.({
            ...billState,
        });
    }, [onConfirm, billState]);

    const chooseImage = async () => {
        const [file] = await showFilePicker({ accept: FORMAT_IMAGE_SUPPORTED });
        setBillState((v) => {
            return { ...v, images: [...(v.images ?? []), file] };
        });
    };

    const locationRef = useRef<HTMLButtonElement>(null);
    const isAdd = useRef(!edit);
    useEffect(() => {
        if (
            !isAdd.current ||
            !usePreferenceStore.getState().autoLocateWhenAddBill
        ) {
            return;
        }
        locationRef.current?.click?.();
    }, []);

    const monitorRef = useRef<HTMLButtonElement>(null);
    const [monitorFocused, setMonitorFocused] = useState(false);
    useEffect(() => {
        monitorRef.current?.focus?.();
    }, []);

    useEffect(() => {
        if (monitorFocused) {
            const onPress = (event: KeyboardEvent) => {
                const key = event.key;
                if (key === "Enter") {
                    toConfirm();
                }
            };
            document.addEventListener("keypress", onPress);
            return () => {
                document.removeEventListener("keypress", onPress);
            };
        }
    }, [monitorFocused, toConfirm]);

    const targetCurrency =
        allCurrencies.find(
            (c) => c.id === (billState.currency?.target ?? baseCurrency.id),
        ) ?? baseCurrency;

    const changeCurrency = (newCurrencyId: string) =>
        setBillState((prev) => {
            if (newCurrencyId === baseCurrency.id) {
                return {
                    ...prev,
                    amount: prev.currency?.amount ?? prev.amount,
                    currency: undefined,
                };
            }
            const { predict } = convert(
                amountToNumber(prev.currency?.amount ?? prev.amount),
                newCurrencyId,
                baseCurrency.id,
                prev.time,
            );
            return {
                ...prev,
                amount: numberToAmount(predict),
                currency: {
                    base: baseCurrency.id,
                    target: newCurrencyId,
                    amount: prev.currency?.amount ?? prev.amount,
                },
            };
        });

    const calculatorInitialValue = billState?.currency
        ? amountToNumber(billState.currency.amount)
        : billState?.amount
          ? amountToNumber(billState?.amount)
          : 0;

    const multiplyKey = usePreferenceStore((v) => {
        if (!v.multiplyKey || v.multiplyKey === "off") {
            return undefined;
        }
        if (v.multiplyKey === "double-zero") {
            return "double-zero";
        }
        return "triple-zero";
    });

    const tagSelectorRef = useRef<HTMLDivElement>(null);
    useWheelScrollX(tagSelectorRef);
    
    return (
        <Calculator.Root
            multiplyKey={multiplyKey}
            initialValue={calculatorInitialValue}
            onValueChange={(n) => {
                setBillState((v) => {
                    if (v.currency) {
                        const { predict } = convert(
                            n,
                            v.currency.target,
                            v.currency.base,
                            v.time,
                        );
                        return {
                            ...v,
                            amount: numberToAmount(predict),
                            currency: {
                                ...v.currency,
                                amount: numberToAmount(n),
                            },
                        };
                    }
                    return {
                        ...v,
                        amount: numberToAmount(n),
                    };
                });
            }}
            input={monitorFocused}
        >
            <PopupLayout
                className="flex h-full flex-col overflow-hidden pb-0"
                onBack={goBack}
                hideBack={false}
                dialogMode
            >
                {/* 顶部金额输入区 */}
                <div className="flex-shrink-0 px-4 pt-2 pb-3">
                    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 p-5 shadow-xl dark:from-pink-600 dark:to-purple-700">
                        {/* 收支切换 */}
                        <div className="mb-4 flex justify-center">
                            <Switch.Root
                                className="relative inline-flex h-12 w-[340px] items-center rounded-2xl bg-white/20 p-1 backdrop-blur-sm"
                                checked={billState.type === "income"}
                                onCheckedChange={() => {
                                    setBillState((v) => ({
                                        ...v,
                                        type:
                                            v.type === "expense"
                                                ? "income"
                                                : "expense",
                                        categoryId:
                                            v.type === "expense"
                                                ? IncomeBillCategories[0].id
                                                : ExpenseBillCategories[0].id,
                                    }));
                                }}
                            >
                                <Switch.Thumb className="block h-10 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-red-500 to-orange-500 shadow-lg transition-transform duration-200 ease-out data-[state=checked]:translate-x-[calc(100%+8px)] data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500">
                                    <span className="flex h-full items-center justify-center text-sm font-bold text-white">
                                        {billState.type === "expense"
                                            ? "💸 " + t("expense")
                                            : "💰 " + t("income")}
                                    </span>
                                </Switch.Thumb>
                            </Switch.Root>
                        </div>

                        {/* 金额输入 */}
                        <div className="flex items-center justify-center gap-2">
                            {quickCurrencies.length > 0 && (
                                <Select
                                    value={targetCurrency?.id}
                                    onValueChange={(newCurrencyId) => {
                                        changeCurrency(newCurrencyId);
                                    }}
                                >
                                    <SelectTrigger className="w-fit border-none bg-transparent p-0 shadow-none outline-none ring-none [&_svg]:hidden">
                                        <div className="text-3xl font-bold text-white">
                                            {targetCurrency?.symbol}
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {quickCurrencies.map((currency) => (
                                            <SelectItem
                                                key={currency.id}
                                                value={currency.id}
                                            >
                                                {currency.label} ({currency.symbol})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <button
                                ref={monitorRef}
                                type="button"
                                onFocus={() => setMonitorFocused(true)}
                                onBlur={() => setMonitorFocused(false)}
                                className="flex-1 text-center outline-none"
                            >
                                <Calculator.Value
                                    className={cn(
                                        "text-5xl font-black text-white after:inline-block after:translate-y-[-6px] after:font-thin after:opacity-0 after:content-['|']",
                                        monitorFocused && "after:animate-caret-blink",
                                    )}
                                />
                            </button>
                        </div>

                        {/* 汇率提示 */}
                        {billState.currency && (
                            <div className="mt-3 text-center text-sm text-white/80">
                                ≈ {baseCurrency.symbol} {amountToNumber(billState.amount)} {baseCurrency.label}
                            </div>
                        )}
                        {billState.amount < 0 && (
                            <div className="mt-2 text-center text-xs text-red-200">
                                {t("bill-negative-tip")}
                            </div>
                        )}
                    </div>
                </div>

                {/* 中间内容区 - 可滚动 */}
                <div className="flex-1 overflow-y-auto px-4 pb-2 scrollbar-hidden">
                    {/* 分类选择卡片 */}
                    <div className="mb-3 rounded-2xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                📂 选择分类
                            </h3>
                            <button
                                type="button"
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-purple-600 transition-colors hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30"
                                onClick={() => showCategoryList(billState.type)}
                            >
                                <i className="icon-[mdi--cog-outline] size-3.5" />
                                管理
                            </button>
                        </div>
                        <div className={cn("grid gap-2", categoriesGridClassName(categories))}>
                            {categories.map((item) => (
                                <CategoryItem
                                    key={item.id}
                                    category={item}
                                    selected={billState.categoryId === item.id}
                                    onMouseDown={() => handleParentCategoryClick(item.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 子分类卡片 */}
                    {(subCategories?.length ?? 0) > 0 && (
                        <div className="mb-3 rounded-2xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 shadow-sm">
                            <h3 className="mb-3 text-sm font-semibold text-[color:var(--wedding-text)]">
                                🏷️ 子分类
                            </h3>
                            <div className={cn("grid gap-2", categoriesGridClassName(subCategories))}>
                                {subCategories?.map((subCategory) => (
                                    <CategoryItem
                                        key={subCategory.id}
                                        category={subCategory}
                                        selected={billState.categoryId === subCategory.id}
                                        onMouseDown={() => {
                                            setBillState((v) => ({
                                                ...v,
                                                categoryId: subCategory.id,
                                            }));
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 详细信息卡片 */}
                    <div className="mb-3 rounded-2xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold text-[color:var(--wedding-text)]">
                            📝 详细信息
                        </h3>

                        {/* 备注输入 */}
                        <div className="mb-3">
                            <label className="mb-1.5 block text-xs text-[color:var(--wedding-text-mute)]">
                                备注说明
                            </label>
                            <RemarkHint
                                recommends={predictComments}
                                onSelect={(v) => {
                                    setBillState((prev) => ({
                                        ...prev,
                                        comment: `${prev.comment} ${v}`,
                                    }));
                                }}
                            >
                                <IOSUnscrolledInput
                                    value={billState.comment}
                                    onChange={(e) => {
                                        setBillState((v) => ({
                                            ...v,
                                            comment: e.target.value,
                                        }));
                                    }}
                                    type="text"
                                    className="w-full rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-3 py-2.5 text-sm text-[color:var(--wedding-text)] outline-none placeholder:text-[color:var(--wedding-text-mute)]"
                                    placeholder="添加备注..."
                                    enterKeyHint="done"
                                />
                            </RemarkHint>
                        </div>

                        {/* 时间、位置、图片 */}
                        <div className="flex flex-wrap gap-2">
                            {/* 时间选择 */}
                            <div className="flex items-center gap-2 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-3 py-2">
                                <i className="icon-[mdi--clock-outline] size-4 text-blue-500" />
                                <DatePicker
                                    fixedTime
                                    value={billState.time}
                                    onChange={(time) => {
                                        setBillState((prev) => {
                                            if (!prev.currency) {
                                                return { ...prev, time };
                                            }
                                            const { predict } = convert(
                                                amountToNumber(prev.currency?.amount ?? prev.amount),
                                                prev.currency.target,
                                                baseCurrency.id,
                                                time,
                                            );
                                            return {
                                                ...prev,
                                                time,
                                                amount: numberToAmount(predict),
                                                currency: {
                                                    base: baseCurrency.id,
                                                    target: prev.currency.target,
                                                    amount: prev.currency?.amount ?? prev.amount,
                                                },
                                            };
                                        });
                                    }}
                                />
                            </div>

                            {/* 位置 */}
                            {billState?.location ? (
                                <Deletable
                                    onDelete={() => {
                                        setBillState((prev) => ({
                                            ...prev,
                                            location: undefined,
                                        }));
                                    }}
                                >
                                    <div className="flex items-center gap-2 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-3 py-2">
                                        <i className="icon-[mdi--map-marker] size-4 text-green-500" />
                                        <span className="text-sm text-[color:var(--wedding-text)]">已定位</span>
                                    </div>
                                </Deletable>
                            ) : (
                                <CurrentLocation
                                    ref={locationRef}
                                    className="flex items-center gap-2 rounded-xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-3 py-2 transition-colors hover:bg-[color:var(--wedding-surface)]"
                                    onValueChange={(v) => {
                                        setBillState((prev) => ({ ...prev, location: v }));
                                    }}
                                >
                                    <i className="icon-[mdi--map-marker-plus-outline] size-4 text-green-500" />
                                    <span className="text-sm text-[color:var(--wedding-text)]">添加位置</span>
                                </CurrentLocation>
                            )}

                            {/* 图片 */}
                            {(billState.images?.length ?? 0) > 0 && (
                                <div className="flex gap-2">
                                    {billState.images?.map((img, index) => (
                                        <Deletable
                                            key={index}
                                            onDelete={() => {
                                                setBillState((v) => ({
                                                    ...v,
                                                    images: v.images?.filter((m) => m !== img),
                                                }));
                                            }}
                                        >
                                            <SmartImage
                                                source={img}
                                                alt=""
                                                className="h-12 w-12 rounded-xl border border-[color:var(--wedding-line)] object-cover"
                                            />
                                        </Deletable>
                                    ))}
                                </div>
                            )}
                            {(billState.images?.length ?? 0) < 3 && (
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-xl border border-dashed border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-3 py-2 transition-colors hover:bg-[color:var(--wedding-surface)]"
                                    onClick={chooseImage}
                                >
                                    <i className="icon-[mdi--image-plus-outline] size-4 text-purple-500" />
                                    <span className="text-sm text-[color:var(--wedding-text)]">添加图片</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 标签卡片 */}
                    <div className="mb-3 rounded-2xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                🏷️ 标签
                            </h3>
                            <button
                                type="button"
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-pink-600 transition-colors hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-950/30"
                                onClick={() => showTagList()}
                            >
                                <i className="icon-[mdi--tag-outline] size-3.5" />
                                管理
                            </button>
                        </div>
                        <div ref={tagSelectorRef} className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hidden">
                            <TagGroupSelector
                                isCreate={isCreate}
                                selectedTags={billState.tagIds}
                                onSelectChange={(newTagIds, extra) => {
                                    setBillState((prev) => ({
                                        ...prev,
                                        tagIds: newTagIds,
                                    }));
                                    if (extra?.preferCurrency) {
                                        changeCurrency(extra.preferCurrency);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 底部键盘区 - 固定 */}
                <div
                    className={cn(
                        "keyboard-field relative flex flex-shrink-0 flex-col gap-3 bg-gradient-to-br from-pink-600 to-purple-600 p-3 pb-[max(env(safe-area-inset-bottom),12px)] text-white dark:from-pink-700 dark:to-purple-700 sm:rounded-b-2xl",
                        "h-[calc(360px+120px*(var(--bekh,0.5)-0.5))] min-h-[280px] max-h-[420px]",
                    )}
                >
                    <ResizeHandle />
                    <button
                        type="button"
                        className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 text-lg font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] dark:from-pink-500 dark:to-purple-600"
                        onClick={toConfirm}
                    >
                        <i className="icon-[mdi--check-circle] size-6" />
                        确认记账
                    </button>
                    <Calculator.Keyboard
                        className="flex-1"
                        onKey={(v) => {
                            if (v === "r") {
                                toConfirm();
                                setTimeout(() => {
                                    goAddBill();
                                }, 10);
                            }
                        }}
                    />
                </div>
            </PopupLayout>
        </Calculator.Root>
    );
}
