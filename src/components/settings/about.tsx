import PopupLayout from "@/layouts/popup-layout";
import { useIntl } from "@/locale";

import createConfirmProvider from "../confirm";
import { Button } from "../ui/button";
import Version from "./version";

function Form({ onCancel }: { onCancel?: () => void }) {
    const t = useIntl();

    return (
        <PopupLayout
            title={t("about-cent")}
            onBack={onCancel}
            className="h-full overflow-hidden"
        >
            <div className="divide-y divide-solid flex flex-col overflow-hidden py-4 gap-2">
                <div className="w-full flex flex-col justify-between items-center px-4 gap-2 pb-4">
                    <img
                        src="/icon.png"
                        alt=""
                        width={80}
                        height={80}
                        className="rounded-lg shadow-md aspect-square"
                    />
                    <Version />
                </div>
                <a
                    className="w-full min-h-10 pb-2 flex justify-between items-center px-4"
                    target="_blank"
                    href="https://github.com/glink25/Cent/issues/new"
                    rel="noopener"
                >
                    <div className="flex items-center gap-2">
                        <i className="icon-[mdi--alternate-email] size-5"></i>
                        <div className="text-sm">{t("feedback")}</div>
                    </div>
                    <i className="icon-[mdi--arrow-top-right]"></i>
                </a>
                <a
                    className="w-full min-h-10 pb-2 flex justify-between items-center px-4"
                    target="_blank"
                    href="https://glink25.github.io/tag/Cent/"
                    rel="noopener"
                >
                    <div className="flex items-center gap-2">
                        <i className="icon-[mdi--rss-box] size-5"></i>
                        <div className="text-sm">{t("blog")}</div>
                    </div>
                    <i className="icon-[mdi--arrow-top-right]"></i>
                </a>
                <a
                    className="w-full min-h-10 pb-2 flex justify-between items-center px-4"
                    target="_blank"
                    href="https://github.com/glink25/Cent"
                    rel="noopener"
                >
                    <div className="flex items-center gap-2">
                        <i className="icon-[mdi--github] size-5"></i>
                        <div className="text-sm">Github</div>
                    </div>
                    <i className="icon-[mdi--arrow-top-right]"></i>
                </a>
                {/* <div className="w-full min-h-10 pb-2 flex justify-between items-center px-4 opacity-60">
                    <div className="flex items-center gap-2">
                        <i className="icon-[mdi--github] size-5"></i>
                        <div className="text-sm">Github</div>
                    </div>
                    <div className="text-xs">{t("preparing")}</div>
                </div> */}
            </div>
        </PopupLayout>
    );
}

const [AboutSettingsProvider, showAboutSettings] = createConfirmProvider(Form, {
    dialogTitle: "experimental-functions",
    dialogModalClose: true,
    contentClassName:
        "h-full w-full max-h-full max-w-full rounded-none sm:rounded-md sm:max-h-[55vh] sm:w-[90vw] sm:max-w-[500px]",
});

export default function AboutSettingsItem() {
    const t = useIntl();
    return (
        <div className="lab">
            <Button
                onClick={() => {
                    showAboutSettings();
                }}
                variant="ghost"
                className="h-auto w-full rounded-none px-1 py-1"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div className="flex items-center gap-3">
                        <div className="wedding-settings-item__icon bg-pink-50 text-pink-500 dark:bg-pink-500/12">
                            <i className="icon-[mdi--about-circle-outline] size-5"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                {t("about-cent")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                关于版本、反馈、博客与项目主页
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </Button>
            <AboutSettingsProvider />
        </div>
    );
}

export function AdvancedGuideItem() {
    const t = useIntl();
    return (
        <div className="lab">
            <a
                href="https://glink25.github.io/post/Cent%E9%AB%98%E7%BA%A7%E8%AE%B0%E8%B4%A6%E6%8C%87%E5%8D%97/"
                target="_blank"
                className="inline-flex h-auto w-full items-center justify-center gap-2 whitespace-nowrap rounded-none px-1 py-1 text-sm font-medium"
                rel="noopener"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div className="flex items-center gap-3">
                        <div className="wedding-settings-item__icon bg-amber-50 text-amber-500 dark:bg-amber-500/12">
                            <i className="icon-[mdi--book-open-blank-variant-outline] size-5 shrink-0"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                {t("advance-billings-label")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                打开高级记账使用指南
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </a>
        </div>
    );
}
