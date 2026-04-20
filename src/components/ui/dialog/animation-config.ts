/**
 * 弹窗动画配置
 * 统一管理所有弹窗的动画参数，确保一致性
 */

// 动画时长（毫秒）
export const ANIMATION_DURATION = {
    fast: 150, // 按钮反馈
    normal: 250, // 弹窗进入/退出
    slow: 350, // 复杂动画
} as const;

// Spring 弹性配置
export const SPRING_CONFIG = {
    // 全屏弹窗 - 较柔和的弹性
    gentle: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
        mass: 0.8,
    },
    // 半屏弹窗 - 较快速的弹性
    snappy: {
        type: "spring" as const,
        damping: 35,
        stiffness: 400,
        mass: 0.6,
    },
    // 按钮反馈 - 较弹的效果
    bouncy: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300,
        mass: 0.5,
    },
} as const;

// 动画变体定义
export const MODAL_VARIANTS = {
    // 全屏弹窗（移动端）- 从底部滑入
    fullscreenMobile: {
        initial: {
            y: "100%",
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
        },
        exit: {
            y: "100%",
            opacity: 0,
        },
    },

    // 全屏弹窗（PC端）- 缩放淡入
    fullscreenDesktop: {
        initial: {
            scale: 0.95,
            opacity: 0,
            y: "-50%",
            x: "-50%",
        },
        animate: {
            scale: 1,
            opacity: 1,
            y: "-50%",
            x: "-50%",
        },
        exit: {
            scale: 0.95,
            opacity: 0,
            y: "-50%",
            x: "-50%",
        },
    },

    // 半屏弹窗 - 从底部滑入（较短距离）
    halfscreen: {
        initial: {
            y: "100%",
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
        },
        exit: {
            y: "100%",
            opacity: 0,
        },
    },

    // 背景遮罩 - 淡入 + 模糊
    backdrop: {
        initial: {
            opacity: 0,
            backdropFilter: "blur(0px)",
        },
        animate: {
            opacity: 1,
            backdropFilter: "blur(8px)",
        },
        exit: {
            opacity: 0,
            backdropFilter: "blur(0px)",
        },
    },
} as const;

// 按钮交互动画
export const BUTTON_VARIANTS = {
    // 点击反馈
    tap: {
        scale: 0.95,
    },
    // 悬停效果（PC端）
    hover: {
        scale: 1.02,
    },
} as const;

// 拖拽配置
export const DRAG_CONFIG = {
    // 拖拽约束
    dragConstraints: { top: 0, bottom: 0, left: 0, right: 0 },
    // 拖拽弹性
    dragElastic: 0.1,
    // 关闭阈值（拖拽距离超过此值自动关闭）
    closeThreshold: 100,
    // 拖拽速度阈值（快速拖拽时降低关闭阈值）
    velocityThreshold: 500,
} as const;

// 响应式断点
export const BREAKPOINTS = {
    mobile: 640, // sm breakpoint
} as const;

// 工具函数：判断是否为移动端
export const isMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < BREAKPOINTS.mobile;
};

// 工具函数：获取安全区域
export const getSafeAreaInsets = () => {
    if (typeof window === "undefined") {
        return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const style = getComputedStyle(document.documentElement);
    return {
        top: parseInt(style.getPropertyValue("--safe-area-inset-top") || "0"),
        bottom: parseInt(
            style.getPropertyValue("--safe-area-inset-bottom") || "0",
        ),
        left: parseInt(style.getPropertyValue("--safe-area-inset-left") || "0"),
        right: parseInt(
            style.getPropertyValue("--safe-area-inset-right") || "0",
        ),
    };
};

// 工具函数：计算拖拽关闭
export const shouldCloseOnDrag = (
    offset: { x: number; y: number },
    velocity: { x: number; y: number },
): boolean => {
    const { closeThreshold, velocityThreshold } = DRAG_CONFIG;

    // 向下拖拽
    if (offset.y > 0) {
        // 快速拖拽时降低阈值
        if (velocity.y > velocityThreshold) {
            return offset.y > closeThreshold * 0.5;
        }
        // 正常拖拽
        return offset.y > closeThreshold;
    }

    return false;
};
