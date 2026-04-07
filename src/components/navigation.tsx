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
        return paths.find((x) => location.pathname.startsWith(x) || location.pathname === x);
    }, [location.pathname]);

    const switchTab = (value: "/" | "/stat" | "/tasks" | "/tools" | "/search") => {
        navigate(`${value}`);
    };

    // 工具子页面隐藏tab栏
    const isToolSubPage = location.pathname.startsWith("/tools/") && location.pathname !== "/tools";
    if (isToolSubPage) {
        return null;
    }

    return createPortal(
        <div
            className="floating-tab fixed w-screen h-18 flex items-center justify-around sm:h-screen
         sm:w-18 sm:flex-col sm:justify-start z-[0]
         bottom-[calc(.25rem+env(safe-area-inset-bottom))]
         sm:top-[env(safe-area-inset-top)] sm:left-[calc(.25rem+env(safe-area-inset-left))]"
        >
            {/* 任务 */}
            <button
                type="button"
                className={`w-14 h-14 sm:w-10 sm:h-10 cursor-pointer flex items-center justify-center rounded-full shadow-md m-2 transition-all hover:bg-[#9a9ba2] active:bg-[#cdcdd0] dark:hover:bg-[#aba8a5] ${
                    currentTab === "/tasks"
                        ? "bg-[#cdcdd0] dark:bg-[#918c89]"
                        : "bg-background dark:bg-stone-500"
                }`}
                onClick={() => switchTab("/tasks")}
                title="任务"
            >
                <i className="icon-[mdi--format-list-bulleted] size-5 text-gray-800 dark:text-white"></i>
            </button>

            {/* 工具 */}
            <button
                type="button"
                className={`w-14 h-14 sm:w-10 sm:h-10 cursor-pointer flex items-center justify-center rounded-full shadow-md m-2 transition-all hover:bg-[#9a9ba2] active:bg-[#cdcdd0] dark:hover:bg-[#aba8a5] ${
                    currentTab === "/tools"
                        ? "bg-[#cdcdd0] dark:bg-[#918c89]"
                        : "bg-background dark:bg-stone-500"
                }`}
                onClick={() => switchTab("/tools")}
                title="工具箱"
            >
                <i className="icon-[mdi--toolbox-outline] size-5 text-gray-800 dark:text-white"></i>
            </button>

            {/* middle group */}
            <div className="flex items-center rounded-full p-1 bg-background dark:bg-stone-500 w-56 h-14 m-2 shadow-md sm:flex-col sm:w-10 sm:h-50 sm:-order-1">
                <button
                    type="button"
                    className={`flex-1 h-full w-full transition rounded-full flex items-center justify-center cursor-pointer hover:bg-[#9a9ba2] active:bg-[#cdcdd0] ${
                        currentTab === "/" ? "bg-foreground/20" : ""
                    }`}
                    onClick={() => switchTab("/")}
                    title="首页"
                >
                    <i className="icon-[mdi--format-align-center] size-5 text-gray-800 dark:text-white"></i>
                </button>

                <ComplexAddButton
                    onClick={() => {
                        goAddBill();
                        afterAddBillPromotion();
                    }}
                />

                <button
                    type="button"
                    className={`flex-1 h-full w-full transition-all rounded-full flex items-center justify-center cursor-pointer hover:bg-[#9a9ba2] active:bg-[#cdcdd0] ${
                        currentTab === "/stat" ? "bg-foreground/20" : ""
                    }`}
                    onClick={() => switchTab("/stat")}
                    title="统计"
                >
                    <i className="icon-[mdi--chart-box-outline] size-5 text-gray-800 dark:text-white"></i>
                </button>
            </div>

            {/* 搜索 */}
            <button
                type="button"
                className={`w-14 h-14 sm:w-10 sm:h-10 cursor-pointer flex items-center justify-center rounded-full shadow-md m-2 transition-all hover:bg-[#9a9ba2] active:bg-[#cdcdd0] ${
                    currentTab === "/search"
                        ? "bg-[#cdcdd0] dark:bg-[#918c89]"
                        : "bg-background dark:bg-stone-500"
                } dark:hover:bg-[#aba8a5]`}
                onClick={() => switchTab("/search")}
                title="搜索"
            >
                <i className="icon-[mdi--search] size-5 text-gray-800 dark:text-white"></i>
            </button>

            {/* settings */}
            <button
                type="button"
                className="w-14 h-14 sm:w-10 sm:h-10 cursor-pointer flex items-center justify-center rounded-full shadow-md m-2 transition-all hover:bg-[#9a9ba2] active:bg-[#cdcdd0] bg-background dark:bg-stone-500 dark:hover:bg-[#aba8a5]"
                onClick={() => {
                    showSettings();
                }}
                title="设置"
            >
                <i className="icon-[mdi--more-horiz] size-5 text-gray-800 dark:text-white"></i>
            </button>
        </div>,
        document.body,
    );
}
