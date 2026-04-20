import "./utils/shim";
import "@/utils/fetch-proxy";

import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { ThemeProvider } from "@/lib/theme/theme-provider";
import Login from "./components/login";
import { ErrorBoundary, OfflineBanner } from "./components/shared";
import { initIntl, LocaleProvider } from "./locale/index";
import { usePreferenceStore } from "./store/preference";
import { register as registerLaunchQueue } from "./utils/launch-queue";
import { lazyWithReload } from "./utils/lazy";

const Rooot = lazyWithReload(() => import("./route"));

const lang = usePreferenceStore.getState().locale;

if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
}

initIntl(lang).then(() => {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
        throw new Error("Root element not found");
    }

    createRoot(rootElement).render(
        <StrictMode>
            <ThemeProvider defaultTheme="system" storageKey="wedding-app-theme">
                <LocaleProvider>
                    <ErrorBoundary>
                        <OfflineBanner />
                        <Suspense>
                            <Rooot />
                        </Suspense>
                    </ErrorBoundary>
                    <Login />
                </LocaleProvider>
            </ThemeProvider>
        </StrictMode>,
    );
});

registerLaunchQueue();
