/**
 * 弹窗动画配置
 * 统一管理所有弹窗的动画参数，确保一致性
 */

// 动画时长（毫秒）
export const ANIMATION_DURATION = {
    fast: 150, // 按钮反馈
    normal: 200, // 弹窗进入/退出（加速）
    slow: 300, // 复杂动画
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
    // 半屏弹窗 - 响应灵敏的弹性（经过优化以提升流畅度）
    snappy: {
        type: "spring" as const,
        damping: 38,
        stiffness: 450,
        mass: 0.5, // 减小质量，让动画更轻快
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
            opacity: 0.5,
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
            scale: 0.98,
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
            scale: 0.98,
            opacity: 0,
            y: "-50%",
            x: "-50%",
        },
    },

    // 半屏弹窗 - 从底部滑入
    halfscreen: {
        initial: {
            y: "100%",
        },
        animate: {
            y: 0,
        },
        exit: {
            y: "100%",
        },
    },

    // 背景遮罩 - 仅淡入，模糊效果由静态 CSS 处理以提升性能
    backdrop: {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
        },
        exit: {
            opacity: 0,
        },
    },
} as const;

// 按钮交互动画
export const BUTTON_VARIANTS = {
    // 点击反馈
    tap: {
        scale: 0.96,
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
    dragElastic: 0.05,
    // 关闭阈值
    closeThreshold: 80,
    // 速度阈值
    velocityThreshold: 400,
} as const;

// 响应式断点
export const BREAKPOINTS = {
    mobile: 640,
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

    if (offset.y > 0) {
        if (velocity.y > velocityThreshold) {
            return offset.y > closeThreshold * 0.4;
        }
        return offset.y > closeThreshold;
    }

    return false;
};
