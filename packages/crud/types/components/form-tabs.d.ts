import { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    modelValue: (NumberConstructor | StringConstructor)[];
    labels: {
        type: ArrayConstructor;
        default: () => never[];
    };
    justify: {
        type: StringConstructor;
        default: string;
    };
    color: {
        type: StringConstructor;
        default: string;
    };
    type: {
        type: PropType<"default" | "card">;
        default: string;
    };
}, {
    active: import("vue").Ref<string>;
    list: import("vue").Ref<any[]>;
    line: {
        width: string;
        offsetLeft: string;
        transform: string;
        backgroundColor: string;
    };
    refs: any;
    setRefs: (index: number) => (el: HTMLElement) => void;
    update: (val: any) => false | undefined;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "change")[], "update:modelValue" | "change", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: (NumberConstructor | StringConstructor)[];
    labels: {
        type: ArrayConstructor;
        default: () => never[];
    };
    justify: {
        type: StringConstructor;
        default: string;
    };
    color: {
        type: StringConstructor;
        default: string;
    };
    type: {
        type: PropType<"default" | "card">;
        default: string;
    };
}>> & {
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    type: "default" | "card";
    labels: unknown[];
    justify: string;
    color: string;
}>;
export default _default;
