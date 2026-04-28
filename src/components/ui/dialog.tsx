import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/index";

/**
 * 判断是否是浮层交互
 */
function isFloatingLayerInteraction(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;

    return Boolean(
        target.closest('[role="listbox"]') ||
            target.closest('[role="dialog"]') ||
            target.closest('[role="menu"]') ||
            target.closest("[data-radix-popper-content-wrapper]") ||
            target.closest("[data-radix-select-content]") ||
            target.closest("[data-radix-select-viewport]") ||
            target.closest("[data-radix-popover-content]") ||
            target.closest("[data-radix-dropdown-menu-content]") ||
            target.closest("[data-radix-context-menu-content]") ||
            target.closest(".react-datepicker") ||
            target.closest(".react-datepicker-popper"),
    );
}

/**
 * 判断当前是否有打开的浮层
 */
function hasOpenFloatingLayer(): boolean {
    if (typeof document === "undefined") return false;

    return Boolean(
        document.querySelector(
            '[data-radix-dropdown-menu-content][data-state="open"]',
        ) ||
            document.querySelector(
                '[data-radix-popover-content][data-state="open"]',
            ) ||
            document.querySelector(
                '[data-radix-select-content][data-state="open"]',
            ) ||
            document.querySelector(".react-datepicker-popper"),
    );
}

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 will-change-[opacity,backdrop-filter]",
            className,
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        fade?: boolean;
        swipe?: boolean;
        hideClose?: boolean;
    }
>(({ className, children, fade, swipe, hideClose, ...props }, ref) => (
    <DialogPortal>
        <DialogPrimitive.Close asChild>
            <DialogOverlay />
        </DialogPrimitive.Close>
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-[50%] top-[50%] z-[1001] flex w-full max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col gap-4 p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                "rounded-[30px] border-none bg-[color:var(--wedding-surface)] shadow-2xl",
                "pb-[calc(1.5rem+env(safe-area-inset-bottom))]",
                "will-change-transform transform-gpu", // 硬件加速
                className,
            )}
            aria-describedby={
                Object.hasOwn(props, "aria-describedby")
                    ? props["aria-describedby"]
                    : undefined
            }
            onPointerDownOutside={(e) => {
                // 阻止点击 Select/Popover/Dropdown 等浮层时关闭弹窗
                if (isFloatingLayerInteraction(e.target)) {
                    e.preventDefault();
                }
            }}
            onFocusOutside={(e) => {
                // 某些浮层(如 DropdownMenu)会先触发焦点迁移，导致弹窗被误判为外部交互
                if (
                    isFloatingLayerInteraction(e.target) ||
                    hasOpenFloatingLayer()
                ) {
                    e.preventDefault();
                }
            }}
            onInteractOutside={(e) => {
                if (
                    isFloatingLayerInteraction(e.target) ||
                    hasOpenFloatingLayer()
                ) {
                    e.preventDefault();
                }
            }}
            {...props}
        >
            {children}
            {!hideClose && (
                <DialogPrimitive.Close
                    onClick={(event) => event.stopPropagation()}
                    className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--wedding-text-mute)] transition hover:bg-[color:var(--wedding-surface-muted)] hover:text-[color:var(--wedding-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--wedding-line-strong)] focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <X className="h-5 w-5" />
                    <span className="sr-only">关闭</span>
                </DialogPrimitive.Close>
            )}
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className,
        )}
        {...props}
    />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className,
        )}
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            "text-[17px] font-semibold leading-tight tracking-tight text-[color:var(--wedding-text)]",
            className,
        )}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
