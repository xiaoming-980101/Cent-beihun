import { useEffect, useState } from "react";
import { toast } from "sonner";
import PopupLayout from "@/layouts/popup-layout";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { cn } from "@/utils";
import { download } from "@/utils/download";
import { FormDialog } from "../ui/dialog/form-dialog";
import { FORMAT_BACKUP, showFilePicker } from "../file-picker";
import { alert } from "@/components/ui/dialog/utils";
import { loading } from "@/components/modal/loading";
import { Button } from "../ui/button";
import { prepareExportFile, processImportFile } from "./exportable";
import { showOncentImport } from "./oncent";
import {
    ImportPreviewProvider,
    importFromPreviewResult,
    showImportPreview,
} from "./preview-form";
import { SmartImport } from "./smart-import";

// SmartImportProvider - 事件驱动的弹窗管理
let smartImportResolveCallback: (() => void) | null = null;

export const SmartImportProvider = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleShow = (_event: Event) => {
            setOpen(true);
        };

        window.addEventListener("show-smart-import", handleShow);
        return () => {
            window.removeEventListener("show-smart-import", handleShow);
        };
    }, []);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            smartImportResolveCallback?.();
            smartImportResolveCallback = null;
        }
        setOpen(newOpen);
    };

    const handleCancel = () => {
        smartImportResolveCallback?.();
        smartImportResolveCallback = null;
        setOpen(false);
    };

    return (
        <FormDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="Smart Import"
            maxWidth="md"
            fullScreenOnMobile={true}
            className="sm:max-h-[55vh] sm:w-[90vw] sm:max-w-[500px]"
            bodyClassName="p-0 sm:pt-14"
            fullscreenBodyClassName="max-sm:p-0"
        >
            <SmartImport onCancel={handleCancel} />
        </FormDialog>
    );
};

export const showSmartImport = (): Promise<void> => {
    return new Promise((resolve) => {
        smartImportResolveCallback = resolve;
        requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent("show-smart-import"));
        });
    });
};

const betaClassName = `relative after:content-['beta'] after:rounded after:bg-yellow-400 after:px-[2px] after:text-[8px] after:block after:absolute after:top-0 after:right-0 after:translate-x-[calc(100%+4px)]`;

