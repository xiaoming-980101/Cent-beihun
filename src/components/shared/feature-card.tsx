import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useId } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils";

import { IconBackground, type IconBackgroundProps } from "./icon-background";

export interface FeatureCardProps {
    icon: ReactNode;
    iconVariant?: IconBackgroundProps["variant"];
    title: string;
    description: string;
    badge?: string;
    onAction: () => void;
    actionText?: string;
    className?: string;
}

export function FeatureCard({
    icon,
    iconVariant = "purple",
    title,
    description,
    badge,
    onAction,
    actionText = "进入工具",
    className,
}: FeatureCardProps) {
    const titleId = useId();

    return (
        <Card
            className={cn(
                "p-5 border-opacity-50 hover:shadow-lg transition-shadow",
                className,
            )}
            role="article"
            aria-labelledby={titleId}
        >
            <div className="mb-4 flex items-start justify-between gap-3">
                <IconBackground icon={icon} variant={iconVariant} />
                {badge ? (
                    <Badge
                        variant="secondary"
                        className="rounded-full text-xs font-bold uppercase"
                    >
                        {badge}
                    </Badge>
                ) : null}
            </div>

            <div className="mb-4 space-y-1">
                <h3 id={titleId} className="text-lg font-bold text-foreground">
                    {title}
                </h3>
                <p className="text-xs leading-relaxed text-text-secondary">
                    {description}
                </p>
            </div>

            <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`${actionText}：${title}`}
            >
                <span>{actionText}</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
        </Card>
    );
}
