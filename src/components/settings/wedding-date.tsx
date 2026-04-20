import dayjs from "dayjs";
import { useState } from "react";
import WeddingDatePicker from "@/components/ui/wedding-date-picker";
import { useWeddingStore } from "@/store/wedding";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../ui/dialog/index";

export default function WeddingDateSettingsItem() {
    const { weddingData, updateWeddingDate, updateEngagementDate } =
        useWeddingStore();
    const [showPicker, setShowPicker] = useState(false);
    const [engagementDateDraft, setEngagementDateDraft] = useState<
        number | undefined
    >(undefined);
    const [weddingDateDraft, setWeddingDateDraft] = useState<
        number | undefined
    >(undefined);

    const weddingDate = weddingData?.weddingDate;
    const engagementDate = weddingData?.engagementDate;

    const openPicker = () => {
        setEngagementDateDraft(engagementDate || undefined);
        setWeddingDateDraft(weddingDate || undefined);
        setShowPicker(true);
    };

    return (
        <div className="wedding-date-settings">
            <Button
                onClick={openPicker}
                variant="ghost"
                className="h-auto w-full rounded-none px-1 py-1"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div className="flex items-center gap-3">
                        <div className="wedding-settings-item__icon bg-pink-50 text-pink-500 dark:bg-pink-500/12">
                            <i className="icon-[mdi--calendar-heart] size-5"></i>
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="wedding-settings-item__title">
                                婚礼日期
                            </div>
                            <div className="wedding-settings-item__desc">
                                {weddingDate
                                    ? dayjs(weddingDate).format(
                                          "YYYY年MM月DD日",
                                      )
                                    : "设置婚期后显示倒计时"}
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)]"></i>
                </div>
            </Button>

            <ResponsiveDialog
                open={showPicker}
                onOpenChange={setShowPicker}
                title="设置婚礼日期"
                maxWidth="sm"
                actions={{
                    cancelText: "取消",
                    confirmText: "确定",
                    onConfirm: () => {
                        if (engagementDateDraft) {
                            updateEngagementDate(engagementDateDraft);
                        }
                        if (weddingDateDraft) {
                            updateWeddingDate(weddingDateDraft);
                        }
                        setShowPicker(false);
                    },
                }}
            >
                <div className="space-y-4">
                    <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/12">
                                <i className="icon-[mdi--ring] size-4 text-cyan-500" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                    订婚日期
                                </div>
                                <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                    记录订婚的美好时刻
                                </div>
                            </div>
                        </div>
                        <WeddingDatePicker
                            value={engagementDateDraft}
                            onChange={setEngagementDateDraft}
                            tone="cyan"
                        />
                    </div>

                    <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/12">
                                <i className="icon-[mdi--heart] size-4 text-pink-500" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-[color:var(--wedding-text)]">
                                    婚礼日期
                                </div>
                                <div className="text-[10px] text-[color:var(--wedding-text-mute)]">
                                    设定人生中最重要的一天
                                </div>
                            </div>
                        </div>
                        <WeddingDatePicker
                            value={weddingDateDraft}
                            onChange={setWeddingDateDraft}
                            tone="pink"
                        />
                    </div>
                </div>
            </ResponsiveDialog>
        </div>
    );
}
