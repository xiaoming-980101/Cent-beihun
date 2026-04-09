import { useMemo } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import { goBackOrNavigate } from "@/components/wedding-ui";
import { useBookStore } from "@/store/book";
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

export function getMobileHeaderMeta(pathname: string, bookName?: string) {
    const bookLabel = bookName || "当前账本";

    if (pathname === "/") {
        return { title: "Cent", subtitle: `${bookLabel}账本与工具中心` };
    }
    if (pathname === "/tasks") {
        return { title: "Cent", subtitle: `${bookLabel}任务进度` };
    }
    if (pathname === "/tools") {
        return { title: "Cent", subtitle: `${bookLabel}常用工具` };
    }
    if (pathname === "/settings") {
        return { title: "设置", subtitle: "偏好、同步与账本配置" };
    }
    if (pathname === "/tasks/calendar") {
        return {
            title: "任务日历",
            subtitle: `按日期查看${bookLabel}待办`,
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
            title: "预算管理",
            subtitle: `跟踪${bookLabel}预算与执行情况`,
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
            subtitle: `${bookLabel}支出与收入结构总览`,
            backTo: "/",
        };
    }
    return { title: "Cent" };
}

export function MobileTopBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentBookName = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((book) => book.id === currentBookId)?.name;
        }),
    );
    const headerMeta = getMobileHeaderMeta(location.pathname, currentBookName);

    return (
        <header className="shrink-0 sm:hidden">
            <div className="border-b border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.5rem)]">
                <div className="mx-auto flex h-[calc(var(--mobile-topbar-height)-1rem)] max-w-[880px] items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        {headerMeta.backTo ? (
                            <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--wedding-text)] transition-colors hover:bg-[color:var(--wedding-surface-muted)]"
                                onClick={() =>
                                    goBackOrNavigate(
                                        navigate,
                                        headerMeta.backTo,
                                    )
                                }
                            >
                                <i className="icon-[mdi--chevron-left] size-5" />
                            </button>
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] text-pink-500 shadow-sm">
                                <i className="icon-[mdi--account] size-4" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <div
                                className={
                                    headerMeta.backTo
                                        ? "wedding-topbar-title truncate text-[22px] leading-none text-[color:var(--wedding-text)]"
                                        : "wedding-brand truncate text-[18px] leading-none"
                                }
                            >
                                {headerMeta.title}
                            </div>
                            {headerMeta.subtitle ? (
                                <div className="mt-1 truncate text-[11px] wedding-muted">
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
                                : "text-[color:var(--wedding-text-soft)] hover:bg-[color:var(--wedding-surface-muted)]"
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
            <nav
                className={`fixed inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-20 px-3 sm:hidden ${
                    showMobileBottomNav ? "" : "hidden"
                }`}
            >
                <div className="mx-auto flex h-[var(--mobile-bottombar-height)] max-w-[430px] items-center justify-between rounded-[22px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-3 shadow-[0_18px_32px_-26px_rgba(15,23,42,0.45)]">
                    <div className="flex flex-1 items-end justify-between pr-4">
                        {items.slice(0, 2).map((item) => (
                            <button
                                key={item.path}
                                type="button"
                                className={`flex min-w-[62px] flex-col items-center gap-1 rounded-[16px] px-2 py-2 text-[11px] transition-all ${
                                    item.active ? "text-pink-500" : ""
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

                    <div className="relative -mt-8 flex h-[74px] w-[74px] items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[color:var(--wedding-app-bg)] shadow-[0_-8px_24px_-20px_rgba(15,23,42,0.65)]"></div>
                        <div className="absolute inset-[8px] rounded-full bg-gradient-to-r from-[#ef5cab] to-[#cb4dc8] shadow-[0_16px_28px_-16px_rgba(239,92,171,0.95)]"></div>
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
                                className={`flex min-w-[62px] flex-col items-center gap-1 rounded-[16px] px-2 py-2 text-[11px] transition-all ${
                                    item.active ? "text-pink-500" : ""
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
