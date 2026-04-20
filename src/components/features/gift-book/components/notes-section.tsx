/**
 * 备注区块组件
 * 从 GiftFormDialog 中提取的 UI 组件
 */

import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
    note: string;
    onNoteChange: (note: string) => void;
}

export function NotesSection({ note, onNoteChange }: NotesSectionProps) {
    return (
        <div className="wedding-soft-card space-y-4 p-4">
            <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] wedding-muted">
                    备注
                </label>
                <Textarea
                    className="wedding-input min-h-[112px] resize-none"
                    rows={3}
                    placeholder="记录红包来源、回礼情况或补充说明"
                    value={note}
                    onChange={(e) => onNoteChange(e.target.value)}
                />
            </div>
        </div>
    );
}
