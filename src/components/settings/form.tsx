import { StorageAPI, StorageDeferredAPI } from "@/api/storage";
import PopupLayout from "@/layouts/popup-layout";
import { useIntl } from "@/locale";
import { useUserStore } from "@/store/user";
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
        <div className="flex items-center justify-between gap-2 px-4 py-4 m-2 backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 rounded-xl shadow-sm border border-white/20 dark:border-stone-700/30">
            <div className="flex-1 flex items-center gap-2 overflow-hidden">
                <img
                    src={avatar_url}
                    alt={`${id}`}
                    className="w-12 h-12 rounded-full border border-pink-200 dark:border-pink-800"
                />

                <div className="flex flex-col overflow-hidden">
                    <div className="flex">
                        <div className="font-semibold flex-1 truncate text-pink-600 dark:text-pink-400">
                            {name}
                        </div>
                        <div
                            className="px-2 flex-shrink-0"
                            title={`Signed with ${StorageAPI.name}`}
                        >
                            <div className="text-xs border rounded px-1">
                                {StorageAPI.name}
                            </div>
                        </div>
                    </div>
                    <div className="text-sm opacity-60">{id}</div>
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
                <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700" onClick={toLogOut}>
                    {t("logout")}
                </Button>
            </div>
        </div>
    );
}

export default function SettingsForm({
    onConfirm,
    onCancel,
}: {
    onConfirm?: (isEdit: boolean) => void;
    onCancel?: () => void;
}) {
    const t = useIntl();

    const showRelyr = Boolean(import.meta.env.VITE_RELAYR_URL);

    return (
        <PopupLayout
            onBack={onCancel}
            title={t("settings")}
            className="h-full overflow-hidden"
        >
            <div className="divide-y divide-solid flex flex-col overflow-hidden">
                <UserInfo />
                <div className="flex-1 overflow-y-auto flex flex-col py-4">
                    <div>
                        <div className="text-xs px-6 py-2 text-pink-500/80 dark:text-pink-400/80 font-medium">
                            {t("book-settings")}
                        </div>
                        <div className="flex flex-col divide-y backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 rounded-xl m-2 shadow-sm border border-white/20 dark:border-stone-700/30">
                            <BookSettings />
                            <PresetSettingsItem />
                            <UserSettingsItem />
                            <DataManagerSettingsItem />
                        </div>
                    </div>
                    <div>
                        <div className="text-xs px-6 py-2 text-pink-500/80 dark:text-pink-400/80 font-medium">{t("ai")}</div>
                        <div className="flex flex-col divide-y backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 rounded-xl m-2 shadow-sm border border-white/20 dark:border-stone-700/30">
                            <AssistantSettingsItem />
                            {showRelyr && <QuickEntrySettingsItem />}
                            <VoiceSettingsItem />
                        </div>
                    </div>
                    <div>
                        <div className="text-xs px-6 py-2 text-pink-500/80 dark:text-pink-400/80 font-medium">
                            {t("billing-functions")}
                        </div>
                        <div className="flex flex-col divide-y backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 rounded-xl m-2 shadow-sm border border-white/20 dark:border-stone-700/30">
                            <CategorySettingsItem />
                            <TagSettingsItem />
                            <Budget />
                            <ScheduledSettingsItems />
                            <CurrencySettingsItem />
                        </div>
                    </div>

                    <div>
                        <div className="text-xs px-6 py-2 text-pink-500/80 dark:text-pink-400/80 font-medium">
                            {t("other-settings")}
                        </div>
                        <div className="flex flex-col divide-y backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 rounded-xl m-2 shadow-sm border border-white/20 dark:border-stone-700/30">
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
