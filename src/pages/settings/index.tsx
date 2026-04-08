import SettingsForm from "@/components/settings/form";

export default function SettingsPage() {
    return (
        <div className="wedding-app-shell h-full overflow-hidden page-show">
            <SettingsForm hideBack hideHeaderOnMobile />
        </div>
    );
}
