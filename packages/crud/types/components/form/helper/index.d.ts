/// <reference types="../index" />
export declare function useForm(): {
    Form: import("vue").Ref<any>;
    config: {
        [x: string]: any;
        title?: any;
        height?: string | undefined;
        width?: string | undefined;
        props: {
            [x: string]: any;
            inline?: boolean | undefined;
            labelPosition?: "left" | "right" | "top" | undefined;
            labelWidth?: string | number | undefined;
            labelSuffix?: string | undefined;
            hideRequiredAsterisk?: boolean | undefined;
            showMessage?: boolean | undefined;
            inlineMessage?: boolean | undefined;
            statusIcon?: boolean | undefined;
            validateOnRuleChange?: boolean | undefined;
            size?: ElementPlus.Size | undefined;
            disabled?: boolean | undefined;
        };
        items: {
            [x: string]: any;
            type?: "tabs" | undefined;
            prop?: string | undefined;
            props?: {
                [x: string]: any;
                labels?: {
                    label: string;
                    value: string;
                    name?: string | undefined;
                    icon?: any;
                }[] | undefined;
                justify?: "center" | "left" | "right" | undefined;
                color?: string | undefined;
                mergeProp?: boolean | undefined;
                labelWidth?: string | undefined;
                error?: string | undefined;
                showMessage?: boolean | undefined;
                inlineMessage?: boolean | undefined;
                size?: "default" | "small" | "medium" | undefined;
            } | undefined;
            span?: number | undefined;
            col?: {
                span: number;
                offset: number;
                push: number;
                pull: number;
                xs: any;
                sm: any;
                md: any;
                lg: any;
                xl: any;
                tag: string;
            } | undefined;
            hook?: string | {
                bind?: Hook.FormPipe | Hook.FormPipe[] | undefined;
                submit?: Hook.FormPipe | Hook.FormPipe[] | undefined;
            } | undefined;
            group?: string | undefined;
            collapse?: boolean | undefined;
            value?: any;
            label?: string | undefined;
            renderLabel?: any;
            flex?: boolean | undefined;
            hidden?: boolean | ((options: {
                scope: obj;
            }) => boolean) | {
                value: boolean;
            } | undefined;
            prepend?: {
                [x: string]: any;
                name?: string | undefined;
                options?: {
                    [x: string]: any;
                    label: string;
                    value: any;
                    color?: string | undefined;
                    type?: string | undefined;
                }[] | {
                    value: {
                        [x: string]: any;
                        label: string;
                        value: any;
                        color?: string | undefined;
                        type?: string | undefined;
                    }[];
                } | undefined;
                props?: {
                    [x: string]: any;
                    onChange?: ((value: any) => void) | undefined;
                } | {
                    value: {
                        [x: string]: any;
                        onChange?: ((value: any) => void) | undefined;
                    };
                } | undefined;
                style?: obj | undefined;
                functionSlot?: boolean | undefined;
                vm?: any;
            } | undefined;
            component?: {
                [x: string]: any;
                name?: string | undefined;
                options?: {
                    [x: string]: any;
                    label: string;
                    value: any;
                    color?: string | undefined;
                    type?: string | undefined;
                }[] | {
                    value: {
                        [x: string]: any;
                        label: string;
                        value: any;
                        color?: string | undefined;
                        type?: string | undefined;
                    }[];
                } | undefined;
                props?: {
                    [x: string]: any;
                    onChange?: ((value: any) => void) | undefined;
                } | {
                    value: {
                        [x: string]: any;
                        onChange?: ((value: any) => void) | undefined;
                    };
                } | undefined;
                style?: obj | undefined;
                functionSlot?: boolean | undefined;
                vm?: any;
            } | undefined;
            append?: {
                [x: string]: any;
                name?: string | undefined;
                options?: {
                    [x: string]: any;
                    label: string;
                    value: any;
                    color?: string | undefined;
                    type?: string | undefined;
                }[] | {
                    value: {
                        [x: string]: any;
                        label: string;
                        value: any;
                        color?: string | undefined;
                        type?: string | undefined;
                    }[];
                } | undefined;
                props?: {
                    [x: string]: any;
                    onChange?: ((value: any) => void) | undefined;
                } | {
                    value: {
                        [x: string]: any;
                        onChange?: ((value: any) => void) | undefined;
                    };
                } | undefined;
                style?: obj | undefined;
                functionSlot?: boolean | undefined;
                vm?: any;
            } | undefined;
            rules?: {
                [x: string]: any;
                type?: "string" | "number" | "boolean" | "object" | "method" | "regexp" | "integer" | "float" | "array" | "enum" | "date" | "url" | "hex" | "email" | "any" | undefined;
                required?: boolean | undefined;
                message?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                trigger?: any;
                validator?: ((rule: any, value: any, callback: (error?: Error | undefined) => void) => void) | undefined;
            } | {
                [x: string]: any;
                type?: "string" | "number" | "boolean" | "object" | "method" | "regexp" | "integer" | "float" | "array" | "enum" | "date" | "url" | "hex" | "email" | "any" | undefined;
                required?: boolean | undefined;
                message?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                trigger?: any;
                validator?: ((rule: any, value: any, callback: (error?: Error | undefined) => void) => void) | undefined;
            }[] | undefined;
            required?: boolean | undefined;
            children?: any[] | undefined;
        }[];
        form: obj;
        isReset?: boolean | undefined;
        on?: {
            open?: ((data: obj) => void) | undefined;
            close?: ((action: ClForm.CloseAction, done: fn) => void) | undefined;
            submit?: ((data: obj, event: {
                close: fn;
                done: fn;
            }) => void) | undefined;
        } | undefined;
        op: {
            hidden?: boolean | undefined;
            saveButtonText?: string | undefined;
            closeButtonText?: string | undefined;
            justify?: "center" | "flex-start" | "flex-end" | undefined;
            buttons?: (ClForm.CloseAction | `slot-${string}` | {
                [x: string]: any;
                label: string;
                type?: string | undefined;
                hidden?: boolean | undefined;
                onClick: (options: {
                    scope: obj;
                }) => void;
            })[] | undefined;
        };
        dialog: {
            [x: string]: any;
            title?: any;
            height?: string | undefined;
            width?: string | undefined;
            hideHeader?: boolean | undefined;
            controls?: ("close" | "fullscreen")[] | undefined;
        };
    };
    form: obj;
    visible: import("vue").Ref<boolean>;
    saving: import("vue").Ref<boolean>;
    loading: import("vue").Ref<boolean>;
    disabled: import("vue").Ref<boolean>;
};
export * from "./action";
export * from "./api";
export * from "./plugins";
export * from "./tabs";
