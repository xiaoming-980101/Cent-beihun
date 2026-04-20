import type { Modal } from "@/components/modal";
import type { Action, Full } from "@/database/stash";
import type { Bill } from "@/ledger/type";
export type ChangeListener = (args: { bookId: string }) => void;

export type UserInfo = {
    avatar_url: string;
    name: string;
    // login: string;
    id: string;
};

export type Book = { id: string; name: string };

export type SyncEndpointConfig = {
    repoPrefix: string;
    entryName: string;
    orderKeys: string[];
};

export type SyncEndpoint = {
    logout: () => Promise<unknown>;

    fetchAllBooks: () => Promise<Book[]>;
    createBook: (name: string) => Promise<{
        id: string;
        name: string;
    }>;
    initBook: (id: string) => Promise<unknown>;
    inviteForBook?: (bookId: string) => Promise<unknown>;
    deleteBook: (bookId: string) => Promise<unknown>;

    batch: (
        bookId: string,
        actions: Action<Bill>[],
        overlap?: boolean,
    ) => Promise<void>;
    getMeta: (bookId: string) => Promise<unknown>;
    getAllItems: (bookId: string) => Promise<Full<Bill>[]>;
    onChange(listener: (args: { bookId: string }) => void): () => void;

    getIsNeedSync: () => Promise<boolean>;
    onSync: (processor: (finished: Promise<void>) => void) => () => void;
    toSync: () => Promise<unknown>;

    getUserInfo: (id?: string) => Promise<UserInfo>;
    getCollaborators: (id: string) => Promise<UserInfo[]>;

    getOnlineAsset?: (src: string, store: string) => Promise<Blob | undefined>;

    forceNeedSync?: (store: string) => void;
};

export type SyncEndpointFactory = {
    type: string;
    name: string;
    login: (ctx: { modal: Modal }) => void;
    manuallyLogin?: (ctx: { modal: Modal }) => void;
    init: (ctx: { modal: Modal }) => SyncEndpoint;
};