function Form({ open, onOpenChange, onCancel }: { open: boolean; onOpenChange: (open: boolean) => void; onCancel?: () => void }) {
    const t = useIntl();
    const toImport = async () => {
        const bookid = useBookStore.getState().currentBookId;
        if (!bookid) {
            return;
        }
        const [jsonFile] = await showFilePicker({ accept: FORMAT_BACKUP });
        const [stopLoading] = loading();
        const data = await processImportFile(jsonFile).finally(() => {
            stopLoading();
        });
        const res = await showImportPreview({
            bills: data.items,
            meta: data.meta,
        });
        if (!res) {
            return;
        }
        await importFromPreviewResult(res);
    };

    const toExport = async () => {
        const bookId = useBookStore.getState().currentBookId;
        if (!bookId) {
            return;
        }
        const [stopLoading] = loading();
        const { blob, ext } = await prepareExportFile(bookId);
        stopLoading();
        await download(
            blob,
            `cent-backup-${bookId.replace("/", "-")}-${new Date().toISOString()}.${ext}`,
        );
    };

    const toImportFromOncent = async () => {
        const [jsonFile] = await showFilePicker({ accept: FORMAT_BACKUP });
        const jsonText = await jsonFile.text();
        const data = JSON.parse(jsonText);
        await showOncentImport(data);
    };

    const toShrinkData = async () => {
        await alert({ title: t("bill-compression-tip") });

        const isSynced = useLedgerStore.getState().sync === "success";
        if (!isSynced) {
            toast.warning(t("wait-synced-tip"));
            return;
        }
        const bills = await useLedgerStore.getState().refreshBillList();
        const meta = useLedgerStore.getState().infos?.meta;
        await importFromPreviewResult({
            bills,
            meta,
            strategy: "overlap",
        });
    };
    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("data-manager")}
            maxWidth="md"
            fullScreenOnMobile={true}
            className="sm:max-h-[55vh] sm:w-[90vw] sm:max-w-[500px]"
            bodyClassName="max-sm:px-4 max-sm:py-4"
        >
            <div className="w-full h-[450px] flex flex-col justify-center items-center rounded">
                <div className="flex-1 flex flex-col w-full gap-2 h-full overflow-hidden">
                    <div className="px-4 opacity-60 text-sm">{t("backup")}</div>
                    <div className="flex flex-col px-4 gap-2">
                        <Button
                            variant="outline"
                            className="py-4"
                            onClick={toImport}
                        >
                            {t("data-import")}
                        </Button>
                        <Button
                            variant="outline"
                            className="py-4"
                            onClick={toExport}
                        >
                            {t("data-export")}
                        </Button>
                    </div>
                    <div className="px-4 opacity-60 text-sm">{t("others")}</div>
                    <div className="flex flex-col px-4 gap-2">
                        <Button
                            variant="outline"
                            className="py-4"
                            onClick={toImportFromOncent}
                        >
                            {t("import-from-oncent-github-io")}
                        </Button>
                    </div>
                    <div className="flex flex-col px-4 gap-2">
                        <Button
                            variant="outline"
                            className={cn(
                                betaClassName,
                                "py-4 after:translate-x-[calc(50%-4px)] after:translate-y-[-4px]",
                            )}
                            onClick={showSmartImport}
                        >
                            {t("smart-import")}
                        </Button>
                    </div>
                    <div className="flex flex-col px-4 gap-2">
                        <Button
                            variant="outline"
                            className={cn(
                                betaClassName,
                                "py-4 after:translate-x-[calc(50%-4px)] after:translate-y-[-4px]",
                            )}
                            onClick={toShrinkData}
                        >
                            {t("bill-compression")}
                        </Button>
                    </div>
                </div>
            </div>
            <ImportPreviewProvider />
            <SmartImportProvider />
        </FormDialog>
    );
}

// DataManagerProvider - 事件驱动的弹窗管理
let dataManagerResolveCallback: (() => void) | null = null;

export const DataManagerProvider = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleShow = (_event: Event) => {
            setOpen(true);
        };

        window.addEventListener("show-data-manager", handleShow);
        return () => {
            window.removeEventListener("show-data-manager", handleShow);
        };
    }, []);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            dataManagerResolveCallback?.();
            dataManagerResolveCallback = null;
        }
        setOpen(newOpen);
    };

    const handleCancel = () => {
        dataManagerResolveCallback?.();
        dataManagerResolveCallback = null;
        setOpen(false);
    };

    return (
        <Form
            open={open}
            onOpenChange={handleOpenChange}
            onCancel={handleCancel}
        />
    );
};

export const showDataManager = (): Promise<void> => {
    return new Promise((resolve) => {
        dataManagerResolveCallback = resolve;
        requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent("show-data-manager"));
        });
    });
};

export default function DataManagerSettingsItem() {
    const t = useIntl();
    return (
        <div className="lab">
            <Button
                onClick={() => {
                    showDataManager();
                }}
                variant="ghost"
                className="h-auto w-full rounded-none px-1 py-1"
            >
                <div className="wedding-settings-item rounded-[18px]">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="wedding-settings-item__icon bg-indigo-50 text-indigo-500 dark:bg-indigo-500/12">
                            <i className="icon-[mdi--database-outline] size-5"></i>
                        </div>
                        <div className="min-w-0">
                            <div className="wedding-settings-item__title">
                                {t("data-manager")}
                            </div>
                            <div className="wedding-settings-item__desc">
                                导入导出账本数据并管理备份内容
                            </div>
                        </div>
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-muted)]"></i>
                </div>
            </Button>
            <DataManagerProvider />
        </div>
    );
}
