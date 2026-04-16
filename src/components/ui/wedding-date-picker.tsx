import dayjs from "dayjs";
import { registerLocale } from "react-datepicker";
import DatePicker from "react-datepicker";
import zhCN from "date-fns/locale/zh-CN";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/react-datepicker-wedding.css";

// 注册中文语言包
registerLocale("zh-CN", zhCN);

type WeddingDatePickerProps = {
    value?: number;
    onChange: (value: number | undefined) => void;
    tone?: "cyan" | "pink";
};

export default function WeddingDatePicker({
    value,
    onChange,
    tone = "pink",
}: WeddingDatePickerProps) {
    const selectedDate = value ? new Date(value) : null;
    const toneClasses =
        tone === "cyan"
            ? "border-cyan-200/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(236,253,255,0.9))] text-cyan-700 focus:border-cyan-400 focus:ring-cyan-200 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(34,211,238,0.08))] dark:text-cyan-300"
            : "border-pink-200/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,241,247,0.9))] text-pink-700 focus:border-pink-400 focus:ring-pink-200 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(244,114,182,0.08))] dark:text-pink-300";

    return (
        <DatePicker
            selected={selectedDate}
            onChange={(date) => {
                if (!date) {
                    onChange(undefined);
                    return;
                }
                onChange(dayjs(date).startOf("day").valueOf());
            }}
            dateFormat="yyyy年MM月dd日"
            locale="zh-CN"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={120}
            placeholderText="请选择日期"
            className={`w-full rounded-xl border py-2 pl-3 pr-3 text-sm shadow-[0_10px_24px_-20px_rgba(236,72,153,0.45)] outline-none transition focus:ring-2 ${toneClasses}`}
            popperClassName="wedding-datepicker-popper"
            calendarClassName="wedding-datepicker-calendar"
            popperPlacement="bottom-start"
        />
    );
}
