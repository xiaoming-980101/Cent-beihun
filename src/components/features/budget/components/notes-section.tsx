/**
 * 预算备注区块组件
 * 从 BudgetFormDialog 中提取的 UI 组件
 */

import { useId } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils";

interface NotesSectionProps {
    notes: string;
    onNotesChange: (notes: string) => void;
}

export function NotesSection({ notes, onNotesChange }: NotesSectionProps) {
    const notesInputId = useId();

    return (
        <div className="wedding-soft-card space-y-4 p-4">
            <div>
                <label
                    htmlFor={notesInputId}
                    className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted"
                >
                    备注
                </label>
                <Textarea
                    id={notesInputId}
                    className={cn("wedding-input", "min-h-[112px] resize-none")}
                    placeholder="补充记录付款节点、对接人或注意事项"
                    rows={3}
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                />
            </div>
        </div>
    );
}
