declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
}>, () => any, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("opened" | "closed")[], "opened" | "closed", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
}>> & Readonly<{
    onOpened?: ((...args: any[]) => any) | undefined;
    onClosed?: ((...args: any[]) => any) | undefined;
}>, {
    sync: boolean;
    items: unknown[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
