import { useMemo } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import ComplexAddButton from "./add-button";
import { goAddBill } from "./bill-editor";
import { afterAddBillPromotion } from "./promotion";
import { showSettings } from "./settings";

export default function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentTab = useMemo(() => {
        const paths = ["/stat", "/tasks", "/tools", "/", "/search"];
        return paths.find(
            (x) => location.pathname.startsWith(x) || location.pathname === x,
        );
    }, [location.pathname]);

    const switchTab = (
        value: "/" | "/stat" | "/tasks" | "/tools" | "/search",
    ) => {
        navigate(`${value}`);
    };

    // 工具子页面隐藏tab栏
    const isToolSubPage =
        location.pathname.startsWith("/tools/") &&
        location.pathname !== "/tools";
    if (isToolSubPage) {
        return null;
    }

    return createPortal(
        <div
            className="floating-tab fixed w-screen h-18 flex items-center justify-around sm:h-screen
         sm:w-18 sm:flex-col sm:justify-start z-[0]
         bottom-[calc(.25rem+env(safe-area-inset-bottom))]
         sm:top-[env(safe-area-inset-top)] sm:left-[calc(.25rem+env(safe-area-inset-left))]
         backdrop-blur-lg bg-white/80 dark:bg-stone-900/80 rounded-xl shadow-lg"
        >
            {/* 任务 */}
            <button
                type="button"
                className={`w-14 h-14 sm:w-10 sm:h-10 cursor-pointer flex items-center justify-center rounded-xl m-2 transition-all hover:bg-pink-50 dark:hover:bg-pink-900/20 ${
                    currentTab === "/tasks"
                        ? "bg-pink-100 dark:bg-pink-900/30"
                        : ""
                }`}
                onClick={() => switchTab("/tasks")}
                title="任务"
            >
                <i
                    className={`icon-[mdi--format-list-bulleted] size-5 ${
                        currentTab === "/tasks"
                            ? "text-pink-500 dark:text-pink-400"
                            : "text-gray-600 dark:text-gray-400"
                    }`}
                ></i>
            </button>

            {/* 工具 */}
            <button
                type="button"
                className={`w-14 h-14 sm:w-10 sm:h-10 cursor-pointer flex items-center justify-center rounded-xl m-2 transition-all hover:bg-pink-50 dark:hover:bg-pink-900/20 ${
                    currentTab === "/tools"
                        ? "bg-pink-100 dark:bg-pink-900/30"
                        : ""
                }`}
                onClick={() => switchTab("/tools")}
                title="工具箱"
            >
                <i
                    className={`icon-[mdi--toolbox-outline] size-5 ${
                        currentTab === "/tools"
                            ? "text-pink-500 dark:text-pink-400"
                            : "text-gray-600 dark:text-gray-400"
                    }`}
                ></i>
            </button>

            {/* middle group */}
            <div className="flex items-center rounded-xl p-1 w-56 h-14 m-2 sm:flex-col sm:w-10 sm:h-50 sm:-order-1">
                <button
                    type="button"
                    className={`flex-1 h-full w-full transition rounded-xl flex items-center justify-center cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 ${
                        currentTab === "/"
                            ? "bg-pink-100 dark:bg-pink-900/30"
                            : ""
                    }`}
                    onClick={() => switchTab("/")}
                    title="首页"
                >
                    <i
                        className={`icon-[mdi--format-align-center] size-5 ${
                            currentTab === "/"
                                ? "text-pink-500 dark:text-pink-400"
                                : "text-gray-600 dark:text-gray-400"
                        }`}
                    ></i>
                </button>

                <ComplexAddButton
                    onClick={() => {
                        goAddBill();
                        afterAddBillPromotion();
                    }}
                />

                <button
                    type="button"
                    className={`flex-1 h-full w-full transition-all rounded-xl flex items-center justify-center cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 ${
                        currentTab === "/stat"
                            ? "bg-pink-100 dark:bg-pink-900/30"
                            : ""
                    }`}
                    onClick={() => switchTab("/stat")}
                    title="统计"
                >
                    <i
                        className={`icon-[mdi--chart-box-outline] size-5 ${
                            currentTab === "/stat"
                                ? "text-pink-500 dark:text-pink-400"
                                : "text-gray-600 dark:text-gray-400"
                        }`}
                    ></i>
                </button>
            </div>

            {/* 搜索 */}
            <button
                type="button"
                className={`w-14 h-14 sm:w-10 sm:h-10 cursor-pointer flex items-center justify-center rounded-xl m-2 transition-all hover:bg-pink-50 dark:hover:bg-pink-900/20 ${
                    currentTab === "/search"
                        ? "bg-pink-100 dark:bg-pink-900/30"
                        : ""
                }`}
                onClick={() => switchTab("/search")}
                title="搜索"
            >
                <i
                    className={`icon-[mdi--search] size-5 ${
                        currentTab === "/search"
                            ? "text-pink-500 dark:text-pink-400"
                            : "text-gray-600 dark:text-gray-400"
                    }`}
                ></i>
            </button>

            {/* settings */}
            <button
                type="button"
                className="w-14 h-14 sm:w-10 sm:h-10 cursor-pointer flex items-center justify-center rounded-xl m-2 transition-all hover:bg-pink-50 dark:hover:bg-pink-900/20"
                onClick={() => {
                    showSettings();
                }}
                title="设置"
            >
                <i className="icon-[mdi--more-horiz] size-5 text-gray-600 dark:text-gray-400"></i>
            </button>
        </div>,
        document.body,
    );
}
