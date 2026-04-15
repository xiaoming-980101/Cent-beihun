import SettingsForm from "@/components/settings/form";

export default function SettingsPage() {
    return (
        <div className="wedding-app-shell h-full overflow-hidden bg-[color:var(--wedding-app-bg)] page-show">
            <div className="px-5 pb-1 pt-4 sm:hidden">
                <p className="text-[20px] font-bold text-[color:var(--wedding-text)]">
                    设置
                </p>
                <p className="mt-1 text-xs text-[color:var(--wedding-text-soft)]">
                    项目配置与个人偏好
                </p>
            </div>
            <SettingsForm hideBack hideHeaderOnMobile />
            <div className="px-4 pb-4 text-center text-[11px] text-[color:var(--wedding-text-mute)] sm:hidden">
                YueWed · 用爱筹备每一个细节
            </div>
        </div>
    );
}
