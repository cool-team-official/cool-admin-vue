declare const _default: import("vue").DefineComponent<{
    modelValue: null;
    list: {
        type: ArrayConstructor;
        required: true;
    };
    field: {
        type: StringConstructor;
        default: string;
    };
    multiple: BooleanConstructor;
    callback: FunctionConstructor;
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("change" | "update:modelValue")[], "change" | "update:modelValue", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: null;
    list: {
        type: ArrayConstructor;
        required: true;
    };
    field: {
        type: StringConstructor;
        default: string;
    };
    multiple: BooleanConstructor;
    callback: FunctionConstructor;
}>> & {
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    field: string;
    multiple: boolean;
}>;
export default _default;
