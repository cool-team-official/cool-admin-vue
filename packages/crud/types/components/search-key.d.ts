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
        type: StringConstructor;
        default: string;
    };
}, {
    value: import("vue").Ref<string>;
    placeholder: import("vue").ComputedRef<string>;
    selectField: import("vue").Ref<string>;
    search: (this: any, ...args: any[]) => any;
    onKeydown: ({ keyCode }: any) => void;
    onInput: (val: string) => void;
    onChange: () => void;
    onFieldChange: () => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "change" | "field-change")[], "update:modelValue" | "change" | "field-change", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
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
        type: StringConstructor;
        default: string;
    };
}>> & {
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onField-change"?: ((...args: any[]) => any) | undefined;
}, {
    width: string;
    field: string;
    fieldList: {
        label: string;
        value: string;
    }[];
}>;
export default _default;
