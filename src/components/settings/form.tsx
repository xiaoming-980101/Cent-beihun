import { StorageAPI } from "@/api/storage";
import PopupLayout from "@/layouts/popup-layout";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useUserStore } from "@/store/user";
import { useWeddingStore } from "@/store/wedding";
import TagSettingsItem from "../bill-tag";
import { BookSettings } from "../book";
import Budget from "../budget";
import CategorySettingsItem from "../category";
import CurrencySettingsItem from "../currency";
import DataManagerSettingsItem from "../data-manager";
import modal from "../modal";
import ScheduledSettingsItems from "../scheduled/settings-item";
import { Button } from "../ui/button";
import AboutSettingsItem, { AdvancedGuideItem } from "./about";
import AssistantSettingsItem from "./assistant";
import LabSettingsItem from "./lab";
import LanguageSettingsItem from "./language";
import MapSettingsItem from "./map-settings";
import PresetSettingsItem from "./preset";
import QuickEntrySettingsItem from "./quick-entry";
import ThemeSettingsItem from "./theme";
import UserSettingsItem from "./user";
import VoiceSettingsItem from "./voice";

function UserInfo() {
    const t = useIntl();
    const { id, avatar_url, name, expired } = useUserStore();
    const toLogOut = async () => {
        await modal.prompt({ title: t("logout-warning") });

        await Promise.all([
            StorageAPI.logout(),
            new Promise<void>((res) => {
                setTimeout(() => {
                    res();
                }, 100);
            }),
        ]);
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
    };
    return (
        <div className="mx-4 my-4 rounded-[24px] bg-[linear-gradient(135deg,#fbbcdf_0%,#ddb6f7_100%)] p-4 text-[#3b0d29] shadow-[0_18px_36px_-28px_rgba(244,114,182,0.45)] dark:bg-[linear-gradient(135deg,#3d1030_0%,#1e0d30_100%)] dark:text-white">
            <div className="flex-1 flex items-center gap-2 overflow-hidden">
                <img
                    src={avatar_url}
                    alt={`${id}`}
                    className="h-12 w-12 rounded-full border-2 border-white/70 dark:border-white/15"
                />

                <div className="flex flex-col overflow-hidden">
                    <div className="flex">
                        <div className="flex-1 truncate text-base font-semibold">
                            {name}
                        </div>
                        <div
                            className="flex-shrink-0 px-2"
                            title={`Signed with ${StorageAPI.name}`}
                        >
                            <div className="rounded-full bg-white/45 px-2 py-0.5 text-[10px] font-medium dark:bg-white/10">
                                {StorageAPI.name}
                            </div>
                        </div>
                    </div>
                    <div className="text-sm opacity-70">{id}</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {expired && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            StorageAPI.loginWith(StorageAPI.type);
                        }}
                    >
                        <i className="icon-[mdi--reload]"></i>
                        {t("re-login")}
                    </Button>
                )}
                <Button
                    size="sm"
                    className="rounded-full bg-white/80 text-[#9d174d] hover:bg-white dark:bg-white/12 dark:text-pink-100 dark:hover:bg-white/18"
                    onClick={toLogOut}
                >
                    {t("logout")}
                </Button>
            </div>
        </div>
    );
}

function SettingsSummary() {
    const { weddingData } = useWeddingStore();
    const currentBookName = useBookStore((state) => {
        const { currentBookId, books } = state;
        return books.find((book) => book.id === currentBookId)?.name;
    });

    const tasks = weddingData?.tasks || [];
    const guests = weddingData?.guests || [];
    const budgets = weddingData?.weddingBudgets || [];

    return (
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
            {[
                [
                    "当前账本",
                    currentBookName || "未命名",
                    "bg-pink-50 text-pink-500 dark:bg-pink-500/12",
                ],
                [
                    "婚礼任务",
                    `${tasks.length} 项`,
                    "bg-blue-50 text-blue-500 dark:bg-blue-500/12",
                ],
                [
                    "预算项目",
                    `${budgets.length + guests.length} 条`,
                    "bg-violet-50 text-violet-500 dark:bg-violet-500/12",
                ],
            ].map(([label, value, tone]) => (
                <div
                    key={label}
                    className="rounded-[18px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-3 text-center shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]"
                >
                    <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                        {label}
                    </div>
                    <div
                        className={`mt-2 rounded-xl px-2 py-1 text-xs font-semibold ${tone}`}
                    >
                        {value}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function SettingsForm({
    onCancel,
    hideBack,
    hideHeaderOnMobile,
}: {
    onCancel?: () => void;
    hideBack?: boolean;
    hideHeaderOnMobile?: boolean;
}) {
    const t = useIntl();

    const showRelyr = Boolean(import.meta.env.VITE_RELAYR_URL);

    return (
        <PopupLayout
            onBack={onCancel}
            title={t("settings")}
            className="h-full overflow-hidden bg-[color:var(--wedding-app-bg)]"
            hideBack={hideBack}
            hideHeaderOnMobile={hideHeaderOnMobile}
        >
            <div className="flex h-full flex-col overflow-hidden bg-[color:var(--wedding-app-bg)]">
                <UserInfo />
                <SettingsSummary />
                <div className="flex flex-1 flex-col overflow-y-auto pb-6">
                    <div className="px-4">
                        <div className="mb-2 pl-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--wedding-text-mute)]">
                            {t("book-settings")}
                        </div>
                        <div className="mb-4 flex flex-col divide-y rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]">
                            <BookSettings />
                            <PresetSettingsItem />
                            <UserSettingsItem />
                            <DataManagerSettingsItem />
                        </div>
                    </div>
                    <div className="px-4">
                        <div className="mb-2 pl-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--wedding-text-mute)]">
                            {t("ai")}
                        </div>
                        <div className="mb-4 flex flex-col divide-y rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]">
                            <AssistantSettingsItem />
                            {showRelyr && <QuickEntrySettingsItem />}
                            <VoiceSettingsItem />
                        </div>
                    </div>
                    <div className="px-4">
                        <div className="mb-2 pl-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--wedding-text-mute)]">
                            {t("billing-functions")}
                        </div>
                        <div className="mb-4 flex flex-col divide-y rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]">
                            <CategorySettingsItem />
                            <TagSettingsItem />
                            <Budget />
                            <ScheduledSettingsItems />
                            <CurrencySettingsItem />
                        </div>
                    </div>

                    <div className="px-4">
                        <div className="mb-2 pl-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--wedding-text-mute)]">
                            {t("other-settings")}
                        </div>
                        <div className="flex flex-col divide-y rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]">
                            <MapSettingsItem />
                            <LabSettingsItem />
                            <AboutSettingsItem />
                            <ThemeSettingsItem />
                            <LanguageSettingsItem />
                            <AdvancedGuideItem />
                        </div>
                    </div>
                </div>
            </div>
        </PopupLayout>
    );
}
