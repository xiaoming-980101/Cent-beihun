import { useMemo } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import ComplexAddButton from "./add-button";
import { goAddBill } from "./bill-editor";
import { afterAddBillPromotion } from "./promotion";

const mobileTabItems = [
    { path: "/", label: "首页", icon: "icon-[mdi--home-outline]" },
    {
        path: "/tasks",
        label: "任务",
        icon: "icon-[mdi--format-list-checkbox]",
    },
    { path: "/tools", label: "工具", icon: "icon-[mdi--toolbox-outline]" },
    { path: "/settings", label: "设置", icon: "icon-[mdi--cog-outline]" },
];

export function isMobileTabPage(pathname: string) {
    return mobileTabItems.some((item) => item.path === pathname);
}

export default function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const showMobileBottomNav = isMobileTabPage(location.pathname);

    const items = useMemo(() => {
        return mobileTabItems.map((item) => ({
            ...item,
            active:
                item.path === "/"
                    ? location.pathname === item.path
                    : location.pathname === item.path ||
                      location.pathname.startsWith(`${item.path}/`),
        }));
    }, [location.pathname]);

    const sidebarItems = [
        { path: "/", label: "首页", icon: "icon-[mdi--home-outline]" },
        {
            path: "/tasks",
            label: "任务",
            icon: "icon-[mdi--format-list-checkbox]",
        },
        { path: "/tools", label: "工具", icon: "icon-[mdi--toolbox-outline]" },
        {
            path: "/search",
            label: "搜索",
            icon: "icon-[mdi--text-box-search-outline]",
        },
        { path: "/stat", label: "统计", icon: "icon-[mdi--chart-donut]" },
    ];

    return createPortal(
        <>
            {/* 移动端底部导航 */}
            <nav
                className={`fixed inset-x-0 bottom-0 z-40 px-6 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-4 sm:hidden transition-all duration-300 ${
                    showMobileBottomNav ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
                }`}
            >
                <div className="mx-auto flex h-[72px] max-w-[430px] items-center justify-between rounded-[32px] bg-[color:var(--wedding-surface)]/80 px-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] backdrop-blur-2xl border border-white/20 dark:border-white/5">
                    <div className="flex flex-1 items-center justify-around">
                        {items.slice(0, 2).map((item) => (
                            <button
                                key={item.path}
                                type="button"
                                className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all active:scale-90 ${
                                    item.active ? "text-pink-500" : "text-[color:var(--wedding-text-soft)]"
                                }`}
                                onClick={() => navigate(item.path)}
                            >
                                <i className={`${item.icon} size-6`}></i>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative -mt-10 flex size-[76px] shrink-0 items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[color:var(--wedding-app-bg)]/80 backdrop-blur-md shadow-xl"></div>
                        <div className="absolute inset-[6px] rounded-full bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-violet-500 shadow-lg shadow-pink-500/30"></div>
                        <ComplexAddButton
                            className="relative z-10 !m-0 !h-full !w-full !rounded-full !bg-transparent !border-none shadow-none hover:scale-105 active:scale-95 transition-transform"
                            onClick={() => {
                                goAddBill();
                                afterAddBillPromotion();
                            }}
                        />
                    </div>

                    <div className="flex flex-1 items-center justify-around">
                        {items.slice(2).map((item) => (
                            <button
                                key={item.path}
                                type="button"
                                className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all active:scale-90 ${
                                    item.active ? "text-pink-500" : "text-[color:var(--wedding-text-soft)]"
                                }`}
                                onClick={() => navigate(item.path)}
                            >
                                <i className={`${item.icon} size-6`}></i>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* 桌面端侧边栏 */}
            <aside className="fixed bottom-6 left-6 top-6 z-40 hidden w-[100px] flex-col rounded-[36px] bg-[color:var(--wedding-surface)]/80 p-4 shadow-2xl backdrop-blur-2xl border border-white/20 dark:border-white/5 sm:flex">
                <button
                    type="button"
                    className="mb-8 flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all"
                    onClick={() => {
                        goAddBill();
                        afterAddBillPromotion();
                    }}
                >
                    <i className="icon-[mdi--plus] size-8" />
                </button>
                
                <div className="flex flex-col gap-4">
                    {sidebarItems.map((item) => {
                        const active = item.path === "/" 
                            ? location.pathname === "/" 
                            : location.pathname.startsWith(item.path);
                        return (
                            <button
                                key={item.path}
                                type="button"
                                className={`flex h-16 flex-col items-center justify-center gap-1 rounded-2xl transition-all active:scale-90 ${
                                    active
                                        ? "bg-pink-500/10 text-pink-500"
                                        : "text-[color:var(--wedding-text-soft)] hover:bg-white/40 dark:hover:bg-white/5"
                                }`}
                                onClick={() => navigate(item.path)}
                            >
                                <i className={`${item.icon} size-6`} />
                                <span className="text-[10px] font-bold">{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    className={`mt-auto flex h-16 flex-col items-center justify-center gap-1 rounded-2xl transition-all active:scale-90 ${
                        location.pathname === "/settings"
                            ? "bg-pink-500/10 text-pink-500"
                            : "text-[color:var(--wedding-text-soft)] hover:bg-white/40 dark:hover:bg-white/5"
                    }`}
                    onClick={() => navigate("/settings")}
                >
                    <i className="icon-[mdi--cog-outline] size-6" />
                    <span className="text-[10px] font-bold">设置</span>
                </button>
            </aside>
        </>,
        document.body,
    );
}
