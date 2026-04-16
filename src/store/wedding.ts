/**
 * 婚礼筹备助手 - 状态管理
 */

import { produce } from "immer";
import { v4 } from "uuid";
import { create } from "zustand";
import { DEFAULT_WEDDING_DATA } from "@/wedding/constants";
import type {
    GiftRecord,
    Guest,
    WeddingBudget,
    WeddingData,
    WeddingTask,
} from "@/wedding/type";
import { useBookStore } from "./book";
import { useLedgerStore } from "./ledger";

type WeddingStoreState = {
    weddingData: WeddingData | null;
    loading: boolean;
    initialized: boolean;
};

type WeddingStoreActions = {
    init: () => Promise<void>;

    // 日期管理
    updateEngagementDate: (date: number) => Promise<void>;
    updateWeddingDate: (date: number) => Promise<void>;
    updatePartnerName: (name: string) => Promise<void>;

    // 任务管理
    addTask: (task: Omit<WeddingTask, "id" | "createdAt">) => Promise<void>;
    updateTask: (id: string, task: Partial<WeddingTask>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;

    // 亲友管理
    addGuest: (guest: Omit<Guest, "id">) => Promise<void>;
    updateGuest: (id: string, guest: Partial<Guest>) => Promise<void>;
    deleteGuest: (id: string) => Promise<void>;

    // 礼金管理
    addGiftRecord: (record: Omit<GiftRecord, "id">) => Promise<void>;
    updateGiftRecord: (
        id: string,
        record: Partial<GiftRecord>,
    ) => Promise<void>;
    deleteGiftRecord: (id: string) => Promise<void>;

    // 预算管理
    addBudget: (budget: Omit<WeddingBudget, "id">) => Promise<void>;
    updateBudget: (id: string, budget: Partial<WeddingBudget>) => Promise<void>;
    deleteBudget: (id: string) => Promise<void>;

    // 数据刷新
    refreshData: () => Promise<void>;
};

type WeddingStore = WeddingStoreState & WeddingStoreActions;

export const useWeddingStore = create<WeddingStore>()((set, get) => {
    // 获取当前婚礼数据（从 GlobalMeta.wedding 字段读取）
    const fetchWeddingData = async (): Promise<WeddingData | null> => {
        const ledgerStore = useLedgerStore.getState();
        const meta = ledgerStore.infos?.meta;
        if (!meta) return null;

        // 从 GlobalMeta.wedding 字段获取婚礼数据
        return (meta as any).wedding ?? null;
    };

    // 更新婚礼数据（通过 updateGlobalMeta 写入 meta.wedding 字段）
    const updateWeddingData = async (newData: WeddingData) => {
        const ledgerStore = useLedgerStore.getState();

        try {
            // 使用现有的 updateGlobalMeta 方法更新 meta.wedding 字段
            await ledgerStore.updateGlobalMeta((prevMeta) => {
                return {
                    ...prevMeta,
                    wedding: newData,
                };
            });

            set(
                produce((state: WeddingStore) => {
                    state.weddingData = newData;
                }),
            );
        } catch (error) {
            // 如果是 AbortError，忽略它（通常是因为快速连续更新）
            if (error instanceof Error && error.name === "AbortError") {
                console.warn("Wedding data update aborted, will retry");
                // 直接更新本地状态
                set(
                    produce((state: WeddingStore) => {
                        state.weddingData = newData;
                    }),
                );
            } else {
                console.error("Failed to update wedding data:", error);
                throw error;
            }
        }
    };

    const init = async () => {
        // 确保账本已初始化
        const currentBookId = useBookStore.getState().currentBookId;
        if (!currentBookId) {
            return;
        }

        set(
            produce((state: WeddingStore) => {
                state.loading = true;
            }),
        );

        try {
            // 等待 ledgerStore 初始化完成
            const ledgerStore = useLedgerStore.getState();
            if (!ledgerStore.infos?.meta) {
                // 如果 meta 未加载，等待刷新
                await ledgerStore.refreshBillList();
            }

            const data = await fetchWeddingData();
            set(
                produce((state: WeddingStore) => {
                    state.weddingData = data ?? DEFAULT_WEDDING_DATA;
                    state.loading = false;
                    state.initialized = true;
                }),
            );
        } catch (err) {
            console.error("Wedding store init failed:", err);
            set(
                produce((state: WeddingStore) => {
                    state.loading = false;
                    state.initialized = true;
                }),
            );
        }
    };

    // 监听 ledgerStore 数据变化，自动刷新婚礼数据
    useLedgerStore.subscribe((state, prev) => {
        // 当 meta 变化时刷新婚礼数据
        if (state.infos?.meta !== prev.infos?.meta && get().initialized) {
            const weddingData =
                (state.infos?.meta as any)?.wedding ?? DEFAULT_WEDDING_DATA;
            set(
                produce((s: WeddingStore) => {
                    s.weddingData = weddingData;
                }),
            );
        }
    });

    return {
        weddingData: null,
        loading: false,
        initialized: false,

        init,

        updateEngagementDate: async (date) => {
            const prev = get().weddingData;
            if (!prev) return;
            await updateWeddingData({ ...prev, engagementDate: date });
        },

        updateWeddingDate: async (date) => {
            const prev = get().weddingData;
            if (!prev) return;
            await updateWeddingData({ ...prev, weddingDate: date });
        },

        updatePartnerName: async (name) => {
            const prev = get().weddingData;
            if (!prev) return;
            await updateWeddingData({ ...prev, partnerName: name });
        },

        addTask: async (task) => {
            const prev = get().weddingData;
            if (!prev) return;
            const newTask: WeddingTask = {
                ...task,
                id: v4(),
                createdAt: Date.now(),
            };
            await updateWeddingData({
                ...prev,
                tasks: [...prev.tasks, newTask],
            });
        },

        updateTask: async (id, task) => {
            const prev = get().weddingData;
            if (!prev) return;
            const tasks = prev.tasks.map((t) =>
                t.id === id ? { ...t, ...task } : t,
            );
            await updateWeddingData({ ...prev, tasks });
        },

        deleteTask: async (id) => {
            const prev = get().weddingData;
            if (!prev) return;
            const tasks = prev.tasks.filter((t) => t.id !== id);
            await updateWeddingData({ ...prev, tasks });
        },

        addGuest: async (guest) => {
            const prev = get().weddingData;
            if (!prev) return;
            const newGuest: Guest = { ...guest, id: v4() };
            await updateWeddingData({
                ...prev,
                guests: [...prev.guests, newGuest],
            });
        },

        updateGuest: async (id, guest) => {
            const prev = get().weddingData;
            if (!prev) return;
            const guests = prev.guests.map((g) =>
                g.id === id ? { ...g, ...guest } : g,
            );
            await updateWeddingData({ ...prev, guests });
        },

        deleteGuest: async (id) => {
            const prev = get().weddingData;
            if (!prev) return;
            const guests = prev.guests.filter((g) => g.id !== id);
            await updateWeddingData({ ...prev, guests });
        },

        addGiftRecord: async (record) => {
            const prev = get().weddingData;
            if (!prev) return;
            const newRecord: GiftRecord = { ...record, id: v4() };
            await updateWeddingData({
                ...prev,
                giftRecords: [...prev.giftRecords, newRecord],
            });
        },

        updateGiftRecord: async (id, record) => {
            const prev = get().weddingData;
            if (!prev) return;
            const giftRecords = prev.giftRecords.map((r) =>
                r.id === id ? { ...r, ...record } : r,
            );
            await updateWeddingData({ ...prev, giftRecords });
        },

        deleteGiftRecord: async (id) => {
            const prev = get().weddingData;
            if (!prev) return;
            const giftRecords = prev.giftRecords.filter((r) => r.id !== id);
            await updateWeddingData({ ...prev, giftRecords });
        },

        addBudget: async (budget) => {
            const prev = get().weddingData;
            if (!prev) return;
            const newBudget: WeddingBudget = { ...budget, id: v4() };
            await updateWeddingData({
                ...prev,
                weddingBudgets: [...prev.weddingBudgets, newBudget],
            });
        },

        updateBudget: async (id, budget) => {
            const prev = get().weddingData;
            if (!prev) return;
            const weddingBudgets = prev.weddingBudgets.map((b) =>
                b.id === id ? { ...b, ...budget } : b,
            );
            await updateWeddingData({ ...prev, weddingBudgets });
        },

        deleteBudget: async (id) => {
            const prev = get().weddingData;
            if (!prev) return;
            const weddingBudgets = prev.weddingBudgets.filter(
                (b) => b.id !== id,
            );
            await updateWeddingData({ ...prev, weddingBudgets });
        },

        refreshData: async () => {
            await init();
        },
    };
});
