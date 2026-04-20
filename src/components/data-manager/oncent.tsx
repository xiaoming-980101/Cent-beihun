import {
    SelectContent,
    SelectPortal,
    SelectViewport,
} from "@radix-ui/react-select";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { v4 } from "uuid";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PopupLayout from "@/layouts/popup-layout";
import { numberToAmount } from "@/ledger/bill";
import { BillCategories } from "@/ledger/category";
import type { Bill } from "@/ledger/type";
import { useIntl } from "@/locale";
import { useLedgerStore } from "@/store/ledger";
import { FormDialog } from "../ui/dialog/form-dialog";
import Loading from "../loading";
import { Button } from "../ui/button";

// 单条用户行
export interface UserRow {
    id: string;
    name: string;
    latestTransferTime: number;
    connectId: string;
    me: boolean;
}

// 单条账单行
interface BillRow {
    id: string; // 假设账单也有 id
    comment?: string;
    categoryId: string;
    time: number;
    creatorId: string;
    image?: File;
    money: number;
    type: number;
}

// 每张表的数据
interface TableData<T = unknown> {
    tableName: string;
    inbound: boolean;
    rows: T[];
}

// 数据库中表的元信息
interface TableSchema {
    name: string;
    schema: string;
    rowCount: number;
}

// 最外层数据库类型
interface DatabaseData {
    databaseName: string;
    databaseVersion: number;
    tables: TableSchema[];
    data: TableData[];
    formatName: string;
    formatVersion: number;
}

// 如果想要精确指定 users 表的行类型，可以写：
export type OncentDatabaseData = { data: DatabaseData };

const transferToBill = (row: BillRow): Omit<Bill, "creatorId"> => {
    const cate = BillCategories.find((v) => v.id === row.categoryId);
    const type = row.type === 1 ? "expense" : "income";
    const categoryId =
        cate?.id ?? (type === "income" ? "other-income" : "other-expenses");
    const comment = cate
        ? row.comment
        : `${row.comment} ${JSON.stringify({ rawCategory: row.categoryId })}`;
    return {
        id: row.id ?? v4(),
        type: row.type === 1 ? "expense" : "income",
        categoryId: categoryId,
        comment,
        time: row.time * 1000,
        amount: numberToAmount(row.money),
    };
};

function OncentImportForm({
    open,
    onOpenChange,
    edit,
    onCancel,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    edit?: OncentDatabaseData;
    onCancel?: () => void;
    onConfirm?: (v: boolean) => void;
}) {
    const t = useIntl();
    const [selectedUserId, setSelectedUserId] = useState<string>();
    const [importStrategy, setImportStrategy] = useState<"add" | "overlap">(
        "add",
    );

    const data = useMemo(() => {
        const users = edit?.data.data.find((v) => v.tableName === "users");
        return users?.rows
            .map((_row) => {
                const row = _row as UserRow;
                return {
                    user: {
                        nickname: row.name,
                        id: row.id,
                    },
                    data: row.me
                        ? edit?.data.data.find((v) => v.tableName === "bills")
                              ?.rows
                        : edit?.data.data.find((v) => v.tableName === row.id)
                              ?.rows,
                };
            })
            .filter((v) => v.data?.length);
    }, [edit]);

    const [loading, setLoading] = useState(false);
    const toConfirm = async () => {
        const selected = data?.find((v) => v.user.id === selectedUserId);
        if (!selected) {
            return;
        }
        setLoading(true);
        try {
            await useLedgerStore
                .getState()
                .batchImportFromBills(
                    selected.data?.map((v) => transferToBill(v as BillRow)) ??
                        [],
                    importStrategy === "overlap",
                );
            toast.success(t("import-success"));
            onConfirm?.(true);
            setLoading(false);
        } catch (error) {
            toast.error(`${t("import-failed")}: ${error}`);
            onConfirm?.(false);
        }
    };
    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Oncent"
            maxWidth="md"
            fullScreenOnMobile={true}
            bodyClassName="max-sm:px-4 max-sm:py-4"
        >
            <div className="flex flex-col gap-4 h-full">
                <div className="flex-1 flex flex-col gap-4">
                    <Select
                        value={selectedUserId}
                        onValueChange={(v) => setSelectedUserId(v)}
                    >
                        <SelectTrigger
                            className="SelectTrigger"
                            aria-label="Food"
                        >
                            <SelectValue placeholder={t("select-a-user")} />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectContent className="bg-background shadow">
                                <SelectViewport className="SelectViewport">
                                    {data?.map((item) => {
                                        return (
                                            <SelectItem
                                                key={item.user.id}
                                                value={item.user.id}
                                            >
                                                {`${item.user.nickname}(${item.data?.length})`}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectViewport>
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                    <div className="flex flex-col gap-4">
                        {t("import-strategy")}:
                        <RadioGroup.Root
                            className="flex items-center gap-4"
                            defaultValue={importStrategy}
                            onValueChange={(v) => {
                                setImportStrategy(v === "overlap" ? "overlap" : "add");
                            }}
                        >
                            <div className="flex gap-2 items-center">
                                <RadioGroup.Item
                                    className="w-6 h-6 rounded-full border flex justify-center items-center"
                                    value="add"
                                >
                                    <RadioGroup.Indicator className="block w-4 h-4 rounded-full bg-stone-900" />
                                </RadioGroup.Item>
                                <label className="Label" htmlFor="r1">
                                    {t("strategy-add")}
                                </label>
                            </div>
                            {/* <div className="flex gap-2 items-center">
							<RadioGroup.Item
								className="w-6 h-6 rounded-full border flex justify-center items-center"
								value="overlap"
							>
								<RadioGroup.Indicator className="block w-4 h-4 rounded-full bg-stone-900" />
							</RadioGroup.Item>
							<label className="Label" htmlFor="r2">
								{t("strategy-overlap")}
							</label>
						</div> */}
                        </RadioGroup.Root>
                    </div>
                </div>
                <div className="flex justify-end gap-2 items-center">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        {t("cancel")}
                    </Button>
                    <Button disabled={loading} onClick={toConfirm}>
                        {loading && <Loading />} {t("confirm")}
                    </Button>
                </div>
            </div>
        </FormDialog>
    );
}

// 事件驱动的弹窗管理
let resolveCallback: ((value: boolean | null) => void) | null = null;

export const OncentImport = () => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<OncentDatabaseData | undefined>();

    useEffect(() => {
        const handleShow = (event: Event) => {
            const customEvent = event as CustomEvent<OncentDatabaseData>;
            setEditData(customEvent.detail);
            setOpen(true);
        };

        window.addEventListener("show-oncent-import", handleShow);
        return () => {
            window.removeEventListener("show-oncent-import", handleShow);
        };
    }, []);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resolveCallback?.(null);
            resolveCallback = null;
        }
        setOpen(newOpen);
    };

    const handleConfirm = (value: boolean) => {
        resolveCallback?.(value);
        resolveCallback = null;
        setOpen(false);
    };

    const handleCancel = () => {
        resolveCallback?.(null);
        resolveCallback = null;
        setOpen(false);
    };

    return (
        <OncentImportForm
            open={open}
            onOpenChange={handleOpenChange}
            edit={editData}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );
};

export const showOncentImport = (edit?: OncentDatabaseData): Promise<boolean | null> => {
    return new Promise((resolve) => {
        resolveCallback = resolve;
        window.dispatchEvent(
            new CustomEvent("show-oncent-import", { detail: edit })
        );
    });
};
