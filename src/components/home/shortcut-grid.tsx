import { useNavigate } from "react-router";
import { SHORTCUT_ITEMS } from "@/constants/home";

export function ShortcutGrid() {
    const navigate = useNavigate();

    return (
        <section>
            <div className="mb-3 flex items-center gap-2">
                <i className="icon-[mdi--apps] size-4 text-[color:var(--wedding-text-soft)]" />
                <span className="text-[13px] font-semibold text-[color:var(--wedding-text)]">
                    快捷入口
                </span>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
                {SHORTCUT_ITEMS.map((item) => (
                    <button
                        key={item.path}
                        type="button"
                        className="group rounded-[20px] border border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface)] p-3.5 text-center shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_14px_28px_-20px_rgba(15,23,42,0.4)] active:translate-y-0"
                        onClick={() => navigate(item.path)}
                    >
                        <div
                            className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl ${item.tone} transition-transform group-hover:scale-110`}
                        >
                            <i className={`${item.icon} text-[22px]`} />
                        </div>
                        <div className="mt-2.5 text-[10px] font-semibold text-[color:var(--wedding-text)]">
                            {item.title}
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}
