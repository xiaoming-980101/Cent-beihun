import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { buildSync } from "esbuild";
import Info from "unplugin-info/vite";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    const shouldAnalyze = process.env.ANALYZE === "true";

    const plugins: PluginOption[] = [
        Info(),
        createHtmlPlugin({
            inject: {
                data: {
                    VITE_GTAG_SCRIPT: env.VITE_GTAG_SCRIPT || "",
                    injectPresetScript: buildSync({
                        entryPoints: ["src/inline/load-preset.ts"],
                        bundle: true,
                        minify: true,
                        write: false,
                        format: "iife",
                    }).outputFiles[0].text,
                },
            },
        }),
        react(),
        svgr(),
        tailwindcss(),
        VitePWA({
            strategies: "injectManifest",
            srcDir: "src",
            filename: "sw.ts",
            registerType: "autoUpdate",
            injectRegister: "auto",
            includeAssets: ["favicon.ico", "apple-touch-icon.png"],
            manifest: {
                name: "Cent - 日计",
                short_name: "Cent",
                description: "Accounting your life - 记录每一天",
                theme_color: "#ffffff",
                icons: [
                    { src: "icon.png", sizes: "192x192", type: "image/png" },
                    { src: "icon.png", sizes: "512x512", type: "image/png" },
                ],
                protocol_handlers: [
                    {
                        protocol: "cent-accounting",
                        url: "/add-bills?text=%s",
                        client_mode: "focus-existing", // 优先聚焦现有窗口
                    } as any,
                ],
                launch_handler: {
                    client_mode: ["navigate-existing", "auto"], // 优先在现有窗口导航
                },
                // 注意：标准 URL 链接唤起通过应用层面的 URL 参数处理实现
                // 见 src/hooks/use-url-handler.tsx
            },
        }),
    ];

    if (shouldAnalyze) {
        // 只有在环境变量 ANALYZE=true 时才添加分析插件
        plugins.push(
            analyzer({
                analyzerMode: "static",
                fileName: "reports/bundle-stats.html",
                openAnalyzer: false,
                summary: true,
            }),
        );
    }
    return {
        plugins,
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (!id.includes("node_modules")) {
                            return;
                        }
                        if (id.includes("/tslib/")) {
                            return "vendor-tslib";
                        }
                        if (id.includes("/react-router")) {
                            return "vendor-router";
                        }
                        if (
                            id.includes("/@aws-sdk/") ||
                            id.includes("/@smithy/") ||
                            id.includes("/@aws-crypto/")
                        ) {
                            return "vendor-aws";
                        }
                        if (
                            id.includes("/react-intl/") ||
                            id.includes("/@formatjs/") ||
                            id.includes("/intl-messageformat/")
                        ) {
                            return "vendor-intl";
                        }
                        if (id.includes("/tailwind-merge/")) {
                            return "vendor-twmerge";
                        }
                        if (id.includes("/lunar-javascript/")) {
                            return "vendor-lunar";
                        }
                        if (id.includes("/@dnd-kit/")) {
                            return "vendor-dndkit";
                        }
                        if (
                            id.includes("/framer-motion/") ||
                            id.includes("/motion-dom/") ||
                            id.includes("/motion/")
                        ) {
                            return "vendor-motion";
                        }
                        if (
                            id.includes("/date-fns/") ||
                            id.includes("/@date-fns/") ||
                            id.includes("/react-day-picker/") ||
                            id.includes("/dayjs/")
                        ) {
                            return "vendor-date";
                        }
                        if (id.includes("/zrender")) {
                            return "vendor-zrender";
                        }
                        if (
                            id.includes("/echarts") ||
                            id.includes("/wordcloud")
                        ) {
                            if (id.includes("/wordcloud")) {
                                return "vendor-wordcloud";
                            }
                            return "vendor-echarts";
                        }
                        if (
                            id.includes("@radix-ui") ||
                            id.includes("/radix-ui")
                        ) {
                            return "vendor-radix";
                        }
                    },
                },
            },
        },
        resolve: {
            alias: {
                "@": resolve("./src"),
            },
        },
        worker: {
            format: "es",
        },
        server: {
            proxy: {
                // 这里的 '/api' 是你在代码中调用的路径前缀
                "/google-api": {
                    target: "https://generativelanguage.googleapis.com", // 目标接口域名
                    changeOrigin: true, // 必须设置为 true，以便绕过主机检查
                    rewrite: (path) => path.replace(/^\/google-api/, ""), // 去掉路径中的前缀
                    // 如果你的网络环境需要科学上网，且使用了本地代理软件，可能需要配置此项（可选）
                    // secure: false,
                },
            },
        },
    };
});
