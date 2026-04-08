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

export function getMobileHeaderMeta(pathname: string) {
    if (pathname === "/") {
        return { title: "Cent", subtitle: "婚礼账本与筹备中心" };
    }
    if (pathname === "/tasks") {
        return { title: "Cent", subtitle: "婚礼任务进度" };
    }
    if (pathname === "/tools") {
        return { title: "Cent", subtitle: "高效备婚，从这里开始" };
    }
    if (pathname === "/settings") {
        return { title: "设置", subtitle: "偏好、同步与账本配置" };
    }
    if (pathname === "/tasks/calendar") {
        return {
            title: "任务日历",
            subtitle: "按日期查看婚礼待办",
            backTo: "/tasks",
        };
    }
    if (pathname === "/tools/gift-book") {
        return {
            title: "礼金簿",
            subtitle: "记录收礼送礼与人情往来",
            backTo: "/tools",
        };
    }
    if (pathname === "/tools/guests") {
        return {
            title: "亲友管理",
            subtitle: "管理宾客名单与邀请状态",
            backTo: "/tools",
        };
    }
    if (pathname === "/tools/wedding-budget") {
        return {
            title: "婚礼预算",
            subtitle: "跟踪定金、尾款与执行情况",
            backTo: "/tools",
        };
    }
    if (pathname.startsWith("/search")) {
        return {
            title: "搜索记录",
            subtitle: "按备注、分类、金额和标签筛选账单",
            backTo: "/",
        };
    }
    if (pathname.startsWith("/stat")) {
        return {
            title: "统计分析",
            subtitle: "婚礼支出与收入结构总览",
            backTo: "/",
        };
    }
    return { title: "Cent" };
}

