import { PropType } from "vue";
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
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("change" | "update:modelValue" | "field-change")[], "change" | "update:modelValue" | "field-change", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
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
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
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
}, {}>;
export default _default;
