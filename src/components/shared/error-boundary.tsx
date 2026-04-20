import type { ReactNode } from "react";
import { Component } from "react";

type ErrorBoundaryProps = {
    children: ReactNode;
    fallback?: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div className="m-4 rounded-2xl border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-4 text-sm text-[color:var(--wedding-text-soft)]">
                        页面出现异常，请刷新后重试。
                    </div>
                )
            );
        }

        return this.props.children;
    }
}
