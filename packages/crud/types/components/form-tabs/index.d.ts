import { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    modelValue: (NumberConstructor | StringConstructor)[];
    labels: {
        type: ArrayConstructor;
        default: () => never[];
    };
    justify: {
        type: PropType<"center" | "justify" | "left" | "right" | "start" | "end" | "match-parent">;
        default: string;
    };
    type: {
        type: PropType<"default" | "card">;
        default: string;
    };
}, () => any, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("change" | "update:modelValue")[], "change" | "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: (NumberConstructor | StringConstructor)[];
    labels: {
        type: ArrayConstructor;
        default: () => never[];
    };
    justify: {
        type: PropType<"center" | "justify" | "left" | "right" | "start" | "end" | "match-parent">;
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
    justify: "center" | "justify" | "left" | "right" | "start" | "end" | "match-parent";
}, {}>;
export default _default;
