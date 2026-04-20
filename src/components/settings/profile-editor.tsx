import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
    FORMAT_IMAGE_SUPPORTED,
    showFilePicker,
} from "@/components/file-picker";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/dialog/index";
import { Input } from "@/components/ui/input";
import { useIntl } from "@/locale";
import { useLedgerStore } from "@/store/ledger";
import { useUserStore } from "@/store/user";
import { cn } from "@/utils";

interface ProfileData {
    avatar?: File | string;
    nickname: string;
}

interface ProfileEditorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm?: (data: ProfileData) => void;
}

function ProfileEditorDialog({
    open,
    onOpenChange,
    onConfirm,
}: ProfileEditorDialogProps) {
    const t = useIntl();
    const { avatar_url, name, id } = useUserStore();

    const [avatarPreview, setAvatarPreview] = useState<string>(avatar_url);
    const [avatarFile, setAvatarFile] = useState<File | undefined>();
    const [nickname, setNickname] = useState(name);
    const [isUploading, setIsUploading] = useState(false);

    const handleAvatarSelect = useCallback(async () => {
        try {
            const [file] = await showFilePicker({
                accept: FORMAT_IMAGE_SUPPORTED,
            });
            if (file) {
                setAvatarFile(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    setAvatarPreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        } catch (error) {
            // User cancelled
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!nickname.trim()) {
            toast.error("昵称不能为空");
            return;
        }

        setIsUploading(true);
        try {
            // 将头像转换为 base64
            let avatarData = avatar_url;
            if (avatarFile) {
                const reader = new FileReader();
                avatarData = await new Promise<string>((resolve, reject) => {
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(avatarFile);
                });
            }

            // 保存到个人元数据中
            await useLedgerStore.getState().updatePersonalMeta((prev) => ({
                ...prev,
                userProfile: {
                    avatar: avatarData,
                    nickname: nickname.trim(),
                    updatedAt: Date.now(),
                },
            }));

            // 更新本地状态
            onConfirm?.({
                avatar: avatarData,
                nickname: nickname.trim(),
            });

            toast.success("个人资料已保存并同步");
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("更新失败，请重试");
        } finally {
            setIsUploading(false);
        }
    }, [nickname, avatarFile, avatar_url, onConfirm, onOpenChange]);

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title="编辑个人资料"
            maxWidth="md"
            fullScreenOnMobile={true}
            actions={{
                cancelText: "取消",
                confirmText: isUploading ? "保存并同步..." : "保存并同步",
                onConfirm: handleSubmit,
                loading: isUploading,
                confirmDisabled: !nickname.trim(),
            }}
        >
            <div className="flex flex-col gap-6">
                {/* 副标题 */}
                <p className="text-center text-sm text-[color:var(--wedding-text-mute)]">
                    设置你的头像和昵称,将同步到云端
                </p>

                {/* 头像上传区域 */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        {/* 头像预览 */}
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-2xl dark:border-gray-800">
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="h-full w-full object-cover"
                            />
                            {/* 渐变遮罩 */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity hover:opacity-100">
                                <div className="flex h-full items-end justify-center pb-3">
                                    <i className="icon-[mdi--camera] size-6 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* 编辑按钮 */}
                        <button
                            type="button"
                            onClick={handleAvatarSelect}
                            className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                        >
                            <i className="icon-[mdi--pencil] size-5" />
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleAvatarSelect}
                            className="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                            点击更换头像
                        </button>
                        <p className="mt-1 text-xs text-[color:var(--wedding-text-mute)]">
                            支持 JPG、PNG、GIF 格式,将保存到云端
                        </p>
                    </div>
                </div>

                {/* 昵称输入 */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[color:var(--wedding-text)]">
                        <i className="icon-[mdi--account-outline] mr-1.5 inline-block size-4" />
                        昵称
                    </label>
                    <div className="relative">
                        <Input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="请输入昵称"
                            maxLength={20}
                            className="h-12 rounded-xl border-2 border-[color:var(--wedding-line)] bg-[color:var(--wedding-surface-muted)] pr-12 text-base transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[color:var(--wedding-text-mute)]">
                            {nickname.length}/20
                        </div>
                    </div>
                </div>

                {/* 同步提示 */}
                <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/30">
                    <div className="flex items-start gap-2">
                        <i className="icon-[mdi--cloud-sync-outline] mt-0.5 size-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                            <p className="font-medium">云端同步</p>
                            <p className="mt-1 opacity-80">
                                你的头像和昵称将保存到当前账本的个人配置中,并自动同步到所有设备
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ResponsiveDialog>
    );
}

let resolveCallback: ((data: ProfileData | null) => void) | null = null;

export function showProfileEditor(): Promise<ProfileData | null> {
    return new Promise((resolve) => {
        resolveCallback = resolve;
        // 触发打开弹窗的事件
        window.dispatchEvent(new CustomEvent("open-profile-editor"));
    });
}

export function ProfileEditorProvider() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => {
            setOpen(true);
        };
        window.addEventListener("open-profile-editor", handleOpen);
        return () => {
            window.removeEventListener("open-profile-editor", handleOpen);
        };
    }, []);

    const handleConfirm = (data: ProfileData) => {
        if (resolveCallback) {
            resolveCallback(data);
            resolveCallback = null;
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen && resolveCallback) {
            resolveCallback(null);
            resolveCallback = null;
        }
    };

    return (
        <ProfileEditorDialog
            open={open}
            onOpenChange={handleOpenChange}
            onConfirm={handleConfirm}
        />
    );
}