export function MobileTopBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const headerMeta = getMobileHeaderMeta(location.pathname);

    return (
        <header className="shrink-0 sm:hidden">
            <div className="border-b border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)]/96 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur-xl">
                <div className="mx-auto flex h-[calc(var(--mobile-topbar-height)-1rem)] max-w-[880px] items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        {headerMeta.backTo ? (
                            <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--wedding-text)] transition-colors hover:bg-white/70"
                                onClick={() => navigate(headerMeta.backTo)}
                            >
                                <i className="icon-[mdi--chevron-left] size-5" />
                            </button>
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-sm">
                                <i className="icon-[mdi--account] size-4" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <div
                                className={
                                    headerMeta.backTo
                                        ? "wedding-topbar-title truncate text-[24px] leading-none text-[color:var(--wedding-text)]"
                                        : "wedding-brand truncate text-[24px] leading-none"
                                }
                            >
                                {headerMeta.title}
                            </div>
                            {headerMeta.subtitle ? (
                                <div className="mt-1 truncate text-xs wedding-muted">
                                    {headerMeta.subtitle}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <button
                        type="button"
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                            location.pathname === "/settings"
                                ? "bg-pink-500/12 text-pink-500"
                                : "text-[color:var(--wedding-text-soft)] hover:bg-white/70"
                        }`}
                        onClick={() => navigate("/settings")}
                        aria-label="打开设置"
                    >
                        <i className="icon-[mdi--cog-outline] size-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();

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
            <nav className="fixed inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-20 px-3 sm:hidden">
                <div className="mx-auto flex h-[var(--mobile-bottombar-height)] max-w-[430px] items-center justify-between rounded-[32px] border border-white/70 bg-[color:var(--wedding-surface)]/92 px-3 shadow-[0_24px_40px_-24px_rgba(15,23,42,0.38)] backdrop-blur-2xl">
                    <div className="flex flex-1 items-end justify-between pr-4">
                        {items.slice(0, 2).map((item) => (
                            <button
                                key={item.path}
                                type="button"
                                className={`flex min-w-[62px] flex-col items-center gap-1 rounded-[20px] px-2 py-2 text-xs transition-all ${
                                    item.active
                                        ? "bg-gradient-to-b from-pink-500/16 to-fuchsia-500/8"
                                        : ""
                                }`}
                                onClick={() => navigate(item.path)}
                            >
                                <i
                                    className={`${item.icon} size-5 ${
                                        item.active
                                            ? "text-pink-500"
                                            : "text-[color:var(--wedding-text-mute)]"
                                    }`}
                                ></i>
                                <span
                                    className={
                                        item.active
                                            ? "text-pink-500"
                                            : "text-[color:var(--wedding-text-mute)]"
                                    }
                                >
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="relative -mt-7 flex h-[72px] w-[72px] items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[color:var(--wedding-app-bg)]/94 shadow-[0_-8px_24px_-18px_rgba(15,23,42,0.55)]"></div>
                        <div className="absolute inset-[7px] rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 wedding-fab-shadow"></div>
                        <ComplexAddButton
                            className="relative z-[1] !m-0 !h-14 !w-14 !rounded-full !bg-transparent [&_i]:!text-white"
                            onClick={() => {
                                goAddBill();
                                afterAddBillPromotion();
                            }}
                        />
                    </div>

                    <div className="flex flex-1 items-end justify-between pl-4">
                        {items.slice(2).map((item) => (
                            <button
                                key={item.path}
                                type="button"
                                className={`flex min-w-[62px] flex-col items-center gap-1 rounded-[20px] px-2 py-2 text-xs transition-all ${
                                    item.active
                                        ? "bg-gradient-to-b from-pink-500/16 to-fuchsia-500/8"
                                        : ""
                                }`}
                                onClick={() => navigate(item.path)}
                            >
                                <i
                                    className={`${item.icon} size-5 ${
                                        item.active
                                            ? "text-pink-500"
                                            : "text-[color:var(--wedding-text-mute)]"
                                    }`}
                                ></i>
                                <span
                                    className={
                                        item.active
                                            ? "text-pink-500"
                                            : "text-[color:var(--wedding-text-mute)]"
                                    }
                                >
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <aside className="fixed bottom-4 left-4 top-4 z-20 hidden w-[92px] flex-col rounded-[28px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)]/94 p-3 shadow-[var(--wedding-shadow-soft)] backdrop-blur-xl sm:flex">
                <button
                    type="button"
                    className="mb-4 flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white wedding-fab-shadow"
                    onClick={() => {
                        goAddBill();
                        afterAddBillPromotion();
                    }}
                    title="新增记录"
                >
                    <i className="icon-[mdi--plus] size-6" />
                </button>
                {sidebarItems.map((item) => {
                    const path = item.path;
                    const active =
                        path === "/"
                            ? location.pathname === "/"
                            : location.pathname.startsWith(path);
                    return (
                        <button
                            key={path}
                            type="button"
                            className={`mb-2 flex h-16 flex-col items-center justify-center gap-1 rounded-2xl transition-all ${
                                active
                                    ? "bg-gradient-to-br from-pink-500/16 to-violet-500/16 text-pink-500"
                                    : "text-[color:var(--wedding-text-soft)] hover:bg-white/60 dark:hover:bg-white/6"
                            }`}
                            onClick={() => navigate(path)}
                        >
                            <i className={`${item.icon} size-5`} />
                            <span className="text-xs">{item.label}</span>
                        </button>
                    );
                })}
                <button
                    type="button"
                    className={`mt-auto flex h-16 flex-col items-center justify-center gap-1 rounded-2xl transition-all ${
                        location.pathname === "/settings"
                            ? "bg-gradient-to-br from-pink-500/16 to-violet-500/16 text-pink-500"
                            : "text-[color:var(--wedding-text-soft)] hover:bg-white/60 dark:hover:bg-white/6"
                    }`}
                    onClick={() => navigate("/settings")}
                >
                    <i className="icon-[mdi--cog-outline] size-5" />
                    <span className="text-xs">设置</span>
                </button>
            </aside>
        </>,
        document.body,
    );
}
