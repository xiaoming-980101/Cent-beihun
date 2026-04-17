export function Settings() {
    // Settings page is route-driven (`/settings`), keep legacy provider inert.
    return null;
}

export function showSettings(): Promise<void> {
    return Promise.resolve();
}
