import { cloneDeep, isEqual, merge } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { StorageAPI } from "@/api/storage";
import type { Full, MetaUpdate, Update } from "@/database/stash";
import PopupLayout from "@/layouts/popup-layout";
import { BillCategories } from "@/ledger/category";
import type { Bill, GlobalMeta } from "@/ledger/type";
import { appendCategories } from "@/ledger/utils";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { useUserStore } from "@/store/user";
import { FormDialog } from "../ui/dialog/form-dialog";
import { PreviewForm, type PreviewState } from "./preview";

// 事件驱动的弹窗管理
let resolveCallback: ((value: PreviewState | null) => void) | null = null;

export const ImportPreviewProvider = () => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<PreviewState | undefined>();

    useEffect(() => {
        const handleShow = (event: CustomEvent<PreviewState>) => {
            setEditData(event.detail);
            setOpen(true);
        };

        window.addEventListener("show-import-preview" as any, handleShow);
        return () => {
            window.removeEventListener("show-import-preview" as any, handleShow);
        };
    }, []);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resolveCallback?.(null);
            resolveCallback = null;
        }
        setOpen(newOpen);
    };

    const handleConfirm = (value?: PreviewState) => {
        resolveCallback?.(value ?? null);
        resolveCallback = null;
        setOpen(false);
    };

    const handleCancel = () => {
        resolveCallback?.(null);
        resolveCallback = null;
        setOpen(false);
    };

    return (
        <FormDialog
            open={open}
            onOpenChange={handleOpenChange}
            title="导入预览"
            maxWidth="md"
            fullScreenOnMobile={true}
            bodyClassName="max-sm:px-4 max-sm:py-4"
        >
            <PreviewForm
                edit={editData}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </FormDialog>
    );
};

export const showImportPreview = (edit?: PreviewState): Promise<PreviewState | null> => {
    return new Promise((resolve) => {
        resolveCallback = resolve;
        window.dispatchEvent(
            new CustomEvent("show-import-preview", { detail: edit })
        );
    });
};

export const importFromPreviewResult = async (res: PreviewState) => {
    const { strategy, asMine, ...rest } = res;
    const currentMeta = cloneDeep(
        useLedgerStore.getState().infos?.meta ?? ({} as GlobalMeta),
    );
    const newMeta =
        strategy === "overlap"
            ? rest.meta
            : (() => {
                  if (!rest.meta?.categories) {
                      const merged = merge(currentMeta, rest.meta);
                      return merged;
                  }
                  const currentCategories =
                      (currentMeta.categories?.length ?? 0) === 0
                          ? BillCategories
                          : currentMeta.categories!;
                  const incomingCategories = [...(rest.meta?.categories ?? [])];
                  // 必须用深拷贝否则会被merge改变
                  const appended = cloneDeep(
                      appendCategories(currentCategories, incomingCategories),
                  );
                  const merged = merge(currentMeta, rest.meta);
                  if (isEqual(BillCategories, appended)) {
                      merged.categories = undefined;
                  } else {
                      merged.categories = appended;
                  }
                  return merged;
              })();
    const bookId = useBookStore.getState().currentBookId;
    if (!bookId) {
        return;
    }
    const mineId = useUserStore.getState().id;
    await StorageAPI.batch(
        bookId,
        [
            ...rest.bills.map((v) => {
                return {
                    id: v.id,
                    type: "update",
                    value: { ...v, creatorId: asMine ? mineId : v.creatorId },
                    timestamp: v.__update_at,
                } as Update<Bill>;
            }),
            {
                type: "meta",
                metaValue: newMeta,
            } as MetaUpdate,
        ],
        strategy === "overlap",
    );
};
