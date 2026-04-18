import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { showFilePicker } from "@/components/file-picker";
import { FormDialog } from "@/components/ui/dialog/form-dialog";
import { alert } from "@/components/ui/dialog/utils";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { useUserStore } from "@/store/user";
import { download } from "@/utils/download";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { PRESET_MERGE_RISK, type PresetExportSection } from "./type";
import {
    applyPreset,
    checkPresetMergeRisk,
    exportPresetWith,
    getCurrentPreset,
    parsePresetFileJson,
} from "./utils";

const FORMAT_PRESET = ".json,.cent-preset.json,application/json,text/json";

const DEFAULT_EXPORT_SECTIONS: PresetExportSection[] = [
    "tags",
    "categories",
    "customFilters",
    "customCSS",
];

interface PresetExportDialogFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm?: (sections: PresetExportSection[]) => void;
}

function PresetExportDialogForm({
    open,
    onOpenChange,
    onConfirm,
}: PresetExportDialogFormProps) {
    const t = useIntl();
    const [exportSections, setExportSections] = useState<PresetExportSection[]>(
        () => [...DEFAULT_EXPORT_SECTIONS],
    );

    const toggleExportSection = useCallback(
        (key: PresetExportSection, checked: boolean) => {
            setExportSections((prev) => {
                if (checked) {
                    return prev.includes(key) ? prev : [...prev, key];
                }
                return prev.filter((k) => k !== key);
            });
        },
        [],
    );

    const handleConfirm = useCallback(() => {
        if (exportSections.length === 0) {
            toast.warning(t("preset-export-empty-selection"));
            return;
        }
        onConfirm?.(exportSections);
        onOpenChange(false);
    }, [exportSections, onConfirm, onOpenChange, t]);

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("preset-export-dialog-title")}
            maxWidth="sm"
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={exportSections.includes("tags")}
                        onCheckedChange={(v) =>
                            toggleExportSection("tags", v === true)
                        }
                    />
                    <span>{t("preset-export-section-tags")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={exportSections.includes("categories")}
                        onCheckedChange={(v) =>
                            toggleExportSection("categories", v === true)
                        }
                    />
                    <span>{t("preset-export-section-categories")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={exportSections.includes("customFilters")}
                        onCheckedChange={(v) =>
                            toggleExportSection("customFilters", v === true)
                        }
                    />
                    <span>{t("preset-export-section-custom-filters")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={exportSections.includes("customCSS")}
                        onCheckedChange={(v) =>
                            toggleExportSection("customCSS", v === true)
                        }
                    />
                    <span>{t("preset-export-section-custom-css")}</span>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                >
                    {t("cancel")}
                </Button>
                <Button type="button" size="sm" onClick={handleConfirm}>
                    {t("preset-export-confirm")}
                </Button>
            </div>
        </FormDialog>
    );
}

// PresetExportProvider 和 showPresetExport
function PresetExportProviderComponent() {
    const [open, setOpen] = useState(false);
    const [resolveRef, setResolveRef] = useState<{
        resolve: (value?: PresetExportSection[]) => void;
    } | null>(null);

    useEffect(() => {
        const handleShow = () => {
            setOpen(true);
        };
        const handleStoreResolve = ((
            e: CustomEvent<{
                resolve: (value?: PresetExportSection[]) => void;
            }>,
        ) => {
            setResolveRef({ resolve: e.detail.resolve });
        }) as EventListener;

        window.addEventListener("show-preset-export", handleShow);
        window.addEventListener(
            "store-preset-export-resolve",
            handleStoreResolve,
        );

        return () => {
            window.removeEventListener("show-preset-export", handleShow);
            window.removeEventListener(
                "store-preset-export-resolve",
                handleStoreResolve,
            );
        };
    }, []);

    const handleConfirm = (sections?: PresetExportSection[]) => {
        resolveRef?.resolve(sections);
        setOpen(false);
        setResolveRef(null);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resolveRef?.resolve(undefined);
            setResolveRef(null);
        }
        setOpen(newOpen);
    };

    return (
        <PresetExportDialogForm
            open={open}
            onOpenChange={handleOpenChange}
            onConfirm={handleConfirm}
        />
    );
}

export const PresetExportProvider = PresetExportProviderComponent;

export function showPresetExport(): Promise<PresetExportSection[] | undefined> {
    return new Promise((resolve) => {
        window.dispatchEvent(new CustomEvent("show-preset-export"));
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("store-preset-export-resolve", {
                    detail: { resolve },
                }),
            );
        }, 0);
    });
}

