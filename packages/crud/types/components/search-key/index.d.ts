import { type PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    modelValue: StringConstructor;
    field: {
        type: StringConstructor;
        default: string;
    };
    fieldList: {
        type: PropType<{
            label: string;
            value: string;
        }[]>;
        default: () => never[];
    };
    onSearch: FunctionConstructor;
    placeholder: StringConstructor;
    width: {
        type: (NumberConstructor | StringConstructor)[];
        default: number;
    };
    refreshOnInput: BooleanConstructor;
}, () => any, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("change" | "update:modelValue" | "field-change")[], "change" | "update:modelValue" | "field-change", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: StringConstructor;
    field: {
        type: StringConstructor;
        default: string;
    };
    fieldList: {
        type: PropType<{
            label: string;
            value: string;
        }[]>;
        default: () => never[];
    };
    onSearch: FunctionConstructor;
    placeholder: StringConstructor;
    width: {
        type: (NumberConstructor | StringConstructor)[];
        default: number;
    };
    refreshOnInput: BooleanConstructor;
}>> & {
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onField-change"?: ((...args: any[]) => any) | undefined;
}, {
    width: string | number;
    field: string;
    fieldList: {
        label: string;
        value: string;
    }[];
    refreshOnInput: boolean;
}, {}>;
export default _default;
