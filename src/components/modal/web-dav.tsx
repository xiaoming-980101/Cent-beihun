import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod/mini";
import { useIntl } from "@/locale";
import { FormDialog } from "../ui/dialog/form-dialog";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type WebDAVEdit = {
    remote: string;
    username: string;
    password: string;
    proxy?: string;
    customUserName?: string;
};

type LoadingState = Partial<WebDAVEdit> & {
    check?: (v: WebDAVEdit) => Promise<unknown>;
};

export const createFormSchema = (t: any) =>
    z.object({
        remote: z.string(),
        username: z.string(),
        password: z.string(),
        proxy: z.optional(z.string()),
        customUserName: z.optional(z.string()),
    });

const LoadingForm = ({
    open,
    onOpenChange,
    edit,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    edit?: LoadingState;
    onCancel?: () => void;
    onConfirm?: (v?: LoadingState) => void;
}) => {
    const t = useIntl();
    const formSchema = useMemo(() => createFormSchema(t), [t]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            proxy: "", //"https://oncent-backend.linkai.work/proxy?url=",
        },
    });
    const [checking, setChecking] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        data.remote = data.remote.replace(/\/$/, "");
        setChecking(true);
        try {
            await edit?.check?.(data);
            onConfirm?.(data);
        } finally {
            setChecking(false);
        }
    };
    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={t("sync-with-web-dav")}
            maxWidth="sm"
            fullScreenOnMobile={true}
            className="sm:h-[480px]"
        >
            <Form {...form}>
                <div className="w-full flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="remote"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel asChild>
                                    <div>{t("web-dav-remote-url")}</div>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://dav.jianguoyun.com/dav/"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel asChild>
                                    <div>{t("username")}</div>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel asChild>
                                    <div>{t("password")}</div>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                        >
                                            {showPassword ? (
                                                <i className="icon-[mdi--eye-off] size-4"></i>
                                            ) : (
                                                <i className="icon-[mdi--eye] size-4"></i>
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="proxy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel asChild>
                                    <a
                                        className="flex items-center gap-1"
                                        href={t("web-dav-proxy-url")}
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        {t("proxy-url")}
                                        <i className="icon-[mdi--question-mark-circle-outline]"></i>
                                    </a>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* 使用webdav时，用户可能会将一个webdav配置分享给其他人使用，达成共享的效果，此时需要允许用户填写一个自定义昵称作为不同用户的区分 */}
                    <div className="flex flex-col gap-4 rounded-md border p-2">
                        <a
                            className="flex items-center gap-1"
                            href={t("web-dav-custom-user")}
                            target="_blank"
                            rel="noopener"
                        >
                            {t("custom-user")}
                            <i className="icon-[mdi--question-mark-circle-outline]"></i>
                        </a>
                        <FormField
                            control={form.control}
                            name="customUserName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel asChild>
                                        <div className="flex items-center gap-1">
                                            {t("custom-user-name")}
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <i className="icon-[mdi--help-circle-outline] cursor-pointer"></i>
                                                </PopoverTrigger>
                                                <PopoverContent className="text-xs p-2">
                                                    <p>
                                                        {t(
                                                            "custom-user-name-tooltip",
                                                        )}
                                                    </p>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        variant={"ghost"}
                        className="sm:w-fit w-full"
                        onClick={() => onOpenChange(false)}
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        className="sm:w-fit w-full"
                        type="submit"
                        disabled={checking}
                        onClick={() => {
                            form.handleSubmit(onSubmit)();
                        }}
                    >
                        {t("confirm")}
                    </Button>
                </div>
            </Form>
        </FormDialog>
    );
};

// 事件驱动的弹窗管理
let resolveCallback: ((value: WebDAVEdit | null) => void) | null = null;

export const WebDAVAuthProvider = () => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<LoadingState | undefined>();

    useEffect(() => {
        const handleShow = (event: CustomEvent<LoadingState>) => {
            setEditData(event.detail);
            setOpen(true);
        };

        window.addEventListener("show-webdav-auth" as any, handleShow);
        return () => {
            window.removeEventListener("show-webdav-auth" as any, handleShow);
        };
    }, []);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resolveCallback?.(null);
            resolveCallback = null;
        }
        setOpen(newOpen);
    };

    const handleConfirm = (value?: LoadingState) => {
        resolveCallback?.(value as WebDAVEdit);
        resolveCallback = null;
        setOpen(false);
    };

    const handleCancel = () => {
        resolveCallback?.(null);
        resolveCallback = null;
        setOpen(false);
    };

    return (
        <LoadingForm
            open={open}
            onOpenChange={handleOpenChange}
            edit={editData}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );
};

export const showWebDAVAuth = (edit?: LoadingState): Promise<WebDAVEdit | null> => {
    return new Promise((resolve) => {
        resolveCallback = resolve;
        window.dispatchEvent(
            new CustomEvent("show-webdav-auth", { detail: edit })
        );
    });
};
