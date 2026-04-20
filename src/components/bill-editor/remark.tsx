import { type ReactNode, useEffect, useState } from "react";
import { useIntl } from "@/locale";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function RemarkHint({
    recommends,
    children,
    onSelect,
}: {
    recommends?: string[];
    children?: ReactNode;
    onSelect?: (v: string) => void;
}) {
    const t = useIntl();
    const [open, setOpen] = useState(false);
    const keyMap = new Map<string, number>();
    useEffect(() => {
        if (recommends?.length) {
            setTimeout(() => {
                setOpen(true);
            }, 400);
        }
    }, [recommends?.length]);
    if (!recommends?.length) {
        return children;
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent
                side="top"
                align="end"
                sideOffset={12}
                className="p-2 px-3 w-fit flex gap-1 items-center text-sm"
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}
            >
                <div className="opacity-60">{t("recommend-comments")}</div>
                <div className="flex gap-2">
                    {recommends.map((comment) => {
                        const count = (keyMap.get(comment) ?? 0) + 1;
                        keyMap.set(comment, count);
                        const key = count > 1 ? `${comment}-${count}` : comment;
                        return (
                        <button
                            key={key}
                            type="button"
                            className="cursor-pointer border rounded-sm px-1 flex items-center active:bg-foreground/20"
                            onClick={() => onSelect?.(comment)}
                        >
                            {comment}
                        </button>
                        );
                    })}
                </div>
                {/* <button
                    type="button"
                    className="flex items-center cursor-pointer"
                >
                    <i className="icon-[mdi--close-circle-outline]"></i>
                </button> */}
                {/* <PopoverArrow className="fill-popover" /> */}
            </PopoverContent>
        </Popover>
    );
}
