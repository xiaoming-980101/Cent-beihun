import type { Guest } from "@/wedding/type";
import { GuestForm } from "@/wedding/components";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";

export function GuestFormDialog({
    open,
    onOpenChange,
    editGuest,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editGuest?: Guest;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 z-[80] bg-[rgba(15,12,18,0.56)]" />
                <div className="fixed inset-0 z-[81] flex items-end justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:items-center sm:px-4 sm:py-6">
                    <DialogContent className="z-[82] flex max-h-[calc(100dvh-1.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-[560px] flex-col overflow-hidden rounded-[30px] border border-[#edd6df] bg-[#fffdfd] shadow-[0_32px_60px_-28px_rgba(31,41,55,0.45)] dark:border-[#302631] dark:bg-[#181419] sm:max-h-[min(84vh,760px)]">
                        <DialogHeader className="border-b border-[color:var(--wedding-line)] px-5 pb-4 pt-5">
                            <DialogTitle className="wedding-topbar-title pl-1 text-[24px] text-[color:var(--wedding-text)]">
                                {editGuest ? "编辑亲友" : "添加亲友"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4">
                            <GuestForm
                                editGuest={editGuest}
                                onClose={() => onOpenChange(false)}
                            />
                        </div>
                    </DialogContent>
                </div>
            </DialogPortal>
        </Dialog>
    );
}