interface PresetFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PresetForm({ open, onOpenChange }: PresetFormProps) {
    const t = useIntl();
    const { id: userId } = useUserStore();
    const bookId = useBookStore((s) => s.currentBookId);
    const customCSS = useLedgerStore(
        useShallow(
            (state) => state.infos?.meta.personal?.[userId]?.customCSS ?? "",
        ),
    );

    const [cssValue, setCssValue] = useState(customCSS);

    useEffect(() => {
        setCssValue(customCSS);
    }, [customCSS]);

    const handleCssChange = useCallback((value: string) => {
        setCssValue(value);
    }, []);

    const handleSave = useCallback(async () => {
        await useLedgerStore.getState().updatePersonalMeta((prev) => {
            prev.customCSS = cssValue;
            return prev;
        });
        toast.success(t("custom-css-saved"));
    }, [cssValue, t]);

    const handleClear = useCallback(() => {
        setCssValue("");
    }, []);

    const runExportWithSections = useCallback(
        async (exportSections: PresetExportSection[]) => {
            const json = exportPresetWith(exportSections);
            const name = `preset-${(bookId ?? "book").replace(/\//g, "-")}-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.cent-preset.json`;
            await download(
                new Blob([json], { type: "application/json" }),
                name,
            );
            toast.success(t("preset-export-done"));
        },
        [bookId, t],
    );

    const handleExport = useCallback(async () => {
        const sections = await showPresetExport();
        if (!sections || sections.length === 0) {
            return;
        }
        await runExportWithSections(sections);
    }, [runExportWithSections]);

    const runImport = useCallback(async () => {
        let files: File[];
        try {
            files = await showFilePicker({ accept: FORMAT_PRESET });
        } catch {
            return;
        }
        const file = files[0];
        if (!file) {
            return;
        }
        let incoming: ReturnType<typeof parsePresetFileJson>;
        try {
            incoming = parsePresetFileJson(await file.text());
        } catch {
            toast.error(t("preset-import-invalid"));
            return;
        }
        const current = getCurrentPreset();
        const risks = checkPresetMergeRisk(incoming, current);
        if (risks.length > 0) {
            const lines = {
                [PRESET_MERGE_RISK.TAGS_WOULD_CHANGE]: t(
                    "preset-merge-risk-tags",
                ),
                [PRESET_MERGE_RISK.TAG_GROUPS_WOULD_CHANGE]: t(
                    "preset-merge-risk-tag-groups",
                ),
                [PRESET_MERGE_RISK.CATEGORY_WOULD_CHANGE]: t(
                    "preset-merge-risk-categories",
                ),
                [PRESET_MERGE_RISK.FILTERS_WOULD_CHANGE]: t(
                    "preset-merge-risk-filters",
                ),
                [PRESET_MERGE_RISK.CSS_WOULD_CHANGE]: t(
                    "preset-merge-risk-css",
                ),
            };
            try {
                const riskMessages = risks.map((r) => lines[r]).join("\n• ");
                await alert({
                    title: t("preset-merge-risk-intro"),
                    description: `• ${riskMessages}`,
                });
            } catch {
                return;
            }
        }
        try {
            await applyPreset(incoming);
            toast.success(t("preset-import-done"));
        } catch {
            toast.error(t("preset-import-failed"));
        }
    }, [t]);

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("preset")}
            maxWidth="md"
            fullScreenOnMobile={true}
        >
            <div className="flex flex-col gap-4">
                <div>
                    <p className="text-xs opacity-60">
                        {t("preset-description")}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={runImport}
                    >
                        {t("preset-import")}
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={handleExport}
                    >
                        {t("preset-export")}
                    </Button>
                </div>

                <PresetExportProvider />

                <div>
                    <div className="text-sm py-1">{t("theme-market")}</div>
                    <div className="w-full border rounded-md p-4 flex flex-col items-center justify-center gap-2 bg-muted/30">
                        <i className="icon-[mdi--store-outline] size-8 opacity-40"></i>
                        <div className="text-sm opacity-60 text-center">
                            {t("theme-market-coming-soon")}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="text-sm py-1">{t("custom-css")}</div>
                    <div>
                        <div className="text-xs opacity-60 mb-2">
                            {t("custom-css-description")}
                        </div>
                        <textarea
                            placeholder={t("custom-css-placeholder")}
                            className="w-full border rounded-md p-3 h-40 resize-none text-sm font-mono"
                            value={cssValue}
                            onChange={(e) => {
                                handleCssChange(e.currentTarget.value);
                            }}
                        ></textarea>
                        <div className="flex gap-2 mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClear}
                                className="flex-1"
                            >
                                {t("clear")}
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleSave}
                                className="flex-1"
                            >
                                {t("save")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </FormDialog>
    );
}
