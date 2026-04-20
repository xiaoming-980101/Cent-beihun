import { useNavigate } from "react-router";
import { EmptyState } from "@/components/shared";
import type { ActivityItem } from "@/hooks/use-wedding-activities";

interface ActivitiesSectionProps {
    activities: ActivityItem[];
}

export function ActivitiesSection({ activities }: ActivitiesSectionProps) {
    const navigate = useNavigate();

    return (
        <div className="mb-4">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <i className="icon-[mdi--timeline-clock-outline] size-4 text-[color:var(--wedding-text-soft)]" />
                    <span className="text-[13px] font-semibold text-[color:var(--wedding-text)]">
                        最近动态
                    </span>
                </div>
                <button
                    type="button"
                    className="text-[11px] font-medium text-pink-500 transition-colors hover:text-pink-600"
                    onClick={() => navigate("/tasks")}
                >
                    全部 →
                </button>
            </div>
            <div className="space-y-2.5">
                {activities.length > 0 ? (
                    activities.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => navigate(item.path)}
                            className="group flex w-full items-center gap-3 rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] px-4 py-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                        >
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                                style={{
                                    background: `${item.color}18`,
                                }}
                            >
                                <i
                                    className={`${item.icon} size-5`}
                                    style={{ color: item.color }}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-[13px] font-semibold text-[color:var(--wedding-text)]">
                                    {item.text}
                                </div>
                                <div className="mt-1 text-[11px] text-[color:var(--wedding-text-mute)]">
                                    {item.sub}
                                </div>
                            </div>
                            <i className="icon-[mdi--chevron-right] size-5 text-[color:var(--wedding-text-mute)] transition-transform group-hover:translate-x-0.5" />
                        </button>
                    ))
                ) : (
                    <div className="rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] px-6 py-8">
                        <EmptyState
                            icon={
                                <i className="icon-[mdi--calendar-clock-outline] size-12 text-[color:var(--wedding-text-mute)]" />
                            }
                            title="还没有婚礼动态"
                            description="添加任务或礼金后这里会自动更新"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
