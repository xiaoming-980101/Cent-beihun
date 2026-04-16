import { StorageAPI } from "@/api/storage";
import PopupLayout from "@/layouts/popup-layout";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useUserStore } from "@/store/user";
import { useWeddingStore } from "@/store/wedding";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";
import { Separator } from "../ui/separator";
import TagSettingsItem from "../bill-tag";
import { BookSettings } from "../book";
import Budget from "../budget";
import CategorySettingsItem from "../category";
import CurrencySettingsItem from "../currency";
import DataManagerSettingsItem from "../data-manager";
import ScheduledSettingsItems from "../scheduled/settings-item";
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
import WeddingDateSettingsItem from "./wedding-date";
import { useState } from "react";

function UserInfo() {
    const t = useIntl();
    const { id, avatar_url, name, expired } = useUserStore();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const toLogOut = async () => {
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
        <>
            <div className="mx-4 my-4 rounded-[24px] bg-[linear-gradient(135deg,#fbbcdf_0%,#ddb6f7_100%)] p-4 text-[#3b0d29] shadow-[0_18px_36px_-28px_rgba(244,114,182,0.45)] dark:bg-[linear-gradient(135deg,#3d1030_0%,#1e0d30_100%)] dark:text-white">
                <div className="flex items-center gap-3">
                    <img
                        src={avatar_url}
                        alt={`${id}`}
                        className="h-14 w-14 rounded-full border-2 border-white/70 shadow-md dark:border-white/15"
                    />

                    <div className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex items-center gap-2">
                            <div className="truncate text-lg font-bold">
                                {name}
                            </div>
                            <div
                                className="shrink-0 rounded-full bg-white/45 px-2 py-0.5 text-[10px] font-medium dark:bg-white/10"
                                title={`Signed with ${StorageAPI.name}`}
                            >
                                {StorageAPI.name}
                            </div>
                        </div>
                        <div className="mt-0.5 truncate text-sm opacity-70">
                            {id}
                        </div>
                    </div>
                </div>

                {expired && (
                    <div className="mt-3">
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                StorageAPI.loginWith(StorageAPI.type);
                            }}
                        >
                            <i className="icon-[mdi--reload] mr-1.5 size-4"></i>
                            {t("re-login")}
                        </Button>
                    </div>
                )}
            </div>

            <AlertDialog
                open={showLogoutDialog}
                onOpenChange={setShowLogoutDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认退出登录？</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("logout-warning")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={toLogOut}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            确认退出
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
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
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [openSections, setOpenSections] = useState({
        book: true,
        ai: false,
        billing: false,
        other: false,
    });

    const showRelyr = Boolean(import.meta.env.VITE_RELAYR_URL);

    const toLogOut = async () => {
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
                
                <div className="flex flex-1 flex-col overflow-y-auto pb-24">
                    {/* 账本设置 */}
                    <div className="px-4 pb-4">
                        <Collapsible
                            open={openSections.book}
                            onOpenChange={(open) =>
                                setOpenSections({ ...openSections, book: open })
                            }
                        >
                            <CollapsibleTrigger className="mb-2 flex w-full items-center justify-between pl-1">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--wedding-text-mute)]">
                                    <i className="icon-[mdi--book-open-variant] mr-1.5 inline-block size-3.5" />
                                    {t("book-settings")}
                                </div>
                                <i
                                    className={`icon-[mdi--chevron-down] size-4 text-[color:var(--wedding-text-mute)] transition-transform ${openSections.book ? "rotate-180" : ""}`}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="flex flex-col divide-y rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]">
                                    <WeddingDateSettingsItem />
                                    <BookSettings />
                                    <PresetSettingsItem />
                                    <UserSettingsItem />
                                    <DataManagerSettingsItem />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* AI 设置 */}
                    <div className="px-4 pb-4">
                        <Collapsible
                            open={openSections.ai}
                            onOpenChange={(open) =>
                                setOpenSections({ ...openSections, ai: open })
                            }
                        >
                            <CollapsibleTrigger className="mb-2 flex w-full items-center justify-between pl-1">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--wedding-text-mute)]">
                                    <i className="icon-[mdi--robot-outline] mr-1.5 inline-block size-3.5" />
                                    {t("ai")}
                                </div>
                                <i
                                    className={`icon-[mdi--chevron-down] size-4 text-[color:var(--wedding-text-mute)] transition-transform ${openSections.ai ? "rotate-180" : ""}`}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="flex flex-col divide-y rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]">
                                    <AssistantSettingsItem />
                                    {showRelyr && <QuickEntrySettingsItem />}
                                    <VoiceSettingsItem />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* 记账功能 */}
                    <div className="px-4 pb-4">
                        <Collapsible
                            open={openSections.billing}
                            onOpenChange={(open) =>
                                setOpenSections({ ...openSections, billing: open })
                            }
                        >
                            <CollapsibleTrigger className="mb-2 flex w-full items-center justify-between pl-1">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--wedding-text-mute)]">
                                    <i className="icon-[mdi--receipt-text-outline] mr-1.5 inline-block size-3.5" />
                                    {t("billing-functions")}
                                </div>
                                <i
                                    className={`icon-[mdi--chevron-down] size-4 text-[color:var(--wedding-text-mute)] transition-transform ${openSections.billing ? "rotate-180" : ""}`}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="flex flex-col divide-y rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]">
                                    <CategorySettingsItem />
                                    <TagSettingsItem />
                                    <Budget />
                                    <ScheduledSettingsItems />
                                    <CurrencySettingsItem />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* 其他设置 */}
                    <div className="px-4 pb-4">
                        <Collapsible
                            open={openSections.other}
                            onOpenChange={(open) =>
                                setOpenSections({ ...openSections, other: open })
                            }
                        >
                            <CollapsibleTrigger className="mb-2 flex w-full items-center justify-between pl-1">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--wedding-text-mute)]">
                                    <i className="icon-[mdi--cog-outline] mr-1.5 inline-block size-3.5" />
                                    {t("other-settings")}
                                </div>
                                <i
                                    className={`icon-[mdi--chevron-down] size-4 text-[color:var(--wedding-text-mute)] transition-transform ${openSections.other ? "rotate-180" : ""}`}
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="flex flex-col divide-y rounded-[24px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)]">
                                    <MapSettingsItem />
                                    <LabSettingsItem />
                                    <AboutSettingsItem />
                                    <ThemeSettingsItem />
                                    <LanguageSettingsItem />
                                    <AdvancedGuideItem />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>

                {/* 退出登录按钮 - 固定在底部 */}
                <div className="border-t border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4">
                    <Button
                        variant="destructive"
                        className="w-full rounded-full"
                        onClick={() => setShowLogoutDialog(true)}
                    >
                        <i className="icon-[mdi--logout] mr-2 size-5" />
                        {t("logout")}
                    </Button>
                </div>

                {/* 退出登录确认对话框 */}
                <AlertDialog
                    open={showLogoutDialog}
                    onOpenChange={setShowLogoutDialog}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>确认退出登录？</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t("logout-warning")}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={toLogOut}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                确认退出
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </PopupLayout>
    );
}
