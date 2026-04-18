import { wrap } from "comlink";
import modal from "@/components/modal";
import type { SyncEndpointFactory } from "../endpoints/type";
import type { Exposed } from "./worker";
import DeferredWorker from "./worker?worker";

const endpointLoaders = {
    github: async () => (await import("../endpoints/github")).GithubEndpoint,
    offline: async () => (await import("../endpoints/offline")).OfflineEndpoint,
    webdav: async () => (await import("../endpoints/web-dav")).WebDAVEndpoint,
    gitee: async () => (await import("../endpoints/gitee")).GiteeEndpoint,
    s3: async () => (await import("../endpoints/s3")).S3Endpoint,
};
type EndpointType = keyof typeof endpointLoaders;

const SYNC_ENDPOINT_KEY = "SYNC_ENDPOINT";
const fallbackEndpointType: EndpointType = "github";
const rawEndpointType = localStorage.getItem(SYNC_ENDPOINT_KEY);
const endpointType: EndpointType =
    rawEndpointType && rawEndpointType in endpointLoaders
        ? (rawEndpointType as EndpointType)
        : fallbackEndpointType;

const loadEndpoint = async (type: EndpointType): Promise<SyncEndpointFactory> => {
    return endpointLoaders[type]();
};

const activeEndpoint = await loadEndpoint(endpointType);
const actions = activeEndpoint.init({ modal });

const loadEndpointByString = async (type: string) => {
    if (!(type in endpointLoaders)) {
        return;
    }
    return loadEndpoint(type as EndpointType);
};

export const StorageAPI = {
    name: activeEndpoint.name,
    type: activeEndpoint.type,
    ...actions,
    loginWith: async (type: string) => {
        const endpoint = await loadEndpointByString(type);
        return endpoint?.login?.({ modal });
    },
    loginManuallyWith: async (type: string) => {
        const endpoint = await loadEndpointByString(type);
        return endpoint?.manuallyLogin?.({ modal });
    },
};

// ComlinkSharedWorker

const workerInstance = new DeferredWorker({
    /* normal Worker options*/
});
const StorageDeferredAPI = wrap<Exposed>(workerInstance);

export { StorageDeferredAPI };
