import { useNetworkStatus } from "@/hooks/use-network-status";

export function OfflineBanner() {
    const { isOnline } = useNetworkStatus();

    if (isOnline) {
        return null;
    }

    return (
        <div className="fixed left-3 right-3 top-3 z-[90] rounded-xl bg-amber-500 px-3 py-2 text-center text-xs font-medium text-white shadow-lg">
            当前处于离线状态，数据将在网络恢复后同步。
        </div>
    );
}

