const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
module.exports = {
    // Configure dark mode to use 'class' strategy
    // Requirements: 1.1, 1.2, 16.4
    darkMode: "class",
    content: ["./src/**/*.{js,ts,jsx,tsx}", "!./docs/**/*"],
    theme: {
        extend: {
            // Design System Colors - 设计系统颜色
            // Maps CSS variables to Tailwind color tokens
            // Requirements: 1.1, 1.2
            colors: {
                // Background colors - 背景色
                background: "var(--color-background)",
                card: {
                    DEFAULT: "var(--color-card-bg)",
                },
                // Text colors - 文字颜色
                text: {
                    primary: "var(--color-text-primary)",
                    secondary: "var(--color-text-secondary)",
                    tertiary: "var(--color-text-tertiary)",
                },
                // Brand colors - Purple - 主色调紫色系
                primary: {
                    DEFAULT: "var(--color-primary)",
                    hover: "var(--color-primary-hover)",
                    light: "var(--color-primary-light)",
                    lighter: "var(--color-primary-lighter)",
                },
                // Brand colors - Blue - 蓝色系
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    light: "var(--color-secondary-light)",
                },
                // Border colors - 边框颜色
                border: {
                    DEFAULT: "var(--color-border)",
                    light: "var(--color-border-light)",
                },
                // Legacy semantic color tokens (kept for backward compatibility)
                semantic: {
                    expense: "var(--color-expense)",
                    "expense-medium": "var(--color-expense-medium-legacy)",
                    "expense-muted": "var(--color-expense-400)",
                    income: "var(--color-income)",
                    "income-medium": "var(--color-income-medium-legacy)",
                    "income-muted": "var(--color-income-400)",
                },
                // Wedding theme colors (kept for backward compatibility)
                wedding: {
                    pink: "var(--wedding-pink)",
                    "pink-light": "var(--wedding-pink-light)",
                    purple: "var(--wedding-purple)",
                    "purple-light": "var(--wedding-purple-light)",
                },
                // Functional colors
                success: "var(--color-success)",
                error: "var(--color-error)",
                warning: "var(--color-warning)",
                info: "var(--color-info)",
            },
            // Font families - 字体族
            // Requirements: 1.3
            fontFamily: {
                sans: ["var(--font-primary)"],
                inter: ["var(--font-secondary)"],
            },
            // Font sizes - 字号
            // Requirements: 1.3
            fontSize: {
                h1: "var(--text-h1)",
                h2: "var(--text-h2)",
                h3: "var(--text-h3)",
                body: "var(--text-body)",
                caption: "var(--text-caption)",
                tiny: "var(--text-tiny)",
            },
            // Spacing - 间距
            // Requirements: 1.4
            spacing: {
                nav: "var(--nav-height)",
                "bottom-nav": "var(--bottom-nav-height)",
            },
            // Border radius - 圆角
            // Requirements: 1.5
            borderRadius: {
                card: "var(--radius-card)",
                icon: "var(--radius-icon-background)",
            },
            // Box shadow - 阴影
            // Requirements: 1.1
            boxShadow: {
                card: "var(--shadow-card)",
            },
            // Transition duration - 过渡时长
            // Requirements: 13.4
            transitionDuration: {
                theme: "200ms",
            },
            // Gradient backgrounds
            backgroundImage: {
                "wedding-gradient": "var(--wedding-gradient)",
                "wedding-gradient-pink-purple":
                    "var(--wedding-gradient-pink-purple)",
            },
            keyframes: {
                "overlay-show": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "content-show": {
                    from: {
                        opacity: "0",
                        transform: "scale(0.96)",
                    },
                    to: { opacity: "1", transform: "scale(1)" },
                },
                "slide-from-right": {
                    from: {
                        transform: "translateX(100%)",
                    },
                    to: {
                        transform: "translateX(0)",
                    },
                },
                "collapse-open": {
                    from: {
                        height: "0",
                    },
                    to: {
                        height: "var(--radix-collapsible-content-height)",
                    },
                },
                "collapse-close": {
                    from: {
                        height: "var(--radix-collapsible-content-height)",
                    },
                    to: {
                        height: "0",
                    },
                },
                "dynamic-bg": {
                    // 动画开始时使用 --color-start
                    "0%, 100%": { "background-color": "var(--color-start)" },
                    // 动画中间时使用 --color-end
                    "50%": { "background-color": "var(--color-end)" },
                },
                wiggle: {
                    "0%, 100%": { transform: "rotate(0deg)" },
                    "10%, 30%, 50%, 70%, 90%": { transform: "rotate(-3deg)" },
                    "20%, 40%, 60%, 80%": { transform: "rotate(3deg)" },
                },
            },
            animation: {
                "overlay-show":
                    "overlay-show 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                "content-show":
                    "content-show 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                "slide-from-right":
                    "slide-from-right 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                "collapse-open":
                    "collapse-open 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                "collapse-close":
                    "collapse-close 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                "dynamic-bg": "dynamic-bg 3s ease-in-out infinite",
                wiggle: "wiggle 1.5s ease-in-out infinite",
            },
        },
    },
    plugins: [
        plugin(({ addUtilities }) => {
            addUtilities({
                ".scrollbar-hidden": {
                    "::-webkit-scrollbar": {
                        display: "none",
                    },
                    /* 针对 IE 和 Edge */
                    "-ms-overflow-style": "none",
                    /* 针对 Firefox */
                    "scrollbar-width": "none",
                },
                // Glass effect utilities
                ".glass-card": {
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    "backdrop-filter": "blur(10px)",
                    "-webkit-backdrop-filter": "blur(10px)",
                },
                // Wedding gradient utilities
                ".wedding-gradient-bg": {
                    background: "var(--wedding-gradient)",
                },
                ".wedding-gradient-text": {
                    background: "var(--wedding-gradient-pink-purple)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                    "background-clip": "text",
                },
            });
        }),
    ],
};
