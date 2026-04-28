import { usePreference } from "@/store/preference";
import { BaseButton } from "./base";
import { KeyboardAddButton } from "./keyboard-add";
import { VoiceAddButton } from "./voice-add";

export default function ComplexAddButton({
    onClick,
    className,
}: {
    onClick?: () => void;
    className?: string;
}) {
    const [voiceRecordingEnabled] = usePreference("voiceRecordingEnabled");
    const [voiceByKeyboard] = usePreference("voiceByKeyboard");

    if (!voiceRecordingEnabled) {
        return (
            <BaseButton className={className} onClick={onClick}>
                <i className="icon-[mdi--add] text-[white] size-7"></i>
            </BaseButton>
        );
    }

    if (voiceByKeyboard) {
        return <KeyboardAddButton className={className} onClick={onClick} />;
    }

    return <VoiceAddButton className={className} onClick={onClick} />;
}
