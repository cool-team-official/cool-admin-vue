declare const _default: import("vue").DefineComponent<{
    items: {
        type: ArrayConstructor;
        default: () => never[];
    };
    props: ObjectConstructor;
    sync: BooleanConstructor;
    op: ObjectConstructor;
    dialog: ObjectConstructor;
    onOpen: FunctionConstructor;
    onOpened: FunctionConstructor;
    onClose: FunctionConstructor;
    onClosed: FunctionConstructor;
    onInfo: FunctionConstructor;
    onSubmit: FunctionConstructor;
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("opened" | "closed")[], "opened" | "closed", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    items: {
        type: ArrayConstructor;
        default: () => never[];
    };
    props: ObjectConstructor;
    sync: BooleanConstructor;
    op: ObjectConstructor;
    dialog: ObjectConstructor;
    onOpen: FunctionConstructor;
    onOpened: FunctionConstructor;
    onClose: FunctionConstructor;
    onClosed: FunctionConstructor;
    onInfo: FunctionConstructor;
    onSubmit: FunctionConstructor;
}>> & {
    onOpened?: ((...args: any[]) => any) | undefined;
    onClosed?: ((...args: any[]) => any) | undefined;
}, {
    items: unknown[];
    sync: boolean;
}, {}>;
export default _default;
