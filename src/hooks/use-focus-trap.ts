import { useEffect, useRef } from "react";

export function useFocusTrap(isActive: boolean) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) {
            return;
        }

        const container = containerRef.current;
        const focusableElements = container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        first?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Tab" || focusableElements.length === 0) {
                return;
            }
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };

        container.addEventListener("keydown", onKeyDown);
        return () => {
            container.removeEventListener("keydown", onKeyDown);
        };
    }, [isActive]);

    return containerRef;
}
