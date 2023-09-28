import { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    modelValue: (StringConstructor | NumberConstructor)[];
    labels: {
        type: ArrayConstructor;
        default: () => never[];
    };
    justify: {
        type: PropType<"center" | "justify" | "left" | "right" | "end" | "start" | "match-parent">;
        default: string;
    };
    type: {
        type: PropType<"default" | "card">;
        default: string;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("change" | "update:modelValue")[], "change" | "update:modelValue", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: (StringConstructor | NumberConstructor)[];
    labels: {
        type: ArrayConstructor;
        default: () => never[];
    };
    justify: {
        type: PropType<"center" | "justify" | "left" | "right" | "end" | "start" | "match-parent">;
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
    justify: "center" | "justify" | "left" | "right" | "end" | "start" | "match-parent";
}, {}>;
export default _default;
