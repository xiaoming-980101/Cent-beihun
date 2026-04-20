import { produce } from "immer";
import { create } from "zustand";
import { getEnableHashMode } from "@/store/preference";
import hashBack from "./hash-back";

const CONFIRM_DIALOG_BASE_Z = 4;

// 单个实例的状态定义
type InstanceState<Value = unknown, Returned = unknown> = {
    visible: boolean;
    zIndex?: number;
    edit?: Value;
    controller?: {
        resolve: (val: Returned) => void;
        reject: (reason?: unknown) => void;
        promise: Promise<Returned>;
        cancel: () => void;
    };
    openId: string;
};

// 全局 Store 的总状态
type GlobalConfirmState = {
    instances: Record<string, InstanceState>;
};

type GlobalConfirmActions = {
    // 初始化或打开弹窗
    open: <V, R>(id: string, value?: V) => [Promise<R | undefined>, () => void];
    // 更新指定 ID 的状态
    update: (id: string, partial: Partial<InstanceState>) => void;
    // 清理/移除实例（防止内存泄漏）
    remove: (id: string) => void;
};

export const useGlobalConfirmStore = create<
    GlobalConfirmState & GlobalConfirmActions
>()((set, get) => ({
    instances: {},

    open: <V, R>(id: string, value?: V) => {
        const controller = get().instances[id]?.controller;
        if (controller)
            return [controller.promise as Promise<R | undefined>, controller.cancel] as const;

        const openId = `id-${Date.now()}`;
        const { promise, reject, resolve } = Promise.withResolvers<R | undefined>();

        let cancelled = false;
        const innerCancel = () => {
            if (cancelled) {
                return;
            }
            cancelled = true;
            resolve(undefined); // 改为 resolve undefined 而不是 reject
            get().update(id, {
                visible: false,
                controller: undefined,
            });
        };

        let cancel: () => void;
        const enableHash = getEnableHashMode();
        if (enableHash) {
            const hash = hashBack.register(() => innerCancel());
            cancel = () => hash.close();
            hash.open();
        } else {
            cancel = innerCancel;
        }
        set(
            produce((state: GlobalConfirmState) => {
                const visibleCount = Object.values(state.instances).filter(
                    (i) => i.visible,
                ).length;
                state.instances[id] = {
                    visible: true,
                    zIndex: CONFIRM_DIALOG_BASE_Z + visibleCount,
                    edit: value,
                    openId,
                    controller: {
                        resolve: resolve as (val: unknown) => void,
                        reject: reject as (reason?: unknown) => void,
                        promise: promise as Promise<unknown>,
                        cancel,
                    },
                };
            }),
        );
        return [promise as Promise<R | undefined>, cancel] as const;
    },

    update: (id, partial) => {
        set(
            produce((state: GlobalConfirmState) => {
                if (state.instances[id]) {
                    Object.assign(state.instances[id], partial);
                }
            }),
        );
    },

    remove: (id) => {
        set(
            produce((state: GlobalConfirmState) => {
                delete state.instances[id];
            }),
        );
    },
}));
