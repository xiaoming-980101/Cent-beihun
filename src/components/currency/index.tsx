import { useIntl } from "@/locale";
import { Button } from "../ui/button";
import { CurrencyListProvider, showCurrencyList } from "./list-form";

export { CurrencyListProvider, showCurrencyList };

export default function CurrencySettingsItem() {
    const t = useIntl();
    return (
        <div className="backup">
            <Button
                onClick={() => {
                    showCurrencyList();
                }}
                variant="ghost"
                className="h-auto w-full rounded-none px-1 py-1"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div className="flex items-center gap-3">
                        <div className="wedding-settings-item__icon bg-emerald-50 text-emerald-500 dark:bg-emerald-500/12">
                            <i className="icon-[mdi--currency-eur] size-5"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                {t("currency-manager")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                管理币种、汇率与显示货币
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </Button>
        </div>
    );
}
